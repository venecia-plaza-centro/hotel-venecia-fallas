/**
 * Envío del correo de confirmación (cliente + hotel).
 *
 * HITO 2: sin proveedor configurado. Aquí solo se registra por consola qué
 * correo se enviaría. En el Hito 3 (o antes, según decida el hotel) se enchufa
 * Resend / SMTP / automatización de Airtable rellenando `deliver()`.
 */
import { FALLAS, SITE, type Locale } from '../consts';
import type { Quote, Room } from './booking';

export interface BookingEmail {
  locator: string;
  room: Room;
  date: string;
  guests: number;
  quote: Quote;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  notes?: string;
  lang: Locale;
  persisted: boolean;
}

export async function sendBookingEmails(data: BookingEmail): Promise<void> {
  const money = (n: number) =>
    new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' }).format(n);

  const resumen = [
    `Localizador: ${data.locator}`,
    `Cliente: ${data.firstName} ${data.lastName} · ${data.email} · ${data.phone}`,
    `Fecha: ${data.date} · acceso ${FALLAS.accessStart}–${FALLAS.accessEnd}h (mascletà ${FALLAS.mascletaTime}h)`,
    `Habitación: ${data.room.roomNumber} (${data.room.floor}) · ${data.guests} huéspedes`,
    `Total: ${money(data.quote.total)} · Snack Pack incluido`,
    data.notes ? `Notas: ${data.notes}` : null,
  ]
    .filter(Boolean)
    .join('\n');

  await deliver({
    toCustomer: data.email,
    toHotel: SITE.email,
    subject: `Solicitud de reserva ${data.locator} · Fallas 2027`,
    body: resumen,
  });
}

interface Delivery {
  toCustomer: string;
  toHotel: string;
  subject: string;
  body: string;
}

async function deliver(d: Delivery): Promise<void> {
  // TODO Hito 3: integrar proveedor de correo real.
  console.info(
    `[email] (sin proveedor) "${d.subject}"\n  → cliente: ${d.toCustomer}\n  → hotel: ${d.toHotel}\n${d.body.replace(/^/gm, '  ')}`,
  );
}
