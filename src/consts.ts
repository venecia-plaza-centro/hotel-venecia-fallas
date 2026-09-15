/** Configuración global de la microweb de Fallas. */

export const SITE = {
  name: 'Hotel Venecia Plaza Centro',
  origin: 'https://fallas.hotelvenecia.com',
  mainSite: 'https://hotelvenecia.com',
  phone: '+34 963 52 42 67',
  phoneHref: 'tel:+34963524267',
  whatsapp: '+34 691 20 17 17',
  whatsappHref: 'https://wa.me/34691201717',
  email: 'reservas@hotelvenecia.com',
  address: 'Plaza del Ayuntamiento, 3 · 46002 València',
} as const;

/**
 * Ventana de venta de estas 9 habitaciones: del 1 al 12 de marzo de 2027
 * (subconjunto de las mascletás de Fallas, que siguen hasta el 19).
 * No es una reserva de noches: cada habitación se alquila por horas el día
 * elegido, como espacio privado para ver la mascletá desde el balcón.
 */
export const FALLAS = {
  year: 2027,
  saleStart: '2027-03-01', // primer día reservable
  saleEnd: '2027-03-12',   // último día reservable para estas habitaciones
  mascletaTime: '14:00',
  mascletaPlace: 'Plaza del Ayuntamiento',
  accessStart: '13:00', // apertura del espacio privado
  accessEnd: '15:00',   // cierre
  totalRooms: 9, // nº real de habitaciones que se ofrecen para Fallas (confirmado por el hotel)
} as const;

export const LOCALES = ['es', 'en', 'it', 'fr', 'de'] as const;
export type Locale = (typeof LOCALES)[number];
export const DEFAULT_LOCALE: Locale = 'es';

export const LOCALE_NAMES: Record<Locale, string> = {
  es: 'Español',
  en: 'English',
  it: 'Italiano',
  fr: 'Français',
  de: 'Deutsch',
};

export const OG_LOCALE: Record<Locale, string> = {
  es: 'es_ES',
  en: 'en_GB',
  it: 'it_IT',
  fr: 'fr_FR',
  de: 'de_DE',
};
