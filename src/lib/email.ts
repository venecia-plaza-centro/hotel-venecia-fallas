/**
 * Envío del correo de confirmación (cliente + hotel).
 *
 * HITO 2: sin proveedor configurado. El HTML ya está listo con el estilo de
 * la web (útil en cuanto se conecte Resend / SMTP / automatización de
 * Airtable en `deliver()`); mientras tanto solo se registra por consola.
 */
import { FALLAS, SITE, type Locale } from '../consts';
import { dictFor } from '../i18n/ui';
import { pagePath } from '../i18n/pages';
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

const EMAIL_COPY: Record<string, Record<string, string>> = {
  es: {
    subject: 'Solicitud de reserva {locator} · Fallas 2027',
    preheader: 'Hemos recibido tu solicitud de balcón privado para la mascletá.',
    greeting: 'Hola {firstName},',
    intro:
      'Hemos recibido tu solicitud de balcón privado para la mascletá de Fallas 2027. Esto es lo que nos has pedido:',
    next:
      'El hotel confirmará la disponibilidad y se pondrá en contacto contigo por email o por teléfono con los pasos para el pago. El importe no se ha cobrado todavía.',
    contact: '¿Alguna duda? Escríbenos o llámanos:',
  },
  en: {
    subject: 'Booking request {locator} · Fallas 2027',
    preheader: "We've received your private balcony request for the mascletá.",
    greeting: 'Hi {firstName},',
    intro:
      "We've received your private balcony request for the Fallas 2027 mascletá. Here's what you asked for:",
    next:
      'The hotel will confirm availability and contact you by email or phone with the payment steps. No payment has been taken yet.',
    contact: 'Any questions? Write or call us:',
  },
};

function money(n: number, lang: Locale) {
  return new Intl.NumberFormat(lang === 'en' ? 'en-GB' : 'es-ES', {
    style: 'currency',
    currency: 'EUR',
    maximumFractionDigits: 0,
  }).format(n);
}

function formatDate(iso: string, lang: Locale) {
  return new Intl.DateTimeFormat(lang === 'en' ? 'en-GB' : 'es-ES', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  }).format(new Date(`${iso}T00:00:00`));
}

/** HTML con el estilo de la web (navy + dorado), a base de tablas: así se ve
 *  bien en la mayoría de clientes de correo, que no soportan flexbox/grid. */
function buildCustomerEmailHtml(data: BookingEmail): string {
  const copy = EMAIL_COPY[data.lang] ?? EMAIL_COPY.es;
  const t = dictFor(data.lang);
  const fmt = (s: string, vars: Record<string, string>) =>
    s.replace(/\{(\w+)\}/g, (_, k) => vars[k] ?? '');

  const rows: [string, string][] = [
    [t['book.summary.date'], formatDate(data.date, data.lang)],
    [t['book.summary.guests'], String(data.guests)],
    [t['book.summary.room'], fmt(t['book.room.number'], { n: data.room.roomNumber })],
  ];

  const rowsHtml = rows
    .map(
      ([label, value]) => `
      <tr>
        <td style="padding:10px 0;border-bottom:1px solid #EDE9DF;font-size:13px;color:#8A8578;font-weight:700">${label}</td>
        <td style="padding:10px 0;border-bottom:1px solid #EDE9DF;font-size:13px;color:#1B2A4A;text-align:right">${value}</td>
      </tr>`,
    )
    .join('');

  return `<!doctype html>
<html lang="${data.lang}">
  <head><meta charset="utf-8" /><meta name="viewport" content="width=device-width" /></head>
  <body style="margin:0;padding:0;background:#F9F7F2;font-family:Georgia,'Times New Roman',serif">
    <span style="display:none;font-size:1px;color:#F9F7F2">${copy.preheader}</span>
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#F9F7F2;padding:32px 0">
      <tr><td align="center">
        <table role="presentation" width="560" cellpadding="0" cellspacing="0" style="max-width:560px;width:100%;background:#ffffff;border-radius:12px;overflow:hidden">
          <tr><td style="background:#1B2A4A;padding:36px 32px;text-align:center">
            <div style="font-size:22px;color:#ffffff;font-weight:bold">${SITE.name}</div>
            <div style="font-size:11px;letter-spacing:2px;text-transform:uppercase;color:#C9A246;margin-top:6px">Fallas ${FALLAS.year}</div>
          </td></tr>
          <tr><td style="padding:40px 32px 8px;text-align:center">
            <div style="width:56px;height:56px;border-radius:50%;border:2px solid #C9A246;color:#C9A246;font-size:28px;line-height:52px;margin:0 auto 20px">✓</div>
            <h1 style="margin:0 0 16px;font-size:24px;color:#1B2A4A">${t['book.done.title']}</h1>
            <p style="margin:0 0 4px;font-size:15px;color:#1B2A4A;font-weight:bold">${fmt(copy.greeting, { firstName: data.firstName })}</p>
            <p style="margin:0 0 24px;font-size:15px;line-height:1.7;color:#4A5568">${copy.intro}</p>
          </td></tr>
          <tr><td style="padding:0 32px">
            <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #EDE9DF;border-radius:8px;padding:20px 24px">
              <tr><td style="text-align:center;padding-bottom:16px;border-bottom:1px solid #EDE9DF">
                <div style="font-size:11px;letter-spacing:1px;text-transform:uppercase;color:#8A8578">${t['book.done.locator']}</div>
                <div style="font-size:26px;color:#C9A246;font-weight:bold;letter-spacing:1px">${data.locator}</div>
              </td></tr>
              <tr><td>
                <table role="presentation" width="100%" cellpadding="0" cellspacing="0">${rowsHtml}</table>
                <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-top:8px">
                  <tr>
                    <td style="padding-top:8px;font-size:15px;color:#1B2A4A;font-weight:bold">${t['book.summary.total']}</td>
                    <td style="padding-top:8px;font-size:20px;color:#1B2A4A;font-weight:bold;text-align:right">${money(data.quote.total, data.lang)}</td>
                  </tr>
                </table>
                <div style="font-size:12px;color:#8A8578;margin-top:4px">${t['book.summary.snack']}</div>
              </td></tr>
            </table>
          </td></tr>
          <tr><td style="padding:24px 32px 8px">
            <p style="margin:0;font-size:14px;line-height:1.7;color:#4A5568">${copy.next}</p>
          </td></tr>
          <tr><td style="padding:24px 32px 36px;border-top:1px solid #EDE9DF;margin-top:16px">
            <p style="margin:16px 0 4px;font-size:13px;color:#8A8578">${copy.contact}</p>
            <p style="margin:0;font-size:13px">
              <a href="mailto:${SITE.email}" style="color:#C9A246;text-decoration:none">${SITE.email}</a>
              &nbsp;·&nbsp;
              <a href="${SITE.phoneHref}" style="color:#C9A246;text-decoration:none">${SITE.phone}</a>
            </p>
            <p style="margin:16px 0 0;font-size:11px;color:#B7B2A3">
              <a href="${SITE.origin}${pagePath('terms', data.lang)}" style="color:#B7B2A3">${t['footer.terms']}</a>
              &nbsp;·&nbsp;
              <a href="${SITE.origin}${pagePath('cancellation', data.lang)}" style="color:#B7B2A3">${t['footer.cancellation']}</a>
              &nbsp;·&nbsp;
              <a href="${SITE.origin}${pagePath('privacy', data.lang)}" style="color:#B7B2A3">${t['footer.privacy']}</a>
            </p>
          </td></tr>
        </table>
      </td></tr>
    </table>
  </body>
</html>`;
}

