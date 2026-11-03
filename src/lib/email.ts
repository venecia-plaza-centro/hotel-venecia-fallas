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

/** Todos los avisos internos (reservas, reembolsos...) van a los dos
 *  buzones del hotel a la vez, no solo a fallas@. */
const HOTEL_RECIPIENTS = [SITE.email, 'reservas@hotelvenecia.com'];

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
    subject: 'Reserva confirmada {locator} · Mascletàs 2027',
    preheader: 'Su balcón está reservado. Enseñe este correo para subir a su habitación.',
    banner: 'Su balcón está reservado',
    greeting: 'Estimado/a {firstName}:',
    confirmed:
      'Su reserva ha sido confirmada: tiene un balcón privado sobre la Plaza del Ayuntamiento para ver la mascletà. El balcón es parte de una habitación real del hotel, que será solo para su grupo.',
    showEmail:
      'Deberán enseñar este correo para subir a la habitación de su balcón y necesitaremos el DNI del titular de la reserva para hacer el registro.',
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
    subject: 'Booking confirmed {locator} · Mascletàs 2027',
    preheader: 'Your balcony is booked. Show this email to go up to your room.',
    banner: 'Your balcony is booked',
    greeting: 'Dear {firstName},',
    confirmed:
      'Your booking is confirmed: you have a private balcony over Plaza del Ayuntamiento to watch the mascletà. The balcony is part of a real hotel room, which will be for your group only.',
    showEmail:
      'You will need to show this email to go up to your balcony’s room, and we will need the ID of the person who made the booking to complete the check-in.',
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
  it: {
    subject:
      'Prenotazione confermata {locator} · Mascletàs 2027',
    preheader:
      'Il suo balcone è prenotato. Mostri questa email per salire in camera.',
    banner:
      'Il suo balcone è prenotato',
    greeting:
      'Gentile {firstName},',
    confirmed:
      'La sua prenotazione è confermata: ha un balcone privato sulla Plaza del Ayuntamiento per vedere la mascletà. Il balcone fa parte di una camera reale dell’hotel, che sarà solo per il suo gruppo.',
    showEmail:
      'Dovrà mostrare questa email per salire nella camera del suo balcone e ci servirà il documento d’identità dell’intestatario della prenotazione per la registrazione.',
    detailsTitle:
      'I dati della sua prenotazione',
    arrivalTitle:
      'Come arrivare',
    arrival:
      'Consigliamo di arrivare in Plaza del Ayuntamiento verso le 12:30 (prima nel fine settimana), perché dopo vengono chiusi tutti gli accessi e diventa più complicato.',
    entrances:
      'L’hotel ha due ingressi: Plaza del Ayuntamiento 3 o Calle en Llop 5; può usare quello che preferisce.',
    terms: [
      {
        title: '1. Capacità e accesso',
        lines: [
          'L’accesso è limitato al numero di persone prenotate.',
          'Non sarà consentito l’accesso a persone aggiuntive in nessun caso.',
          'Il mancato rispetto di questa norma potrà comportare l’annullamento immediato dell’esperienza senza diritto al rimborso.',
        ],
      },
      {
        title: '2. Norme d’uso',
        lines: [
          'Lo spazio dovrà essere utilizzato in modo responsabile.',
          'È vietato fumare all’interno della camera.',
          'Qualsiasi danno causato sarà responsabilità degli ospiti.',
        ],
      },
      {
        title: '3. Politica di cancellazione',
        lines: [
          'In caso di annullamento dell’evento per cause estranee all’organizzazione (condizioni meteorologiche estreme, restrizioni ufficiali, forza maggiore), l’hotel non è responsabile.',
          'Non saranno ammesse cancellazioni né rimborsi una volta confermata la prenotazione.',
        ],
      },
      {
        title: '4. Accettazione delle condizioni',
        lines: [
          'Effettuare la prenotazione implica l’accettazione integrale di questi termini e condizioni.',
        ],
      },
    ],
    thanks: 'Grazie mille e speriamo che possa godersi l’esperienza.',
    signoff: 'Cordiali saluti,',
    contact: 'Ha dei dubbi? Ci scriva o ci chiami:',
  },
  fr: {
    subject:
      'Réservation confirmée {locator} · Mascletàs 2027',
    preheader:
      'Votre balcon est réservé. Présentez cet e-mail pour monter à votre chambre.',
    banner:
      'Votre balcon est réservé',
    greeting:
      'Bonjour {firstName},',
    confirmed:
      'Votre réservation est confirmée : vous avez un balcon privé sur la Plaza del Ayuntamiento pour voir la mascletà. Le balcon fait partie d’une vraie chambre de l’hôtel, qui sera réservée à votre groupe seul.',
    showEmail:
      'Vous devrez présenter cet e-mail pour monter à la chambre de votre balcon, et nous aurons besoin de la pièce d’identité du titulaire de la réservation pour l’enregistrement.',
    detailsTitle:
      'Les détails de votre réservation',
    arrivalTitle:
      'Comment venir',
    arrival:
      'Nous recommandons d’arriver sur la Plaza del Ayuntamiento vers 12h30 (plus tôt le week-end), car tous les accès sont ensuite fermés et cela devient plus compliqué.',
    entrances:
      'L’hôtel a deux entrées : Plaza del Ayuntamiento 3 ou Calle en Llop 5. Vous pouvez utiliser celle qui vous convient le mieux.',
    terms: [
      {
        title: '1. Capacité et accès',
        lines: [
          'L’accès est limité au nombre de personnes réservées.',
          'Aucune personne supplémentaire ne sera admise, en aucun cas.',
          'Le non-respect de cette règle peut entraîner l’annulation immédiate de l’expérience sans droit à remboursement.',
        ],
      },
      {
        title: '2. Règles d’utilisation',
        lines: [
          'L’espace doit être utilisé de manière responsable.',
          'Il est interdit de fumer à l’intérieur de la chambre.',
          'Tout dommage causé relève de la responsabilité des participants.',
        ],
      },
      {
        title: '3. Politique d’annulation',
        lines: [
          'En cas d’annulation de l’événement pour des causes indépendantes de l’organisation (conditions météorologiques extrêmes, restrictions officielles, force majeure), l’hôtel décline toute responsabilité.',
          'Aucune annulation ni aucun remboursement ne sera admis une fois la réservation confirmée.',
        ],
      },
      {
        title: '4. Acceptation des conditions',
        lines: [
          'Effectuer la réservation implique l’acceptation intégrale des présentes conditions.',
        ],
      },
    ],
    thanks: 'Merci beaucoup, et nous espérons que vous en profiterez.',
    signoff: 'Cordialement,',
    contact: 'Une question ? Écrivez-nous ou appelez-nous :',
  },
  de: {
    subject:
      'Buchung bestätigt {locator} · Mascletàs 2027',
    preheader:
      'Ihr Balkon ist gebucht. Zeigen Sie diese E-Mail vor, um zu Ihrem Zimmer zu gelangen.',
    banner:
      'Ihr Balkon ist gebucht',
    greeting:
      'Guten Tag {firstName},',
    confirmed:
      'Ihre Buchung ist bestätigt: Sie haben einen privaten Balkon an der Plaza del Ayuntamiento, um die Mascletà zu erleben. Der Balkon gehört zu einem echten Hotelzimmer, das ausschließlich Ihrer Gruppe zur Verfügung steht.',
    showEmail:
      'Bitte zeigen Sie diese E-Mail vor, um zum Zimmer Ihres Balkons zu gelangen. Für die Anmeldung benötigen wir den Ausweis der Person, die die Buchung vorgenommen hat.',
    detailsTitle:
      'Ihre Buchungsdaten',
    arrivalTitle:
      'Anreise',
    arrival:
      'Wir empfehlen, gegen 12:30 Uhr an der Plaza del Ayuntamiento zu sein (am Wochenende früher), da danach alle Zugänge gesperrt werden und es deutlich schwieriger wird.',
    entrances:
      'Das Hotel hat zwei Eingänge: Plaza del Ayuntamiento 3 oder Calle en Llop 5. Sie können den Eingang nutzen, der Ihnen besser passt.',
    terms: [
      {
        title: '1. Kapazität und Zutritt',
        lines: [
          'Der Zutritt ist auf die Anzahl der gebuchten Personen beschränkt.',
          'Zusätzliche Personen werden unter keinen Umständen eingelassen.',
          'Die Missachtung dieser Regel kann zum sofortigen Abbruch des Erlebnisses ohne Anspruch auf Erstattung führen.',
        ],
      },
      {
        title: '2. Nutzungsregeln',
        lines: [
          'Der Raum ist verantwortungsvoll zu nutzen.',
          'Im Zimmer ist Rauchen nicht gestattet.',
          'Für verursachte Schäden haften die Gäste.',
        ],
      },
      {
        title: '3. Stornierungsbedingungen',
        lines: [
          'Wird die Veranstaltung aus Gründen abgesagt, die außerhalb des Einflusses des Veranstalters liegen (extreme Wetterbedingungen, behördliche Auflagen, höhere Gewalt), übernimmt das Hotel keine Haftung.',
          'Nach der Bestätigung der Buchung sind weder Stornierungen noch Erstattungen möglich.',
        ],
      },
      {
        title: '4. Annahme der Bedingungen',
        lines: [
          'Mit der Buchung erkennen Sie diese Bedingungen vollständig an.',
        ],
      },
    ],
    thanks: 'Vielen Dank, und wir wünschen Ihnen ein schönes Erlebnis.',
    signoff: 'Mit freundlichen Grüßen,',
    contact: 'Fragen? Schreiben Sie uns oder rufen Sie uns an:',
  },
};

