import { defineConfig } from 'astro/config';
import vercel from '@astrojs/vercel';
import sitemap from '@astrojs/sitemap';
import { LOCALES } from './src/consts.ts';
import { NOINDEX_PAGES, pagePath } from './src/i18n/pages.ts';

// fallas.hotelvenecia.com — microweb de reservas para las Fallas 2027.
// Hosting: Vercel (deploy automático desde GitHub).
// i18n: ES en la raíz, resto de idiomas con prefijo (/en/, /it/, /fr/, /de/).
//
// output 'static' (por defecto) + adaptador → todo se pre-renderiza estático
// salvo lo que marque `export const prerender = false` (las rutas /api/* de
// reserva). Es lo que antes era output: 'hybrid'.
export default defineConfig({
  site: 'https://fallas.hotelvenecia.com',
  adapter: vercel(),
  // Astro 7 quita por defecto los espacios entre etiquetas en línea ('jsx'):
  // con `true` se mantiene el comportamiento anterior y el texto no se pega.
  compressHTML: true,
  security: {
    // Astro 5+ devuelve 403 a los POST de formulario que no vienen del propio
    // sitio. Las notificaciones del banco (/api/redsys-notification) llegan
    // de servidor a servidor, sin Origin: bloquearían los pagos. Esa ruta se
    // protege con la firma de Redsys; /api/checkout exige JSON (ver checkout.ts).
    checkOrigin: false,
  },
  i18n: {
    defaultLocale: 'es',
    locales: ['es', 'en', 'it', 'fr', 'de'],
    routing: {
      prefixDefaultLocale: false,
    },
  },
  // Sin la opción "i18n": con slugs distintos por idioma (p. ej. "galeria" vs
  // "gallery"), el emparejado automático de hreflang del plugin sale
  // incompleto. Cada página ya lleva sus etiquetas hreflang completas en el
  // <head> (ver Base.astro), así que el sitemap se deja como listado simple.
  // Las páginas `noindex` (legales) tampoco van en el sitemap: así Search
  // Console no las lista como "excluidas por etiqueta noindex".
  integrations: [
    sitemap({
      filter: (page) => {
        const path = new URL(page).pathname;
        return !NOINDEX_PAGES.some((id) => LOCALES.some((l) => pagePath(id, l) === path));
      },
    }),
  ],
  // La página de Balcones se llamaba antes "habitaciones" (rooms, camere...):
  // las URLs antiguas ya están indexadas y compartidas, así que redirigen a las
  // nuevas (redirección permanente) en vez de dar 404.
  redirects: {
    '/habitaciones': '/balcones/',
    '/en/rooms': '/en/balconies/',
    '/it/camere': '/it/balconi/',
    '/fr/chambres': '/fr/balcons/',
    '/de/zimmer': '/de/balkone/',
  },
  build: {
    inlineStylesheets: 'auto',
  },
});
