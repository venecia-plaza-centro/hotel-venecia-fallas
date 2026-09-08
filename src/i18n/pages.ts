import type { Locale } from '../consts';

/**
 * Manifiesto de páginas: id + slug localizado por idioma + a qué entrada de
 * navegación pertenece. Igual filosofía que el build.mjs de la web principal.
 * slug '' = home. El generador ([...slug].astro) crea, por cada página y cada
 * idioma, la URL correcta (ES en la raíz, resto con prefijo /en/, /it/…).
 */
export type PageId =
  | 'home'
  | 'rooms'
  | 'groups'
  | 'mascletas'
  | 'faq'
  | 'terms'
  | 'cancellation'
  | 'privacy';

export interface PageDef {
  id: PageId;
  slug: Record<Locale, string>;
  inNav: boolean;
  inFooter: boolean;
}

export const PAGES: PageDef[] = [
  {
    id: 'home',
    slug: { es: '', en: '', it: '', fr: '', de: '' },
    inNav: false,
    inFooter: false,
  },
  {
    id: 'rooms',
    slug: { es: 'habitaciones', en: 'rooms', it: 'camere', fr: 'chambres', de: 'zimmer' },
    inNav: true,
    inFooter: true,
  },
  {
    id: 'groups',
    slug: {
      es: 'grupos-catering',
      en: 'groups-catering',
      it: 'gruppi-catering',
      fr: 'groupes-traiteur',
      de: 'gruppen-catering',
    },
    inNav: true,
    inFooter: true,
  },
  {
    id: 'mascletas',
    slug: { es: 'mascletas', en: 'mascletas', it: 'mascletas', fr: 'mascletas', de: 'mascletas' },
    inNav: true,
    inFooter: true,
  },
  {
    id: 'faq',
    slug: { es: 'faq', en: 'faq', it: 'faq', fr: 'faq', de: 'faq' },
    inNav: true,
    inFooter: true,
  },
  {
    id: 'terms',
    slug: { es: 'condiciones', en: 'terms', it: 'condizioni', fr: 'conditions', de: 'agb' },
    inNav: false,
    inFooter: true,
  },
  {
    id: 'cancellation',
    slug: {
      es: 'cancelacion',
      en: 'cancellation',
      it: 'cancellazione',
      fr: 'annulation',
      de: 'stornierung',
    },
    inNav: false,
    inFooter: true,
  },
  {
    id: 'privacy',
    slug: {
      es: 'privacidad',
      en: 'privacy',
      it: 'privacy',
      fr: 'confidentialite',
      de: 'datenschutz',
    },
    inNav: false,
    inFooter: true,
  },
];

export const PAGE_BY_ID = Object.fromEntries(PAGES.map((p) => [p.id, p])) as Record<PageId, PageDef>;

/** Ruta de una página en un idioma dado. ES en la raíz, resto con prefijo. */
export function pagePath(id: PageId, lang: Locale): string {
  const p = PAGE_BY_ID[id];
  const slug = p.slug[lang];
  const prefix = lang === 'es' ? '' : `/${lang}`;
  if (!slug) return prefix ? `${prefix}/` : '/';
  return `${prefix}/${slug}/`;
}
