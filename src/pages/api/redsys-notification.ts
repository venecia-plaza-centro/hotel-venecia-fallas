import type { APIRoute } from 'astro';
import { isGuestCount, isLocale, priceForGuests } from '../../lib/booking';
import { cancelBooking, confirmHeldBooking, createBooking, findBooking, getRoomOffers } from '../../lib/airtable';
import { sendBookingEmails, sendPaymentRefundedNotice } from '../../lib/email';
import { isAuthorised, readMerchantData, redsysEnabled, refundOrder, verifyNotification } from '../../lib/redsys';
import { DEFAULT_LOCALE } from '../../consts';

export const prerender = false;

// Redsys solo necesita un 200 para dar la notificación por recibida.
const ok = (body = 'OK') => new Response(body, { status: 200, headers: { 'content-type': 'text/plain' } });

/**
 * POST /api/redsys-notification
 * Aquí se confirma de verdad la reserva: en cuanto Redsys confirma el pago,
 * no antes. Al pasar al TPV la habitación quedó bloqueada (registro "en
 * pago", ver checkout.ts); aquí ese bloqueo pasa a reserva pagada. Si el
 * bloqueo caducó antes de pagar (el cliente tardó más de FALLAS.holdMinutes)
 * se revalida la disponibilidad por si otra persona ya la tiene; si no está
 * libre, se devuelve el pago y se avisa al cliente. Redsys puede repetir la
 * notificación: el localizador evita duplicar la reserva.
 */
export const POST: APIRoute = async ({ request }) => {
  if (!redsysEnabled()) return new Response('no-configurado', { status: 500 });

  const form = await request.formData();
  const params = verifyNotification({
    Ds_SignatureVersion: String(form.get('Ds_SignatureVersion') ?? ''),
    Ds_MerchantParameters: String(form.get('Ds_MerchantParameters') ?? ''),
    Ds_Signature: String(form.get('Ds_Signature') ?? ''),
  });
  if (!params) {
    console.error('[redsys-notification] firma inválida');
    return new Response('firma-invalida', { status: 400 });
  }

  const m = readMerchantData(params);

  // Pago denegado o cancelado: se libera la habitación al momento en vez de
  // esperar a que caduque el bloqueo.
  if (!isAuthorised(params)) {
    try {
      const held = m.locator ? await findBooking(m.locator) : null;
      if (held?.estado === 'en pago') await cancelBooking(held.id);
    } catch (err) {
      console.error('[redsys-notification] no se pudo liberar el bloqueo', err);
    }
    return ok('denegado');
  }

  const date = m.date ?? '';
  const roomSlug = m.roomSlug ?? '';
  const guests = Number(m.guests);
  const lang = isLocale(m.lang) ? m.lang : DEFAULT_LOCALE;
  const order = params.Ds_Order;
  const amountCents = Number(params.Ds_Amount);

  try {
    const existing = m.locator ? await findBooking(m.locator) : null;
    if (existing?.estado === 'confirmada') return ok('duplicada');

    // Se excluye la propia reserva: su bloqueo (si sigue vigente) no cuenta
    // contra ella misma.
    const offers = await getRoomOffers(date, m.locator);
    const room = offers.find((r) => r.slug === roomSlug);

    if (!room || !room.available || !isGuestCount(guests)) {
      // Doble reserva por poco margen: el pago ya se ha cobrado, así que se
      // devuelve en vez de dejar al cliente con un cargo sin habitación.
      if (existing) await cancelBooking(existing.id);
      const refunded = await refundOrder(order, amountCents);
      await sendPaymentRefundedNotice({
        email: m.email ?? '',
        firstName: m.firstName ?? '',
        roomNumber: room?.roomNumber ?? roomSlug,
        date,
        lang,
        manual: !refunded,
        locator: m.locator,
        order,
      });
      return ok('reembolsada');
    }

    const total = priceForGuests(room, guests, date);

    if (existing) {
      await confirmHeldBooking(existing.id, total, { order, authCode: params.Ds_AuthorisationCode });
    } else {
      // Sin bloqueo previo (p. ej. registro borrado a mano): se crea ahora.
      await createBooking({
        date,
        room,
        guests,
        total,
        firstName: m.firstName ?? '',
        lastName: m.lastName ?? '',
        email: m.email ?? '',
        phone: m.phone ?? '',
        country: m.country || undefined,
        notes: m.notes || undefined,
        lang,
        locator: m.locator,
        paid: true,
        payment: { order, authCode: params.Ds_AuthorisationCode },
      });
    }

    await sendBookingEmails({
      locator: m.locator ?? '',
      room,
      date,
      guests,
      quote: { total, currency: 'EUR' },
      firstName: m.firstName ?? '',
      lastName: m.lastName ?? '',
      email: m.email ?? '',
      phone: m.phone ?? '',
      notes: m.notes || undefined,
      lang,
      paid: true,
      payment: { order, authCode: params.Ds_AuthorisationCode },
    });

    return ok();
  } catch (err) {
    // 500: Redsys reintenta la notificación más tarde.
    console.error('[redsys-notification] fallo al procesar el pago', err);
    return new Response('interno', { status: 500 });
  }
};
