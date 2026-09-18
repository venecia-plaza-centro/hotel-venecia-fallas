import type { APIRoute } from 'astro';
import { getSoldOutRoomSlugs } from '../../lib/airtable';
import { handleError, json } from '../../lib/api';

export const prerender = false;

/**
 * GET /api/rooms-availability
 * Slugs de las habitaciones sin ningún día libre en toda la ventana de
 * venta. Home y Habitaciones son páginas estáticas (generadas en el
 * build), así que esto se consulta desde el navegador para reflejar
 * reservas hechas después del último despliegue, no solo las que había
 * al compilar.
 */
export const GET: APIRoute = async () => {
  try {
    const soldOut = await getSoldOutRoomSlugs();
    return json({ ok: true, soldOut });
  } catch (e) {
    return handleError(e);
  }
};
