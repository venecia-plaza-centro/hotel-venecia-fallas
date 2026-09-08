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
  'nav.groups': 'Grupos y catering',
  'nav.mascletas': 'Mascletàs',
  'nav.faq': 'Preguntas frecuentes',
  'nav.book': 'Reservar',

  // fabs
  'fab.call': 'Llamar',
  'fab.call.aria': 'Llamar al hotel',

  // footer
  'footer.tagline': 'En la Plaza del Ayuntamiento, donde se disparan las mascletàs.',
  'footer.mainsite': 'Web principal del hotel',
  'footer.terms': 'Condiciones de reserva',
  'footer.cancellation': 'Política de cancelación',
  'footer.privacy': 'Privacidad',
  'footer.rights': 'Todos los derechos reservados.',

  // home
  'home.eyebrow': 'Fallas 2027',
  'home.h1': 'Vive las mascletàs desde el Hotel Venecia',
  'home.lead':
    'Del 1 al 19 de marzo, la mascletà estalla cada día a las 14:00 en la Plaza del Ayuntamiento. Nuestro hotel está justo ahí. Reserva tu habitación —entera o para tu grupo, con catering— y siéntela desde dentro.',
  'home.cta.rooms': 'Ver habitaciones',
  'home.cta.groups': 'Reservas de grupo',
  'home.section.why': 'Por qué reservar con nosotros',
  'home.why.location.t': 'En la propia plaza',
  'home.why.location.d':
    'La mascletà se dispara en la Plaza del Ayuntamiento y el hotel está en el número 3. Algunas habitaciones dan directamente a la plaza.',
  'home.why.whole.t': 'Habitaciones enteras',
  'home.why.whole.d':
    'Reserva la habitación completa para ti o tu familia, sin compartir. Precio cerrado por las noches de Fallas.',
  'home.why.groups.t': 'Grupos con catering',
  'home.why.groups.d':
    'Varias habitaciones juntas y un paquete de catering para vivir la mascletà en grupo, con aperitivo valenciano.',

  // rooms
  'rooms.eyebrow': 'Fallas 2027',
  'rooms.h1': 'Habitaciones para las Fallas',
  'rooms.lead':
    'Reserva la habitación entera para las noches de Fallas. Contenido de ejemplo — pendiente de datos reales del hotel (tipos, vistas a la plaza, capacidad y precios).',
  'rooms.viewsplaza': 'Vistas a la Plaza del Ayuntamiento',
  'rooms.capacity': 'Capacidad',
  'rooms.from': 'Desde',
  'rooms.night': '/ noche',
  'rooms.book': 'Reservar esta habitación',
  'rooms.tbd': 'Precio por confirmar',

  // groups
  'groups.eyebrow': 'Fallas 2027',
  'groups.h1': 'Grupos y catering',
  'groups.lead':
    'Reserva varias habitaciones juntas y añade un paquete de catering para vivir la mascletà en grupo. Contenido de ejemplo — pendiente de definir paquetes y precios.',
  'groups.step1.t': '1 · Elige las habitaciones',
  'groups.step1.d': 'Bloque de habitaciones contiguas para tu grupo, cada una reservada entera.',
  'groups.step2.t': '2 · Añade catering',
  'groups.step2.d':
    'Paquete de aperitivo valenciano (horchata, longaniza, embutidos, bebida) servido antes de la mascletà. Precio por persona.',
  'groups.step3.t': '3 · Vive la mascletà',
  'groups.step3.d': 'Desde los balcones de vuestras habitaciones, en primera línea de la plaza.',
  'groups.cta': 'Solicitar reserva de grupo',

  // mascletas
  'mascletas.eyebrow': 'Fallas 2027',
  'mascletas.h1': 'Calendario de mascletàs',
  'mascletas.lead':
    'Del 1 al 19 de marzo de 2027, todos los días a las 14:00 en la Plaza del Ayuntamiento. El 18, Nit del Foc; el 19, la Cremà.',
  'mascletas.daily': 'Mascletà diaria · 14:00 · Plaza del Ayuntamiento',
  'mascletas.march': 'Marzo 2027',

  // faq
  'faq.eyebrow': 'Fallas 2027',
  'faq.h1': 'Preguntas frecuentes',
  'faq.lead': 'Contenido de ejemplo — se completará con la información real de reservas y catering.',
  'faq.q1': '¿Qué fechas puedo reservar?',
  'faq.a1': 'Las noches del 1 al 19 de marzo de 2027, con un mínimo de noches por confirmar.',
  'faq.q2': '¿Las habitaciones tienen vistas a la mascletà?',
  'faq.a2':
    'Algunas dan directamente a la Plaza del Ayuntamiento. Se indicará en cada habitación al reservar.',
  'faq.q3': '¿Cómo funciona el catering de grupo?',
  'faq.a3': 'Es un paquete opcional por persona que se añade a la reserva de grupo. Pendiente de detalle.',
  'faq.q4': '¿Puedo cancelar?',
  'faq.a4': 'Consulta la política de cancelación para las fechas de Fallas.',

  // reserva (flujo del Hito 2)
  'book.eyebrow': 'Fallas 2027',
  'book.h1': 'Reserva tu habitación',
  'book.lead':
    'Elige fechas, habitación y catering. La reserva queda como solicitud; el hotel confirma la disponibilidad y te escribe por correo.',

  'book.step.dates': 'Fechas',
  'book.step.room': 'Habitación',
  'book.step.extras': 'Catering',
  'book.step.details': 'Tus datos',
  'book.step.done': 'Confirmación',

  'book.dates.title': 'Fechas de la estancia',
  'book.dates.checkin': 'Entrada',
  'book.dates.checkout': 'Salida',
  'book.dates.guests': 'Huéspedes',
  'book.dates.window': 'Noches del 1 al 19 de marzo de 2027. Mínimo {min} noches.',
  'book.dates.submit': 'Buscar disponibilidad',
  'book.dates.err.range': 'Las fechas deben estar entre el 1 y el 20 de marzo de 2027.',
  'book.dates.err.order': 'La salida debe ser posterior a la entrada.',
  'book.dates.err.min': 'La estancia mínima es de {min} noches.',
  'book.dates.err.generic': 'Revisa las fechas.',

  'book.room.title': 'Elige habitación',
  'book.room.capacity': 'Hasta {n} personas',
  'book.room.plaza': 'Vistas a la plaza',
  'book.room.pernight': '{price} / noche',
  'book.room.total': '{price} · {nights}',
  'book.room.select': 'Elegir',
  'book.room.selected': 'Elegida',
  'book.room.unavailable': 'Sin disponibilidad para estas fechas',
  'book.room.toosmall': 'No admite {n} huéspedes',
  'book.room.none': 'No hay habitaciones disponibles para estas fechas.',
  'book.room.back': 'Cambiar fechas',
  'book.room.next': 'Continuar',

  'book.extras.title': '¿Añadir catering?',
  'book.extras.lead': 'Aperitivo valenciano servido antes de la mascletà. Es opcional.',
  'book.extras.none': 'Sin catering',
  'book.extras.perperson': '{price} / persona',
  'book.extras.people': 'Comensales',
  'book.extras.min': 'Mínimo {n} personas',
  'book.extras.back': 'Atrás',
  'book.extras.next': 'Continuar',

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

  'book.err.availability': 'Esa habitación ya no está disponible para estas fechas.',
  'book.err.service':
    'No hemos podido conectar con el sistema de reservas. Inténtalo en unos minutos o llámanos.',
  'book.err.generic': 'Algo ha ido mal. Inténtalo de nuevo.',

  'book.summary.title': 'Resumen',
  'book.summary.dates': 'Fechas',
  'book.summary.room': 'Habitación',
  'book.summary.catering': 'Catering',
  'book.summary.lodging': 'Alojamiento',
  'book.summary.total': 'Total',
  'book.summary.empty': 'Elige fechas para empezar.',
  'book.summary.pending': 'El pago se añade más adelante. Ahora solo se envía la solicitud.',

  'book.done.title': '¡Solicitud recibida!',
  'book.done.locator': 'Localizador',
  'book.done.body':
    'Hemos enviado un correo a {email} con el resumen. El hotel confirmará la disponibilidad y te escribirá con los pasos para el pago.',
  'book.done.demo': 'Modo demostración: la reserva no se ha guardado (falta conectar Airtable).',
  'book.done.home': 'Volver al inicio',

  'book.night.one': 'noche',
  'book.night.other': 'noches',

  'book.meta.title': 'Reservar · Hotel Venecia Plaza Centro · Fallas 2027',
  'book.meta.desc':
    'Reserva tu habitación en el Hotel Venecia Plaza Centro para las Fallas 2027 y vive la mascletà diaria desde la Plaza del Ayuntamiento.',

  // legal (marcadores)
  'legal.terms.h1': 'Condiciones de reserva',
  'legal.cancellation.h1': 'Política de cancelación',
  'legal.privacy.h1': 'Política de privacidad',
  'legal.placeholder':
    'Texto legal pendiente de redactar y revisar antes de abrir reservas y pagos.',

  // meta
  'meta.home.title': 'Fallas 2027 · Reserva en el Hotel Venecia y vive la mascletà — Plaza del Ayuntamiento, València',
  'meta.home.desc':
    'Reserva habitación en el Hotel Venecia Plaza Centro para las Fallas 2027 y vive la mascletà diaria desde la Plaza del Ayuntamiento. Habitaciones enteras y reservas de grupo con catering.',
};

