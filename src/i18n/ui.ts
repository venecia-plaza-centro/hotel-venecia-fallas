import { DEFAULT_LOCALE, type Locale } from '../consts';

/**
 * Diccionario de textos de interfaz.
 * ES es la fuente de verdad. EN/IT/FR/DE traducidos y completos.
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
  'home.discover': 'Descúbralo',
  'home.tagline': 'Mascletás, más cerca que nunca',
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
  'book.closed.title': 'Las reservas aún no están abiertas',
  'book.closed.body': 'Muy pronto podrá reservar su balcón privado para la mascletá. Vuelva a visitarnos.',
  'book.closed.opens': 'Se abrirán el {date}.',
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
  'book.date.left': 'Quedan {n}',
  'book.date.left.one': 'Queda {n}',
  'book.date.room_taken': 'La habitación {n} ya está reservada ese día',

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
    'Su balcón privado queda reservado para la fecha y la habitación exactas que eligió al confirmar: no se admiten cambios posteriores.',
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
  'home.tagline': 'Mascletás, closer than ever',
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

  'book.closed.title': 'Bookings are not open yet',
  'book.closed.body': 'Very soon you will be able to book your private balcony for the mascletá. Please check back soon.',
  'book.closed.opens': 'Bookings open on {date}.',
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
  'book.date.left': 'Only {n} left',
  'book.date.left.one': 'Only {n} left',
  'book.date.room_taken': 'Room {n} is already booked that day',

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
    'Your private balcony is booked for the exact date and room you chose when confirming: no changes are possible afterwards.',
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

const it: Dict = {
  'nav.rooms': 'Camere',
  'nav.mascletas': 'Mascletás',
  'nav.faq': 'Domande frequenti',
  'nav.gallery': 'Galleria',
  'nav.contact': 'Contatto',
  'nav.book': 'Prenota',
  'nav.menu': 'Menu',
  'nav.close': 'Chiudi menu',

  'fab.call.aria': 'Chiama l’hotel',
  'fab.contact.aria': 'Contatta per telefono o WhatsApp',
  'fab.top.aria': 'Torna su',

  'footer.tagline': 'Nella Plaza del Ayuntamiento, dove scoppiano le mascletás.',
  'footer.mainsite': 'Sito principale dell’hotel',
  'footer.terms': 'Condizioni di prenotazione',
  'footer.cancellation': 'Politica di cancellazione',
  'footer.privacy': 'Privacy',
  'footer.legalnotice': 'Note legali',
  'footer.videoCredit': 'Video: Freakpyromaniacs (CC BY)',
  'footer.rights': 'Tutti i diritti riservati.',

  'home.h1.pre': 'Vivi la mascletá dal suo',
  'home.h1.accent': 'balcone privato',
  'home.kicker': 'La Plaza del Ayuntamiento. Il suo balcone. E la mascletá proprio davanti.',
  'home.p1':
    'Durante le Fallas, alcune delle nostre camere diventano per alcune ore spazi privati per godersi la mascletá in prima fila, senza folla e con tutte le comodità dell’hotel.',
  'home.p2':
    'Tutti gli spazi sono camere vere dell’Hotel Venecia, con il loro arredamento abituale, bagno privato e balcone o terrazzino con vista sulla Plaza del Ayuntamiento.',
  'home.p3': 'Inoltre, la sua prenotazione include uno Snack Pack per accompagnare l’esperienza.',
  'home.cta': 'Vedi camere disponibili',
  'home.discover': 'Scoprire',
  'home.tagline': 'Mascletás, più vicine che mai',
  'home.badge': 'Un’esperienza unica a Valencia',
  'home.photo.hero.alt': 'La mascletá vista da un balcone dell’Hotel Venecia',

  'home.feature1.t': 'Viste privilegiate',
  'home.feature1.d': 'Balcone o terrazzino sulla Plaza del Ayuntamiento',
  'home.feature2.t': 'Spazio privato',
  'home.feature2.d': 'Camere dell’hotel con il loro arredamento',
  'home.feature3.t': 'Bagno privato',
  'home.feature3.d': 'Tutte le camere dispongono di bagno proprio',
  'home.feature4.t': 'Snack Pack',
  'home.feature4.d': 'Incluso nella prenotazione per godersi l’esperienza',

  'home.tradicion.eyebrow': 'Una tradizione unica',
  'home.tradicion.h2.pre': 'Vivi l’essenza delle Fallas',
  'home.tradicion.h2.accent': 'dall’interno.',
  'home.tradicion.p1':
    'Dal 1 al 19 marzo, le nostre camere sono pronte per godersi la mascletá, con il loro balcone, senza folla e con tutte le comodità dell’hotel.',
  'home.tradicion.p2': 'Un modo diverso, comodo ed esclusivo di vivere la tradizione.',
  'home.tradicion.tagline': 'Valencia allo stato puro',
  'home.tradicion.photo.alt': 'Vista aerea di una mascletá nella Plaza del Ayuntamiento',

  'home.rooms.h2.pre': 'Scelga il suo',
  'home.rooms.h2.accent': 'balcone privato',
  'home.rooms.lead': 'Selezioni la data, la camera e il numero di persone. Al resto pensiamo noi.',
  'home.rooms.seeall': 'Vedi tutte le camere',

  'home.strip.schedule.t': 'Orario di accesso',
  'home.strip.schedule.v': '13:00 – 15:00',
  'home.strip.mascleta.t': 'Mascletá',
  'home.strip.mascleta.v': '14:00',
  'home.strip.private.t': 'Spazio privato',
  'home.strip.private.v': 'Solo per la sua prenotazione',
  'home.strip.snack.t': 'Snack Pack',
  'home.strip.snack.v': 'Incluso',

  'rooms.h1': 'Scelga il suo balcone per la mascletá',
  'rooms.intro':
    'Vivi le Fallas in prima fila. Camere private con balcone diretto sulla piazza e viste spettacolari per non perdere nemmeno un momento. Bagno privato, spazi esclusivi e tutta l’emozione delle Fallas proprio davanti a lei.',

  'mascletas.h1': 'Calendario delle mascletás',
  'mascletas.lead':
    'Dal 1 al 19 marzo 2027, tutti i giorni alle 14:00 nella Plaza del Ayuntamiento.',
  'mascletas.march': 'Marzo 2027',
  'mascletas.month': 'Marzo',

  'gallery.h1': 'Galleria',
  'gallery.alt': 'Hotel Venecia Plaza Centro, foto {n}',
  'gallery.open': 'Ingrandisci foto {n}',
  'gallery.close': 'Chiudi',
  'gallery.prev': 'Foto precedente',
  'gallery.next': 'Foto successiva',

  'faq.h1': 'Domande frequenti',
  'faq.q1': 'Quali giorni posso prenotare?',
  'faq.a1':
    'Qualsiasi giorno dal 1 al 12 marzo 2027. La camera si prenota a ore, dalle 13:00 alle 15:00, per vedere la mascletá delle 14:00.',
  'faq.q2': 'Tutte le camere hanno vista sulla mascletá?',
  'faq.a2':
    'Sì: le camere offerte per le Fallas hanno balcone con vista sulla Plaza del Ayuntamiento.',
  'faq.q3': 'Cosa include lo Snack Pack?',
  'faq.a3':
    'È incluso nel prezzo della camera, senza costo extra: patatine, mini fuet, olive, frutta secca, 2 bibite o birre e 1 acqua a persona.',
  'faq.q4': 'Posso cancellare?',
  'faq.a4': 'Consulti la {cancellationLink} per le date delle mascletás.',

  'roomcard.title': 'Camera {n}',
  'roomcard.capacity': 'Capacità massima: {n} persone',
  'roomcard.bath': 'Bagno privato',
  'roomcard.balcony': 'Balcone con vista sulla mascletá',
  'roomcard.snack':
    'Snack Pack incluso: patatine, mini fuet, olive, frutta secca, 2 bibite o birre e 1 acqua a persona',
  'roomcard.hours': 'Disponibile dalle {start} alle {end}',
  'roomcard.private':
    'La camera si prenota per intero e sarà a uso esclusivo del suo gruppo per tutta l’esperienza.',
  'roomcard.from': 'Da',
  'roomcard.perperson': '/ persona',
  'roomcard.book': 'Prenota camera {n}',
  'roomcard.photopending': 'Foto in arrivo',
  'roomcard.soldout.badge': 'Al completo',
  'roomcard.soldout': 'Non disponibile per queste date.',

  'book.closed.title': 'Le prenotazioni non sono ancora aperte',
  'book.closed.body': 'Molto presto potrà prenotare il suo balcone privato per la mascletá. Torni a trovarci.',
  'book.closed.opens': 'Apriranno il {date}.',
  'book.h1': 'Prenoti il suo balcone per la mascletá',
  'book.lead':
    'Scelga il giorno, la camera e paghi online: la sua prenotazione si conferma subito.',

  'book.step.date': 'Data',
  'book.step.room': 'Camera',
  'book.step.details': 'I suoi dati',
  'book.step.done': 'Conferma',

  'book.date.title': 'Che giorno vuole vivere la mascletá?',
  'book.date.date': 'Data',
  'book.date.guests': 'Persone',
  'book.date.guestsHint': 'Il prezzo della camera dipende dal numero di persone.',
  'book.date.window': 'Giorni dal 1 al 12 marzo 2027. Accesso dalle {start} alle {end}, mascletá alle {mascleta}.',
  'book.date.submit': 'Cerca disponibilità',
  'book.date.err.range': 'La data deve essere compresa tra il 1 e il 12 marzo 2027.',
  'book.date.err.generic': 'Controlli la data.',
  'book.date.legend.available': 'Disponibile',
  'book.date.legend.full': 'Al completo',
  'book.date.sold_out': 'Nessuna camera libera quel giorno',
  'book.date.left': 'Ne restano {n}',
  'book.date.left.one': 'Ne resta {n}',
  'book.date.room_taken': 'La camera {n} è già prenotata quel giorno',

  'book.room.title': 'Scelga la camera',
  'book.room.number': 'Camera {n}',
  'book.room.capacity': 'Fino a {n} persone',
  'book.room.price': '{price} / persona',
  'book.room.select': 'Scegli camera',
  'book.room.selected': 'Scelta',
  'book.room.unavailable': 'Prenotata o in fase di prenotazione',
  'book.room.toosmall': 'Non ammette {n} persone',
  'book.room.none': 'Non restano camere disponibili per quel giorno.',
  'book.room.change': 'Scegli un’altra camera',
  'book.room.back': 'Cambia dati',
  'book.room.next': 'Continua',

  'book.details.title': 'I suoi dati',
  'book.details.first': 'Nome',
  'book.details.last': 'Cognome',
  'book.details.email': 'Email',
  'book.details.phone': 'Telefono',
  'book.details.country': 'Paese (facoltativo)',
  'book.details.notes': 'Richieste (facoltativo)',
  'book.details.consent': 'Ho letto e accetto le {terms} e la {privacy}.',
  'book.details.consent.terms': 'condizioni di prenotazione',
  'book.details.consent.privacy': 'politica sulla privacy',
  'book.details.back': 'Indietro',
  'book.details.submit': 'Vai al pagamento',
  'book.details.sending': 'Reindirizzamento…',
  'book.details.err.fields': 'Controlli i campi segnalati.',
  'book.details.err.consent': 'Deve accettare le condizioni per continuare.',

  'book.err.availability': 'Quella camera non è più disponibile: qualcuno l’ha appena prenotata o la sta pagando in questo momento. Ne scelga un’altra o riprovi tra qualche minuto.',
  'book.err.service':
    'Non siamo riusciti a collegarci al sistema di prenotazione. Riprovi tra qualche minuto o ci chiami.',
  'book.err.generic': 'Qualcosa è andato storto. Riprovi.',
  'book.err.canceled': 'Il pagamento è stato annullato. Può riprovare quando vuole.',

  'book.summary.title': 'Riepilogo',
  'book.summary.date': 'Data',
  'book.summary.room': 'Camera',
  'book.summary.guests': 'Persone',
  'book.summary.total': 'Totale',
  'book.summary.empty': 'Scelga il numero di persone e una data per iniziare.',
  'book.summary.pending': 'Il passo successivo è il pagamento, con carta o Bizum.',
  'book.summary.snack': 'Snack Pack incluso',

  'book.done.title': 'Prenotazione confermata!',
  'book.done.locator': 'Codice prenotazione',
  'book.done.body.email':
    'Le abbiamo inviato la conferma a {email}. La aspettiamo in hotel il giorno della sua prenotazione.',
  'book.done.demo': 'Modalità demo: la prenotazione non è stata salvata (Airtable non ancora collegato).',
  'book.done.demo.payment': 'Modalità demo: non è stato effettuato nessun addebito reale (nessun sistema di pagamento collegato).',
  'book.done.home': 'Torna alla home',

  'book.meta.title': 'Prenota balcone · Hotel Venecia Plaza Centro · Fallas 2027',
  'book.meta.desc':
    'Prenoti il suo balcone privato all’Hotel Venecia Plaza Centro per vedere la mascletá delle Fallas 2027 dalla Plaza del Ayuntamiento.',

  'legal.nav.aria': 'Altre pagine legali',
  'legal.home': 'Home',
  'legal.terms.h1': 'Condizioni di prenotazione',
  'legal.terms.intro':
    'Queste condizioni regolano la prenotazione del balcone privato per la mascletá delle Fallas 2027 all’Hotel Venecia Plaza Centro. Completando il pagamento su questo sito accetta i termini descritti di seguito.',
  'legal.terms.s1.h': 'Cosa include la prenotazione',
  'legal.terms.s1.p':
    'Prenota l’uso privato di una delle 9 camere reali dell’hotel durante la fascia dalle 13:00 alle 15:00 del giorno di mascletá scelto, con vista sulla Plaza del Ayuntamiento e Snack Pack incluso. Non è una prenotazione di alloggio e non include il pernottamento.',
  'legal.terms.s2.h': 'Occupazione e prezzo',
  'legal.terms.s2.p':
    'Ogni camera ospita fino a 4 persone. Il prezzo mostrato dipende dal numero di ospiti indicato al momento della prenotazione (2, 3 o 4) ed è sempre calcolato dall’hotel, mai indicato dal cliente.',
  'legal.terms.s3.h': 'Conferma della prenotazione',
  'legal.terms.s3.p':
    'La sua prenotazione si conferma nel momento in cui si completa il pagamento online. Può prenotare solo le camere che il sistema mostra come disponibili in quell’istante: non c’è una richiesta preventiva che l’hotel debba approvare in seguito.',
  'legal.terms.s4.h': 'Accesso il giorno dell’esperienza',
  'legal.terms.s4.p':
    'Si presenti alla reception dell’hotel entro la fascia oraria prenotata, con un documento d’identità valido. In caso di ritardo, il tempo di accesso restante non viene esteso.',
  'legal.terms.s5.h': 'Modifiche e cancellazioni',
  'legal.terms.s5.p':
    'Le condizioni di modifica e cancellazione, incluso il carattere non rimborsabile dell’importo pagato, sono dettagliate nella nostra {cancellationLink}.',
  'legal.terms.s6.h': 'Circostanze indipendenti dall’hotel',
  'legal.terms.s6.p':
    'La mascletá è organizzata dal Comune di Valencia e può essere influenzata da motivi di sicurezza, meteorologici o di altro tipo indipendenti dall’hotel. In tal caso si applicherà quanto previsto nella {cancellationLink}.',
  'legal.terms.s7.h': 'Uso dello spazio',
  'legal.terms.s7.p':
    'La camera prenotata è uno spazio reale dell’hotel messo a sua disposizione durante l’esperienza. La preghiamo di avere cura dell’arredamento e delle strutture; l’hotel potrà addebitare il costo di eventuali danni causati durante la sua fascia di accesso.',
  'legal.terms.contact': 'Domande su queste condizioni? Ci scriva:',

  'legal.cancellation.h1': 'Politica di cancellazione',
  'legal.cancellation.intro':
    'Prima di confermare la prenotazione del balcone privato, tenga presente che si tratta di un’esperienza con posti limitati per un giorno e una fascia oraria specifici.',
  'legal.cancellation.s1.h': 'Pagamenti non rimborsabili',
  'legal.cancellation.s1.p':
    'L’importo pagato per la prenotazione del balcone privato non è rimborsabile, qualunque sia il motivo o il preavviso con cui si richiede la cancellazione.',
  'legal.cancellation.s2.h': 'Data e camera fisse',
  'legal.cancellation.s2.p':
    'Il suo balcone privato resta prenotato per la data e la camera esatte scelte al momento della conferma: non sono ammesse modifiche successive.',
  'legal.cancellation.s3.h': 'Se non si presenta',
  'legal.cancellation.s3.p':
    'Se non si presenta entro la fascia oraria prenotata (13:00–15:00), la prenotazione si considera utilizzata: non dà diritto a rimborso né a cambio data.',
  'legal.cancellation.s4.h': 'Come gestire la sua prenotazione',
  'legal.cancellation.s4.p': 'Ci scriva indicando il codice della sua prenotazione e la aiuteremo per quanto possibile.',
  'legal.cancellation.contact': 'Contatto per gestire la sua prenotazione:',

  'legal.privacy.h1': 'Informativa sulla privacy',
  'legal.legalnotice.h1': 'Note legali',

  'meta.home.title': 'Fallas 2027 · Prenoti il suo balcone all’Hotel Venecia e viva la mascletá — Plaza del Ayuntamiento, València',
  'meta.home.desc':
    'Prenoti una camera privata all’Hotel Venecia Plaza Centro per vedere la mascletá delle Fallas 2027 dal suo balcone sulla Plaza del Ayuntamiento. Snack Pack incluso.',
};

const fr: Dict = {
  'nav.rooms': 'Chambres',
  'nav.mascletas': 'Mascletás',
  'nav.faq': 'Questions fréquentes',
  'nav.gallery': 'Galerie',
  'nav.contact': 'Contact',
  'nav.book': 'Réserver',
  'nav.menu': 'Menu',
  'nav.close': 'Fermer le menu',

  'fab.call.aria': "Appeler l'hôtel",
  'fab.contact.aria': 'Contacter par téléphone ou WhatsApp',
  'fab.top.aria': 'Retour en haut',

  'footer.tagline': 'Sur la Plaza del Ayuntamiento, là où éclatent les mascletás.',
  'footer.mainsite': "Site principal de l'hôtel",
  'footer.terms': 'Conditions de réservation',
  'footer.cancellation': "Politique d'annulation",
  'footer.privacy': 'Confidentialité',
  'footer.legalnotice': 'Mentions légales',
  'footer.videoCredit': 'Vidéo : Freakpyromaniacs (CC BY)',
  'footer.rights': 'Tous droits réservés.',

  'home.h1.pre': 'Vivez la mascletá depuis votre',
  'home.h1.accent': 'balcon privé',
  'home.kicker': 'La Plaza del Ayuntamiento. Votre propre balcon. Et la mascletá juste devant.',
  'home.p1':
    'Pendant les Fallas, certaines de nos chambres deviennent, le temps de quelques heures, des espaces privés pour profiter de la mascletá aux premières loges, sans foule et avec tout le confort de l’hôtel.',
  'home.p2':
    "Chaque espace est une véritable chambre de l'Hôtel Venecia, avec son mobilier habituel, une salle de bain privée et un balcon ou un mirador avec vue sur la Plaza del Ayuntamiento.",
  'home.p3': 'Votre réservation inclut également un Snack Pack pour accompagner l’expérience.',
  'home.cta': 'Voir les chambres disponibles',
  'home.discover': 'Découvrir',
  'home.tagline': 'Les mascletás, plus proches que jamais',
  'home.badge': 'Une expérience unique à Valence',
  'home.photo.hero.alt': "La mascletá vue depuis un balcon de l'Hôtel Venecia",

  'home.feature1.t': 'Vue privilégiée',
  'home.feature1.d': 'Balcon ou mirador sur la Plaza del Ayuntamiento',
  'home.feature2.t': 'Espace privé',
  'home.feature2.d': "Chambres de l'hôtel avec leur mobilier habituel",
  'home.feature3.t': 'Salle de bain privée',
  'home.feature3.d': 'Toutes les chambres disposent de leur propre salle de bain',
  'home.feature4.t': 'Snack Pack',
  'home.feature4.d': 'Inclus dans votre réservation pour profiter de l’expérience',

  'home.tradicion.eyebrow': 'Une tradition unique',
  'home.tradicion.h2.pre': "Vivez l'essence des Fallas",
  'home.tradicion.h2.accent': "de l'intérieur.",
  'home.tradicion.p1':
    'Du 1er au 19 mars, nos chambres sont prêtes pour profiter de la mascletá, avec leur balcon, sans foule et avec tout le confort de l’hôtel.',
  'home.tradicion.p2': 'Une façon différente, confortable et exclusive de vivre la tradition.',
  'home.tradicion.tagline': 'Valence à l’état pur',
  'home.tradicion.photo.alt': 'Vue aérienne d’une mascletá sur la Plaza del Ayuntamiento',

  'home.rooms.h2.pre': 'Choisissez votre',
  'home.rooms.h2.accent': 'balcon privé',
  'home.rooms.lead': 'Sélectionnez la date, la chambre et le nombre de personnes. Nous nous occupons du reste.',
  'home.rooms.seeall': 'Voir toutes les chambres',

  'home.strip.schedule.t': "Horaire d'accès",
  'home.strip.schedule.v': '13h00 – 15h00',
  'home.strip.mascleta.t': 'Mascletá',
  'home.strip.mascleta.v': '14h00',
  'home.strip.private.t': 'Espace privé',
  'home.strip.private.v': 'Réservé exclusivement à votre groupe',
  'home.strip.snack.t': 'Snack Pack',
  'home.strip.snack.v': 'Inclus',

  'rooms.h1': 'Choisissez votre balcon pour la mascletá',
  'rooms.intro':
    'Vivez les Fallas aux premières loges. Chambres privées avec balcon donnant directement sur la place et des vues spectaculaires pour ne rien manquer. Salle de bain privée, espaces exclusifs et toute l’émotion des Fallas juste devant vous.',

  'mascletas.h1': 'Calendrier des mascletás',
  'mascletas.lead':
    'Du 1er au 19 mars 2027, tous les jours à 14h00 sur la Plaza del Ayuntamiento.',
  'mascletas.march': 'Mars 2027',
  'mascletas.month': 'Mars',

  'gallery.h1': 'Galerie',
  'gallery.alt': 'Hôtel Venecia Plaza Centro, photo {n}',
  'gallery.open': 'Agrandir la photo {n}',
  'gallery.close': 'Fermer',
  'gallery.prev': 'Photo précédente',
  'gallery.next': 'Photo suivante',

  'faq.h1': 'Questions fréquentes',
  'faq.q1': 'Quels jours puis-je réserver ?',
  'faq.a1':
    'N’importe quel jour du 1er au 12 mars 2027. La chambre se réserve par créneau horaire, de 13h00 à 15h00, pour voir la mascletá de 14h00.',
  'faq.q2': 'Toutes les chambres ont-elles vue sur la mascletá ?',
  'faq.a2':
    'Oui : les chambres proposées pour les Fallas ont un balcon avec vue sur la Plaza del Ayuntamiento.',
  'faq.q3': 'Que comprend le Snack Pack ?',
  'faq.a3':
    'Il est inclus dans le prix de la chambre, sans coût supplémentaire : chips, mini fuet, olives, fruits secs, 2 boissons ou bières et 1 eau par personne.',
  'faq.q4': 'Puis-je annuler ?',
  'faq.a4': 'Consultez notre {cancellationLink} pour les dates des mascletás.',

  'roomcard.title': 'Chambre {n}',
  'roomcard.capacity': 'Capacité maximale : {n} personnes',
  'roomcard.bath': 'Salle de bain privée',
  'roomcard.balcony': 'Balcon avec vue sur la mascletá',
  'roomcard.snack':
    'Snack Pack inclus : chips, mini fuet, olives, fruits secs, 2 boissons ou bières et 1 eau par personne',
  'roomcard.hours': 'Disponible de {start} à {end}',
  'roomcard.private':
    'La chambre se réserve en intégralité et sera réservée exclusivement à votre groupe pendant toute l’expérience.',
  'roomcard.from': 'À partir de',
  'roomcard.perperson': '/ personne',
  'roomcard.book': 'Réserver la chambre {n}',
  'roomcard.photopending': 'Photo à venir',
  'roomcard.soldout.badge': 'Complet',
  'roomcard.soldout': 'Aucune disponibilité pour ces dates.',

  'book.closed.title': 'Les réservations ne sont pas encore ouvertes',
  'book.closed.body': 'Très bientôt vous pourrez réserver votre balcon privé pour la mascletá. Revenez nous voir.',
  'book.closed.opens': 'Ouverture le {date}.',
  'book.h1': 'Réservez votre balcon pour la mascletá',
  'book.lead':
    'Choisissez le jour et la chambre, puis payez en ligne : votre réservation est confirmée immédiatement.',

  'book.step.date': 'Date',
  'book.step.room': 'Chambre',
  'book.step.details': 'Vos coordonnées',
  'book.step.done': 'Confirmation',

  'book.date.title': 'Quel jour voulez-vous vivre la mascletá ?',
  'book.date.date': 'Date',
  'book.date.guests': 'Personnes',
  'book.date.guestsHint': 'Le prix de la chambre dépend du nombre de personnes.',
  'book.date.window': 'Du 1er au 12 mars 2027. Accès de {start} à {end}, mascletá à {mascleta}.',
  'book.date.submit': 'Vérifier les disponibilités',
  'book.date.err.range': 'La date doit être comprise entre le 1er et le 12 mars 2027.',
  'book.date.err.generic': 'Veuillez vérifier la date.',
  'book.date.legend.available': 'Disponible',
  'book.date.legend.full': 'Complet',
  'book.date.sold_out': 'Aucune chambre libre ce jour-là',
  'book.date.left': 'Il en reste {n}',
  'book.date.left.one': 'Il en reste {n}',
  'book.date.room_taken': 'La chambre {n} est déjà réservée ce jour-là',

  'book.room.title': 'Choisissez une chambre',
  'book.room.number': 'Chambre {n}',
  'book.room.capacity': "Jusqu'à {n} personnes",
  'book.room.price': '{price} / personne',
  'book.room.select': 'Choisir la chambre',
  'book.room.selected': 'Choisie',
  'book.room.unavailable': 'Réservée ou en cours de réservation',
  'book.room.toosmall': "N'accueille pas {n} personnes",
  'book.room.none': 'Aucune chambre disponible pour ce jour-là.',
  'book.room.change': 'Choisir une autre chambre',
  'book.room.back': 'Modifier les critères',
  'book.room.next': 'Continuer',

  'book.details.title': 'Vos coordonnées',
  'book.details.first': 'Prénom',
  'book.details.last': 'Nom',
  'book.details.email': 'Email',
  'book.details.phone': 'Téléphone',
  'book.details.country': 'Pays (facultatif)',
  'book.details.notes': 'Demandes particulières (facultatif)',
  'book.details.consent': "J'ai lu et j'accepte les {terms} et la {privacy}.",
  'book.details.consent.terms': 'conditions de réservation',
  'book.details.consent.privacy': 'politique de confidentialité',
  'book.details.back': 'Retour',
  'book.details.submit': 'Passer au paiement',
  'book.details.sending': 'Redirection…',
  'book.details.err.fields': 'Veuillez vérifier les champs signalés.',
  'book.details.err.consent': "Vous devez accepter les conditions pour continuer.",

  'book.err.availability': "Cette chambre n'est plus disponible : quelqu'un vient de la réserver ou est en train de la payer. Choisissez-en une autre ou réessayez dans quelques minutes.",
  'book.err.service':
    "Nous n'avons pas pu joindre le système de réservation. Réessayez dans quelques minutes ou appelez-nous.",
  'book.err.generic': "Une erreur s'est produite. Veuillez réessayer.",
  'book.err.canceled': 'Le paiement a été annulé. Vous pouvez réessayer quand vous le souhaitez.',

  'book.summary.title': 'Récapitulatif',
  'book.summary.date': 'Date',
  'book.summary.room': 'Chambre',
  'book.summary.guests': 'Personnes',
  'book.summary.total': 'Total',
  'book.summary.empty': 'Choisissez le nombre de personnes et une date pour commencer.',
  'book.summary.pending': "L'étape suivante est le paiement, par carte ou Bizum.",
  'book.summary.snack': 'Snack Pack inclus',

  'book.done.title': 'Réservation confirmée !',
  'book.done.locator': 'Numéro de réservation',
  'book.done.body.email':
    'Nous avons envoyé votre confirmation à {email}. Nous vous attendons à l’hôtel le jour de votre réservation.',
  'book.done.demo': "Mode démo : la réservation n'a pas été enregistrée (Airtable non encore connecté).",
  'book.done.demo.payment': "Mode démo : aucun paiement réel n'a été effectué (aucune passerelle de paiement connectée).",
  'book.done.home': "Retour à l'accueil",

  'book.meta.title': 'Réserver un balcon · Hôtel Venecia Plaza Centro · Fallas 2027',
  'book.meta.desc':
    'Réservez votre balcon privé à l’Hôtel Venecia Plaza Centro pour voir la mascletá des Fallas 2027 depuis la Plaza del Ayuntamiento.',

  'legal.nav.aria': 'Autres pages légales',
  'legal.home': 'Accueil',
  'legal.terms.h1': 'Conditions de réservation',
  'legal.terms.intro':
    'Ces conditions régissent la réservation d’un balcon privé pour la mascletá des Fallas 2027 à l’Hôtel Venecia Plaza Centro. En effectuant le paiement depuis ce site, vous acceptez les conditions décrites ci-dessous.',
  'legal.terms.s1.h': 'Ce qu’inclut la réservation',
  'legal.terms.s1.p':
    'Vous réservez l’usage privé de l’une des 9 chambres réelles de l’hôtel pendant la plage 13h00-15h00 le jour de mascletá choisi, avec vue sur la Plaza del Ayuntamiento et Snack Pack inclus. Il ne s’agit pas d’une réservation d’hébergement et cela n’inclut pas de nuitée.',
  'legal.terms.s2.h': 'Occupation et prix',
  'legal.terms.s2.p':
    'Chaque chambre accueille jusqu’à 4 personnes. Le prix affiché dépend du nombre de personnes indiqué au moment de la réservation (2, 3 ou 4) et est toujours calculé par l’hôtel, jamais saisi par le client.',
  'legal.terms.s3.h': 'Confirmation de la réservation',
  'legal.terms.s3.p':
    'Votre réservation est confirmée dès que le paiement en ligne est effectué. Vous ne pouvez réserver que les chambres affichées comme disponibles par le système à cet instant précis : il n’y a pas de demande préalable que l’hôtel devrait approuver ultérieurement.',
  'legal.terms.s4.h': "Accès le jour de l'expérience",
  'legal.terms.s4.p':
    'Merci de vous présenter à la réception de l’hôtel dans la plage horaire réservée, muni d’une pièce d’identité valide. En cas de retard, le temps d’accès restant n’est pas prolongé.',
  'legal.terms.s5.h': 'Modifications et annulations',
  'legal.terms.s5.p':
    'Les conditions de modification et d’annulation, y compris le caractère non remboursable du montant versé, sont détaillées dans notre {cancellationLink}.',
  'legal.terms.s6.h': "Circonstances indépendantes de l'hôtel",
  'legal.terms.s6.p':
    "La mascletá est organisée par la mairie de Valence et peut être affectée par des raisons de sécurité, météorologiques ou autres, indépendantes de la volonté de l'hôtel. Dans ce cas, la {cancellationLink} s’applique.",
  'legal.terms.s7.h': "Utilisation de l'espace",
  'legal.terms.s7.p':
    'La chambre réservée est un véritable espace de l’hôtel mis à votre disposition pendant l’expérience. Nous vous demandons de prendre soin du mobilier et des installations ; l’hôtel pourra facturer le coût des dommages causés pendant votre créneau d’accès.',
  'legal.terms.contact': 'Des questions sur ces conditions ? Écrivez-nous :',

  'legal.cancellation.h1': "Politique d'annulation",
  'legal.cancellation.intro':
    'Avant de confirmer votre réservation de balcon privé, veuillez noter qu’il s’agit d’une expérience à places limitées, pour un jour et un créneau horaire précis.',
  'legal.cancellation.s1.h': 'Paiements non remboursables',
  'legal.cancellation.s1.p':
    "Le montant versé pour la réservation de votre balcon privé n'est pas remboursable, quel que soit le motif ou le délai de la demande d’annulation.",
  'legal.cancellation.s2.h': 'Date et chambre fixes',
  'legal.cancellation.s2.p':
    "Votre balcon privé est réservé pour la date et la chambre exactes choisies lors de la confirmation : aucune modification n'est possible par la suite.",
  'legal.cancellation.s3.h': 'En cas de non-présentation',
  'legal.cancellation.s3.p':
    "Si vous ne vous présentez pas dans le créneau horaire réservé (13h00-15h00), la réservation est considérée comme utilisée : elle n'ouvre droit ni à un remboursement ni à un changement de date.",
  'legal.cancellation.s4.h': 'Gérer votre réservation',
  'legal.cancellation.s4.p': 'Écrivez-nous en indiquant votre numéro de réservation, nous vous aiderons du mieux possible.',
  'legal.cancellation.contact': 'Contact pour gérer votre réservation :',

  'legal.privacy.h1': 'Politique de confidentialité',
  'legal.legalnotice.h1': 'Mentions légales',

  'meta.home.title': 'Fallas 2027 · Réservez votre balcon à l’Hôtel Venecia et vivez la mascletá — Plaza del Ayuntamiento, Valence',
  'meta.home.desc':
    'Réservez une chambre privée à l’Hôtel Venecia Plaza Centro pour voir la mascletá des Fallas 2027 depuis votre propre balcon sur la Plaza del Ayuntamiento. Snack Pack inclus.',
};

const de: Dict = {
  'nav.rooms': 'Zimmer',
  'nav.mascletas': 'Mascletás',
  'nav.faq': 'Häufige Fragen',
  'nav.gallery': 'Galerie',
  'nav.contact': 'Kontakt',
  'nav.book': 'Jetzt buchen',
  'nav.menu': 'Menü',
  'nav.close': 'Menü schließen',

  'fab.call.aria': 'Hotel anrufen',
  'fab.contact.aria': 'Per Telefon oder WhatsApp kontaktieren',
  'fab.top.aria': 'Nach oben',

  'footer.tagline': 'An der Plaza del Ayuntamiento, wo die Mascletás gezündet werden.',
  'footer.mainsite': 'Hauptwebsite des Hotels',
  'footer.terms': 'Buchungsbedingungen',
  'footer.cancellation': 'Stornierungsbedingungen',
  'footer.privacy': 'Datenschutz',
  'footer.legalnotice': 'Impressum',
  'footer.videoCredit': 'Video: Freakpyromaniacs (CC BY)',
  'footer.rights': 'Alle Rechte vorbehalten.',

  'home.h1.pre': 'Erleben Sie die Mascletá von Ihrem',
  'home.h1.accent': 'privaten Balkon',
  'home.kicker': 'Die Plaza del Ayuntamiento. Ihr eigener Balkon. Und die Mascletá direkt vor Ihnen.',
  'home.p1':
    'Während der Fallas werden einige unserer Zimmer für ein paar Stunden zu privaten Räumen, in denen Sie die Mascletá hautnah erleben können, ohne Gedränge und mit dem gesamten Komfort des Hotels.',
  'home.p2':
    'Jeder dieser Räume ist ein echtes Zimmer des Hotel Venecia mit seiner üblichen Einrichtung, eigenem Bad und Balkon oder Erker mit Blick auf die Plaza del Ayuntamiento.',
  'home.p3': 'Ihre Buchung beinhaltet außerdem ein Snack Pack, um das Erlebnis zu begleiten.',
  'home.cta': 'Verfügbare Zimmer ansehen',
  'home.discover': 'Entdecken',
  'home.tagline': 'Mascletás, näher als je zuvor',
  'home.badge': 'Ein einzigartiges Erlebnis in Valencia',
  'home.photo.hero.alt': 'Die Mascletá, gesehen von einem Balkon des Hotel Venecia',

  'home.feature1.t': 'Privilegierte Aussicht',
  'home.feature1.d': 'Balkon oder Erker mit Blick auf die Plaza del Ayuntamiento',
  'home.feature2.t': 'Privater Raum',
  'home.feature2.d': 'Echte Hotelzimmer mit ihrer üblichen Einrichtung',
  'home.feature3.t': 'Eigenes Bad',
  'home.feature3.d': 'Alle Zimmer verfügen über ein eigenes Bad',
  'home.feature4.t': 'Snack Pack',
  'home.feature4.d': 'In der Buchung inbegriffen, um das Erlebnis zu genießen',

  'home.tradicion.eyebrow': 'Eine einzigartige Tradition',
  'home.tradicion.h2.pre': 'Erleben Sie die Essenz der Fallas',
  'home.tradicion.h2.accent': 'von innen.',
  'home.tradicion.p1':
    'Vom 1. bis 19. März stehen unsere Zimmer bereit, um die Mascletá zu genießen, mit eigenem Balkon, ohne Gedränge und mit dem gesamten Komfort des Hotels.',
  'home.tradicion.p2': 'Eine andere, komfortable und exklusive Art, die Tradition zu erleben.',
  'home.tradicion.tagline': 'Valencia pur',
  'home.tradicion.photo.alt': 'Luftaufnahme einer Mascletá auf der Plaza del Ayuntamiento',

  'home.rooms.h2.pre': 'Wählen Sie Ihren',
  'home.rooms.h2.accent': 'privaten Balkon',
  'home.rooms.lead': 'Wählen Sie Datum, Zimmer und Personenzahl. Um den Rest kümmern wir uns.',
  'home.rooms.seeall': 'Alle Zimmer ansehen',

  'home.strip.schedule.t': 'Zugangszeiten',
  'home.strip.schedule.v': '13:00 – 15:00 Uhr',
  'home.strip.mascleta.t': 'Mascletá',
  'home.strip.mascleta.v': '14:00 Uhr',
  'home.strip.private.t': 'Privater Raum',
  'home.strip.private.v': 'Exklusiv für Ihre Buchung',
  'home.strip.snack.t': 'Snack Pack',
  'home.strip.snack.v': 'Inbegriffen',

  'rooms.h1': 'Wählen Sie Ihren Balkon für die Mascletá',
  'rooms.intro':
    'Erleben Sie die Fallas hautnah. Private Zimmer mit Balkon direkt zum Platz und spektakulärem Blick, damit Ihnen kein Moment entgeht. Eigenes Bad, exklusive Räume und die ganze Emotion der Fallas direkt vor Ihnen.',

  'mascletas.h1': 'Mascletá-Kalender',
  'mascletas.lead':
    'Vom 1. bis 19. März 2027, täglich um 14:00 Uhr auf der Plaza del Ayuntamiento.',
  'mascletas.march': 'März 2027',
  'mascletas.month': 'März',

  'gallery.h1': 'Galerie',
  'gallery.alt': 'Hotel Venecia Plaza Centro, Foto {n}',
  'gallery.open': 'Foto {n} vergrößern',
  'gallery.close': 'Schließen',
  'gallery.prev': 'Vorheriges Foto',
  'gallery.next': 'Nächstes Foto',

  'faq.h1': 'Häufige Fragen',
  'faq.q1': 'An welchen Tagen kann ich buchen?',
  'faq.a1':
    'An jedem Tag vom 1. bis 12. März 2027. Das Zimmer wird stundenweise gebucht, von 13:00 bis 15:00 Uhr, um die Mascletá um 14:00 Uhr zu erleben.',
  'faq.q2': 'Haben alle Zimmer Blick auf die Mascletá?',
  'faq.a2':
    'Ja: Alle für die Fallas angebotenen Zimmer haben einen Balkon mit Blick auf die Plaza del Ayuntamiento.',
  'faq.q3': 'Was ist im Snack Pack enthalten?',
  'faq.a3':
    'Es ist im Zimmerpreis inbegriffen, ohne Aufpreis: Kartoffelchips, Mini-Fuet-Wurst, Oliven, Nüsse, 2 Erfrischungsgetränke oder Biere und 1 Wasser pro Person.',
  'faq.q4': 'Kann ich stornieren?',
  'faq.a4': 'Informationen dazu finden Sie in unserer {cancellationLink} zu den Mascletá-Terminen.',

  'roomcard.title': 'Zimmer {n}',
  'roomcard.capacity': 'Maximale Kapazität: {n} Personen',
  'roomcard.bath': 'Eigenes Bad',
  'roomcard.balcony': 'Balkon mit Blick auf die Mascletá',
  'roomcard.snack':
    'Snack Pack inbegriffen: Kartoffelchips, Mini-Fuet-Wurst, Oliven, Nüsse, 2 Erfrischungsgetränke oder Biere und 1 Wasser pro Person',
  'roomcard.hours': 'Verfügbar von {start} bis {end} Uhr',
  'roomcard.private':
    'Das Zimmer wird vollständig gebucht und steht während des gesamten Erlebnisses ausschließlich Ihrer Gruppe zur Verfügung.',
  'roomcard.from': 'Ab',
  'roomcard.perperson': '/ Person',
  'roomcard.book': 'Zimmer {n} buchen',
  'roomcard.photopending': 'Foto folgt',
  'roomcard.soldout.badge': 'Ausgebucht',
  'roomcard.soldout': 'Für diese Termine nicht verfügbar.',

  'book.closed.title': 'Buchungen sind noch nicht geöffnet',
  'book.closed.body': 'Schon bald können Sie Ihren privaten Balkon für die Mascletá buchen. Schauen Sie bald wieder vorbei.',
  'book.closed.opens': 'Öffnet am {date}.',
  'book.h1': 'Buchen Sie Ihren Balkon für die Mascletá',
  'book.lead':
    'Wählen Sie Tag und Zimmer und zahlen Sie online: Ihre Buchung wird sofort bestätigt.',

  'book.step.date': 'Datum',
  'book.step.room': 'Zimmer',
  'book.step.details': 'Ihre Daten',
  'book.step.done': 'Bestätigung',

  'book.date.title': 'An welchem Tag möchten Sie die Mascletá erleben?',
  'book.date.date': 'Datum',
  'book.date.guests': 'Personen',
  'book.date.guestsHint': 'Der Zimmerpreis richtet sich nach der Personenzahl.',
  'book.date.window': 'Tage vom 1. bis 12. März 2027. Zugang von {start} bis {end} Uhr, Mascletá um {mascleta} Uhr.',
  'book.date.submit': 'Verfügbarkeit prüfen',
  'book.date.err.range': 'Das Datum muss zwischen dem 1. und 12. März 2027 liegen.',
  'book.date.err.generic': 'Bitte überprüfen Sie das Datum.',
  'book.date.legend.available': 'Verfügbar',
  'book.date.legend.full': 'Ausgebucht',
  'book.date.sold_out': 'An diesem Tag keine Zimmer mehr frei',
  'book.date.left': 'Noch {n} übrig',
  'book.date.left.one': 'Noch {n} übrig',
  'book.date.room_taken': 'Zimmer {n} ist an diesem Tag bereits gebucht',

  'book.room.title': 'Zimmer wählen',
  'book.room.number': 'Zimmer {n}',
  'book.room.capacity': 'Bis zu {n} Personen',
  'book.room.price': '{price} / Person',
  'book.room.select': 'Zimmer wählen',
  'book.room.selected': 'Ausgewählt',
  'book.room.unavailable': 'Gebucht oder wird gerade gebucht',
  'book.room.toosmall': 'Nicht geeignet für {n} Personen',
  'book.room.none': 'An diesem Tag sind keine Zimmer mehr verfügbar.',
  'book.room.change': 'Anderes Zimmer wählen',
  'book.room.back': 'Angaben ändern',
  'book.room.next': 'Weiter',

  'book.details.title': 'Ihre Daten',
  'book.details.first': 'Vorname',
  'book.details.last': 'Nachname',
  'book.details.email': 'E-Mail',
  'book.details.phone': 'Telefon',
  'book.details.country': 'Land (optional)',
  'book.details.notes': 'Wünsche (optional)',
  'book.details.consent': 'Ich habe die {terms} und die {privacy} gelesen und akzeptiere sie.',
  'book.details.consent.terms': 'Buchungsbedingungen',
  'book.details.consent.privacy': 'Datenschutzerklärung',
  'book.details.back': 'Zurück',
  'book.details.submit': 'Weiter zur Zahlung',
  'book.details.sending': 'Weiterleitung…',
  'book.details.err.fields': 'Bitte überprüfen Sie die markierten Felder.',
  'book.details.err.consent': 'Sie müssen die Bedingungen akzeptieren, um fortzufahren.',

  'book.err.availability': 'Dieses Zimmer ist nicht mehr verfügbar: Jemand hat es gerade gebucht oder bezahlt es gerade. Wählen Sie ein anderes oder versuchen Sie es in ein paar Minuten erneut.',
  'book.err.service':
    'Wir konnten keine Verbindung zum Buchungssystem herstellen. Versuchen Sie es in ein paar Minuten erneut oder rufen Sie uns an.',
  'book.err.generic': 'Etwas ist schiefgelaufen. Bitte versuchen Sie es erneut.',
  'book.err.canceled': 'Die Zahlung wurde abgebrochen. Sie können es jederzeit erneut versuchen.',

  'book.summary.title': 'Zusammenfassung',
  'book.summary.date': 'Datum',
  'book.summary.room': 'Zimmer',
  'book.summary.guests': 'Personen',
  'book.summary.total': 'Gesamt',
  'book.summary.empty': 'Wählen Sie die Personenzahl und ein Datum, um zu beginnen.',
  'book.summary.pending': 'Der nächste Schritt ist die Zahlung, per Karte oder Bizum.',
  'book.summary.snack': 'Snack Pack inbegriffen',

  'book.done.title': 'Buchung bestätigt!',
  'book.done.locator': 'Buchungsnummer',
  'book.done.body.email':
    'Wir haben Ihnen die Bestätigung an {email} gesendet. Wir erwarten Sie am Tag Ihrer Buchung im Hotel.',
  'book.done.demo': 'Demomodus: Die Buchung wurde nicht gespeichert (Airtable noch nicht verbunden).',
  'book.done.demo.payment': 'Demomodus: Es wurde keine echte Zahlung vorgenommen (kein Zahlungsanbieter verbunden).',
  'book.done.home': 'Zurück zur Startseite',

  'book.meta.title': 'Balkon buchen · Hotel Venecia Plaza Centro · Fallas 2027',
  'book.meta.desc':
    'Buchen Sie Ihren privaten Balkon im Hotel Venecia Plaza Centro, um die Mascletá der Fallas 2027 von der Plaza del Ayuntamiento aus zu erleben.',

  'legal.nav.aria': 'Weitere rechtliche Seiten',
  'legal.home': 'Startseite',
  'legal.terms.h1': 'Buchungsbedingungen',
  'legal.terms.intro':
    'Diese Bedingungen regeln die Buchung eines privaten Balkons für die Mascletá der Fallas 2027 im Hotel Venecia Plaza Centro. Mit Abschluss der Zahlung auf dieser Website akzeptieren Sie die im Folgenden beschriebenen Bedingungen.',
  'legal.terms.s1.h': 'Was die Buchung beinhaltet',
  'legal.terms.s1.p':
    'Sie buchen die private Nutzung eines der 9 echten Zimmer des Hotels während des Zeitfensters von 13:00 bis 15:00 Uhr am gewählten Mascletá-Tag, mit Blick auf die Plaza del Ayuntamiento und inklusive Snack Pack. Es handelt sich nicht um eine Übernachtungsbuchung.',
  'legal.terms.s2.h': 'Belegung und Preis',
  'legal.terms.s2.p':
    'Jedes Zimmer fasst bis zu 4 Personen. Der angezeigte Preis richtet sich nach der bei der Buchung angegebenen Personenzahl (2, 3 oder 4) und wird stets vom Hotel berechnet, niemals vom Gast selbst eingegeben.',
  'legal.terms.s3.h': 'Buchungsbestätigung',
  'legal.terms.s3.p':
    'Ihre Buchung wird in dem Moment bestätigt, in dem die Online-Zahlung abgeschlossen ist. Sie können nur Zimmer buchen, die das System in diesem Augenblick als verfügbar anzeigt: Es gibt keine vorherige Anfrage, die das Hotel später genehmigen müsste.',
  'legal.terms.s4.h': 'Zugang am Tag des Erlebnisses',
  'legal.terms.s4.p':
    'Bitte melden Sie sich innerhalb des gebuchten Zeitfensters mit einem gültigen Ausweisdokument an der Rezeption des Hotels. Bei verspätetem Erscheinen verlängert sich die verbleibende Zugangszeit nicht.',
  'legal.terms.s5.h': 'Änderungen und Stornierungen',
  'legal.terms.s5.p':
    'Die Bedingungen für Änderungen und Stornierungen, einschließlich der Nicht-Erstattung des gezahlten Betrags, sind in unserer {cancellationLink} aufgeführt.',
  'legal.terms.s6.h': 'Umstände außerhalb der Kontrolle des Hotels',
  'legal.terms.s6.p':
    'Die Mascletá wird vom Stadtrat von Valencia organisiert und kann durch Sicherheits-, Wetter- oder andere Gründe außerhalb der Kontrolle des Hotels beeinträchtigt werden. In diesem Fall gilt das in der {cancellationLink} Festgelegte.',
  'legal.terms.s7.h': 'Nutzung des Raums',
  'legal.terms.s7.p':
    'Das gebuchte Zimmer ist ein echter Raum des Hotels, der Ihnen für das Erlebnis zur Verfügung gestellt wird. Wir bitten Sie, mit Mobiliar und Einrichtungen sorgsam umzugehen; das Hotel kann die Kosten für während Ihres Zugangsfensters verursachte Schäden in Rechnung stellen.',
  'legal.terms.contact': 'Fragen zu diesen Bedingungen? Schreiben Sie uns:',

  'legal.cancellation.h1': 'Stornierungsbedingungen',
  'legal.cancellation.intro':
    'Bevor Sie Ihre Buchung für den privaten Balkon bestätigen, beachten Sie bitte, dass es sich um ein Erlebnis mit begrenzten Plätzen für einen bestimmten Tag und ein bestimmtes Zeitfenster handelt.',
  'legal.cancellation.s1.h': 'Nicht erstattungsfähige Zahlungen',
  'legal.cancellation.s1.p':
    'Der für die Buchung Ihres privaten Balkons gezahlte Betrag wird unabhängig vom Grund oder der Frist der Stornierung nicht erstattet.',
  'legal.cancellation.s2.h': 'Festes Datum und festes Zimmer',
  'legal.cancellation.s2.p':
    'Ihr privater Balkon ist für das genaue Datum und Zimmer gebucht, das Sie bei der Bestätigung gewählt haben: Nachträgliche Änderungen sind nicht möglich.',
  'legal.cancellation.s3.h': 'Bei Nichterscheinen',
  'legal.cancellation.s3.p':
    'Wenn Sie nicht innerhalb des gebuchten Zeitfensters (13:00–15:00 Uhr) erscheinen, gilt die Buchung als verbraucht: Es besteht kein Anspruch auf Erstattung oder Terminänderung.',
  'legal.cancellation.s4.h': 'Verwaltung Ihrer Buchung',
  'legal.cancellation.s4.p': 'Schreiben Sie uns unter Angabe Ihrer Buchungsnummer, und wir helfen Ihnen so gut wir können.',
  'legal.cancellation.contact': 'Kontakt zur Verwaltung Ihrer Buchung:',

  'legal.privacy.h1': 'Datenschutzerklärung',
  'legal.legalnotice.h1': 'Impressum',

  'meta.home.title': 'Fallas 2027 · Buchen Sie Ihren Balkon im Hotel Venecia und erleben Sie die Mascletá — Plaza del Ayuntamiento, València',
  'meta.home.desc':
    'Buchen Sie ein privates Zimmer im Hotel Venecia Plaza Centro, um die Mascletá der Fallas 2027 von Ihrem eigenen Balkon auf der Plaza del Ayuntamiento aus zu erleben. Snack Pack inbegriffen.',
};

const DICTS: Record<Locale, Dict> = {
  es,
  en,
  it,
  fr,
  de,
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
