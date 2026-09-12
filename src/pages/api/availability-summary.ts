import type { APIRoute } from 'astro';
import { allSaleDays } from '../../lib/booking';
import { getAvailabilitySummary } from '../../lib/airtable';
import { handleError, json } from '../../lib/api';

export const prerender = false;

/**
 * GET /api/availability-summary
 * Nº de habitaciones libres por cada día de la ventana de venta (1–12 de
 * marzo de 2027), para pintar el calendario antes de elegir fecha.
 */
export const GET: APIRoute = async () => {
  try {
    const dates = allSaleDays();
    const summary = await getAvailabilitySummary(dates);
    return json({ ok: true, days: dates.map((date) => ({ date, available: summary[date] ?? 0 })) });
  } catch (e) {
    return handleError(e);
  }
};
