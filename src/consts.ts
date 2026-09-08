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

/** Ventana de venta: Fallas 2027 = mascletàs diarias del 1 al 19 de marzo. */
export const FALLAS = {
  year: 2027,
  saleStart: '2027-03-01', // primera noche reservable
  saleEnd: '2027-03-19',   // última noche (Cremà la noche del 19)
  mascletaTime: '14:00',
  mascletaPlace: 'Plaza del Ayuntamiento',
  minNights: 2, // TODO confirmar con el hotel
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
