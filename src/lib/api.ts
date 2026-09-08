/** Utilidades compartidas por las rutas src/pages/api/*. */
import { AirtableError } from './airtable';
import type { Extra, RoomOffer } from './booking';

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
    name: r.name,
    type: r.type,
    capacity: r.capacity,
    plazaView: r.plazaView,
    pricePerNight: r.pricePerNight,
    available: r.available,
    nights: r.nights,
    lodgingTotal: r.lodgingTotal,
    descriptionEs: r.descriptionEs,
    descriptionEn: r.descriptionEn,
    photo: r.photo,
  };
}

export function serializeExtra(e: Extra) {
  return {
    slug: e.slug,
    name: e.name,
    descriptionEs: e.descriptionEs,
    descriptionEn: e.descriptionEn,
    pricePerPerson: e.pricePerPerson,
    minPeople: e.minPeople,
  };
}
