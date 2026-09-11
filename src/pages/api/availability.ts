import type { APIRoute } from 'astro';
import { validateDate } from '../../lib/booking';
import { getRoomOffers } from '../../lib/airtable';
import { handleError, json, serializeRoom } from '../../lib/api';

export const prerender = false;

/**
 * GET /api/availability?date=YYYY-MM-DD
 * Habitaciones con disponibilidad para ese día de mascletà.
 */
export const GET: APIRoute = async ({ url }) => {
  const date = url.searchParams.get('date') ?? '';

  const check = validateDate(date);
  if (!check.ok) return json({ ok: false, error: 'fecha', detail: check.error }, 400);

  try {
    const rooms = await getRoomOffers(date);
    return json({ ok: true, date, rooms: rooms.map(serializeRoom) });
  } catch (e) {
    return handleError(e);
  }
};
