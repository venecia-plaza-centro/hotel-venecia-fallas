import { defineConfig } from 'astro/config';
import vercel from '@astrojs/vercel/serverless';
import sitemap from '@astrojs/sitemap';
import { LOCALES } from './src/consts.ts';
import { NOINDEX_PAGES, pagePath } from './src/i18n/pages.ts';

// fallas.hotelvenecia.com — microweb de reservas para las Fallas 2027.
// Hosting: Vercel (deploy automático desde GitHub).
// i18n: ES en la raíz, resto de idiomas con prefijo (/en/, /it/, /fr/, /de/).
//
// output: 'hybrid' → todo se pre-renderiza estático salvo lo que marque
// `export const prerender = false` (las rutas /api/* de reserva).
export default defineConfig({
  site: 'https://fallas.hotelvenecia.com',
  output: 'hybrid',
  adapter: vercel(),
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
  build: {
    inlineStylesheets: 'auto',
  },
});
