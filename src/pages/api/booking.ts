import type { APIRoute } from 'astro';
import { DEFAULT_LOCALE } from '../../consts';
import { buildQuote, isLocale, validateStay } from '../../lib/booking';
import { airtableEnabled, createBooking, getExtras, getRoomOffers } from '../../lib/airtable';
import { sendBookingEmails } from '../../lib/email';
import { handleError, json } from '../../lib/api';

export const prerender = false;

const EMAIL_RE = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;
const str = (v: unknown) => (typeof v === 'string' ? v.trim() : '');

/**
 * POST /api/booking
 * Crea la reserva. Revalida fechas, disponibilidad y precio en el servidor:
 * nada de lo que manda el cliente se da por bueno salvo los datos de contacto.
 */
export const POST: APIRoute = async ({ request }) => {
  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return json({ ok: false, error: 'json' }, 400);
  }

  const from = str(body.from);
  const to = str(body.to);
  const roomSlug = str(body.roomSlug);
  const cateringSlug = str(body.cateringSlug);
  const guests = Number(body.guests);
  const cateringPeople = Number(body.cateringPeople ?? 0);
  const lang = isLocale(body.lang) ? body.lang : DEFAULT_LOCALE;

  const firstName = str(body.firstName);
  const lastName = str(body.lastName);
  const email = str(body.email);
  const phone = str(body.phone);
  const country = str(body.country);
  const notes = str(body.notes);
  const consent = body.consent === true;

  const stay = validateStay(from, to);
  if (!stay.ok) return json({ ok: false, error: 'fechas', detail: stay.error }, 400);

  const missing: string[] = [];
  if (!firstName) missing.push('firstName');
  if (!lastName) missing.push('lastName');
  if (!EMAIL_RE.test(email)) missing.push('email');
  if (phone.replace(/\D/g, '').length < 6) missing.push('phone');
  if (!consent) missing.push('consent');
  if (missing.length) return json({ ok: false, error: 'datos', fields: missing }, 400);

  try {
    const [offers, extras] = await Promise.all([getRoomOffers(from, to), getExtras()]);

    const room = offers.find((r) => r.slug === roomSlug);
    if (!room) return json({ ok: false, error: 'habitacion' }, 400);
    if (!room.available) return json({ ok: false, error: 'sin-disponibilidad' }, 409);

    if (!Number.isInteger(guests) || guests < 1 || guests > room.capacity) {
      return json({ ok: false, error: 'huespedes', max: room.capacity }, 400);
    }

    let extra = null;
    if (cateringSlug) {
      extra = extras.find((e) => e.slug === cateringSlug) ?? null;
      if (!extra) return json({ ok: false, error: 'catering' }, 400);
      if (!Number.isInteger(cateringPeople) || cateringPeople < extra.minPeople) {
        return json({ ok: false, error: 'catering-min', min: extra.minPeople }, 400);
      }
      if (cateringPeople > 200) return json({ ok: false, error: 'catering-max' }, 400);
    }

    const quote = buildQuote(room, extra, { from, to, cateringPeople });

    const { locator } = await createBooking({
      from,
      to,
      room,
      guests,
      extra,
      cateringPeople: extra ? cateringPeople : 0,
      lodging: quote.lodging,
      catering: quote.catering,
      total: quote.total,
      firstName,
      lastName,
      email,
      phone,
      country: country || undefined,
      notes: notes || undefined,
      lang,
    });

    const persisted = airtableEnabled();

    await sendBookingEmails({
      locator,
      room,
      extra,
      cateringPeople: extra ? cateringPeople : 0,
      guests,
      quote,
      from,
      to,
      firstName,
      lastName,
      email,
      phone,
      notes: notes || undefined,
      lang,
      persisted,
    }).catch((err) => console.error('[booking] fallo al enviar correos', err));

    return json({
      ok: true,
      locator,
      persisted,
      stay: { from, to, nights: quote.nights },
      room: { name: room.name, slug: room.slug },
      catering: extra ? { name: extra.name, people: cateringPeople } : null,
      quote,
    });
  } catch (e) {
    return handleError(e);
  }
};
