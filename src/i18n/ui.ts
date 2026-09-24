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
  'nav.gallery': 'Galería',
  'nav.contact': 'Contacto',
  'nav.book': 'Reservar',
  'nav.menu': 'Menú',
  'nav.close': 'Cerrar menú',

  // fabs
  'fab.call.aria': 'Llamar al hotel',
  'fab.contact.aria': 'Contactar por teléfono o WhatsApp',
  'fab.top.aria': 'Subir arriba',

  // footer
  'footer.tagline': 'En la Plaza del Ayuntamiento, donde se disparan las mascletás.',
  'footer.mainsite': 'Web principal del hotel',
  'footer.terms': 'Condiciones de reserva',
  'footer.cancellation': 'Política de cancelación',
  'footer.privacy': 'Privacidad',
  'footer.legalnotice': 'Aviso legal',
  'footer.videoCredit': 'Vídeo: Freakpyromaniacs (CC BY)',
  'footer.rights': 'Todos los derechos reservados.',

  // home · hero
  'home.h1.pre': 'Viva la mascletá desde su',
  'home.h1.accent': 'balcón privado',
  'home.kicker': 'La Plaza del Ayuntamiento. Su propio balcón. Y la mascletá justo delante.',
  'home.p1':
    'Durante Fallas, algunas de nuestras habitaciones se convierten durante unas horas en espacios privados para disfrutar de la mascletá desde primera línea, sin aglomeraciones y con todas las comodidades del hotel.',
  'home.p2':
    'Todos los espacios son habitaciones del Hotel Venecia, con su mobiliario habitual, baño privado y balcón o mirador con vistas a la Plaza del Ayuntamiento.',
  'home.p3': 'Además, su reserva incluye un Snack Pack para acompañar la experiencia.',
  'home.cta': 'Ver habitaciones disponibles',
  'home.discover': 'Descubra',
  'home.tagline': 'Fallas, más cerca que nunca',
  'home.badge': 'Una experiencia única en Valencia',
  'home.photo.hero.alt': 'La mascletá vista desde un balcón del Hotel Venecia',

  // home · fila de características
  'home.feature1.t': 'Vistas privilegiadas',
  'home.feature1.d': 'Balcón o mirador a la Plaza del Ayuntamiento',
  'home.feature2.t': 'Espacio privado',
  'home.feature2.d': 'Habitaciones del hotel con su mobiliario',
  'home.feature3.t': 'Baño privado',
  'home.feature3.d': 'Todas las habitaciones disponen de baño propio',
  'home.feature4.t': 'Snack Pack',
  'home.feature4.d': 'Incluido en su reserva para disfrutar de la experiencia',

  // home · tradición
  'home.tradicion.eyebrow': 'Una tradición única',
  'home.tradicion.h2.pre': 'Viva la esencia de las Fallas',
  'home.tradicion.h2.accent': 'desde dentro.',
  'home.tradicion.p1':
    'Del 1 al 19 de marzo, nuestras habitaciones están listas para disfrutar de la mascletá, con su balcón, sin aglomeraciones y con todas las comodidades del hotel.',
  'home.tradicion.p2': 'Una forma diferente, cómoda y exclusiva de vivir la tradición.',
  'home.tradicion.tagline': 'Valencia en estado puro',
  'home.tradicion.photo.alt': 'Vista aérea de una mascletá en la Plaza del Ayuntamiento',

  // home · elige tu balcón (adelanto de habitaciones)
  'home.rooms.h2.pre': 'Elija su',
  'home.rooms.h2.accent': 'balcón privado',
  'home.rooms.lead': 'Seleccione la fecha, habitación y número de personas. Del resto nos encargamos nosotros.',
  'home.rooms.seeall': 'Ver todas las habitaciones',

  // home · franja inferior
  'home.strip.schedule.t': 'Horario de acceso',
  'home.strip.schedule.v': '13:00 – 15:00 h',
  'home.strip.mascleta.t': 'Mascletá',
  'home.strip.mascleta.v': '14:00 h',
  'home.strip.private.t': 'Espacio privado',
  'home.strip.private.v': 'Solo para su reserva',
  'home.strip.snack.t': 'Snack Pack',
  'home.strip.snack.v': 'Incluido',

  // rooms
  'rooms.h1': 'Elija su balcón para la mascletá',
  'rooms.intro':
    'Viva las Fallas en primera fila. Habitaciones privadas con balcón directo a la plaza y unas vistas espectaculares para no perderse ni un momento. Baño privado, espacios exclusivos y toda la emoción de las Fallas justo delante de usted.',

  // mascletas
  'mascletas.h1': 'Calendario de mascletás',
  'mascletas.lead':
    'Del 1 al 19 de marzo de 2027, todos los días a las 14:00 en la Plaza del Ayuntamiento.',
  'mascletas.march': 'Marzo 2027',
  'mascletas.month': 'Marzo',

  // galería
  'gallery.h1': 'Galería',
  'gallery.alt': 'Hotel Venecia Plaza Centro, foto {n}',
  'gallery.open': 'Ampliar foto {n}',
  'gallery.close': 'Cerrar',
  'gallery.prev': 'Foto anterior',
  'gallery.next': 'Foto siguiente',

  // faq
  'faq.h1': 'Preguntas frecuentes',
  'faq.q1': '¿Qué días puedo reservar?',
  'faq.a1':
    'Cualquier día del 1 al 12 de marzo de 2027. La habitación se reserva por horas, de 13:00 a 15:00 h, para ver la mascletá de las 14:00 h.',
  'faq.q2': '¿Todas las habitaciones tienen vistas a la mascletá?',
  'faq.a2':
    'Sí: las habitaciones que se ofrecen para Fallas tienen balcón con vistas a la Plaza del Ayuntamiento.',
  'faq.q3': '¿Qué incluye el Snack Pack?',
  'faq.a3':
    'Va incluido en el precio de la habitación, sin coste extra: patatas, mini fuet, aceitunas, frutos secos, 2 refrescos o cervezas y 1 agua por persona.',
  'faq.q4': '¿Puedo cancelar?',
  'faq.a4': 'Consulte la {cancellationLink} para las fechas de las mascletás.',

  // tarjeta de habitación (Home + Habitaciones)
  'roomcard.title': 'Habitación {n}',
  'roomcard.capacity': 'Capacidad máxima: {n} personas',
  'roomcard.bath': 'Baño privado',
  'roomcard.balcony': 'Balcón con vistas a la mascletá',
  'roomcard.snack':
    'Snack Pack incluido: patatas, mini fuet, aceitunas, frutos secos, 2 refrescos o cervezas y 1 agua por persona',
  'roomcard.hours': 'Disponible de {start} a {end} h',
  'roomcard.private':
    'La habitación se reserva completa y será exclusivamente para su grupo durante toda la experiencia.',
  'roomcard.from': 'Desde',
  'roomcard.perperson': '/ persona',
  'roomcard.book': 'Reservar habitación {n}',
  'roomcard.photopending': 'Foto pendiente',
  'roomcard.soldout.badge': 'Completa',
  'roomcard.soldout': 'Sin disponibilidad para estas fechas.',

  // reserva (flujo del Hito 2: espacio privado por horas, no noches)
  'book.h1': 'Reserve su balcón para la mascletá',
  'book.lead':
    'Elija el día, la habitación y pague online: su reserva queda confirmada al momento.',

  'book.step.date': 'Fecha',
  'book.step.room': 'Habitación',
  'book.step.details': 'Sus datos',
  'book.step.done': 'Confirmación',

  'book.date.title': '¿Qué día quiere vivir la mascletá?',
  'book.date.date': 'Fecha',
  'book.date.guests': 'Personas',
  'book.date.guestsHint': 'El precio de la habitación depende del número de personas.',
  'book.date.window': 'Días del 1 al 12 de marzo de 2027. Acceso de {start} a {end} h, mascletá a las {mascleta} h.',
  'book.date.submit': 'Buscar disponibilidad',
  'book.date.err.range': 'La fecha debe estar entre el 1 y el 12 de marzo de 2027.',
  'book.date.err.generic': 'Revise la fecha.',
  'book.date.legend.available': 'Disponible',
  'book.date.legend.full': 'Completo',
  'book.date.sold_out': 'Sin habitaciones libres ese día',

  'book.room.title': 'Elija habitación',
  'book.room.number': 'Habitación {n}',
  'book.room.capacity': 'Hasta {n} personas',
  'book.room.price': '{price} / persona',
  'book.room.select': 'Elegir habitación',
  'book.room.selected': 'Elegida',
  'book.room.unavailable': 'Reservada o en proceso de reserva',
  'book.room.toosmall': 'No admite {n} personas',
  'book.room.none': 'No quedan habitaciones disponibles para ese día.',
  'book.room.change': 'Elegir otra habitación',
  'book.room.back': 'Cambiar datos',
  'book.room.next': 'Continuar',

  'book.details.title': 'Sus datos',
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
  'book.details.submit': 'Ir al pago',
  'book.details.sending': 'Redirigiendo…',
  'book.details.err.fields': 'Revise los campos marcados.',
  'book.details.err.consent': 'Debe aceptar las condiciones para continuar.',

  'book.err.availability': 'Esa habitación ya no está disponible: alguien acaba de reservarla o la está pagando ahora mismo. Elija otra o vuelva a intentarlo en unos minutos.',
  'book.err.service':
    'No hemos podido conectar con el sistema de reservas. Inténtelo en unos minutos o llámenos.',
  'book.err.generic': 'Algo ha ido mal. Inténtelo de nuevo.',
  'book.err.canceled': 'El pago se ha cancelado. Puede intentarlo de nuevo cuando quiera.',

  'book.summary.title': 'Resumen',
  'book.summary.date': 'Fecha',
  'book.summary.room': 'Habitación',
  'book.summary.guests': 'Personas',
  'book.summary.total': 'Total',
  'book.summary.empty': 'Elija número de personas y una fecha para empezar.',
  'book.summary.pending': 'El siguiente paso es el pago, con tarjeta o Bizum.',
  'book.summary.snack': 'Snack Pack incluido',

  'book.done.title': '¡Reserva confirmada!',
  'book.done.locator': 'Localizador',
  'book.done.body.email':
    'Le hemos enviado la confirmación a {email}. Le esperamos en el hotel el día de su reserva.',
  'book.done.demo': 'Modo demostración: la reserva no se ha guardado (falta conectar Airtable).',
  'book.done.demo.payment': 'Modo demostración: no se ha realizado ningún cobro real (falta conectar una pasarela de pago).',
  'book.done.home': 'Volver al inicio',

  'book.meta.title': 'Reservar balcón · Hotel Venecia Plaza Centro · Fallas 2027',
  'book.meta.desc':
    'Reserve su balcón privado en el Hotel Venecia Plaza Centro para ver la mascletá de Fallas 2027 desde la Plaza del Ayuntamiento.',

  // legal
  'legal.nav.aria': 'Otras páginas legales',
  'legal.home': 'Inicio',
  'legal.terms.h1': 'Condiciones de reserva',
  'legal.terms.intro':
    'Estas condiciones regulan la reserva de balcón privado para la mascletá de Fallas 2027 en el Hotel Venecia Plaza Centro. Al completar el pago desde esta web acepta los términos que se describen a continuación.',
  'legal.terms.s1.h': 'Qué incluye la reserva',
  'legal.terms.s1.p':
    'Reserva el uso privado de una de las 9 habitaciones reales del hotel durante la franja de 13:00 a 15:00 h del día de mascletá que elija, con vistas a la Plaza del Ayuntamiento y Snack Pack incluido. No es una reserva de alojamiento ni incluye pernoctación.',
  'legal.terms.s2.h': 'Ocupación y precio',
  'legal.terms.s2.p':
    'Cada habitación admite hasta 4 personas. El precio mostrado depende del número de huéspedes indicado en el momento de la reserva (2, 3 o 4) y se calcula siempre por el hotel, nunca lo indica el cliente.',
  'legal.terms.s3.h': 'Confirmación de la reserva',
  'legal.terms.s3.p':
    'Su reserva se confirma en el momento en que se completa el pago online. Solo puede reservar habitaciones que el sistema muestra como disponibles en ese instante: no hay una solicitud previa que el hotel deba aprobar más tarde.',
  'legal.terms.s4.h': 'Acceso el día de la experiencia',
  'legal.terms.s4.p':
    'Preséntese en la recepción del hotel dentro de la franja horaria reservada, con un documento de identidad válido. Si se retrasa, el tiempo de acceso restante no se amplía.',
  'legal.terms.s5.h': 'Cambios y cancelaciones',
  'legal.terms.s5.p':
    'Las condiciones de cambio y cancelación, incluido el carácter no reembolsable del importe abonado, se detallan en nuestra {cancellationLink}.',
  'legal.terms.s6.h': 'Circunstancias ajenas al hotel',
  'legal.terms.s6.p':
    'La mascletá la organiza el Ayuntamiento de València y puede verse afectada por causas de seguridad, meteorológicas o de otro tipo ajenas al hotel. En ese caso se aplicará lo previsto en la {cancellationLink}.',
  'legal.terms.s7.h': 'Uso del espacio',
  'legal.terms.s7.p':
    'La habitación reservada es un espacio real del hotel puesto a su disposición durante la experiencia. Le pedimos que cuide el mobiliario y las instalaciones; el hotel podrá repercutir el coste de daños causados durante su franja de acceso.',
  'legal.terms.contact': '¿Dudas sobre estas condiciones? Escríbanos:',

  'legal.cancellation.h1': 'Política de cancelación',
  'legal.cancellation.intro':
    'Antes de confirmar su reserva de balcón privado, tenga en cuenta que se trata de una experiencia con plazas limitadas para un día y una franja horaria concreta.',
  'legal.cancellation.s1.h': 'Pagos no reembolsables',
  'legal.cancellation.s1.p':
    'El importe abonado por la reserva de su balcón privado no es reembolsable, sea cual sea el motivo o la antelación con la que se solicite la cancelación.',
  'legal.cancellation.s2.h': 'Fecha y habitación fijas',
  'legal.cancellation.s2.p':
    'Su balcón privado queda reservado para la fecha y la habitación exactas que eligió al confirmar: no se admiten cambios posteriores. Le pedimos elegir con calma antes de reservar, para que el día de la mascletá todo sea exactamente como lo imaginó.',
  'legal.cancellation.s3.h': 'Si no se presenta',
  'legal.cancellation.s3.p':
    'Si no acude dentro de la franja horaria reservada (13:00–15:00 h), la reserva se considera consumida: no da derecho a reembolso ni a cambio de fecha.',
  'legal.cancellation.s4.h': 'Cómo gestionar su reserva',
  'legal.cancellation.s4.p':
    'Escríbanos indicando su localizador de reserva y le ayudaremos en lo que podamos.',
  'legal.cancellation.contact': 'Contacto para gestionar su reserva:',

  'legal.privacy.h1': 'Política de privacidad',
  'legal.legalnotice.h1': 'Aviso legal',

  // meta
  'meta.home.title': 'Fallas 2027 · Reserve su balcón en el Hotel Venecia y viva la mascletá — Plaza del Ayuntamiento, València',
  'meta.home.desc':
    'Reserve una habitación privada en el Hotel Venecia Plaza Centro para ver la mascletá de Fallas 2027 desde su propio balcón en la Plaza del Ayuntamiento. Snack Pack incluido.',
};