function buildCustomerEmailText(data: BookingEmail): string {
  const copy = EMAIL_COPY[data.lang] ?? EMAIL_COPY.es;
  return [
    copy.greeting.replace('{firstName}', data.firstName),
    '',
    copy.intro,
    '',
    `${SITE.name}`,
    `Localizador: ${data.locator}`,
    `Fecha: ${formatDate(data.date, data.lang)}`,
    `Huéspedes: ${data.guests}`,
    `Habitación: ${data.room.roomNumber}`,
    `Total: ${money(data.quote.total, data.lang)} · Snack Pack incluido`,
    '',
    copy.next,
    '',
    `${SITE.email} · ${SITE.phone}`,
  ].join('\n');
}

export async function sendBookingEmails(data: BookingEmail): Promise<void> {
  const copy = EMAIL_COPY[data.lang] ?? EMAIL_COPY.es;
  const subject = copy.subject.replace('{locator}', data.locator);

  const hotelSummary = [
    `Localizador: ${data.locator}`,
    `Cliente: ${data.firstName} ${data.lastName} · ${data.email} · ${data.phone}`,
    `Fecha: ${data.date} · acceso ${FALLAS.accessStart}–${FALLAS.accessEnd}h (mascletá ${FALLAS.mascletaTime}h)`,
    `Habitación: ${data.room.roomNumber} (${data.room.floor}) · ${data.guests} huéspedes`,
    `Total: ${money(data.quote.total, data.lang)} · Snack Pack incluido`,
    data.notes ? `Notas: ${data.notes}` : null,
  ]
    .filter(Boolean)
    .join('\n');

  await deliver({
    to: data.email,
    subject,
    html: buildCustomerEmailHtml(data),
    text: buildCustomerEmailText(data),
  });

  await deliver({
    to: SITE.email,
    subject: `[Nueva solicitud web] ${subject}`,
    text: hotelSummary,
  });
}

interface Delivery {
  to: string;
  subject: string;
  html?: string;
  text: string;
}

async function deliver(d: Delivery): Promise<void> {
  // TODO Hito 3: integrar proveedor de correo real (Resend, SMTP…) y pasarle
  // `d.to` / `d.subject` / `d.html` / `d.text` tal cual.
  console.info(
    `[email] (sin proveedor) "${d.subject}" → ${d.to}${d.html ? ' (HTML listo, ' + d.html.length + ' bytes)' : ''}\n${d.text.replace(/^/gm, '  ')}`,
  );
}
