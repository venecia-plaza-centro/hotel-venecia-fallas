import type { APIRoute } from 'astro';
import { DEFAULT_LOCALE } from '../../consts';
import { pagePath } from '../../i18n/pages';
import { buildQuote, isConfirmChannel, isGuestCount, isLocale, validateDate } from '../../lib/booking';
import { airtableEnabled, createBooking, getRoomOffers, newLocator } from '../../lib/airtable';
import { sendBookingEmails } from '../../lib/email';
import { getStripe, stripeEnabled } from '../../lib/stripe';
import { handleError, json } from '../../lib/api';

export const prerender = false;

const EMAIL_RE = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;
const str = (v: unknown) => (typeof v === 'string' ? v.trim() : '');

/**
 * POST /api/checkout
 * No hay "solicitud": lo que se reserva son habitaciones que el sistema ya
 * muestra como disponibles, así que el pago es lo que confirma la reserva.
 *
 * - Con Stripe conectado: crea una sesión de Checkout (tarjeta + Bizum) y
 *   devuelve la URL a la que redirigir al cliente. La reserva se crea en
 *   Airtable solo cuando Stripe confirma el pago (ver stripe-webhook.ts).
 * - Sin Stripe conectado (demo): crea la reserva directamente, sin cobrar
 *   nada, para poder probar el flujo entero sin cuenta de pago.
 */
export const POST: APIRoute = async ({ request, url }) => {
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
  const confirmVia = isConfirmChannel(body.confirmVia) ? body.confirmVia : 'email';

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

    if (!stripeEnabled()) {
      // Demo: sin pasarela conectada, se crea la reserva sin cobrar nada.
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
        confirmVia,
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
        confirmVia,
        paid: false,
      }).catch((err) => console.error('[checkout] fallo al enviar correos', err));

      return json({
        ok: true,
        mode: 'demo',
        locator,
        persisted,
        paid: false,
        confirmVia,
        date,
        room: { roomNumber: room.roomNumber, slug: room.slug },
        quote,
      });
    }

    // Con Stripe: el localizador se genera ya para poder mostrarlo en cuanto
    // el cliente vuelve del pago (ver /api/checkout-status), y el webhook usa
    // este mismo localizador al crear la reserva definitiva.
    const locator = await newLocator();
    const bookPath = pagePath('book', lang);

    const session = await getStripe().checkout.sessions.create({
      mode: 'payment',
      payment_method_types: ['card', 'bizum'],
      customer_email: email,
      line_items: [
        {
          quantity: 1,
          price_data: {
            currency: 'eur',
            unit_amount: Math.round(quote.total * 100),
            product_data: {
              name: `Balcón privado · Habitación ${room.roomNumber} · ${date}`,
              description: 'Fallas 2027 · Snack Pack incluido',
            },
          },
        },
      ],
      success_url: `${url.origin}${bookPath}?paid=1&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${url.origin}${bookPath}?canceled=1`,
      metadata: {
        locator,
        date,
        roomSlug: room.slug,
        roomNumber: room.roomNumber,
        guests: String(guests),
        firstName,
        lastName,
        email,
        phone,
        country,
        notes,
        lang,
        confirmVia,
      },
    });

    if (!session.url) throw new Error('Stripe no devolvió una URL de checkout');

    return json({ ok: true, mode: 'redirect', url: session.url });
  } catch (e) {
    return handleError(e);
  }
};
