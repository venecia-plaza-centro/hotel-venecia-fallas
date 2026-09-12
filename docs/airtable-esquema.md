# Esquema de Airtable — Reservas Fallas 2027

> **Actualizado tras la reunión con el cliente (2026-09-11):** no es una reserva
> de noches. Cada habitación se alquila por horas (13:00–15:00 h) el día de
> mascletá elegido, como espacio privado. Son **10 habitaciones reales** del
> hotel (no tipos), Snack Pack incluido de serie.
>
> **Actualizado de nuevo:** las 10 habitaciones admiten hasta **4 personas**,
> y el precio **varía según se apunten 2, 3 o 4** (ya no es un precio plano
> único). Ver la tabla `Habitaciones` más abajo.

Base que gestiona el hotel. Dos tablas: **Habitaciones** y **Reservas**.

- El **precio siempre se calcula en el servidor** a partir de `Habitaciones`;
  el cliente nunca envía importes.
- **Disponibilidad** = para una fecha dada, ¿ya hay una reserva no cancelada
  de esa habitación exacta ese día? (cada habitación es física y única, así
  que `Cupo` es normalmente 1).

Cómo crear la base: o bien la montáis a mano con estas tablas, o nos pasáis el
token con permiso de escritura de esquema (`schema.bases:write`) y la creamos
nosotros por API. En ambos casos hacen falta el **token** (`pat…`) y el **ID de
la base** (`app…`).

---

## Tabla `Habitaciones`

Un registro por cada una de las 10 habitaciones reales que se ofrecen.

| Campo | Tipo Airtable | Notas |
|---|---|---|
| `Nombre` | Single line text (**campo principal**) | Ej.: `Habitación 317`. Solo para identificar el registro en Airtable. |
| `Slug` | Single line text | Identificador estable que usa la web. Ej.: `habitacion-317`. **No cambiar** una vez publicado. |
| `Numero` | Single line text | El número real de la habitación, ej. `317`. Es lo que ve el cliente. |
| `Planta` | Single line text | Ej.: `3ª planta`. |
| `Capacidad` | Number (entero) | Nº máximo de personas. Las 10 habitaciones admiten hasta `4`. |
| `Precio 2p` | Currency (EUR) | Precio de la experiencia para 2 personas, IVA incluido. Snack Pack ya incluido. |
| `Precio 3p` | Currency (EUR) | Precio para 3 personas. |
| `Precio 4p` | Currency (EUR) | Precio para 4 personas. |
| `Cupo` | Number (entero) | Normalmente `1` (una habitación física = una unidad). Solo se pondría más de 1 si dos habitaciones son intercambiables. |
| `Descripcion ES` | Long text | Una frase de la ficha en español. |
| `Descripcion EN` | Long text | Opcional. |
| `Fotos` | Attachment (varias) | En orden de aparición; la primera es la principal. El carrusel de la web usa todas las que haya. |
| `Orden` | Number | Orden en el listado (menor primero). |
| `Activa` | Checkbox | Desmarca para retirar de la venta sin borrar el registro. |

## Tabla `Reservas`

Un registro por reserva. **No hay "solicitud" que el hotel deba aprobar**:
el pago online es lo que confirma la reserva, así que el registro solo se
crea en Airtable cuando Stripe confirma el cobro (ver
`src/pages/api/stripe-webhook.ts`) y entra directamente como `confirmada` /
`pagado`.

> Sin Stripe conectado, la web cae a un modo de demostración
> (`src/pages/api/checkout.ts`) que crea el registro sin cobrar nada, como
> `solicitada` / `pendiente` — solo para poder probar el flujo sin cuenta de
> pago. En producción, con Stripe conectado, ese caso no debería darse.

| Campo | Tipo Airtable | Notas |
|---|---|---|
| `Localizador` | Single line text (**campo principal**) | _(lo rellena la web)_ Código corto, ej.: `FAL-7Q3KD`. |
| `Estado` | Single select | `solicitada` · `confirmada` · `cancelada`. Reserva pagada = `confirmada`. |
| `Fecha` | Date | _(lo rellena la web)_ Día de mascletá elegido (acceso 13:00–15:00 h). |
| `Habitacion` | Link → `Habitaciones` (single) | _(lo rellena la web)_ |
| `Huespedes` | Number (entero) | _(lo rellena la web)_ |
| `Nombre cliente` | Single line text | _(lo rellena la web)_ |
| `Apellidos cliente` | Single line text | _(lo rellena la web)_ |
| `Email` | Email | _(lo rellena la web)_ |
| `Telefono` | Phone number | _(lo rellena la web)_ |
| `Pais` | Single line text | _(lo rellena la web)_ Opcional. |
| `Notas` | Long text | _(lo rellena la web)_ Peticiones del cliente. |
| `Idioma` | Single select | _(lo rellena la web)_ `es` · `en` · `it` · `fr` · `de` |
| `Importe total` | Currency (EUR) | _(lo rellena la web)_ = `Precio 2p`/`3p`/`4p` de la habitación según `Huespedes`. |
| `Pago` | Single select | `pendiente` · `pagado`. Reserva pagada por Stripe = `pagado`. |
| `Confirmar por` | Single select | `email` · `telefono`. Elegido por el cliente en el formulario: por dónde quiere recibir la confirmación (email o SMS). |
| `Origen` | Single select | `web` · `telefono` · `email`. Nueva reserva web = `web`. |
| `Creada` | Created time | Automático de Airtable. |

### Cómo se calcula la disponibilidad

Para una fecha pedida:

1. Se leen las reservas con `Estado` distinto de `cancelada` y `Fecha` igual a
   la pedida.
2. Se cuentan cuántas de esas reservas son de cada habitación.
3. Una habitación está disponible si ese recuento es menor que su `Cupo`
   (normalmente 0 < 1, es decir: libre mientras nadie la haya reservado ya
   ese día).

---

## Datos de ejemplo (los que usa la web en local hasta tener la base real)

| Nº | Planta | 2 pers. | 3 pers. | 4 pers. |
|---|---|---|---|---|
| 214 | 2ª | 150 € | 175 € | 200 € |
| 219 | 2ª | 170 € | 195 € | 220 € |
| 305 | 3ª | 190 € | 215 € | 240 € |
| 317 | 3ª | 180 € | 205 € | 230 € |
| 322 | 3ª | 160 € | 185 € | 210 € |
| 401 | 4ª | 260 € | 290 € | 320 € |
| 408 | 4ª | 210 € | 235 € | 260 € |
| 415 | 4ª | 170 € | 195 € | 220 € |
| 502 | 5ª (ático) | 230 € | 255 € | 280 € |
| 510 | 5ª (ático) | 220 € | 245 € | 270 € |

Todas admiten hasta 4 personas.

> Números y habitaciones inventados para poder programar y probar el flujo.
> Los reales (los 10 números de habitación, plantas, capacidades y precios que
> salgan de la reunión) van en Airtable y **no requieren tocar código**.
