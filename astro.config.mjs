import { defineConfig } from 'astro/config';

// fallas.hotelvenecia.com — microweb de reservas para las Fallas 2027.
// Hosting: Vercel (deploy automático desde GitHub).
// i18n: ES en la raíz, resto de idiomas con prefijo (/en/, /it/, /fr/, /de/).
export default defineConfig({
  site: 'https://fallas.hotelvenecia.com',
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
