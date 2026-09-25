/**
 * Confirmación de la reserva al cliente por email + aviso interno al hotel,
 * también por email.
 *
 * Sin proveedor configurado: el HTML ya está listo con el estilo de la web
 * (útil en cuanto se conecte Resend / SMTP en `deliver()`); mientras tanto
 * solo se registra por consola.
 */
import { FALLAS, SITE, type Locale } from '../consts';
import { dictFor } from '../i18n/ui';
import { pagePath } from '../i18n/pages';
import type { BookingNotification } from './booking';

export type BookingEmail = BookingNotification;

interface EmailCopy {
  subject: string;
  preheader: string;
  banner: string;
  greeting: string;
  confirmed: string;
  showEmail: string;
  detailsTitle: string;
  arrivalTitle: string;
  arrival: string;
  entrances: string;
  terms: { title: string; lines: string[] }[];
  thanks: string;
  signoff: string;
  contact: string;
}

const EMAIL_COPY: Record<string, EmailCopy> = {
  es: {
    subject: 'Reserva confirmada {locator} · Fallas 2027',
    preheader: 'Su reserva ha sido confirmada. Enseñe este correo para subir a la habitación.',
    banner: 'Reserva confirmada',
    greeting: 'Estimado/a {firstName}:',
    confirmed: 'Su reserva ha sido confirmada.',
    showEmail:
      'Deberán enseñar este correo para subir a la habitación y necesitaremos el DNI del titular de la reserva para hacer el registro.',
    detailsTitle: 'Los datos de su reserva',
    arrivalTitle: 'Cómo llegar',
    arrival:
      'Recomendamos llegar a la Plaza del Ayuntamiento sobre las 12.30h (más en fin de semana) ya que luego cortan todos los accesos y es más complicado.',
    entrances:
      'El hotel tiene dos entradas: Plaza del Ayuntamiento 3 o Calle en Llop 5, pueden usar la que más les convenga.',
    terms: [
      {
        title: '1. Capacidad y acceso',
        lines: [
          'El acceso está limitado al número de personas reservadas.',
          'No se permitirá el acceso a personas adicionales bajo ningún concepto.',
          'El incumplimiento de esta norma podrá suponer la cancelación inmediata de la experiencia sin derecho a reembolso.',
        ],
      },
      {
        title: '2. Normas de uso',
        lines: [
          'El espacio deberá utilizarse de forma responsable.',
          'No se permite fumar en el interior de la habitación.',
          'Cualquier daño ocasionado será responsabilidad de los asistentes.',
        ],
      },
      {
        title: '3. Política de cancelación',
        lines: [
          'En caso de cancelación del evento por causas ajenas a la organización (condiciones meteorológicas extremas, restricciones oficiales, fuerza mayor), el hotel no se hace responsable.',
          'No se admitirán cancelaciones ni devoluciones una vez confirmada la reserva.',
        ],
      },
      {
        title: '4. Aceptación de las condiciones',
        lines: ['La realización de la reserva implica la aceptación íntegra de estos términos y condiciones.'],
      },
    ],
    thanks: 'Muchas gracias y esperamos que disfruten.',
    signoff: 'Un saludo,',
    contact: '¿Alguna duda? Escríbanos o llámenos:',
  },
  en: {
    subject: 'Booking confirmed {locator} · Fallas 2027',
    preheader: 'Your booking is confirmed. Show this email to go up to your room.',
    banner: 'Booking confirmed',
    greeting: 'Dear {firstName},',
    confirmed: 'Your booking has been confirmed.',
    showEmail:
      'You will need to show this email to go up to the room, and we will need the ID of the person who made the booking to complete the check-in.',
    detailsTitle: 'Your booking details',
    arrivalTitle: 'Getting here',
    arrival:
      'We recommend arriving at Plaza del Ayuntamiento around 12:30 (earlier at weekends), as all access is closed off afterwards and it becomes much more difficult.',
    entrances:
      'The hotel has two entrances: Plaza del Ayuntamiento 3 or Calle en Llop 5. You can use whichever suits you best.',
    terms: [
      {
        title: '1. Capacity and access',
        lines: [
          'Access is limited to the number of people booked.',
          'Additional guests will not be admitted under any circumstances.',
          'Failure to comply with this rule may result in the immediate cancellation of the experience with no right to a refund.',
        ],
      },
      {
        title: '2. Rules of use',
        lines: [
          'The space must be used responsibly.',
          'Smoking is not allowed inside the room.',
          'Any damage caused will be the responsibility of the guests.',
        ],
      },
      {
        title: '3. Cancellation policy',
        lines: [
          'If the event is cancelled for reasons beyond the organisers’ control (extreme weather, official restrictions, force majeure), the hotel accepts no liability.',
          'No cancellations or refunds will be accepted once the booking is confirmed.',
        ],
      },
      {
        title: '4. Acceptance of the conditions',
        lines: ['Making the booking implies full acceptance of these terms and conditions.'],
      },
    ],
    thanks: 'Thank you very much, we hope you enjoy it.',
    signoff: 'Kind regards,',
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

const esc = (s: string) =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

/** HTML con el estilo de la web (navy + dorado), a base de tablas: así se ve
 *  bien en la mayoría de clientes de correo, que no soportan flexbox/grid.
 *  El logo va por URL absoluta (los correos no pueden llevar rutas
 *  relativas): necesita que la web esté desplegada en SITE.origin. */
function buildCustomerEmailHtml(data: BookingEmail): string {
  const copy = EMAIL_COPY[data.lang] ?? EMAIL_COPY.es;
  const t = dictFor(data.lang);
  const fmt = (s: string, vars: Record<string, string>) =>
    s.replace(/\{(\w+)\}/g, (_, k) => vars[k] ?? '');
  const logo = `${SITE.origin}/img/logo-hotel-venecia.png`;

  const rows: [string, string][] = [
    [t['book.summary.date'], formatDate(data.date, data.lang).replace(/^./, (c) => c.toUpperCase())],
    [t['book.summary.guests'], String(data.guests)],
    [t['book.summary.room'], fmt(t['book.room.number'], { n: data.room.roomNumber })],
  ];

  const rowsHtml = rows
    .map(
      ([label, value]) => `
      <tr>
        <td style="padding:11px 0;border-bottom:1px solid #EDE9DF;font-size:13px;color:#8A8578;font-weight:700;text-transform:uppercase;letter-spacing:1px">${label}</td>
        <td style="padding:11px 0;border-bottom:1px solid #EDE9DF;font-size:15px;color:#1B2A4A;text-align:right">${value}</td>
      </tr>`,
    )
    .join('');

  const termsHtml = copy.terms
    .map(
      (sec) => `
          <tr><td style="padding:18px 0 0">
            <div style="font-size:14px;font-weight:bold;color:#1B2A4A;margin-bottom:6px">${sec.title}</div>
            ${sec.lines.map((l) => `<div style="font-size:13px;line-height:1.7;color:#4A5568">${l}</div>`).join('')}
          </td></tr>`,
    )
    .join('');

  return `<!doctype html>
<html lang="${data.lang}">
  <head><meta charset="utf-8" /><meta name="viewport" content="width=device-width" /></head>
  <body style="margin:0;padding:0;background:#F1EDE2;font-family:Georgia,'Times New Roman',serif">
    <span style="display:none;font-size:1px;color:#F1EDE2;max-height:0;overflow:hidden">${copy.preheader}</span>
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#F1EDE2;padding:32px 12px">
      <tr><td align="center">
        <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background:#ffffff;border-radius:14px;overflow:hidden;box-shadow:0 6px 30px rgba(27,42,74,.12)">

          <!-- Cabecera: logo circular con el león -->
          <tr><td align="center" style="background:#ffffff;padding:32px 32px 8px">
            <img src="${logo}" width="150" height="150" alt="${SITE.name}" style="display:block;border:0;width:150px;height:150px" />
          </td></tr>
          <tr><td style="background:#ffffff;padding:0 32px"><div style="height:3px;background:#C9A246;width:64px;margin:12px auto 0"></div></td></tr>

          <!-- Banner navy -->
          <tr><td align="center" style="background:#1B2A4A;padding:34px 32px;margin-top:24px">
            <div style="font-size:11px;letter-spacing:3px;text-transform:uppercase;color:#C9A246">Fallas ${FALLAS.year}</div>
            <div style="font-size:28px;color:#ffffff;font-weight:bold;margin-top:10px">${copy.banner}</div>
            <div style="width:44px;height:44px;border-radius:50%;border:2px solid #C9A246;color:#C9A246;font-size:22px;line-height:40px;margin:18px auto 0">✓</div>
          </td></tr>

          <!-- Saludo -->
          <tr><td style="padding:34px 36px 6px">
            <p style="margin:0 0 10px;font-size:16px;color:#1B2A4A;font-weight:bold">${fmt(copy.greeting, { firstName: esc(data.firstName) })}</p>
            <p style="margin:0;font-size:18px;line-height:1.5;color:#1B2A4A">${copy.confirmed}</p>
          </td></tr>

          <!-- Localizador + datos -->
          <tr><td style="padding:22px 36px 0">
            <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #EDE9DF;border-radius:10px;background:#FBFAF6">
              <tr><td align="center" style="padding:22px 24px 16px;border-bottom:1px solid #EDE9DF">
                <div style="font-size:11px;letter-spacing:2px;text-transform:uppercase;color:#8A8578">${t['book.done.locator']}</div>
                <div style="font-size:32px;color:#C9A246;font-weight:bold;letter-spacing:3px;margin-top:4px">${data.locator}</div>
              </td></tr>
              <tr><td style="padding:6px 24px 20px">
                <table role="presentation" width="100%" cellpadding="0" cellspacing="0">${rowsHtml}</table>
                <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-top:10px">
                  <tr>
                    <td style="padding-top:8px;font-size:15px;color:#1B2A4A;font-weight:bold">${t['book.summary.total']}</td>
                    <td style="padding-top:8px;font-size:22px;color:#1B2A4A;font-weight:bold;text-align:right">${money(data.quote.total, data.lang)}</td>
                  </tr>
                </table>
                <div style="font-size:12px;color:#8A8578;margin-top:4px">${t['book.summary.snack']}</div>
              </td></tr>
            </table>
          </td></tr>

          <!-- Aviso importante -->
          <tr><td style="padding:22px 36px 0">
            <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#FBF5E4;border-left:4px solid #C9A246;border-radius:6px">
              <tr><td style="padding:16px 20px;font-size:15px;line-height:1.65;color:#1B2A4A;font-weight:bold">${copy.showEmail}</td></tr>
            </table>
          </td></tr>

          <!-- Cómo llegar -->
          <tr><td style="padding:26px 36px 0">
            <div style="font-size:11px;letter-spacing:2px;text-transform:uppercase;color:#C9A246;font-weight:bold;margin-bottom:8px">${copy.arrivalTitle}</div>
            <p style="margin:0 0 10px;font-size:14px;line-height:1.7;color:#4A5568">${copy.arrival}</p>
            <p style="margin:0;font-size:14px;line-height:1.7;color:#4A5568">${copy.entrances}</p>
          </td></tr>

          <!-- Normas y condiciones -->
          <tr><td style="padding:28px 36px 0">
            <div style="border-top:1px solid #EDE9DF"></div>
            <table role="presentation" width="100%" cellpadding="0" cellspacing="0">${termsHtml}</table>
          </td></tr>

          <!-- Despedida -->
          <tr><td style="padding:30px 36px 8px">
            <p style="margin:0 0 14px;font-size:15px;line-height:1.6;color:#1B2A4A">${copy.thanks}</p>
            <p style="margin:0;font-size:15px;color:#4A5568">${copy.signoff}</p>
            <p style="margin:2px 0 0;font-size:16px;color:#1B2A4A;font-weight:bold">${SITE.name}</p>
          </td></tr>

          <!-- Pie -->
          <tr><td align="center" style="padding:26px 36px 32px">
            <div style="border-top:1px solid #EDE9DF;padding-top:22px">
              <p style="margin:0 0 6px;font-size:13px;color:#8A8578">${copy.contact}</p>
              <p style="margin:0;font-size:13px">
                <a href="mailto:${SITE.email}" style="color:#C9A246;text-decoration:none">${SITE.email}</a>
                &nbsp;·&nbsp;
                <a href="${SITE.phoneHref}" style="color:#C9A246;text-decoration:none">${SITE.phone}</a>
              </p>
              <p style="margin:6px 0 0;font-size:12px;color:#B7B2A3">${SITE.address}</p>
              <p style="margin:14px 0 0;font-size:11px;color:#B7B2A3">
                <a href="${SITE.origin}${pagePath('terms', data.lang)}" style="color:#B7B2A3">${t['footer.terms']}</a>
                &nbsp;·&nbsp;
                <a href="${SITE.origin}${pagePath('cancellation', data.lang)}" style="color:#B7B2A3">${t['footer.cancellation']}</a>
                &nbsp;·&nbsp;
                <a href="${SITE.origin}${pagePath('privacy', data.lang)}" style="color:#B7B2A3">${t['footer.privacy']}</a>
              </p>
            </div>
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
    copy.confirmed,
    copy.showEmail,
    '',
    `${SITE.name}`,
    `Localizador: ${data.locator}`,
    `Fecha: ${formatDate(data.date, data.lang)}`,
    `Huéspedes: ${data.guests}`,
    `Habitación: ${data.room.roomNumber}`,
    `Total: ${money(data.quote.total, data.lang)} · Snack Pack incluido`,
    '',
    copy.arrival,
    copy.entrances,
    '',
    ...copy.terms.flatMap((sec) => [sec.title, ...sec.lines, '']),
    copy.thanks,
    copy.signoff,
    SITE.name,
    '',
    `${SITE.email} · ${SITE.phone}`,
  ].join('\n');
}

/** Aviso interno al hotel: qué reserva ha entrado, de quién y para cuándo. */
function buildHotelEmailHtml(data: BookingEmail): string {
  const rows: [string, string][] = [
    ['Localizador', `<b style="color:#C9A246;font-size:18px;letter-spacing:2px">${data.locator}</b>`],
    ['Cliente', `${esc(data.firstName)} ${esc(data.lastName)}`],
    ['Email', `<a href="mailto:${esc(data.email)}" style="color:#1B2A4A">${esc(data.email)}</a>`],
    ['Teléfono', `<a href="tel:${esc(data.phone)}" style="color:#1B2A4A">${esc(data.phone)}</a>`],
    ['Fecha', `${formatDate(data.date, 'es')} · acceso ${FALLAS.accessStart}–${FALLAS.accessEnd}h (mascletá ${FALLAS.mascletaTime}h)`],
    ['Habitación', `${data.room.roomNumber} (${esc(data.room.floor)}) · ${data.guests} huéspedes`],
    ['Total', `${money(data.quote.total, 'es')} · Snack Pack incluido`],
    ...(data.notes ? ([['Notas', esc(data.notes)]] as [string, string][]) : []),
  ];
  const rowsHtml = rows
    .map(
      ([k, v]) => `<tr>
        <td style="padding:10px 0;border-bottom:1px solid #EDE9DF;font-size:12px;color:#8A8578;font-weight:700;text-transform:uppercase;letter-spacing:1px;width:120px;vertical-align:top">${k}</td>
        <td style="padding:10px 0;border-bottom:1px solid #EDE9DF;font-size:14px;color:#1B2A4A">${v}</td>
      </tr>`,
    )
    .join('');
  const demo = !data.paid
    ? `<tr><td style="background:#FFF4E0;color:#8A5A00;padding:12px 24px;font-size:13px;font-weight:bold">⚠️ Modo demostración: no se ha cobrado nada de verdad.</td></tr>`
    : '';
  return `<!doctype html>
<html lang="es"><head><meta charset="utf-8" /></head>
<body style="margin:0;padding:24px 12px;background:#F1EDE2;font-family:Georgia,'Times New Roman',serif">
  <table role="presentation" width="560" cellpadding="0" cellspacing="0" align="center" style="max-width:560px;width:100%;background:#fff;border-radius:12px;overflow:hidden">
    <tr><td style="background:#1B2A4A;padding:24px;text-align:center">
      <div style="font-size:11px;letter-spacing:3px;text-transform:uppercase;color:#C9A246">Fallas ${FALLAS.year}</div>
      <div style="font-size:22px;color:#fff;font-weight:bold;margin-top:6px">Nueva reserva recibida</div>
    </td></tr>
    ${demo}
    <tr><td style="padding:12px 24px 24px"><table role="presentation" width="100%" cellpadding="0" cellspacing="0">${rowsHtml}</table></td></tr>
  </table>
</body></html>`;
}

/** Envía la confirmación al cliente por email y avisa por email al hotel. */
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
    !data.paid ? '⚠️ Modo demostración: no se ha cobrado nada de verdad.' : null,
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
    subject: `[${data.paid ? 'Reserva pagada' : 'Demo'}] Nueva reserva ${data.locator} · ${data.date} · hab. ${data.room.roomNumber}`,
    html: buildHotelEmailHtml(data),
    text: hotelSummary,
  });
}

/** Solo para previsualizar los correos en desarrollo (scripts/preview-emails). */
export const __previewEmails = { buildCustomerEmailHtml, buildHotelEmailHtml };

/**
 * Caso raro: dos personas pagan la misma habitación/fecha casi a la vez y
 * una se queda sin sitio cuando el webhook revalida disponibilidad. Se
 * reembolsa automáticamente (ver redsys-notification.ts) y se avisa por aquí.
 */
export async function sendPaymentRefundedNotice(input: {
  email: string;
  firstName: string;
  roomNumber: string;
  date: string;
  lang: Locale;
  /** true = el reembolso automático falló y el hotel debe hacerlo a mano
   *  desde el portal de Redsys. */
  manual?: boolean;
  locator?: string;
  order?: string;
}): Promise<void> {
  const es = input.lang !== 'en';
  const subject = es
    ? 'Su balcón privado ya no está disponible — reembolso en curso'
    : 'Your private balcony is no longer available — refund on its way';
  const text = es
    ? `Estimado/a ${input.firstName}:\n\nLo sentimos mucho: justo cuando se completaba su pago, la habitación ${input.roomNumber} para el ${input.date} se acababa de reservar. Hemos anulado el cobro; el reembolso llegará a su método de pago en los próximos días.\n\nPuede elegir otra habitación o fecha en ${SITE.origin}, o escribirnos a ${SITE.email} y le ayudaremos.`
    : `Hi ${input.firstName},\n\nWe're sorry: right as your payment went through, room ${input.roomNumber} for ${input.date} had just been booked. We've cancelled the charge; the refund will reach your payment method in the next few days.\n\nYou can pick another room or date at ${SITE.origin}, or write to us at ${SITE.email} and we'll help.`;
  await deliver({ to: input.email, subject, text });
  await deliver({
    to: SITE.email,
    subject: `[${input.manual ? 'REEMBOLSO MANUAL' : 'Reembolso automático'}] ${input.roomNumber} · ${input.date}`,
    text: `Doble reserva evitada (dos pagos para la misma habitación y fecha). ${
      input.manual
        ? '⚠️ EL REEMBOLSO AUTOMÁTICO HA FALLADO: hay que devolver el pago a mano desde el portal de Redsys.'
        : 'Reembolsado automáticamente en Redsys.'
    }\nCliente: ${input.firstName} · ${input.email}\nHabitación: ${input.roomNumber}\nFecha: ${input.date}${input.order ? `\nPedido Redsys: ${input.order}` : ''}${input.locator ? `\nLocalizador: ${input.locator}` : ''}`,
  });
}

interface Delivery {
  to: string;
  subject: string;
  html?: string;
  text: string;
}

const env = (k: string): string | undefined => import.meta.env?.[k] ?? process.env[k];

/**
 * Envío con Resend (https://resend.com). Sin RESEND_API_KEY solo se registra
 * por consola, para poder probar el flujo en local. Un fallo al enviar NO
 * rompe la reserva (ya está pagada y guardada): se registra el error y se
 * sigue, para que Redsys no reintente la notificación por un problema de
 * correo. El cliente puede escribir con su localizador si no le llega.
 */
async function deliver(d: Delivery): Promise<void> {
  const key = env('RESEND_API_KEY');
  if (!key) {
    console.info(
      `[email] (sin proveedor) "${d.subject}" → ${d.to}${d.html ? ' (HTML listo, ' + d.html.length + ' bytes)' : ''}\n${d.text.replace(/^/gm, '  ')}`,
    );
    return;
  }

  const from = env('EMAIL_FROM') ?? `${SITE.name} <${SITE.email}>`;
  const body = JSON.stringify({
    from,
    to: [d.to],
    reply_to: SITE.email,
    subject: d.subject,
    text: d.text,
    ...(d.html ? { html: d.html } : {}),
  });

  for (let attempt = 1; attempt <= 2; attempt++) {
    try {
      const res = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' },
        body,
      });
      if (res.ok) return;
      const detail = (await res.text()).slice(0, 300);
      console.error(`[email] Resend ${res.status} al enviar "${d.subject}" a ${d.to} (intento ${attempt}): ${detail}`);
      if (res.status < 500 && res.status !== 429) return; // error definitivo, no se reintenta
    } catch (err) {
      console.error(`[email] fallo de red al enviar "${d.subject}" a ${d.to} (intento ${attempt})`, err);
    }
  }
}
