# Hotel Venecia · Fallas 2027 — microweb de reservas

Microweb independiente para **reservar habitaciones del Hotel Venecia Plaza Centro
para ver las mascletàs de las Fallas 2027**. Se enlazará desde la web principal
(hotelvenecia.com) y vivirá en el subdominio **fallas.hotelvenecia.com**.

Proyecto separado del de la web principal (`hotel-venecia`) a propósito: otro repo,
otro hosting, otro flujo de despliegue. Solo comparten el **sistema de diseño**
(copiado, no acoplado).

---

## Decisiones tomadas (sesión previa)

| Tema | Decisión |
|---|---|
| Base técnica | **Astro** (páginas estáticas + rutas `/api/*` para reserva/pago) |
| Hosting | **Vercel** (deploy automático desde GitHub) |
| Dominio | **fallas.hotelvenecia.com** (subdominio del principal) |
| Reservas + cupo | **Airtable** — tabla que gestiona el hotel |
| Inventario | **Cupo fijo manual**: se apartan X habitaciones para las fechas y se venden por orden de llegada |
| Fechas a la venta | **1–19 de marzo de 2027** (mascletà diaria a las 14:00 en la Plaza del Ayuntamiento) |
| Idiomas | **ES / EN / IT / FR / DE** (los 5, como la web principal) |
| Pago | **Por decidir** — Stripe vs Redsys vs motor Green Channel. Se enchufa en el Hito 3 sin rehacer el resto |
| Estilo | Igual que la web nueva de hotelvenecia.com |

---

## Hitos

### Hito 1 — Esqueleto + contenido  ✅ (este commit)
- Proyecto Astro con i18n (ES en la raíz, resto con prefijo) + hreflang/canonical/OG/JSON-LD.
- Sistema de diseño portado de la web principal (`src/styles/global.css`).
- Páginas: Inicio · Habitaciones · Grupos y catering · Calendario de mascletàs · FAQ · Legal (condiciones / cancelación / privacidad).
- Nav, footer y FABs (llamar + WhatsApp) con el mismo patrón que la web principal.
- **Contenido de ejemplo** en ES (EN traducido; IT/FR/DE caen a ES — `TODO traducir` en `src/i18n/ui.ts`).

### Hito 2 — Reserva
- Flujo: fechas → habitación/paquete → extras de catering → datos → confirmación.
- Rutas `src/pages/api/*` en Astro.
- Cupo y reservas en **Airtable** (leer disponibilidad, crear reserva).
- Correo de confirmación al cliente y al hotel.

### Hito 3 — Pago
- Integrar Stripe o Redsys (según se decida) en el paso de pago del flujo del Hito 2.

---

## Datos que faltan del hotel (para rellenar el contenido real)

1. **Habitaciones que se venden enteras**: tipos (doble/triple/cuádruple/suite),
   cuáles tienen **vistas a la Plaza del Ayuntamiento**, capacidad, y cuántas de
   cada tipo se apartan para Fallas.
2. **Grupos + catering**: en qué consiste el paquete de grupo, qué incluye el
   catering (aperitivo valenciano, bebida, horchata…), precio por persona, y
   desde dónde se ve la mascletà (balcones de las habitaciones / terraza común).
3. **Precios de Fallas** por habitación y noche.
4. **Mínimo de noches** y **política de cancelación** para las fechas de Fallas.
5. Textos legales (condiciones de reserva, cancelación, privacidad) — necesarios
   antes de abrir pagos.

## Accesos que hacen falta

- Cuenta de **Airtable** + token de acceso personal (para el Hito 2).
- Cuenta de **Vercel** conectada a GitHub (para desplegar).
- Acceso al **DNS de hotelvenecia.com** para el registro CNAME de `fallas`.
- Credenciales de **Stripe** o **Redsys** (para el Hito 3).

Ninguna clave se commitea: van en variables de entorno (`.env`, ya en `.gitignore`).

---

## Arranque

```bash
npm install
npm run dev      # http://localhost:4321
npm run build    # genera dist/
```

## Estructura

```
src/
  consts.ts              # config global (dominio, fechas Fallas, idiomas)
  i18n/
    pages.ts             # manifiesto de páginas + slug localizado + pagePath()
    ui.ts                # diccionario de textos (ES fuente, EN hecho, IT/FR/DE TODO)
  styles/global.css      # tokens + reset + primitivas (portado de la web principal)
  layouts/Base.astro     # <head> con SEO/hreflang/OG/JSON-LD + Nav + Footer + FABs
  components/
    Nav.astro  Footer.astro  Fabs.astro  PageHero.astro
    pages/                # cuerpo de cada página
      Home  Rooms  Groups  Mascletas  Faq  Legal
  pages/
    [...slug].astro       # genera todas las URLs (página × idioma) con getStaticPaths
```
