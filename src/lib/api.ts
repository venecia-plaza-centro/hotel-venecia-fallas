/** Utilidades compartidas por las rutas src/pages/api/*. */
import { AirtableError } from './airtable';
import type { RoomOffer } from './booking';

export function json(data: unknown, status = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'content-type': 'application/json; charset=utf-8',
      'cache-control': 'no-store',
    },
  });
}

/** Traduce cualquier excepción en una respuesta JSON con código estable. */
export function handleError(e: unknown): Response {
  if (e instanceof AirtableError) {
    return json({ ok: false, error: 'servicio' }, e.status >= 500 ? e.status : 502);
  }
  console.error('[api] error inesperado', e);
  return json({ ok: false, error: 'interno' }, 500);
}

export function serializeRoom(r: RoomOffer) {
  return {
    slug: r.slug,
    roomNumber: r.roomNumber,
    floor: r.floor,
    capacity: r.capacity,
    bed: r.bed,
    price: r.price,
    available: r.available,
    descriptionEs: r.descriptionEs,
    descriptionEn: r.descriptionEn,
    photos: r.photos,
  };
}
