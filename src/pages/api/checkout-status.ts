import type { APIRoute } from 'astro';
import { readReturnToken, redsysEnabled } from '../../lib/redsys';
import { airtableEnabled } from '../../lib/airtable';
import { json } from '../../lib/api';

export const prerender = false;

/**
 * GET /api/checkout-status?r=...
 * Al volver del TPV (URL OK), la página necesita los datos de la reserva
 * para pintar la pantalla de confirmación. Vienen en un token firmado en la
 * propia URL de vuelta (ver checkout.ts): no dependen de que la notificación
 * del banco ya haya terminado de crear la reserva en Airtable, y no se
 * pueden inventar sin la clave del comercio.
 */
export const GET: APIRoute = async ({ url }) => {
  if (!redsysEnabled()) return json({ ok: false, error: 'no-configurado' }, 400);

  const token = url.searchParams.get('r') ?? '';
  const m = token ? readReturnToken(token) : null;
  if (!m) return json({ ok: false, error: 'token-invalido' }, 400);

  return json({
    ok: true,
    persisted: airtableEnabled(),
    locator: String(m.locator ?? ''),
    date: String(m.date ?? ''),
    guests: Number(m.guests),
    room: { roomNumber: String(m.roomNumber ?? ''), slug: String(m.roomSlug ?? '') },
    quote: { total: Number(m.total), currency: 'EUR' },
    email: String(m.email ?? ''),
    phone: String(m.phone ?? ''),
  });
};
