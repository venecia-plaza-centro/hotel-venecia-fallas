/**
 * Reserva y pago de los ESPACIOS (habitaciones sin mobiliario que se alquilan
 * enteras, por día). Mismo circuito que los balcones —bloqueo de 15 minutos,
 * pago en el TPV de Redsys, confirmación por la notificación del banco— pero
 * en un módulo aparte para no tocar el flujo de balcones, que ya está vendiendo.
 *
 * Diferencias con un balcón: el precio es fijo por espacio y día (no depende de
 * las personas), solo se puede reservar en los días que el hotel abre para ese
 * espacio, y una sola reserva ocupa el espacio entero ese día.
 */
import { DEFAULT_LOCALE } from '../consts';
import { pagePath } from '../i18n/pages';
import { airtableEnabled, cancelBooking, confirmHeldBooking, createBooking, findBooking, getBookedSpaceDates, newLocator, placeHold } from './airtable';
import { handleError, json } from './api';
import { readCustomer } from './customer-input';
import { buildPayment, isAuthorised, maskEmail, newOrder, redsysEnabled, refundOrder, signReturnToken } from './redsys';
import { spacesSalesStatus } from './sales';
import { sendSpaceBookingEmails, sendSpaceRefundedNotice } from './space-email';
import { getSpace, getSpaces, isSpaceDate, priceForSpaceDate, spaceDates, type Space } from './spaces';
import { isLocale } from './booking';

/** Días de cada espacio con precio y si siguen libres. `fresh` = leer en directo. */
export async function getSpaceDayOffers(opts: { fresh?: boolean; excludeLocator?: string } = {}) {
  const [spaces, booked] = await Promise.all([getSpaces(), getBookedSpaceDates(opts)]);
  return spaces.map((s) => ({
    slug: s.slug,
    number: s.number,
    capacity: s.capacity,
    days: spaceDates(s).map((date) => ({
      date,
      price: priceForSpaceDate(s, date),
      available: !(s.id && booked.get(s.id)?.has(date)),
    })),
  }));
}

async function isFree(space: Space, date: string, opts: { excludeLocator?: string } = {}): Promise<boolean> {
  const booked = await getBookedSpaceDates({ fresh: true, ...opts });
  return !(space.id && booked.get(space.id)?.has(date));
}

const str = (v: unknown) => (typeof v === 'string' ? v.trim() : '');

/**
 * POST /api/checkout con `kind: 'space'`. Llega ya pasado el límite de
 * peticiones y comprobado el origen (ver pages/api/checkout.ts).
 */
export async function spaceCheckout(body: Record<string, unknown>, url: URL): Promise<Response> {
  if (!spacesSalesStatus().open) return json({ ok: false, error: 'ventas-cerradas' }, 403);

  const date = str(body.date); // exacta: cualquier cosa que no sea un día válido de este espacio se rechaza
  const customer = readCustomer(body);
  if (!customer.ok) return json({ ok: false, error: 'datos', fields: customer.fields }, 400);
  const c = customer.data;

  try {
    const space = await getSpace(str(body.spaceSlug).slice(0, 40));
    if (!space) return json({ ok: false, error: 'habitacion' }, 400);
    // Con Airtable conectado hace falta el registro del espacio para enlazar la
    // reserva: si la tabla `Espacios` aún no existe, no se puede vender.
    if (airtableEnabled() && !space.id) return json({ ok: false, error: 'servicio' }, 503);
    if (!isSpaceDate(space, date)) return json({ ok: false, error: 'fecha', detail: 'fuera-de-ventana' }, 400);
    if (!(await isFree(space, date))) return json({ ok: false, error: 'sin-disponibilidad' }, 409);

    const total = priceForSpaceDate(space, date);
    // En un espacio no se cuentan personas: se guarda el aforo máximo.
    const booking = { date, space, guests: space.capacity, total, ...c, country: c.country || undefined, notes: c.notes || undefined };

    if (!redsysEnabled()) {
      // Demo: sin TPV conectado se crea la reserva sin cobrar nada.
      const { locator } = await createBooking({ ...booking, paid: false });
      await sendSpaceBookingEmails({ ...booking, locator, paid: false }).catch((err) =>
        console.error('[space-checkout] fallo al enviar correos', err),
      );
      return json({ ok: true, mode: 'demo', locator, persisted: airtableEnabled(), paid: false, date, space: { number: space.number, slug: space.slug }, quote: { total, currency: 'EUR' } });
    }

    const locator = await newLocator();
    const order = newOrder();
    const bookPath = pagePath('book', c.lang);
    const held = await placeHold({ ...booking, locator });
    if (!held) return json({ ok: false, error: 'sin-disponibilidad' }, 409);

    const cut = (v: string, n: number) => v.slice(0, n);
    const payment = buildPayment({
      order,
      amountEuros: total,
      lang: c.lang,
      description: `Espacio privado · ${space.number} · ${date}`,
      holder: `${c.firstName} ${c.lastName}`.slice(0, 60),
      label: `FALLAS ${locator} esp${space.number} ${date}`,
      data: {
        kind: 'space',
        locator,
        date,
        spaceSlug: space.slug,
        firstName: cut(c.firstName, 60),
        lastName: cut(c.lastName, 60),
        email: cut(c.email, 100),
        phone: cut(c.phone, 30),
        country: cut(c.country, 40),
        notes: cut(c.notes, 200),
        lang: c.lang,
      },
      notificationUrl: `${url.origin}/api/redsys-notification`,
      okUrl: `${url.origin}${bookPath}?paid=1&r=${signReturnToken({
        kind: 'space',
        locator,
        date,
        spaceNumber: space.number,
        spaceSlug: space.slug,
        capacity: space.capacity,
        total,
        email: maskEmail(c.email),
      })}`,
      koUrl: `${url.origin}${bookPath}?canceled=1&espacio=${space.number}`,
    });
    return json({ ok: true, mode: 'redirect', form: payment });
  } catch (e) {
    return handleError(e);
  }
}