const en: Dict = {
  'nav.rooms': 'Rooms',
  'nav.mascletas': 'Mascletás',
  'nav.faq': 'FAQ',
  'nav.gallery': 'Gallery',
  'nav.contact': 'Contact',
  'nav.book': 'Book now',
  'nav.menu': 'Menu',
  'nav.close': 'Close menu',

  'fab.call.aria': 'Call the hotel',
  'fab.contact.aria': 'Contact by phone or WhatsApp',
  'fab.top.aria': 'Back to top',

  'footer.tagline': "On Plaza del Ayuntamiento, where the mascletás are set off.",
  'footer.mainsite': "Hotel's main website",
  'footer.terms': 'Booking terms',
  'footer.cancellation': 'Cancellation policy',
  'footer.privacy': 'Privacy',
  'footer.legalnotice': 'Legal notice',
  'footer.videoCredit': 'Video: Freakpyromaniacs (CC BY)',
  'footer.rights': 'All rights reserved.',

  'home.h1.pre': 'Experience the mascletá from your',
  'home.h1.accent': 'private balcony',
  'home.kicker': 'Plaza del Ayuntamiento. Your own balcony. The mascletá right in front of you.',
  'home.p1':
    'During Fallas, some of our rooms become private spaces for a few hours so you can enjoy the mascletá front row, away from the crowds and with all the hotel’s comforts.',
  'home.p2':
    'Every space is a real room at Hotel Venecia, with its usual furniture, a private bathroom, and a balcony or viewpoint over Plaza del Ayuntamiento.',
  'home.p3': 'Your booking also includes a Snack Pack to enjoy the experience.',
  'home.cta': 'See available rooms',
  'home.discover': 'Discover',
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
  'home.tradicion.photo.alt': 'Aerial view of a mascletá in Plaza del Ayuntamiento',

  'home.rooms.h2.pre': 'Choose your',
  'home.rooms.h2.accent': 'private balcony',
  'home.rooms.lead': 'Pick a date, room and number of guests. We take care of the rest.',
  'home.rooms.seeall': 'See all 9 rooms',

  'home.strip.schedule.t': 'Access hours',
  'home.strip.schedule.v': '1pm – 3pm',
  'home.strip.mascleta.t': 'Mascletá',
  'home.strip.mascleta.v': '2pm',
  'home.strip.private.t': 'Private space',
  'home.strip.private.v': 'Exclusively for your booking',
  'home.strip.snack.t': 'Snack Pack',
  'home.strip.snack.v': 'Included',

  'rooms.h1': 'Choose your balcony for the mascletá',
  'rooms.intro':
    "Experience Fallas from the front row. Private rooms with a balcony right onto the square and spectacular views so you don't miss a moment. Private bathroom, exclusive spaces, and all the excitement of Fallas right in front of you.",

  'mascletas.h1': 'Mascletá calendar',
  'mascletas.lead':
    'From 1 to 19 March 2027, every day at 2 pm on Plaza del Ayuntamiento.',
  'mascletas.march': 'March 2027',
  'mascletas.month': 'March',

  'gallery.h1': 'Photo gallery',
  'gallery.alt': 'Hotel Venecia Plaza Centro, photo {n}',
  'gallery.open': 'Enlarge photo {n}',
  'gallery.close': 'Close',
  'gallery.prev': 'Previous photo',
  'gallery.next': 'Next photo',

  'faq.h1': 'Frequently asked questions',
  'faq.q1': 'Which days can I book?',
  'faq.a1':
    'Any day from 1 to 12 March 2027. The room is booked by the hour, from 1pm to 3pm, to watch the 2pm mascletá.',
  'faq.q2': 'Do all the rooms have views of the mascletá?',
  'faq.a2':
    'Yes: all 9 rooms offered for Fallas have a balcony or viewpoint over Plaza del Ayuntamiento.',
  'faq.q3': "What's included in the Snack Pack?",
  'faq.a3':
    "It's included in the room price at no extra cost: crisps, mini fuet sausage, olives, nuts, 2 soft drinks or beers and 1 water per person.",
  'faq.q4': 'Can I cancel?',
  'faq.a4': 'See the {cancellationLink} for the Fallas dates.',

  'roomcard.title': 'Room {n}',
  'roomcard.capacity': 'Maximum capacity: {n} people',
  'roomcard.bath': 'Private bathroom',
  'roomcard.balcony': 'Balcony overlooking the mascletá',
  'roomcard.snack':
    'Snack Pack included: crisps, mini fuet sausage, olives, nuts, 2 soft drinks or beers and 1 water per person',
  'roomcard.hours': 'Available from {start} to {end}',
  'roomcard.private':
    'The room is booked in full and is exclusively for your group for the whole experience.',
  'roomcard.from': 'From',
  'roomcard.perperson': '/ person',
  'roomcard.book': 'Book room {n}',
  'roomcard.photopending': 'Photo coming soon',
  'roomcard.soldout.badge': 'Fully booked',
  'roomcard.soldout': 'No availability for these dates.',

  'book.h1': 'Book your balcony for the mascletá',
  'book.lead':
    'Pick the day and the room, then pay online: your booking is confirmed straight away.',

  'book.step.date': 'Date',
  'book.step.room': 'Room',
  'book.step.details': 'Your details',
  'book.step.done': 'Confirmation',

  'book.date.title': 'Which day do you want to experience the mascletá?',
  'book.date.date': 'Date',
  'book.date.guests': 'Guests',
  'book.date.guestsHint': 'The room price depends on the number of guests.',
  'book.date.window': 'Days from 1 to 12 March 2027. Access from {start} to {end}, mascletá at {mascleta}.',
  'book.date.submit': 'Check availability',
  'book.date.err.range': 'The date must fall between 1 and 12 March 2027.',
  'book.date.err.generic': 'Please check the date.',
  'book.date.legend.available': 'Available',
  'book.date.legend.full': 'Fully booked',
  'book.date.sold_out': 'No rooms left that day',

  'book.room.title': 'Choose a room',
  'book.room.number': 'Room {n}',
  'book.room.capacity': 'Up to {n} people',
  'book.room.price': '{price} / person',
  'book.room.select': 'Choose room',
  'book.room.selected': 'Chosen',
  'book.room.unavailable': 'Booked or being booked',
  'book.room.toosmall': "Doesn't fit {n} people",
  'book.room.none': 'No rooms left for that day.',
  'book.room.change': 'Choose a different room',
  'book.room.back': 'Change search',
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
  'book.details.submit': 'Continue to payment',
  'book.details.sending': 'Redirecting…',
  'book.details.err.fields': 'Please check the highlighted fields.',
  'book.details.err.consent': 'You must accept the terms to continue.',

  'book.err.availability': 'That room is no longer available: someone has just booked it or is paying for it right now. Pick another one or try again in a few minutes.',
  'book.err.service':
    "We couldn't reach the booking system. Try again in a few minutes or give us a call.",
  'book.err.generic': 'Something went wrong. Please try again.',
  'book.err.canceled': 'Payment was canceled. You can try again whenever you like.',

  'book.summary.title': 'Summary',
  'book.summary.date': 'Date',
  'book.summary.room': 'Room',
  'book.summary.guests': 'Guests',
  'book.summary.total': 'Total',
  'book.summary.empty': 'Choose the number of guests and a date to start.',
  'book.summary.pending': 'The next step is payment, by card or Bizum.',
  'book.summary.snack': 'Snack Pack included',

  'book.done.title': 'Booking confirmed!',
  'book.done.locator': 'Reference',
  'book.done.body.email': "We've emailed your confirmation to {email}. See you at the hotel on the day of your booking.",
  'book.done.demo': 'Demo mode: the booking was not saved (Airtable not connected yet).',
  'book.done.demo.payment': 'Demo mode: no real charge was made (no payment provider connected yet).',
  'book.done.home': 'Back to home',

  'book.meta.title': 'Book your balcony · Hotel Venecia Plaza Centro · Fallas 2027',
  'book.meta.desc':
    'Book your private balcony at Hotel Venecia Plaza Centro to watch the Fallas 2027 mascletá from Plaza del Ayuntamiento.',

  'legal.nav.aria': 'Other legal pages',
  'legal.home': 'Home',
  'legal.terms.h1': 'Booking terms',
  'legal.terms.intro':
    'These terms govern the booking of a private balcony to watch the Fallas 2027 mascletá at Hotel Venecia Plaza Centro. By completing payment through this website you accept the terms described below.',
  'legal.terms.s1.h': 'What the booking includes',
  'legal.terms.s1.p':
    'You are booking private use of one of the hotel’s 9 real rooms during the 13:00–15:00 window on the mascletá day you choose, with views over Plaza del Ayuntamiento and a Snack Pack included. This is not an overnight stay and does not include lodging.',
  'legal.terms.s2.h': 'Occupancy and price',
  'legal.terms.s2.p':
    'Each room takes up to 4 people. The price shown depends on the number of guests selected at the time of booking (2, 3 or 4) and is always calculated by the hotel, never entered by the guest.',
  'legal.terms.s3.h': 'Booking confirmation',
  'legal.terms.s3.p':
    'Your booking is confirmed the moment your online payment goes through. You can only book rooms the system shows as available at that instant: there is no prior request for the hotel to approve later.',
  'legal.terms.s4.h': 'Access on the day',
  'legal.terms.s4.p':
    'Please arrive at the hotel reception within your booked time window with a valid ID. Late arrival does not extend your remaining access time.',
  'legal.terms.s5.h': 'Changes and cancellations',
  'legal.terms.s5.p':
    'Change and cancellation terms, including the non-refundable nature of the amount paid, are detailed in our {cancellationLink}.',
  'legal.terms.s6.h': 'Circumstances beyond the hotel’s control',
  'legal.terms.s6.p':
    'The mascletá is organised by the Valencia City Council and may be affected by safety, weather or other causes beyond the hotel’s control. In that case the {cancellationLink} applies.',
  'legal.terms.s7.h': 'Use of the space',
  'legal.terms.s7.p':
    'The booked room is a real space of the hotel made available to you for the experience. Please take care of the furniture and facilities; the hotel may charge for damage caused during your access window.',
  'legal.terms.contact': 'Questions about these terms? Write to us:',

  'legal.cancellation.h1': 'Cancellation policy',
  'legal.cancellation.intro':
    'Before confirming your private balcony booking, please note this is a limited-availability experience for one specific day and time window.',
  'legal.cancellation.s1.h': 'Non-refundable payments',
  'legal.cancellation.s1.p':
    'The amount paid for your private balcony booking is non-refundable, regardless of the reason or notice given for the cancellation.',
  'legal.cancellation.s2.h': 'Fixed date and room',
  'legal.cancellation.s2.p':
    'Your private balcony is booked for the exact date and room you chose when confirming: no changes are possible afterwards. We ask you to choose carefully before booking, so that on the day of the mascletá everything is exactly as you pictured it.',
  'legal.cancellation.s3.h': 'If you don’t show up',
  'legal.cancellation.s3.p':
    'If you do not arrive within your booked time window (13:00–15:00), the booking is considered used: it does not entitle you to a refund or a date change.',
  'legal.cancellation.s4.h': 'Managing your booking',
  'legal.cancellation.s4.p': 'Write to us with your booking locator and we will help however we can.',
  'legal.cancellation.contact': 'Contact us to manage your booking:',

  'legal.privacy.h1': 'Privacy policy',
  'legal.legalnotice.h1': 'Legal notice',

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
