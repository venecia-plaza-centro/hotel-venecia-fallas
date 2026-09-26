import type { APIRoute } from 'astro';
import { DEFAULT_LOCALE } from '../../consts';
import { pagePath } from '../../i18n/pages';
import { buildQuote, isGuestCount, isLocale, validateDate } from '../../lib/booking';
import { airtableEnabled, createBooking, getRoomOffers, newLocator, placeHold } from '../../lib/airtable';
import { sendBookingEmails } from '../../lib/email';
import { buildPayment, newOrder, redsysEnabled, signReturnToken } from '../../lib/redsys';
import { handleError, json } from '../../lib/api';
import { salesStatus } from '../../lib/sales';

export const prerender = false;

const EMAIL_RE = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;
const str = (v: unknown) => (typeof v === 'string' ? v.trim() : '');

/**
 * POST /api/checkout
 * No hay "solicitud": lo que se reserva son habitaciones que el sistema ya
 * muestra como disponibles, así que el pago es lo que confirma la reserva.
 *
 * - Con Redsys conectado: devuelve los campos firmados del formulario que
 *   redirige al cliente al TPV (tarjeta, Bizum…). Antes se bloquea la
 *   habitación FALLAS.holdMinutes minutos (registro "en pago" en Airtable);
 *   la reserva pasa a confirmada solo cuando el banco confirma el pago (ver
 *   redsys-notification.ts).
 * - Sin Redsys conectado (demo): crea la reserva directamente, sin cobrar
 *   nada, para poder probar el flujo entero sin TPV.
 */
export const POST: APIRoute = async ({ request, url }) => {
  // Ventas cerradas (ver lib/sales.ts): ni pago ni bloqueo de habitación.
  if (!salesStatus().open) return json({ ok: false, error: 'ventas-cerradas' }, 403);

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return json({ ok: false, error: 'json' }, 400);
  }

  const date = str(body.date);
  const roomSlug = str(body.roomSlug);
  const guests = Number(body.guests);
  const lang = isLocale(body.lang) ? body.lang : DEFAULT_LOCALE;

  const firstName = str(body.firstName);
  const lastName = str(body.lastName);
  const email = str(body.email);
  const phone = str(body.phone);
  const country = str(body.country);
  const notes = str(body.notes);
  const consent = body.consent === true;

  const check = validateDate(date);
  if (!check.ok) return json({ ok: false, error: 'fecha', detail: check.error }, 400);

  const missing: string[] = [];
  if (!firstName) missing.push('firstName');
  if (!lastName) missing.push('lastName');
  if (!EMAIL_RE.test(email)) missing.push('email');
  if (phone.replace(/\D/g, '').length < 6) missing.push('phone');
  if (!consent) missing.push('consent');
  if (missing.length) return json({ ok: false, error: 'datos', fields: missing }, 400);

  try {
    const offers = await getRoomOffers(date);

    const room = offers.find((r) => r.slug === roomSlug);
    if (!room) return json({ ok: false, error: 'habitacion' }, 400);
    if (!room.available) return json({ ok: false, error: 'sin-disponibilidad' }, 409);

    if (!isGuestCount(guests)) {
      return json({ ok: false, error: 'huespedes' }, 400);
    }

    const quote = buildQuote(room, guests, date);

    if (!redsysEnabled()) {
      // Demo: sin TPV conectado, se crea la reserva sin cobrar nada.
      const { locator } = await createBooking({
        date,
        room,
        guests,
        total: quote.total,
        firstName,
        lastName,
        email,
        phone,
        country: country || undefined,
        notes: notes || undefined,
        lang,
        paid: false,
      });

      const persisted = airtableEnabled();

      await sendBookingEmails({
        locator,
        room,
        date,
        guests,
        quote,
        firstName,
        lastName,
        email,
        phone,
        notes: notes || undefined,
        lang,
        paid: false,
      }).catch((err) => console.error('[checkout] fallo al enviar correos', err));

      return json({
        ok: true,
        mode: 'demo',
        locator,
        persisted,
        paid: false,
        date,
        room: { roomNumber: room.roomNumber, slug: room.slug },
        quote,
      });
    }

    // Con Redsys: el localizador se genera ya para poder mostrarlo en cuanto
    // el cliente vuelve del pago (va firmado en la URL de vuelta), y la
    // notificación del banco usa este mismo localizador al crear la reserva
    // definitiva. Los datos de la reserva viajan en DS_MERCHANT_MERCHANTDATA
    // (firmado por Redsys y devuelto tal cual al confirmar el pago).
    const locator = await newLocator();
    const order = newOrder();
    const bookPath = pagePath('book', lang);

    // Bloqueo de la habitación mientras el cliente paga (FALLAS.holdMinutes):
    // otra persona la ve "ya reservada" y no puede pagarla a la vez.
    const held = await placeHold({
      date,
      room,
      guests,
      total: quote.total,
      firstName,
      lastName,
      email,
      phone,
      country: country || undefined,
      notes: notes || undefined,
      lang,
      locator,
    });
    if (!held) return json({ ok: false, error: 'sin-disponibilidad' }, 409);

    const cut = (v: string, n: number) => v.slice(0, n);

    const payment = buildPayment({
      order,
      amountEuros: quote.total,
      lang,
      description: `Balcón privado · Habitación ${room.roomNumber} · ${date}`,
      holder: `${firstName} ${lastName}`.slice(0, 60),
      data: {
        locator,
        date,
        roomSlug: room.slug,
        guests,
        firstName: cut(firstName, 60),
        lastName: cut(lastName, 60),
        email: cut(email, 100),
        phone: cut(phone, 30),
        country: cut(country, 40),
        notes: cut(notes, 200),
        lang,
      },
      notificationUrl: `${url.origin}/api/redsys-notification`,
      okUrl: `${url.origin}${bookPath}?paid=1&r=${signReturnToken({
        locator,
        date,
        guests,
        roomNumber: room.roomNumber,
        roomSlug: room.slug,
        total: quote.total,
        email,
        phone,
      })}`,
      koUrl: `${url.origin}${bookPath}?canceled=1`,
    });

    return json({ ok: true, mode: 'redirect', form: payment });
  } catch (e) {
    return handleError(e);
  }
};
