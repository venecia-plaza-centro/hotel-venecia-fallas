import { DEFAULT_LOCALE, type Locale } from '../consts';

/**
 * Diccionario de textos de interfaz.
 * ES es la fuente de verdad. EN traducido. IT/FR/DE: pendientes — de momento
 * caen a ES vía t(). Al cargar contenido real se completan los 5 idiomas
 * (el usuario eligió los 5).  TODO: traducir it / fr / de.
 */
type Dict = Record<string, string>;

const es: Dict = {
  // marca / nav
  'brand.name': 'Hotel Venecia',
  'brand.sub': 'Plaza Centro',
  'nav.rooms': 'Habitaciones',
  'nav.mascletas': 'Mascletás',
  'nav.faq': 'Preguntas frecuentes',
  'nav.book': 'Reservar',
  'nav.menu': 'Menú',
  'nav.close': 'Cerrar menú',

  // fabs
  'fab.call': 'Llamar',
  'fab.call.aria': 'Llamar al hotel',

  // footer
  'footer.tagline': 'En la Plaza del Ayuntamiento, donde se disparan las mascletás.',
  'footer.mainsite': 'Web principal del hotel',
  'footer.terms': 'Condiciones de reserva',
  'footer.cancellation': 'Política de cancelación',
  'footer.privacy': 'Privacidad',
  'footer.rights': 'Todos los derechos reservados.',

  // home · hero
  'home.eyebrow': 'Fallas 2027',
  'home.h1.pre': 'Vive la mascletá desde tu',
  'home.h1.accent': 'balcón privado',
  'home.kicker': 'La Plaza del Ayuntamiento. Tu propio balcón. Y la mascletá justo delante.',
  'home.p1':
    'Durante Fallas, algunas de nuestras habitaciones se convierten durante unas horas en espacios privados para disfrutar de la mascletá desde primera línea, sin aglomeraciones y con todas las comodidades del hotel.',
  'home.p2':
    'Todos los espacios son habitaciones reales del Hotel Venecia, con su mobiliario habitual, baño privado y balcón o mirador con vistas a la Plaza del Ayuntamiento.',
  'home.p3': 'Además, vuestra reserva incluye un Snack Pack para acompañar la experiencia.',
  'home.cta': 'Ver habitaciones disponibles',
  'home.tagline': 'Fallas, más cerca que nunca',
  'home.badge': 'Una experiencia única en Valencia',
  'home.photo.hero.alt': 'La mascletá vista desde un balcón del Hotel Venecia',

  // home · fila de características
  'home.feature1.t': 'Vistas privilegiadas',
  'home.feature1.d': 'Balcón o mirador a la Plaza del Ayuntamiento',
  'home.feature2.t': 'Espacio privado',
  'home.feature2.d': 'Habitaciones reales del hotel con su mobiliario',
  'home.feature3.t': 'Baño privado',
  'home.feature3.d': 'Todas las habitaciones disponen de baño propio',
  'home.feature4.t': 'Snack Pack',
  'home.feature4.d': 'Incluido en tu reserva para disfrutar de la experiencia',

  // home · tradición
  'home.tradicion.eyebrow': 'Una tradición única',
  'home.tradicion.h2.pre': 'Vive la esencia de las Fallas',
  'home.tradicion.h2.accent': 'desde dentro.',
  'home.tradicion.p1':
    'Durante Fallas, algunas de nuestras habitaciones se convierten en espacios privados para disfrutar de la mascletá, sin aglomeraciones y con todas las comodidades del hotel.',
  'home.tradicion.p2': 'Una forma diferente, cómoda y exclusiva de vivir la tradición.',
  'home.tradicion.tagline': 'Valencia en estado puro',
  'home.tradicion.photo.alt': 'Torre del Micalet y naranjos en València',

  // home · elige tu balcón (adelanto de habitaciones)
  'home.rooms.eyebrow': 'Elige tu balcón',
  'home.rooms.h2': 'Habitaciones disponibles',
  'home.rooms.lead': 'Selecciona la fecha, habitación y número de personas. Del resto nos encargamos nosotros.',
  'home.rooms.seeall': 'Ver las 10 habitaciones',

  // home · franja inferior
  'home.strip.schedule.t': 'Horario de acceso',
  'home.strip.schedule.v': '13:00 – 15:00 h',
  'home.strip.mascleta.t': 'Mascletá',
  'home.strip.mascleta.v': '14:00 h',
  'home.strip.private.t': 'Espacio privado',
  'home.strip.private.v': 'Solo para tu reserva',
  'home.strip.snack.t': 'Snack Pack',
  'home.strip.snack.v': 'Incluido',

  // rooms
  'rooms.eyebrow': 'Fallas 2027',
  'rooms.h1': 'Elige tu balcón para la mascletá',
  'rooms.lead':
    'Las 10 habitaciones del Hotel Venecia con balcón o mirador a la Plaza del Ayuntamiento. Selecciona la fecha, habitación y número de personas: del resto nos encargamos nosotros.',


  // mascletas
  'mascletas.eyebrow': 'Fallas 2027',
  'mascletas.h1': 'Calendario de mascletás',
  'mascletas.lead':
    'Del 1 al 19 de marzo de 2027, todos los días a las 14:00 en la Plaza del Ayuntamiento. El 18, Nit del Foc; el 19, la Cremà.',
  'mascletas.daily': 'Mascletá diaria · 14:00 · Plaza del Ayuntamiento',
  'mascletas.march': 'Marzo 2027',

  // faq
  'faq.eyebrow': 'Fallas 2027',
  'faq.h1': 'Preguntas frecuentes',
  'faq.lead': 'Contenido de ejemplo — se completará con la información real de la reserva.',
  'faq.q1': '¿Qué días puedo reservar?',
  'faq.a1':
    'Cualquier día del 1 al 12 de marzo de 2027. La habitación se reserva por horas, de 13:00 a 15:00 h, para ver la mascletá de las 14:00 h.',
  'faq.q2': '¿Todas las habitaciones tienen vistas a la mascletá?',
  'faq.a2':
    'Sí: las 10 habitaciones que se ofrecen para Fallas tienen balcón o mirador con vistas a la Plaza del Ayuntamiento.',
  'faq.q3': '¿Qué incluye el Snack Pack?',
  'faq.a3':
    'Va incluido en el precio de la habitación, sin coste extra. El detalle se confirma con el hotel antes de abrir las reservas.',
  'faq.q4': '¿Puedo cancelar?',
  'faq.a4': 'Consulta la política de cancelación para las fechas de Fallas.',

  // tarjeta de habitación (Home + Habitaciones)
  'roomcard.title': 'Habitación {n}',
  'roomcard.capacity': 'Capacidad máxima: {n} personas',
  'roomcard.bath': 'Baño privado',
  'roomcard.balcony': 'Balcón con vistas a la mascletá',
  'roomcard.snack': 'Snack Pack incluido',
  'roomcard.hours': 'Disponible de {start} a {end} h',
  'roomcard.private':
    'La habitación se reserva completa y será exclusivamente para vuestro grupo durante toda la experiencia.',
  'roomcard.from': 'Desde',
  'roomcard.perroom': '/ habitación',
  'roomcard.book': 'Reservar habitación {n}',
  'roomcard.hint': 'Selecciona la fecha para consultar disponibilidad y precio.',
  'roomcard.photopending': 'Foto pendiente',

  // reserva (flujo del Hito 2: espacio privado por horas, no noches)
  'book.eyebrow': 'Fallas 2027',
  'book.h1': 'Reserva tu balcón para la mascletá',
  'book.lead':
    'Elige el día y la habitación. La reserva queda como solicitud; el hotel confirma la disponibilidad y te escribe por correo.',

  'book.step.date': 'Fecha',
  'book.step.room': 'Habitación',
  'book.step.details': 'Tus datos',
  'book.step.done': 'Confirmación',

  'book.date.title': '¿Qué día quieres vivir la mascletá?',
  'book.date.date': 'Fecha',
  'book.date.guests': 'Personas',
  'book.date.window': 'Días del 1 al 12 de marzo de 2027. Acceso de {start} a {end} h, mascletá a las {mascleta} h.',
  'book.date.submit': 'Buscar disponibilidad',
  'book.date.err.range': 'La fecha debe estar entre el 1 y el 12 de marzo de 2027.',
  'book.date.err.generic': 'Revisa la fecha.',

  'book.room.title': 'Elige habitación',
  'book.room.number': 'Habitación {n}',
  'book.room.capacity': 'Hasta {n} personas',
  'book.room.price': '{price} / habitación',
  'book.room.select': 'Elegir',
  'book.room.selected': 'Elegida',
  'book.room.unavailable': 'Ya reservada para ese día',
  'book.room.toosmall': 'No admite {n} personas',
  'book.room.none': 'No quedan habitaciones disponibles para ese día.',
  'book.room.back': 'Cambiar fecha',
  'book.room.next': 'Continuar',

  'book.details.title': 'Tus datos',
  'book.details.first': 'Nombre',
  'book.details.last': 'Apellidos',
  'book.details.email': 'Email',
  'book.details.phone': 'Teléfono',
  'book.details.country': 'País (opcional)',
  'book.details.notes': 'Peticiones (opcional)',
  'book.details.consent': 'He leído y acepto las {terms} y la {privacy}.',
  'book.details.consent.terms': 'condiciones de reserva',
  'book.details.consent.privacy': 'política de privacidad',
  'book.details.back': 'Atrás',
  'book.details.submit': 'Enviar solicitud',
  'book.details.sending': 'Enviando…',
  'book.details.err.fields': 'Revisa los campos marcados.',
  'book.details.err.consent': 'Tienes que aceptar las condiciones para continuar.',

  'book.err.availability': 'Esa habitación ya no está disponible para ese día.',
  'book.err.service':
    'No hemos podido conectar con el sistema de reservas. Inténtalo en unos minutos o llámanos.',
  'book.err.generic': 'Algo ha ido mal. Inténtalo de nuevo.',

  'book.summary.title': 'Resumen',
  'book.summary.date': 'Fecha',
  'book.summary.room': 'Habitación',
  'book.summary.guests': 'Personas',
  'book.summary.total': 'Total',
  'book.summary.empty': 'Elige una fecha para empezar.',
  'book.summary.pending': 'El pago se añade más adelante. Ahora solo se envía la solicitud.',
  'book.summary.snack': 'Snack Pack incluido',

  'book.done.title': '¡Solicitud recibida!',
  'book.done.locator': 'Localizador',
  'book.done.body':
    'Hemos enviado un correo a {email} con el resumen. El hotel confirmará la disponibilidad y te escribirá con los pasos para el pago.',
  'book.done.demo': 'Modo demostración: la reserva no se ha guardado (falta conectar Airtable).',
  'book.done.home': 'Volver al inicio',

  'book.meta.title': 'Reservar balcón · Hotel Venecia Plaza Centro · Fallas 2027',
  'book.meta.desc':
    'Reserva tu balcón privado en el Hotel Venecia Plaza Centro para ver la mascletá de Fallas 2027 desde la Plaza del Ayuntamiento.',

  // legal (marcadores)
  'legal.terms.h1': 'Condiciones de reserva',
  'legal.cancellation.h1': 'Política de cancelación',
  'legal.privacy.h1': 'Política de privacidad',
  'legal.placeholder':
    'Texto legal pendiente de redactar y revisar antes de abrir reservas y pagos.',

  // meta
  'meta.home.title': 'Fallas 2027 · Reserva tu balcón en el Hotel Venecia y vive la mascletá — Plaza del Ayuntamiento, València',
  'meta.home.desc':
    'Reserva una habitación privada en el Hotel Venecia Plaza Centro para ver la mascletá de Fallas 2027 desde tu propio balcón en la Plaza del Ayuntamiento. Snack Pack incluido.',
};

