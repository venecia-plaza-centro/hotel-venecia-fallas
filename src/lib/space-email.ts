/**
 * Correos de las reservas de ESPACIOS: confirmación al cliente (en su idioma),
 * aviso al hotel y aviso de reembolso. Mismo estilo y mismo envío (Resend) que
 * los de balcones (src/lib/email.ts), con textos propios: aquí no hay Snack
 * Pack, ni personas que contar, ni "enseñe este correo para subir".
 */
import { FALLAS, SITE, type Locale } from '../consts';
import { dictFor } from '../i18n/ui';
import { pagePath } from '../i18n/pages';
import { EMAIL_COPY, HOTEL_RECIPIENTS, LANG_NAME, deliver, esc, formatDate, money } from './email';
import type { Space } from './spaces';

export interface SpaceBookingEmail {
  locator: string;
  space: Space;
  date: string;
  /** Aforo máximo del espacio (no se cuentan personas). */
  guests: number;
  total: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  notes?: string;
  lang: Locale;
  paid: boolean;
  payment?: { order: string; authCode?: string };
}

interface SpaceCopy {
  subject: string;
  preheader: string;
  banner: string;
  confirmed: string;
  space: string;
  capacity: string;
  /** Plantilla de personas para la fila de capacidad: "{n} personas". */
  people: string;
  hours: string;
  vat: string;
  early: string;
}

const COPY: Record<Locale, SpaceCopy> = {
  es: {
    subject: 'Espacio reservado {locator} · Mascletàs 2027',
    preheader: 'Su espacio privado está reservado.',
    banner: 'Su espacio está reservado',
    confirmed: 'Su reserva ha sido confirmada: tiene el espacio completo, solo para su grupo, con vistas a la Plaza del Ayuntamiento para ver la mascletà.',
    space: 'Espacio',
    capacity: 'Capacidad máxima',
    people: '{n} personas',
    hours: 'Horario',
    vat: 'IVA incluido',
    early: '¿Necesita acceso anticipado para el montaje (catering, decoración u otros servicios)? Responda a este correo indicándonos qué necesita: está sujeto a disponibilidad y a la confirmación previa del hotel.',
  },
  en: {
    subject: 'Space booked {locator} · Mascletàs 2027',
    preheader: 'Your private space is booked.',
    banner: 'Your space is booked',
    confirmed: 'Your booking is confirmed: you have the whole space, just for your group, with views over Plaza del Ayuntamiento to watch the mascletà.',
    space: 'Space',
    capacity: 'Maximum capacity',
    people: '{n} guests',
    hours: 'Hours',
    vat: 'VAT included',
    early: 'Need early access to set up (catering, decoration or other services)? Reply to this email telling us what you need: it is subject to availability and prior confirmation by the hotel.',
  },
  it: {
    subject: 'Spazio prenotato {locator} · Mascletàs 2027',
    preheader: 'Il suo spazio privato è prenotato.',
    banner: 'Il suo spazio è prenotato',
    confirmed: 'La sua prenotazione è confermata: ha a disposizione l’intero spazio, solo per il suo gruppo, con vista su Plaza del Ayuntamiento per vedere la mascletà.',
    space: 'Spazio',
    capacity: 'Capacità massima',
    people: '{n} persone',
    hours: 'Orario',
    vat: 'IVA inclusa',
    early: 'Le serve l’accesso anticipato per l’allestimento (catering, decorazione o altri servizi)? Risponda a questa email indicandoci di cosa ha bisogno: è soggetto a disponibilità e a previa conferma da parte dell’hotel.',
  },
  fr: {
    subject: 'Espace réservé {locator} · Mascletàs 2027',
    preheader: 'Votre espace privé est réservé.',
    banner: 'Votre espace est réservé',
    confirmed: 'Votre réservation est confirmée : vous disposez de tout l’espace, rien que pour votre groupe, avec vue sur la Plaza del Ayuntamiento pour voir la mascletà.',
    space: 'Espace',
    capacity: 'Capacité maximale',
    people: '{n} personnes',
    hours: 'Horaires',
    vat: 'TVA incluse',
    early: 'Besoin d’un accès anticipé pour l’installation (traiteur, décoration ou autres services) ? Répondez à cet email en nous indiquant ce qu’il vous faut : sous réserve de disponibilité et de confirmation préalable de l’hôtel.',
  },
  de: {
    subject: 'Raum gebucht {locator} · Mascletàs 2027',
    preheader: 'Ihr privater Raum ist gebucht.',
    banner: 'Ihr Raum ist gebucht',
    confirmed: 'Ihre Buchung ist bestätigt: Sie haben den gesamten Raum nur für Ihre Gruppe, mit Blick auf die Plaza del Ayuntamiento, um die Mascletà zu erleben.',
    space: 'Raum',
    capacity: 'Maximale Kapazität',
    people: '{n} Personen',
    hours: 'Zeiten',
    vat: 'inkl. MwSt.',
    early: 'Benötigen Sie früheren Zugang zum Aufbau (Catering, Dekoration oder andere Leistungen)? Antworten Sie auf diese E-Mail und teilen Sie uns mit, was Sie brauchen: vorbehaltlich Verfügbarkeit und vorheriger Bestätigung durch das Hotel.',
  },
};