const LANG_NAME: Record<string, string> = { es: 'Español', en: 'Inglés', it: 'Italiano', fr: 'Francés', de: 'Alemán' };
const INTL_LOCALE: Record<Locale, string> = { es: 'es-ES', en: 'en-GB', it: 'it-IT', fr: 'fr-FR', de: 'de-DE' };

function money(n: number, lang: Locale) {
  return new Intl.NumberFormat(INTL_LOCALE[lang] ?? 'es-ES', {
    style: 'currency',
    currency: 'EUR',
    maximumFractionDigits: 0,
  }).format(n);
}

function formatDate(iso: string, lang: Locale) {
  return new Intl.DateTimeFormat(INTL_LOCALE[lang] ?? 'es-ES', {
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
            <div style="font-size:11px;letter-spacing:3px;text-transform:uppercase;color:#C9A246">Mascletàs ${FALLAS.year}</div>
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
  const t = dictFor(data.lang);
  return [
    copy.greeting.replace('{firstName}', data.firstName),
    '',
    copy.confirmed,
    copy.showEmail,
    '',
    `${SITE.name}`,
    `${t['book.done.locator']}: ${data.locator}`,
    `${t['book.summary.date']}: ${formatDate(data.date, data.lang)}`,
    `${t['book.summary.guests']}: ${data.guests}`,
    `${t['book.summary.room']}: ${t['book.room.number'].replace('{n}', data.room.roomNumber)}`,
    `${t['book.summary.total']}: ${money(data.quote.total, data.lang)} · ${t['book.summary.snack']}`,
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
    ['Fecha', `${formatDate(data.date, 'es')} · acceso ${FALLAS.accessStart}–${FALLAS.accessEnd}h (mascletà ${FALLAS.mascletaTime}h)`],
    ['Balcón', `Balcón · Habitación ${data.room.roomNumber} (${esc(data.room.floor)})`],
    ['Personas', String(data.guests)],
    ['Idioma', `${LANG_NAME[data.lang] ?? data.lang} (el cliente ha recibido el email en este idioma)`],
    ['Total', `${money(data.quote.total, 'es')} · Snack Pack incluido`],
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
      <div style="font-size:11px;letter-spacing:3px;text-transform:uppercase;color:#C9A246">Mascletàs ${FALLAS.year}</div>
      <div style="font-size:22px;color:#fff;font-weight:bold;margin-top:6px">Nuevo balcón reservado</div>
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
    `Fecha: ${data.date} · acceso ${FALLAS.accessStart}–${FALLAS.accessEnd}h (mascletà ${FALLAS.mascletaTime}h)`,
    `Balcón: habitación ${data.room.roomNumber} (${data.room.floor}) · ${data.guests} personas`,
    `Idioma del cliente: ${LANG_NAME[data.lang] ?? data.lang}`,
    `Total: ${money(data.quote.total, data.lang)} · Snack Pack incluido`,
    data.payment ? `Pago: Redsys · pedido ${data.payment.order}${data.payment.authCode ? ` · autorización ${data.payment.authCode}` : ''}` : null,
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
    to: HOTEL_RECIPIENTS,
    subject: `[${data.paid ? 'Reserva pagada' : 'Demo'}] Nuevo balcón ${data.locator} · ${data.date} · hab. ${data.room.roomNumber}`,
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
  const R: Record<string, { subject: string; text: string }> = {
    es: {
      subject: 'Su balcón privado ya no está disponible — reembolso en curso',
      text: `Estimado/a ${input.firstName}:\n\nLo sentimos mucho: justo cuando se completaba su pago, el balcón de la habitación ${input.roomNumber} para el ${input.date} se acababa de reservar. Hemos anulado el cobro; el reembolso llegará a su método de pago en los próximos días.\n\nPuede elegir otro balcón o fecha en ${SITE.origin}, o escribirnos a ${SITE.email} y le ayudaremos.`,
    },
    en: {
      subject: 'Your private balcony is no longer available — refund on its way',
      text: `Hi ${input.firstName},\n\nWe're sorry: right as your payment went through, the balcony of room ${input.roomNumber} for ${input.date} had just been booked. We've cancelled the charge; the refund will reach your payment method in the next few days.\n\nYou can pick another balcony or date at ${SITE.origin}, or write to us at ${SITE.email} and we'll help.`,
    },
    it: {
      subject: 'Il suo balcone privato non è più disponibile — rimborso in corso',
      text: `Gentile ${input.firstName},\n\nCi dispiace molto: proprio mentre si completava il suo pagamento, il balcone della camera ${input.roomNumber} per il ${input.date} era appena stato prenotato. Abbiamo annullato l’addebito; il rimborso arriverà al suo metodo di pagamento nei prossimi giorni.\n\nPuò scegliere un altro balcone o un’altra data su ${SITE.origin}, oppure scriverci a ${SITE.email} e la aiuteremo.`,
    },
    fr: {
      subject: 'Votre balcon privé n’est plus disponible — remboursement en cours',
      text: `Bonjour ${input.firstName},\n\nNous sommes vraiment désolés : au moment même où votre paiement se finalisait, le balcon de la chambre ${input.roomNumber} pour le ${input.date} venait d’être réservé. Nous avons annulé le débit ; le remboursement arrivera sur votre moyen de paiement dans les prochains jours.\n\nVous pouvez choisir un autre balcon ou une autre date sur ${SITE.origin}, ou nous écrire à ${SITE.email} et nous vous aiderons.`,
    },
    de: {
      subject: 'Ihr privater Balkon ist nicht mehr verfügbar — Erstattung läuft',
      text: `Guten Tag ${input.firstName},\n\nEs tut uns sehr leid: Genau als Ihre Zahlung abgeschlossen wurde, war der Balkon von Zimmer ${input.roomNumber} für den ${input.date} soeben gebucht worden. Wir haben die Abbuchung storniert; die Erstattung erreicht Ihr Zahlungsmittel in den nächsten Tagen.\n\nSie können auf ${SITE.origin} einen anderen Balkon oder ein anderes Datum wählen oder uns unter ${SITE.email} schreiben, wir helfen Ihnen gern.`,
    },
  };
  const { subject, text } = R[input.lang] ?? R.es;
  await deliver({ to: input.email, subject, text });
  await deliver({
    to: HOTEL_RECIPIENTS,
    subject: `[${input.manual ? 'REEMBOLSO MANUAL' : 'Reembolso automático'}] ${input.roomNumber} · ${input.date}`,
    text: `Doble reserva evitada (dos pagos para la misma habitación y fecha). ${
      input.manual
        ? '⚠️ EL REEMBOLSO AUTOMÁTICO HA FALLADO: hay que devolver el pago a mano desde el portal de Redsys.'
        : 'Reembolsado automáticamente en Redsys.'
    }\nCliente: ${input.firstName} · ${input.email}\nHabitación: ${input.roomNumber}\nFecha: ${input.date}${input.order ? `\nPedido Redsys: ${input.order}` : ''}${input.locator ? `\nLocalizador: ${input.locator}` : ''}`,
  });
}

interface Delivery {
  to: string | string[];
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
  const to = Array.isArray(d.to) ? d.to : [d.to];
  if (!key) {
    console.info(
      `[email] (sin proveedor) "${d.subject}" → ${to.join(', ')}${d.html ? ' (HTML listo, ' + d.html.length + ' bytes)' : ''}\n${d.text.replace(/^/gm, '  ')}`,
    );
    return;
  }

  const from = env('EMAIL_FROM') ?? `${SITE.name} <${SITE.email}>`;
  const body = JSON.stringify({
    from,
    to,
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
