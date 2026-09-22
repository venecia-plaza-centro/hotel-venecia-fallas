import type { APIRoute } from 'astro';
import { getRooms } from '../../lib/airtable';
import { handleError, json } from '../../lib/api';

export const prerender = false;

/**
 * GET /api/room-photos
 * Las fotos de Airtable llevan una URL firmada que caduca a las pocas
 * horas; Home y Habitaciones son páginas estáticas (generadas en el
 * build), así que las URLs que quedan guardadas ahí acaban rotas. Esto se
 * consulta desde el navegador en cada visita para refrescarlas con las
 * vigentes, sin esperar a un nuevo despliegue.
 */
export const GET: APIRoute = async () => {
  try {
    const rooms = await getRooms();
    const photos = Object.fromEntries(rooms.map((r) => [r.slug, r.photos]));
    return json({ ok: true, photos });
  } catch (e) {
    return handleError(e);
  }
};