const REFUND: Record<Locale, { subject: string; text: (n: string, name: string, date: string) => string }> = {
  es: {
    subject: 'Su espacio privado ya no está disponible — reembolso en curso',
    text: (n, name, date) => `Estimado/a ${name}:\n\nLo sentimos mucho: justo cuando se completaba su pago, el espacio ${n} para el ${date} se acababa de reservar. Hemos anulado el cobro; el reembolso llegará a su método de pago en los próximos días.\n\nPuede elegir otro espacio o fecha en ${SITE.origin}, o escribirnos a ${SITE.email} y le ayudaremos.`,
  },
  en: {
    subject: 'Your private space is no longer available — refund on its way',
    text: (n, name, date) => `Hi ${name},\n\nWe're sorry: right as your payment went through, space ${n} for ${date} had just been booked. We've cancelled the charge; the refund will reach your payment method in the next few days.\n\nYou can pick another space or date at ${SITE.origin}, or write to us at ${SITE.email} and we'll help.`,
  },
  it: {
    subject: 'Il suo spazio privato non è più disponibile — rimborso in corso',
    text: (n, name, date) => `Gentile ${name},\n\nCi dispiace molto: proprio mentre si completava il suo pagamento, lo spazio ${n} per il ${date} era appena stato prenotato. Abbiamo annullato l’addebito; il rimborso arriverà al suo metodo di pagamento nei prossimi giorni.\n\nPuò scegliere un altro spazio o un’altra data su ${SITE.origin}, oppure scriverci a ${SITE.email} e la aiuteremo.`,
  },
  fr: {
    subject: 'Votre espace privé n’est plus disponible — remboursement en cours',
    text: (n, name, date) => `Bonjour ${name},\n\nNous sommes vraiment désolés : au moment même où votre paiement se finalisait, l’espace ${n} pour le ${date} venait d’être réservé. Nous avons annulé le débit ; le remboursement arrivera sur votre moyen de paiement dans les prochains jours.\n\nVous pouvez choisir un autre espace ou une autre date sur ${SITE.origin}, ou nous écrire à ${SITE.email} et nous vous aiderons.`,
  },
  de: {
    subject: 'Ihr privater Raum ist nicht mehr verfügbar — Erstattung läuft',
    text: (n, name, date) => `Guten Tag ${name},\n\nEs tut uns sehr leid: Genau als Ihre Zahlung abgeschlossen wurde, war Raum ${n} für den ${date} soeben gebucht worden. Wir haben die Abbuchung storniert; die Erstattung erreicht Ihr Zahlungsmittel in den nächsten Tagen.\n\nSie können auf ${SITE.origin} einen anderen Raum oder ein anderes Datum wählen oder uns unter ${SITE.email} schreiben, wir helfen Ihnen gern.`,
  },
};

const fill = (s: string, vars: Record<string, string | number>) => s.replace(/\{(\w+)\}/g, (_, k) => String(vars[k] ?? ''));
/** "de 13:00 h a 15:00 h." → "de 13:00 h a 15:00 h" (sin el punto final, para una fila). */
const noDot = (s: string) => s.replace(/\.$/, '');
const INFO = ['whole', 'hours', 'rates', 'early', 'bath', 'use', 'decor'] as const;

/** Cancelación y aceptación de las condiciones: las mismas que los balcones
 *  (apartados 3 y 4 de los términos de su correo), sin el número de apartado. */
const sameTerms = (lang: Locale) =>
  (EMAIL_COPY[lang] ?? EMAIL_COPY.es).terms.slice(2).map((sec) => ({ title: sec.title.replace(/^\d+\.\s*/, ''), lines: sec.lines }));

