/**
 * Confirmación de la reserva por SMS, para el cliente que elige "teléfono"
 * en vez de "email" en el paso de datos.
 *
 * Sin proveedor configurado (Twilio, Vonage…): solo se registra por consola
 * el mensaje que se enviaría, igual que email.ts y airtable.ts sin sus
 * respectivas credenciales.
 */
import { FALLAS, SITE } from '../consts';
import type { BookingNotification } from './booking';

function money(n: number) {
  return new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(n);
}

export async function sendBookingSms(data: BookingNotification): Promise<void> {
  const es = data.lang !== 'en';
  const text = es
    ? `${SITE.name}: ¡reserva confirmada! Localizador ${data.locator}. Habitación ${data.room.roomNumber}, ${data.date}, acceso ${FALLAS.accessStart}-${FALLAS.accessEnd}h. Total ${money(data.quote.total)}. Dudas: ${SITE.phone}.`
    : `${SITE.name}: booking confirmed! Reference ${data.locator}. Room ${data.room.roomNumber}, ${data.date}, access ${FALLAS.accessStart}-${FALLAS.accessEnd}. Total ${money(data.quote.total)}. Questions: ${SITE.phone}.`;

  // TODO: integrar un proveedor real (Twilio, Vonage…) y pasarle
  // `data.phone` / `text` tal cual.
  console.info(`[sms] (sin proveedor) → ${data.phone}\n  ${text}`);
}
