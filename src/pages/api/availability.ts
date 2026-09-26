import type { APIRoute } from 'astro';
import { isGuestCount, validateDate } from '../../lib/booking';
import { getRoomOffers } from '../../lib/airtable';
import { handleError, json, serializeRoom, cacheJson } from '../../lib/api';

export const prerender = false;

/**
 * GET /api/availability?date=YYYY-MM-DD&guests=2|3|4
 * Habitaciones con disponibilidad y precio para ese día y ese nº de personas
 * (el precio depende de cuántas personas se apunten).
 */
export const GET: APIRoute = async ({ url }) => {
  const date = url.searchParams.get('date') ?? '';
  const guests = Number(url.searchParams.get('guests'));

  const check = validateDate(date);
  if (!check.ok) return json({ ok: false, error: 'fecha', detail: check.error }, 400);
  if (!isGuestCount(guests)) return json({ ok: false, error: 'huespedes' }, 400);

  try {
    const rooms = await getRoomOffers(date);
    return cacheJson({ ok: true, date, guests, rooms: rooms.map((r) => serializeRoom(r, guests, date)) }, 20);
  } catch (e) {
    return handleError(e);
  }
};
