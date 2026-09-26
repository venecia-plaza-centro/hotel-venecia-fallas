/** Utilidades compartidas por las rutas src/pages/api/*. */
import { AirtableError } from './airtable';
import { priceForGuests, type GuestCount, type RoomOffer } from './booking';

export function json(data: unknown, status = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'content-type': 'application/json; charset=utf-8',
      'cache-control': 'no-store',
    },
  });
}

/**
 * JSON que Vercel puede guardar unos segundos en su red (s-maxage) y servir a
 * muchos visitantes sin volver a ejecutar la función ni consultar Airtable.
 * Solo para lecturas que se muestran (disponibilidad, fotos), nunca para
 * bloqueos ni pagos. `stale-while-revalidate` sirve la copia vieja mientras
 * se refresca en segundo plano.
 */
export function cacheJson(data: unknown, sMaxAgeSeconds: number, staleSeconds = sMaxAgeSeconds * 2): Response {
  return new Response(JSON.stringify(data), {
    headers: {
      'content-type': 'application/json; charset=utf-8',
      'cache-control': `public, s-maxage=${sMaxAgeSeconds}, stale-while-revalidate=${staleSeconds}`,
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

/** `guests` y `date` deciden qué precio de `r.prices` se manda: el cliente
 *  nunca elige el importe, solo cuántos van y qué día. */
export function serializeRoom(r: RoomOffer, guests: GuestCount, date: string) {
  return {
    slug: r.slug,
    roomNumber: r.roomNumber,
    floor: r.floor,
    capacity: r.capacity,
    price: priceForGuests(r, guests, date),
    available: r.available,
    descriptionEs: r.descriptionEs,
    descriptionEn: r.descriptionEn,
    photos: r.photos,
  };
}
