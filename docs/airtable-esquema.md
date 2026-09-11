# Esquema de Airtable — Reservas Fallas 2027

> **Actualizado tras la reunión con el cliente (2026-09-11):** no es una reserva
> de noches. Cada habitación se alquila por horas (13:00–15:00 h) el día de
> mascletà elegido, como espacio privado. Son **10 habitaciones reales** del
> hotel (no tipos), precio plano por habitación, Snack Pack incluido de serie.

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
| `Capacidad` | Number (entero) | Nº máximo de personas. |
| `Cama` | Single line text | Ej.: `Cama doble o dos camas (según disponibilidad)`. |
| `Precio` | Currency (EUR) | Precio plano de la experiencia, IVA incluido. Snack Pack ya incluido: no hay que sumar nada más. |
| `Cupo` | Number (entero) | Normalmente `1` (una habitación física = una unidad). Solo se pondría más de 1 si dos habitaciones son intercambiables. |
| `Descripcion ES` | Long text | Una frase de la ficha en español. |
| `Descripcion EN` | Long text | Opcional. |
| `Fotos` | Attachment (varias) | En orden de aparición; la primera es la principal. El carrusel de la web usa todas las que haya. |
| `Orden` | Number | Orden en el listado (menor primero). |
| `Activa` | Checkbox | Desmarca para retirar de la venta sin borrar el registro. |

## Tabla `Reservas`

Un registro por solicitud de reserva. Mientras no haya pago (Hito 2) entra
como `solicitada`.

| Campo | Tipo Airtable | Notas |
|---|---|---|
| `Localizador` | Single line text (**campo principal**) | _(lo rellena la web)_ Código corto, ej.: `FAL-7Q3KD`. |
| `Estado` | Single select | `solicitada` · `confirmada` · `cancelada`. Nueva reserva = `solicitada`. |
| `Fecha` | Date | _(lo rellena la web)_ Día de mascletà elegido (acceso 13:00–15:00 h). |
| `Habitacion` | Link → `Habitaciones` (single) | _(lo rellena la web)_ |
| `Huespedes` | Number (entero) | _(lo rellena la web)_ |
| `Nombre cliente` | Single line text | _(lo rellena la web)_ |
| `Apellidos cliente` | Single line text | _(lo rellena la web)_ |
| `Email` | Email | _(lo rellena la web)_ |
| `Telefono` | Phone number | _(lo rellena la web)_ |
| `Pais` | Single line text | _(lo rellena la web)_ Opcional. |
| `Notas` | Long text | _(lo rellena la web)_ Peticiones del cliente. |
| `Idioma` | Single select | _(lo rellena la web)_ `es` · `en` · `it` · `fr` · `de` |
| `Importe total` | Currency (EUR) | _(lo rellena la web)_ = `Precio` de la habitación elegida. |
| `Pago` | Single select | `pendiente` · `pagado`. Hito 3. Nueva reserva = `pendiente`. |
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

| Nº | Planta | Capacidad | Cama | Precio |
|---|---|---|---|---|
| 214 | 2ª | 2 | Cama doble | 160 € |
| 219 | 2ª | 3 | Cama doble y sofá cama | 190 € |
| 305 | 3ª | 4 | Dos camas dobles | 210 € |
| 317 | 3ª | 4 | Cama doble o dos camas | 200 € |
| 322 | 3ª | 2 | Cama doble | 175 € |
| 401 | 4ª | 6 | Habitación familiar, tres camas | 320 € |
| 408 | 4ª | 4 | Dos camas dobles | 230 € |
| 415 | 4ª | 2 | Cama doble | 190 € |
| 502 | 5ª (ático) | 3 | Cama doble y cama nido | 260 € |
| 510 | 5ª (ático) | 2 | Cama doble | 240 € |

> Números y habitaciones inventados para poder programar y probar el flujo.
> Los reales (los 10 números de habitación, plantas, capacidades y precios que
> salgan de la reunión) van en Airtable y **no requieren tocar código**.
