import type { APIRoute } from 'astro';
import { validateDate } from '../../lib/booking';
import { getRoomOffers } from '../../lib/airtable';
import { handleError, json } from '../../lib/api';
import { clientIp, isRateLimited } from '../../lib/rate-limit';

export const prerender = false;

// Lectura en directo (sin memoria ni caché de Vercel): cuesta una consulta a
// Airtable cada vez, así que va con límite por IP. Un cliente real la usa una
// vez por balcón elegido.
const CHECK_MAX = 30;
const CHECK_WINDOW_MS = 10 * 60_000;

/**
 * GET /api/room-check?date=YYYY-MM-DD&room=habitacion-317
 * ¿Sigue libre ese balcón ese día? La disponibilidad que se enseña en la lista
 * puede ir unos minutos por detrás; esto se consulta justo al pulsar
 * "Continuar", antes de que el cliente rellene sus datos. El bloqueo real
 * sigue haciéndose en /api/checkout.
 */
export const GET: APIRoute = async ({ request, url }) => {
  const date = url.searchParams.get('date') ?? '';
  const room = (url.searchParams.get('room') ?? '').slice(0, 40);

  const check = validateDate(date);
  if (!check.ok) return json({ ok: false, error: 'fecha' }, 400);
  if (!/^habitacion-[\w-]+$/.test(room)) return json({ ok: false, error: 'habitacion' }, 400);

  if (isRateLimited(`room-check:${clientIp(request)}`, CHECK_MAX, CHECK_WINDOW_MS)) {
    return json({ ok: false, error: 'demasiadas-solicitudes' }, 429);
  }

  try {
    const offers = await getRoomOffers(date, { fresh: true });
    const found = offers.find((r) => r.slug === room);
    if (!found) return json({ ok: false, error: 'habitacion' }, 404);
    return json({ ok: true, available: found.available });
  } catch (e) {
    return handleError(e);
  }
};
