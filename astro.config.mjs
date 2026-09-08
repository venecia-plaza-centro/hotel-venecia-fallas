import { defineConfig } from 'astro/config';
import vercel from '@astrojs/vercel/serverless';

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
  build: {
    inlineStylesheets: 'auto',
  },
});
