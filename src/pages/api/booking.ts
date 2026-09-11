import type { APIRoute } from 'astro';
import { DEFAULT_LOCALE } from '../../consts';
import { buildQuote, isGuestCount, isLocale, validateDate } from '../../lib/booking';
import { airtableEnabled, createBooking, getRoomOffers } from '../../lib/airtable';
import { sendBookingEmails } from '../../lib/email';
import { handleError, json } from '../../lib/api';

export const prerender = false;

const EMAIL_RE = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;
const str = (v: unknown) => (typeof v === 'string' ? v.trim() : '');

/**
 * POST /api/booking
 * Crea la reserva. Revalida fecha, disponibilidad y precio en el servidor:
 * nada de lo que manda el cliente se da por bueno salvo los datos de contacto.
 */
export const POST: APIRoute = async ({ request }) => {
  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return json({ ok: false, error: 'json' }, 400);
  }

  const date = str(body.date);
  const roomSlug = str(body.roomSlug);
  const guests = Number(body.guests);
  const lang = isLocale(body.lang) ? body.lang : DEFAULT_LOCALE;

  const firstName = str(body.firstName);
  const lastName = str(body.lastName);
  const email = str(body.email);
  const phone = str(body.phone);
  const country = str(body.country);
  const notes = str(body.notes);
  const consent = body.consent === true;

  const check = validateDate(date);
  if (!check.ok) return json({ ok: false, error: 'fecha', detail: check.error }, 400);

  const missing: string[] = [];
  if (!firstName) missing.push('firstName');
  if (!lastName) missing.push('lastName');
  if (!EMAIL_RE.test(email)) missing.push('email');
  if (phone.replace(/\D/g, '').length < 6) missing.push('phone');
  if (!consent) missing.push('consent');
  if (missing.length) return json({ ok: false, error: 'datos', fields: missing }, 400);

  try {
    const offers = await getRoomOffers(date);

    const room = offers.find((r) => r.slug === roomSlug);
    if (!room) return json({ ok: false, error: 'habitacion' }, 400);
    if (!room.available) return json({ ok: false, error: 'sin-disponibilidad' }, 409);

    if (!isGuestCount(guests)) {
      return json({ ok: false, error: 'huespedes' }, 400);
    }

    const quote = buildQuote(room, guests);

    const { locator } = await createBooking({
      date,
      room,
      guests,
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
      date,
      guests,
      quote,
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
      date,
      room: { roomNumber: room.roomNumber, slug: room.slug },
      quote,
    });
  } catch (e) {
    return handleError(e);
  }
};