function details(data: SpaceBookingEmail) {
  const t = dictFor(data.lang);
  const copy = COPY[data.lang] ?? COPY.es;
  const hoursVars = { start: FALLAS.accessStart, end: FALLAS.accessEnd };
  const nb = (s: string) => s.replace(/ (\S+)$/, ' $1'); // que el número no caiga solo a la 2.ª línea
  return {
    t,
    copy,
    rows: [
      [t['book.summary.date'], formatDate(data.date, data.lang).replace(/^./, (c) => c.toUpperCase())],
      [copy.space, nb(fill(t['spaces.card.title'], { n: data.space.number }))],
      [copy.capacity, fill(copy.people, { n: data.space.capacity })],
      [copy.hours, noDot(fill(t['spaces.info.hours.t'], hoursVars))],
    ] as [string, string][],
    conditions: INFO.map((k) => ({ l: t[`spaces.info.${k}.l`], t: fill(t[`spaces.info.${k}.t`], hoursVars) })),
    terms: sameTerms(data.lang),
  };
}

function customerHtml(data: SpaceBookingEmail): string {
  const { t, copy, rows, conditions, terms } = details(data);
  const base = EMAIL_COPY[data.lang] ?? EMAIL_COPY.es;
  const logo = `${SITE.origin}/img/logo-hotel-venecia.png`;
  const rowsHtml = rows
    .map(
      ([label, value]) => `
      <tr>
        <td style="padding:11px 0;border-bottom:1px solid #EDE9DF;font-size:12px;color:#8A8578;font-weight:700;text-transform:uppercase;letter-spacing:.5px">${label}</td>
        <td style="padding:11px 0 11px 8px;border-bottom:1px solid #EDE9DF;font-size:15px;color:#1B2A4A;text-align:right">${value}</td>
      </tr>`,
    )
    .join('');
  const condHtml = conditions
    .map((c) => `<div style="font-size:13px;line-height:1.7;color:#4A5568;margin-bottom:6px"><b style="color:#1B2A4A">${c.l}:</b> ${c.t}</div>`)
    .join('');
  const termsHtml = terms
    .map(
      (sec) => `<div style="font-size:14px;font-weight:bold;color:#1B2A4A;margin:16px 0 6px">${sec.title}</div>${sec.lines.map((l) => `<div style="font-size:13px;line-height:1.7;color:#4A5568">${l}</div>`).join('')}`,
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
          <tr><td align="center" style="background:#ffffff;padding:32px 32px 8px">
            <img src="${logo}" width="150" height="150" alt="${SITE.name}" style="display:block;border:0;width:150px;height:150px" />
          </td></tr>
          <tr><td style="background:#ffffff;padding:0 32px"><div style="height:3px;background:#C9A246;width:64px;margin:12px auto 0"></div></td></tr>
          <tr><td align="center" style="background:#1B2A4A;padding:34px 32px">
            <div style="font-size:11px;letter-spacing:3px;text-transform:uppercase;color:#C9A246">Mascletàs ${FALLAS.year}</div>
            <div style="font-size:28px;color:#ffffff;font-weight:bold;margin-top:10px">${copy.banner}</div>
            <div style="width:44px;height:44px;border-radius:50%;border:2px solid #C9A246;color:#C9A246;font-size:22px;line-height:40px;margin:18px auto 0">✓</div>
          </td></tr>
          <tr><td style="padding:34px 28px 6px">
            <p style="margin:0 0 10px;font-size:16px;color:#1B2A4A;font-weight:bold">${base.greeting.replace('{firstName}', esc(data.firstName))}</p>
            <p style="margin:0;font-size:18px;line-height:1.5;color:#1B2A4A">${copy.confirmed}</p>
          </td></tr>
          <tr><td style="padding:22px 28px 0">
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
                    <td style="padding-top:8px;font-size:22px;color:#1B2A4A;font-weight:bold;text-align:right">${money(data.total, data.lang)}</td>
                  </tr>
                </table>
                <div style="font-size:12px;color:#8A8578;margin-top:4px">${copy.vat}</div>
              </td></tr>
            </table>
          </td></tr>
          <tr><td style="padding:22px 28px 0">
            <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#FBF5E4;border-left:4px solid #C9A246;border-radius:6px">
              <tr><td style="padding:16px 20px;font-size:15px;line-height:1.65;color:#1B2A4A;font-weight:bold">${copy.early}</td></tr>
            </table>
          </td></tr>
          <tr><td style="padding:26px 28px 0">
            <div style="font-size:11px;letter-spacing:2px;text-transform:uppercase;color:#C9A246;font-weight:bold;margin-bottom:8px">${base.arrivalTitle}</div>
            <p style="margin:0 0 10px;font-size:14px;line-height:1.7;color:#4A5568">${base.arrival}</p>
            <p style="margin:0;font-size:14px;line-height:1.7;color:#4A5568">${base.entrances}</p>
          </td></tr>
          <tr><td style="padding:28px 28px 0">
            <div style="border-top:1px solid #EDE9DF;padding-top:18px">
              <div style="font-size:14px;font-weight:bold;color:#1B2A4A;margin-bottom:8px">${t['spaces.info.h']}</div>
              ${condHtml}
              ${termsHtml}
            </div>
          </td></tr>
          <tr><td style="padding:30px 28px 8px">
            <p style="margin:0 0 14px;font-size:15px;line-height:1.6;color:#1B2A4A">${base.thanks}</p>
            <p style="margin:0;font-size:15px;color:#4A5568">${base.signoff}</p>
            <p style="margin:2px 0 0;font-size:16px;color:#1B2A4A;font-weight:bold">${SITE.name}</p>
          </td></tr>
          <tr><td align="center" style="padding:26px 28px 32px">
            <div style="border-top:1px solid #EDE9DF;padding-top:22px">
              <p style="margin:0 0 6px;font-size:13px;color:#8A8578">${base.contact}</p>
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

function customerText(data: SpaceBookingEmail): string {
  const { t, copy, rows, conditions, terms } = details(data);
  const base = EMAIL_COPY[data.lang] ?? EMAIL_COPY.es;
  return [
    base.greeting.replace('{firstName}', data.firstName),
    '',
    copy.confirmed,
    '',
    SITE.name,
    `${t['book.done.locator']}: ${data.locator}`,
    ...rows.map(([k, v]) => `${k}: ${v.replace(/ /g, ' ')}`),
    `${t['book.summary.total']}: ${money(data.total, data.lang)} · ${copy.vat}`,
    '',
    copy.early,
    '',
    base.arrival,
    base.entrances,
    '',
    t['spaces.info.h'],
    ...conditions.map((c) => `- ${c.l}: ${c.t}`),
    '',
    ...terms.flatMap((sec) => [sec.title, ...sec.lines, '']),
    base.thanks,
    base.signoff,
    SITE.name,
    '',
    `${SITE.email} · ${SITE.phone}`,
  ].join('\n');
}

function hotelHtml(data: SpaceBookingEmail): string {
  const rows: [string, string][] = [
    ['Localizador', `<b style="color:#C9A246;font-size:18px;letter-spacing:2px">${data.locator}</b>`],
    ['Cliente', `${esc(data.firstName)} ${esc(data.lastName)}`],
    ['Email', `<a href="mailto:${esc(data.email)}" style="color:#1B2A4A">${esc(data.email)}</a>`],
    ['Teléfono', `<a href="tel:${esc(data.phone)}" style="color:#1B2A4A">${esc(data.phone)}</a>`],
    ['Fecha', `${formatDate(data.date, 'es')} · acceso ${FALLAS.accessStart}–${FALLAS.accessEnd}h (mascletà ${FALLAS.mascletaTime}h)`],
    ['Espacio', `Espacio ${data.space.number} · ${data.space.floor}ª planta · ${data.space.m2} m² · aforo máx. ${data.space.capacity}`],
    ['Idioma', LANG_NAME[data.lang] ?? data.lang],
    ['Total', `${money(data.total, 'es')} · IVA incluido`],
    ...(data.payment
      ? ([
          ['Pago', 'Cobrado por Redsys · Caixa Popular'],
          ['Pedido Redsys', esc(data.payment.order)],
          ...(data.payment.authCode ? [['Cód. autorización', esc(data.payment.authCode)]] : []),
        ] as [string, string][])
      : []),
    ...(data.notes ? ([['Notas', esc(data.notes)]] as [string, string][]) : []),
  ];
  const rowsHtml = rows
    .map(
      ([k, v]) => `<tr>
        <td style="padding:10px 0;border-bottom:1px solid #EDE9DF;font-size:11px;color:#8A8578;font-weight:700;text-transform:uppercase;letter-spacing:.5px;width:96px;vertical-align:top">${k}</td>
        <td style="padding:10px 0 10px 10px;border-bottom:1px solid #EDE9DF;font-size:14px;color:#1B2A4A;word-break:break-word">${v}</td>
      </tr>`,
    )
    .join('');
  const demo = !data.paid
    ? `<tr><td style="background:#FFF4E0;color:#8A5A00;padding:12px 24px;font-size:13px;font-weight:bold">⚠️ Modo demostración: no se ha cobrado nada de verdad.</td></tr>`
    : '';
  return `<!doctype html>
<html lang="es"><head><meta charset="utf-8" /><meta name="viewport" content="width=device-width" /></head>
<body style="margin:0;padding:24px 12px;background:#F1EDE2;font-family:Georgia,'Times New Roman',serif">
  <table role="presentation" cellpadding="0" cellspacing="0" align="center" style="max-width:560px;width:100%;background:#fff;border-radius:12px;overflow:hidden">
    <tr><td style="background:#1B2A4A;padding:24px;text-align:center">
      <div style="font-size:11px;letter-spacing:3px;text-transform:uppercase;color:#C9A246">Mascletàs ${FALLAS.year}</div>
      <div style="font-size:22px;color:#fff;font-weight:bold;margin-top:6px">Nuevo espacio reservado</div>
    </td></tr>
    ${demo}
    <tr><td style="padding:12px 24px 24px"><table role="presentation" width="100%" cellpadding="0" cellspacing="0">${rowsHtml}</table></td></tr>
  </table>
</body></html>`;
}

/** Confirmación al cliente (en su idioma) y aviso al hotel. */
export async function sendSpaceBookingEmails(data: SpaceBookingEmail): Promise<void> {
  const copy = COPY[data.lang] ?? COPY.es;
  const summary = [
    `Localizador: ${data.locator}`,
    `Cliente: ${data.firstName} ${data.lastName} · ${data.email} · ${data.phone}`,
    `Fecha: ${data.date} · acceso ${FALLAS.accessStart}–${FALLAS.accessEnd}h (mascletà ${FALLAS.mascletaTime}h)`,
    `Espacio ${data.space.number} · ${data.space.floor}ª planta · aforo máx. ${data.space.capacity}`,
    `Idioma del cliente: ${LANG_NAME[data.lang] ?? data.lang}`,
    `Total: ${money(data.total, 'es')} · IVA incluido`,
    data.payment ? `Pago: Redsys · pedido ${data.payment.order}${data.payment.authCode ? ` · autorización ${data.payment.authCode}` : ''}` : null,
    data.notes ? `Notas: ${data.notes}` : null,
    !data.paid ? '⚠️ Modo demostración: no se ha cobrado nada de verdad.' : null,
  ]
    .filter(Boolean)
    .join('\n');

  await deliver({
    to: data.email,
    subject: copy.subject.replace('{locator}', data.locator),
    html: customerHtml(data),
    text: customerText(data),
  });
  await deliver({
    to: HOTEL_RECIPIENTS,
    subject: `[${data.paid ? 'Reserva pagada' : 'Demo'}] Nuevo espacio ${data.locator} · ${data.date} · esp. ${data.space.number}`,
    html: hotelHtml(data),
    text: summary,
  });
}

/** Dos pagos para el mismo espacio y día casi a la vez: el segundo se devuelve y se avisa. */
export async function sendSpaceRefundedNotice(input: {
  email: string;
  firstName: string;
  spaceNumber: string;
  date: string;
  lang: Locale;
  manual?: boolean;
  locator?: string;
  order?: string;
}): Promise<void> {
  const r = REFUND[input.lang] ?? REFUND.es;
  await deliver({ to: input.email, subject: r.subject, text: r.text(input.spaceNumber, input.firstName, input.date) });
  await deliver({
    to: HOTEL_RECIPIENTS,
    subject: `[${input.manual ? 'REEMBOLSO MANUAL' : 'Reembolso automático'}] Espacio ${input.spaceNumber} · ${input.date}`,
    text: `Doble reserva evitada (dos pagos para el mismo espacio y fecha, o importe que no cuadra). ${
      input.manual
        ? '⚠️ EL REEMBOLSO AUTOMÁTICO HA FALLADO: hay que devolver el pago a mano desde el portal de Redsys.'
        : 'Reembolsado automáticamente en Redsys.'
    }\nCliente: ${input.firstName} · ${input.email}\nEspacio: ${input.spaceNumber}\nFecha: ${input.date}${input.order ? `\nPedido Redsys: ${input.order}` : ''}${input.locator ? `\nLocalizador: ${input.locator}` : ''}`,
  });
}

/** Solo para previsualizar los correos en desarrollo. */
export const __previewSpaceEmails = { customerHtml, hotelHtml };
