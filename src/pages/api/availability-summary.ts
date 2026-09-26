import type { APIRoute } from 'astro';
import { allSaleDays } from '../../lib/booking';
import { getAvailabilitySummary } from '../../lib/airtable';
import { handleError, json, cacheJson } from '../../lib/api';

export const prerender = false;

/**
 * GET /api/availability-summary[?room=slug]
 * Nº de habitaciones libres por cada día de la ventana de venta (1–12 de
 * marzo de 2027), para pintar el calendario antes de elegir fecha. Con
 * `room`, cada día trae además `roomFree`: si esa habitación concreta sigue
 * libre (el cliente que viene de "Reservar habitación X" ve tachados los días
 * en que ya está reservada).
 */
export const GET: APIRoute = async ({ url }) => {
  try {
    const dates = allSaleDays();
    const room = url.searchParams.get('room') ?? undefined;
    const summary = await getAvailabilitySummary(dates, room);
    return cacheJson({
      ok: true,
      days: dates.map((date) => ({
        date,
        available: summary[date]?.free ?? 0,
        ...(room ? { roomFree: summary[date]?.roomFree } : {}),
      })),
    }, 20);
  } catch (e) {
    return handleError(e);
  }
};
