import type { APIRoute } from 'astro';
import { getStripe, stripeEnabled } from '../../lib/stripe';
import { airtableEnabled } from '../../lib/airtable';
import { handleError, json } from '../../lib/api';

export const prerender = false;

/**
 * GET /api/checkout-status?session_id=...
 * Al volver del pago (success_url), la página necesita los datos de la
 * reserva para pintar la pantalla de confirmación. Se leen directamente de
 * los metadatos de la sesión de Stripe: no dependen de que el webhook ya
 * haya terminado de crear la reserva en Airtable.
 */
export const GET: APIRoute = async ({ url }) => {
  if (!stripeEnabled()) return json({ ok: false, error: 'no-configurado' }, 400);

  const sessionId = url.searchParams.get('session_id') ?? '';
  if (!sessionId) return json({ ok: false, error: 'falta-session' }, 400);

  try {
    const session = await getStripe().checkout.sessions.retrieve(sessionId);
    if (session.payment_status !== 'paid') {
      return json({ ok: false, error: 'no-pagado' }, 409);
    }

    const m = session.metadata ?? {};
    return json({
      ok: true,
      persisted: airtableEnabled(),
      locator: m.locator ?? '',
      date: m.date ?? '',
      guests: Number(m.guests),
      room: { roomNumber: m.roomNumber ?? '', slug: m.roomSlug ?? '' },
      quote: { total: (session.amount_total ?? 0) / 100, currency: 'EUR' },
      email: m.email ?? '',
      phone: m.phone ?? '',
      confirmVia: m.confirmVia === 'phone' ? 'phone' : 'email',
    });
  } catch (e) {
    return handleError(e);
  }
};