const en: Dict = {
  'nav.rooms': 'Rooms',
  'nav.mascletas': 'Mascletás',
  'nav.faq': 'FAQ',
  'nav.book': 'Book now',
  'nav.menu': 'Menu',
  'nav.close': 'Close menu',

  'fab.call': 'Call',
  'fab.call.aria': 'Call the hotel',

  'footer.tagline': "On Plaza del Ayuntamiento, where the mascletás are set off.",
  'footer.mainsite': "Hotel's main website",
  'footer.terms': 'Booking terms',
  'footer.cancellation': 'Cancellation policy',
  'footer.privacy': 'Privacy',
  'footer.rights': 'All rights reserved.',

  'home.eyebrow': 'Fallas 2027',
  'home.h1.pre': 'Experience the mascletá from your',
  'home.h1.accent': 'private balcony',
  'home.kicker': 'Plaza del Ayuntamiento. Your own balcony. The mascletá right in front of you.',
  'home.p1':
    'During Fallas, some of our rooms become private spaces for a few hours so you can enjoy the mascletá front row, away from the crowds and with all the hotel’s comforts.',
  'home.p2':
    'Every space is a real room at Hotel Venecia, with its usual furniture, a private bathroom, and a balcony or viewpoint over Plaza del Ayuntamiento.',
  'home.p3': 'Your booking also includes a Snack Pack to enjoy the experience.',
  'home.cta': 'See available rooms',
  'home.tagline': 'Fallas, closer than ever',
  'home.badge': 'A unique experience in Valencia',
  'home.photo.hero.alt': 'The mascletá seen from a Hotel Venecia balcony',

  'home.feature1.t': 'Prime views',
  'home.feature1.d': 'Balcony or viewpoint over Plaza del Ayuntamiento',
  'home.feature2.t': 'Private space',
  'home.feature2.d': 'Real hotel rooms with their usual furniture',
  'home.feature3.t': 'Private bathroom',
  'home.feature3.d': 'Every room has its own bathroom',
  'home.feature4.t': 'Snack Pack',
  'home.feature4.d': 'Included with your booking to enjoy the experience',

  'home.tradicion.eyebrow': 'A unique tradition',
  'home.tradicion.h2.pre': 'Experience the essence of Fallas',
  'home.tradicion.h2.accent': 'from the inside.',
  'home.tradicion.p1':
    'During Fallas, some of our rooms become private spaces to enjoy the mascletá, away from the crowds and with all the hotel’s comforts.',
  'home.tradicion.p2': 'A different, comfortable and exclusive way to experience the tradition.',
  'home.tradicion.tagline': 'Valencia in its purest form',
  'home.tradicion.photo.alt': 'The Micalet tower and orange trees in València',

  'home.rooms.eyebrow': 'Choose your balcony',
  'home.rooms.h2': 'Available rooms',
  'home.rooms.lead': 'Pick a date, room and number of guests. We take care of the rest.',
  'home.rooms.seeall': 'See all 10 rooms',

  'home.strip.schedule.t': 'Access hours',
  'home.strip.schedule.v': '1pm – 3pm',
  'home.strip.mascleta.t': 'Mascletá',
  'home.strip.mascleta.v': '2pm',
  'home.strip.private.t': 'Private space',
  'home.strip.private.v': 'Exclusively for your booking',
  'home.strip.snack.t': 'Snack Pack',
  'home.strip.snack.v': 'Included',

  'rooms.eyebrow': 'Fallas 2027',
  'rooms.h1': 'Choose your balcony for the mascletá',
  'rooms.lead':
    'All 10 Hotel Venecia rooms with a balcony or viewpoint over Plaza del Ayuntamiento. Pick a date, room and number of guests — we take care of the rest.',

  'mascletas.eyebrow': 'Fallas 2027',
  'mascletas.h1': 'Mascletá calendar',
  'mascletas.lead':
    'From 1 to 19 March 2027, every day at 2 pm on Plaza del Ayuntamiento. On the 18th, Nit del Foc; on the 19th, the Cremà.',
  'mascletas.daily': 'Daily mascletá · 2 pm · Plaza del Ayuntamiento',
  'mascletas.march': 'March 2027',

  'faq.eyebrow': 'Fallas 2027',
  'faq.h1': 'Frequently asked questions',
  'faq.lead': 'Placeholder content — to be completed with the real booking information.',
  'faq.q1': 'Which days can I book?',
  'faq.a1':
    'Any day from 1 to 12 March 2027. The room is booked by the hour, from 1pm to 3pm, to watch the 2pm mascletá.',
  'faq.q2': 'Do all the rooms have views of the mascletá?',
  'faq.a2':
    'Yes: all 10 rooms offered for Fallas have a balcony or viewpoint over Plaza del Ayuntamiento.',
  'faq.q3': "What's included in the Snack Pack?",
  'faq.a3':
    "It's included in the room price at no extra cost. The details will be confirmed with the hotel before bookings open.",
  'faq.q4': 'Can I cancel?',
  'faq.a4': 'See the cancellation policy for the Fallas dates.',

  'roomcard.title': 'Room {n}',
  'roomcard.capacity': 'Maximum capacity: {n} people',
  'roomcard.bath': 'Private bathroom',
  'roomcard.balcony': 'Balcony overlooking the mascletá',
  'roomcard.snack': 'Snack Pack included',
  'roomcard.hours': 'Available from {start} to {end}',
  'roomcard.private':
    'The room is booked in full and is exclusively for your group for the whole experience.',
  'roomcard.from': 'From',
  'roomcard.perroom': '/ room',
  'roomcard.book': 'Book room {n}',
  'roomcard.hint': 'Pick a date to check availability and price.',
  'roomcard.photopending': 'Photo coming soon',

  'book.eyebrow': 'Fallas 2027',
  'book.h1': 'Book your balcony for the mascletá',
  'book.lead':
    'Pick the day and the room. The booking is submitted as a request; the hotel confirms availability and gets back to you by email.',

  'book.step.date': 'Date',
  'book.step.room': 'Room',
  'book.step.details': 'Your details',
  'book.step.done': 'Confirmation',

  'book.date.title': 'Which day do you want to experience the mascletá?',
  'book.date.date': 'Date',
  'book.date.guests': 'Guests',
  'book.date.window': 'Days from 1 to 12 March 2027. Access from {start} to {end}, mascletá at {mascleta}.',
  'book.date.submit': 'Check availability',
  'book.date.err.range': 'The date must fall between 1 and 12 March 2027.',
  'book.date.err.generic': 'Please check the date.',

  'book.room.title': 'Choose a room',
  'book.room.number': 'Room {n}',
  'book.room.capacity': 'Up to {n} people',
  'book.room.price': '{price} / room',
  'book.room.select': 'Choose',
  'book.room.selected': 'Chosen',
  'book.room.unavailable': 'Already booked for that day',
  'book.room.toosmall': "Doesn't fit {n} people",
  'book.room.none': 'No rooms left for that day.',
  'book.room.back': 'Change date',
  'book.room.next': 'Continue',

  'book.details.title': 'Your details',
  'book.details.first': 'First name',
  'book.details.last': 'Last name',
  'book.details.email': 'Email',
  'book.details.phone': 'Phone',
  'book.details.country': 'Country (optional)',
  'book.details.notes': 'Requests (optional)',
  'book.details.consent': 'I have read and accept the {terms} and the {privacy}.',
  'book.details.consent.terms': 'booking terms',
  'book.details.consent.privacy': 'privacy policy',
  'book.details.back': 'Back',
  'book.details.submit': 'Send request',
  'book.details.sending': 'Sending…',
  'book.details.err.fields': 'Please check the highlighted fields.',
  'book.details.err.consent': 'You must accept the terms to continue.',

  'book.err.availability': 'That room is no longer available for these dates.',
  'book.err.service':
    "We couldn't reach the booking system. Try again in a few minutes or give us a call.",
  'book.err.generic': 'Something went wrong. Please try again.',

  'book.summary.title': 'Summary',
  'book.summary.date': 'Date',
  'book.summary.room': 'Room',
  'book.summary.guests': 'Guests',
  'book.summary.total': 'Total',
  'book.summary.empty': 'Pick a date to start.',
  'book.summary.pending': 'Payment comes later. For now only the request is sent.',
  'book.summary.snack': 'Snack Pack included',

  'book.done.title': 'Request received!',
  'book.done.locator': 'Reference',
  'book.done.body':
    "We've emailed a summary to {email}. The hotel will confirm availability and write to you with the payment steps.",
  'book.done.demo': 'Demo mode: the booking was not saved (Airtable not connected yet).',
  'book.done.home': 'Back to home',

  'book.meta.title': 'Book your balcony · Hotel Venecia Plaza Centro · Fallas 2027',
  'book.meta.desc':
    'Book your private balcony at Hotel Venecia Plaza Centro to watch the Fallas 2027 mascletá from Plaza del Ayuntamiento.',

  'legal.terms.h1': 'Booking terms',
  'legal.cancellation.h1': 'Cancellation policy',
  'legal.privacy.h1': 'Privacy policy',
  'legal.placeholder': 'Legal text pending drafting and review before opening bookings and payments.',

  'meta.home.title': 'Fallas 2027 · Book your balcony at Hotel Venecia and experience the mascletá — Plaza del Ayuntamiento, València',
  'meta.home.desc':
    'Book a private room at Hotel Venecia Plaza Centro to watch the Fallas 2027 mascletá from your own balcony over Plaza del Ayuntamiento. Snack Pack included.',
};

const DICTS: Record<Locale, Dict> = {
  es,
  en,
  it: {}, // TODO traducir
  fr: {}, // TODO traducir
  de: {}, // TODO traducir
};

/** t('clave', lang) — cae a ES si falta la traducción. */
export function useT(lang: Locale) {
  const dict = DICTS[lang] ?? {};
  return (key: string): string => dict[key] ?? DICTS[DEFAULT_LOCALE][key] ?? key;
}

/** Diccionario completo de un idioma: ES como base + traducciones encima. */
export function dictFor(lang: Locale): Dict {
  return { ...DICTS[DEFAULT_LOCALE], ...(DICTS[lang] ?? {}) };
}
