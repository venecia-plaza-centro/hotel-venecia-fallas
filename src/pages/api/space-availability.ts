import type { APIRoute } from 'astro';
import { getSpaceDayOffers } from '../../lib/space-booking';
import { handleError, cacheJson } from '../../lib/api';

export const prerender = false;

/**
 * GET /api/space-availability[?space=espacio-109]
 * Para cada espacio: sus días de alquiler con precio y si siguen libres. Es lo
 * que enseña el calendario de la reserva; la comprobación de verdad (en
 * directo) se hace al bloquear el espacio, en /api/checkout.
 */
export const GET: APIRoute = async ({ url }) => {
  try {
    const only = url.searchParams.get('space');
    const spaces = (await getSpaceDayOffers()).filter((s) => !only || s.slug === only);
    return cacheJson({ ok: true, spaces }, 120, 300);
  } catch (e) {
    return handleError(e);
  }
};
