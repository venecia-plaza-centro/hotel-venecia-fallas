import type { APIRoute } from 'astro';
import { validateStay } from '../../lib/booking';
import { getExtras, getRoomOffers } from '../../lib/airtable';
import { handleError, json, serializeExtra, serializeRoom } from '../../lib/api';

export const prerender = false;

/**
 * GET /api/availability?from=YYYY-MM-DD&to=YYYY-MM-DD
 * Habitaciones con disponibilidad y precio para la estancia, más el catálogo
 * de extras de catering.
 */
export const GET: APIRoute = async ({ url }) => {
  const from = url.searchParams.get('from') ?? '';
  const to = url.searchParams.get('to') ?? '';

  const stay = validateStay(from, to);
  if (!stay.ok) return json({ ok: false, error: 'fechas', detail: stay.error }, 400);

  try {
    const [rooms, extras] = await Promise.all([getRoomOffers(from, to), getExtras()]);
    return json({
      ok: true,
      stay: { from, to, nights: stay.nights },
      rooms: rooms.map(serializeRoom),
      extras: extras.map(serializeExtra),
    });
  } catch (e) {
    return handleError(e);
  }
};
