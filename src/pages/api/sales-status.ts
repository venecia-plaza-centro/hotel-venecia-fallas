import type { APIRoute } from 'astro';
import { salesStatus } from '../../lib/sales';

export const prerender = false;

/** GET /api/sales-status → { open, opensAt? }. La página de reserva lo
 *  consulta para mostrar "aún no abiertas" en vez del formulario. */
export const GET: APIRoute = () =>
  new Response(JSON.stringify({ ok: true, ...salesStatus() }), {
    headers: { 'content-type': 'application/json', 'cache-control': 'no-store' },
  });
