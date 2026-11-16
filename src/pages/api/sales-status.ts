import type { APIRoute } from 'astro';
import { salesStatus, spacesSalesStatus } from '../../lib/sales';

export const prerender = false;

/** GET /api/sales-status → { open, opensAt? }. La página de reserva lo
 *  consulta para mostrar "aún no abiertas" en vez del formulario.
 *  Con ?for=space se mira el interruptor de los espacios (ver lib/sales.ts). */
export const GET: APIRoute = ({ url }) => {
  const status = url.searchParams.get('for') === 'space' ? spacesSalesStatus() : salesStatus();
  return new Response(JSON.stringify({ ok: true, ...status }), {
    headers: { 'content-type': 'application/json', 'cache-control': 'no-store' },
  });
};