/**
 * Notificación del banco para un pago de espacio (`kind: 'space'` en los datos
 * del comercio). Ya viene con la firma verificada. Mismas reglas que un balcón:
 * si el bloqueo caducó y el espacio ya no está libre, o lo cobrado es menos que
 * el precio, se devuelve el pago y se avisa al cliente.
 */
export async function spaceNotification(params: Record<string, string>, m: Record<string, string>): Promise<Response> {
  const ok = (body = 'OK') => new Response(body, { status: 200, headers: { 'content-type': 'text/plain' } });

  if (!isAuthorised(params)) {
    try {
      const held = m.locator ? await findBooking(m.locator) : null;
      if (held?.estado === 'en pago') await cancelBooking(held.id);
    } catch (err) {
      console.error('[space-notification] no se pudo liberar el bloqueo', err);
    }
    return ok('denegado');
  }

  const date = m.date ?? '';
  const order = params.Ds_Order;
  const amountCents = Number(params.Ds_Amount);
  const lang = isLocale(m.lang) ? m.lang : DEFAULT_LOCALE;

  try {
    const existing = m.locator ? await findBooking(m.locator) : null;
    if (existing?.estado === 'confirmada') return ok('duplicada');

    const space = await getSpace(m.spaceSlug ?? '');
    const price = space && isSpaceDate(space, date) ? priceForSpaceDate(space, date) : 0;
    const free = space && price > 0 ? await isFree(space, date, { excludeLocator: m.locator }) : false;
    const underpaid = price > 0 && amountCents < Math.round(price * 100);

    if (!space || !free || underpaid) {
      if (existing) await cancelBooking(existing.id);
      const refunded = await refundOrder(order, amountCents);
      await sendSpaceRefundedNotice({
        email: m.email ?? '',
        firstName: m.firstName ?? '',
        spaceNumber: space?.number ?? (m.spaceSlug ?? ''),
        date,
        lang,
        manual: !refunded,
        locator: m.locator,
        order,
      });
      return ok('reembolsada');
    }

    const booking = {
      date,
      space,
      guests: space.capacity,
      total: price,
      firstName: m.firstName ?? '',
      lastName: m.lastName ?? '',
      email: m.email ?? '',
      phone: m.phone ?? '',
      country: m.country || undefined,
      notes: m.notes || undefined,
      lang,
    };
    const payment = { order, authCode: params.Ds_AuthorisationCode };
    if (existing) {
      await confirmHeldBooking(existing.id, price, payment);
    } else {
      await createBooking({ ...booking, locator: m.locator, paid: true, payment });
    }
    await sendSpaceBookingEmails({ ...booking, locator: m.locator ?? '', paid: true, payment });
    return ok();
  } catch (err) {
    // 500: Redsys reintenta la notificación más tarde.
    console.error('[space-notification] fallo al procesar el pago', err);
    return new Response('interno', { status: 500 });
  }
}
