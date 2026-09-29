import type { APIRoute } from 'astro';
import { salesStatus } from '../../lib/sales';

export const prerender = false;

/** GET /api/sales-status → { open, opensAt? }. La página de reserva lo
 *  consulta para mostrar "aún no abiertas" en vez del formulario. */
export const GET: APIRoute = () =>
  new Response(JSON.stringify({
    ok: true,
    ...salesStatus(),
    // TEMPORAL, para depurar por qué SALES_OPEN no se aplicaba: se quita
    // en cuanto quede claro qué está leyendo el servidor de verdad.
    debug: {
      metaEnv: import.meta.env?.SALES_OPEN ?? null,
      processEnv: process.env.SALES_OPEN ?? null,
    },
  }), {
    headers: { 'content-type': 'application/json', 'cache-control': 'no-store' },
  });
