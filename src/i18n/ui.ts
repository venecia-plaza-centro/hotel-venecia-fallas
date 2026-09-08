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
