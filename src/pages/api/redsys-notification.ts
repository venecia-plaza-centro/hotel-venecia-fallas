import type { APIRoute } from 'astro';
import { isGuestCount, isLocale, priceForGuests } from '../../lib/booking';
import { bookingExists, createBooking, getRoomOffers } from '../../lib/airtable';
import { sendBookingEmails, sendPaymentRefundedNotice } from '../../lib/email';
import { isAuthorised, readMerchantData, redsysEnabled, refundOrder, verifyNotification } from '../../lib/redsys';
import { DEFAULT_LOCALE } from '../../consts';

export const prerender = false;

// Redsys solo necesita un 200 para dar la notificación por recibida.
const ok = (body = 'OK') => new Response(body, { status: 200, headers: { 'content-type': 'text/plain' } });

/**
 * POST /api/redsys-notification
 * Aquí es donde se crea de verdad la reserva: en cuanto Redsys confirma el
 * pago, no antes. Antes de crearla se revalida la disponibilidad por si dos
 * personas han pagado la misma habitación/fecha casi a la vez; si ya no está
 * libre, se devuelve el pago y se avisa al cliente en vez de crear la
 * reserva. Redsys puede repetir la notificación: el localizador evita
 * duplicar la reserva.
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

  // Pago denegado o cancelado: no hay nada que crear.
  if (!isAuthorised(params)) return ok('denegado');

  const m = readMerchantData(params);
  const date = m.date ?? '';
  const roomSlug = m.roomSlug ?? '';
  const guests = Number(m.guests);
  const lang = isLocale(m.lang) ? m.lang : DEFAULT_LOCALE;
  const order = params.Ds_Order;
  const amountCents = Number(params.Ds_Amount);

  try {
    if (m.locator && (await bookingExists(m.locator))) return ok('duplicada');

    const offers = await getRoomOffers(date);
    const room = offers.find((r) => r.slug === roomSlug);

    if (!room || !room.available || !isGuestCount(guests)) {
      // Doble reserva por poco margen: el pago ya se ha cobrado, así que se
      // devuelve en vez de dejar al cliente con un cargo sin habitación.
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
    });

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
    });

    return ok();
  } catch (err) {
    // 500: Redsys reintenta la notificación más tarde.
    console.error('[redsys-notification] fallo al procesar el pago', err);
    return new Response('interno', { status: 500 });
  }
};