const en: Dict = {
  'nav.rooms': 'Rooms',
  'nav.groups': 'Groups & catering',
  'nav.mascletas': 'Mascletàs',
  'nav.faq': 'FAQ',
  'nav.book': 'Book now',

  'fab.call': 'Call',
  'fab.call.aria': 'Call the hotel',

  'footer.tagline': "On Plaza del Ayuntamiento, where the mascletàs are set off.",
  'footer.mainsite': "Hotel's main website",
  'footer.terms': 'Booking terms',
  'footer.cancellation': 'Cancellation policy',
  'footer.privacy': 'Privacy',
  'footer.rights': 'All rights reserved.',

  'home.eyebrow': 'Fallas 2027',
  'home.h1': 'Experience the mascletàs from Hotel Venecia',
  'home.lead':
    'From 1 to 19 March, the mascletà goes off every day at 2 pm on Plaza del Ayuntamiento. Our hotel is right there. Book your room — whole, or for your group with catering — and feel it from the inside.',
  'home.cta.rooms': 'See rooms',
  'home.cta.groups': 'Group bookings',
  'home.section.why': 'Why book with us',
  'home.why.location.t': 'On the square itself',
  'home.why.location.d':
    "The mascletà is fired on Plaza del Ayuntamiento and the hotel is at number 3. Some rooms face straight onto the square.",
  'home.why.whole.t': 'Whole rooms',
  'home.why.whole.d':
    'Book the entire room for yourself or your family, no sharing. Fixed price for the Fallas nights.',
  'home.why.groups.t': 'Groups with catering',
  'home.why.groups.d':
    'Several rooms together and a catering package to enjoy the mascletà as a group, with a Valencian aperitif.',

  'rooms.eyebrow': 'Fallas 2027',
  'rooms.h1': 'Rooms for Fallas',
  'rooms.lead':
    "Book the whole room for the Fallas nights. Placeholder content — pending real hotel data (types, square views, capacity and prices).",
  'rooms.viewsplaza': 'Views over Plaza del Ayuntamiento',
  'rooms.capacity': 'Capacity',
  'rooms.from': 'From',
  'rooms.night': '/ night',
  'rooms.book': 'Book this room',
  'rooms.tbd': 'Price to be confirmed',

  'groups.eyebrow': 'Fallas 2027',
  'groups.h1': 'Groups & catering',
  'groups.lead':
    'Book several rooms together and add a catering package to enjoy the mascletà as a group. Placeholder content — packages and prices to be defined.',
  'groups.step1.t': '1 · Choose the rooms',
  'groups.step1.d': 'A block of adjoining rooms for your group, each booked in full.',
  'groups.step2.t': '2 · Add catering',
  'groups.step2.d':
    'A Valencian aperitif package (horchata, longaniza, cold cuts, drinks) served before the mascletà. Price per person.',
  'groups.step3.t': '3 · Enjoy the mascletà',
  'groups.step3.d': 'From your room balconies, front row on the square.',
  'groups.cta': 'Request a group booking',

  'mascletas.eyebrow': 'Fallas 2027',
  'mascletas.h1': 'Mascletà calendar',
  'mascletas.lead':
    'From 1 to 19 March 2027, every day at 2 pm on Plaza del Ayuntamiento. On the 18th, Nit del Foc; on the 19th, the Cremà.',
  'mascletas.daily': 'Daily mascletà · 2 pm · Plaza del Ayuntamiento',
  'mascletas.march': 'March 2027',

  'faq.eyebrow': 'Fallas 2027',
  'faq.h1': 'Frequently asked questions',
  'faq.lead': 'Placeholder content — to be completed with the real booking and catering information.',
  'faq.q1': 'Which dates can I book?',
  'faq.a1': 'Nights from 1 to 19 March 2027, with a minimum stay to be confirmed.',
  'faq.q2': 'Do the rooms have views of the mascletà?',
  'faq.a2': 'Some face straight onto Plaza del Ayuntamiento. This is shown for each room when booking.',
  'faq.q3': 'How does the group catering work?',
  'faq.a3': 'An optional per-person package added to the group booking. Details pending.',
  'faq.q4': 'Can I cancel?',
  'faq.a4': 'See the cancellation policy for the Fallas dates.',

  'book.eyebrow': 'Fallas 2027',
  'book.h1': 'Book your room',
  'book.lead':
    'Pick your dates, room and catering. The booking is submitted as a request; the hotel confirms availability and gets back to you by email.',

  'book.step.dates': 'Dates',
  'book.step.room': 'Room',
  'book.step.extras': 'Catering',
  'book.step.details': 'Your details',
  'book.step.done': 'Confirmation',

  'book.dates.title': 'Stay dates',
  'book.dates.checkin': 'Check-in',
  'book.dates.checkout': 'Check-out',
  'book.dates.guests': 'Guests',
  'book.dates.window': 'Nights from 1 to 19 March 2027. Minimum {min} nights.',
  'book.dates.submit': 'Check availability',
  'book.dates.err.range': 'Dates must fall between 1 and 20 March 2027.',
  'book.dates.err.order': 'Check-out must be after check-in.',
  'book.dates.err.min': 'The minimum stay is {min} nights.',
  'book.dates.err.generic': 'Please check the dates.',

  'book.room.title': 'Choose a room',
  'book.room.capacity': 'Up to {n} people',
  'book.room.plaza': 'Square views',
  'book.room.pernight': '{price} / night',
  'book.room.total': '{price} · {nights}',
  'book.room.select': 'Choose',
  'book.room.selected': 'Chosen',
  'book.room.unavailable': 'Not available for these dates',
  'book.room.toosmall': "Doesn't fit {n} guests",
  'book.room.none': 'No rooms available for these dates.',
  'book.room.back': 'Change dates',
  'book.room.next': 'Continue',

  'book.extras.title': 'Add catering?',
  'book.extras.lead': 'A Valencian aperitif served before the mascletà. Optional.',
  'book.extras.none': 'No catering',
  'book.extras.perperson': '{price} / person',
  'book.extras.people': 'Guests',
  'book.extras.min': 'Minimum {n} people',
  'book.extras.back': 'Back',
  'book.extras.next': 'Continue',

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
  'book.summary.dates': 'Dates',
  'book.summary.room': 'Room',
  'book.summary.catering': 'Catering',
  'book.summary.lodging': 'Accommodation',
  'book.summary.total': 'Total',
  'book.summary.empty': 'Pick your dates to start.',
  'book.summary.pending': 'Payment comes later. For now only the request is sent.',

  'book.done.title': 'Request received!',
  'book.done.locator': 'Reference',
  'book.done.body':
    "We've emailed a summary to {email}. The hotel will confirm availability and write to you with the payment steps.",
  'book.done.demo': 'Demo mode: the booking was not saved (Airtable not connected yet).',
  'book.done.home': 'Back to home',

  'book.night.one': 'night',
  'book.night.other': 'nights',

  'book.meta.title': 'Book · Hotel Venecia Plaza Centro · Fallas 2027',
  'book.meta.desc':
    'Book a room at Hotel Venecia Plaza Centro for Fallas 2027 and experience the daily mascletà from Plaza del Ayuntamiento.',

  'legal.terms.h1': 'Booking terms',
  'legal.cancellation.h1': 'Cancellation policy',
  'legal.privacy.h1': 'Privacy policy',
  'legal.placeholder': 'Legal text pending drafting and review before opening bookings and payments.',

  'meta.home.title': 'Fallas 2027 · Book at Hotel Venecia and experience the mascletà — Plaza del Ayuntamiento, València',
  'meta.home.desc':
    'Book a room at Hotel Venecia Plaza Centro for Fallas 2027 and experience the daily mascletà from Plaza del Ayuntamiento. Whole rooms and group bookings with catering.',
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
