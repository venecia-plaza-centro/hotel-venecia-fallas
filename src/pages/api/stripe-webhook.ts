import type { APIRoute } from 'astro';
import { isGuestCount, isLocale, priceForGuests } from '../../lib/booking';
import { createBooking, getRoomOffers } from '../../lib/airtable';
import { sendBookingEmails, sendPaymentRefundedNotice } from '../../lib/email';
import { getStripe, WEBHOOK_SECRET } from '../../lib/stripe';
import { json } from '../../lib/api';
import { DEFAULT_LOCALE } from '../../consts';
import type Stripe from 'stripe';

export const prerender = false;

/**
 * POST /api/stripe-webhook
 * Aquí es donde se crea de verdad la reserva: en cuanto Stripe confirma el
 * pago (checkout.session.completed), no antes. Antes de crearla se
 * revalida la disponibilidad por si dos personas han pagado la misma
 * habitación/fecha casi a la vez; si ya no está libre, se reembolsa
 * automáticamente y se avisa al cliente en vez de crear la reserva.
 */
export const POST: APIRoute = async ({ request }) => {
  if (!WEBHOOK_SECRET) return json({ ok: false, error: 'no-configurado' }, 500);

  const signature = request.headers.get('stripe-signature');
  const rawBody = await request.text();
  if (!signature) return json({ ok: false, error: 'sin-firma' }, 400);

  const stripe = getStripe();
  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(rawBody, signature, WEBHOOK_SECRET);
  } catch (err) {
    console.error('[stripe-webhook] firma inválida', err);
    return json({ ok: false, error: 'firma-invalida' }, 400);
  }

  if (event.type !== 'checkout.session.completed') {
    return json({ ok: true, ignored: event.type });
  }

  const session = event.data.object as Stripe.Checkout.Session;
  const m = session.metadata ?? {};
  const date = m.date ?? '';
  const roomSlug = m.roomSlug ?? '';
  const guests = Number(m.guests);
  const lang = isLocale(m.lang) ? m.lang : DEFAULT_LOCALE;

  try {
    const offers = await getRoomOffers(date);
    const room = offers.find((r) => r.slug === roomSlug);

    if (!room || !room.available || !isGuestCount(guests)) {
      // Doble reserva por poco margen: el pago ya se ha cobrado, así que se
      // reembolsa en vez de dejar al cliente con un cargo sin habitación.
      if (session.payment_intent) {
        await stripe.refunds.create({ payment_intent: String(session.payment_intent) });
      }
      await sendPaymentRefundedNotice({
        email: m.email ?? '',
        firstName: m.firstName ?? '',
        roomNumber: m.roomNumber ?? roomSlug,
        date,
        lang,
      });
      return json({ ok: true, refunded: true });
    }

    const total = priceForGuests(room, guests);

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

    return json({ ok: true });
  } catch (err) {
    console.error('[stripe-webhook] fallo al procesar el pago', err);
    return json({ ok: false, error: 'interno' }, 500);
  }
};
