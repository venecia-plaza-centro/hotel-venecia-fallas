# Esquema de Airtable — Reservas Fallas 2027

> **Actualizado tras la reunión con el cliente (2026-09-11):** no es una reserva
> de noches. Cada habitación se alquila por horas (13:00–15:00 h) el día de
> mascletá elegido, como espacio privado. Son habitaciones reales del
> hotel (no tipos), Snack Pack incluido de serie.
>
> **Actualizado de nuevo:** las habitaciones admiten hasta **4 personas**,
> y el precio **varía según se apunten 2, 3 o 4** (ya no es un precio plano
> único). Ver la tabla `Habitaciones` más abajo.
>
> **Datos reales del hotel (2026-09-15):** son **9 habitaciones** en total —
> 317 (3ª planta), 409/410/411/412 (4ª planta) y 502/503/504/505 (5ª planta).
> Descripción y precio son iguales en las 9, Snack Pack incluido. Fotos ya
> recibidas y subidas a la web.
>
> **Precio entre semana / fin de semana (2026-09-17):** el precio por
> persona ya no es fijo: es más barato entre semana y sube en fin de semana
> (viernes, sábado y domingo). Cada habitación necesita 6 precios en vez de
> 3 — ver la tabla `Habitaciones` más abajo.

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

Un registro por cada una de las 9 habitaciones reales que se ofrecen.

| Campo | Tipo Airtable | Notas |
|---|---|---|
| `Nombre` | Single line text (**campo principal**) | Ej.: `Habitación 317`. Solo para identificar el registro en Airtable. |
| `Slug` | Single line text | Identificador estable que usa la web. Ej.: `habitacion-317`. **No cambiar** una vez publicado. |
| `Numero` | Single line text | El número real de la habitación, ej. `317`. Es lo que ve el cliente. |
| `Planta` | Single line text | Ej.: `3ª planta`. |
| `Capacidad` | Number (entero) | Nº máximo de personas. Las 9 habitaciones admiten hasta `4`. |
| `Precio 2p entresemana` | Currency (EUR) | Precio de la experiencia para 2 personas entre semana (lunes a jueves), IVA y Snack Pack incluidos. |
| `Precio 3p entresemana` | Currency (EUR) | Precio para 3 personas entre semana. |
| `Precio 4p entresemana` | Currency (EUR) | Precio para 4 personas entre semana. |
| `Precio 2p finde` | Currency (EUR) | Precio para 2 personas en fin de semana (viernes, sábado o domingo). |
| `Precio 3p finde` | Currency (EUR) | Precio para 3 personas en fin de semana. |
| `Precio 4p finde` | Currency (EUR) | Precio para 4 personas en fin de semana. |
| `Cupo` | Number (entero) | Normalmente `1` (una habitación física = una unidad). Solo se pondría más de 1 si dos habitaciones son intercambiables. |
| `Descripcion ES` | Long text | Una frase de la ficha en español. |
| `Descripcion EN` | Long text | Opcional. |
| `Fotos` | Attachment (varias) | En orden de aparición; la primera es la principal. El carrusel de la web usa todas las que haya. |
| `Orden` | Number | Orden en el listado (menor primero). |
| `Activa` | Checkbox | Desmarca para retirar de la venta sin borrar el registro. |

## Tabla `Reservas`

Un registro por reserva. **No hay "solicitud" que el hotel deba aprobar**:
el pago online es lo que confirma la reserva, así que el registro solo se
crea en Airtable cuando Redsys confirma el cobro (ver
`src/pages/api/redsys-notification.ts`) y entra directamente como `confirmada` /
`pagado`.

> Sin Redsys conectado, la web cae a un modo de demostración
> (`src/pages/api/checkout.ts`) que crea el registro sin cobrar nada, como
> `solicitada` / `pendiente` — solo para poder probar el flujo sin TPV.
> En producción, con Redsys conectado, ese caso no debería darse.

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
| `Importe total` | Currency (EUR) | _(lo rellena la web)_ = precio de la habitación según `Huespedes` **y** si `Fecha` cae entre semana o en fin de semana (viernes, sábado o domingo). |
| `Pago` | Single select | `pendiente` · `pagado`. Reserva pagada por Redsys = `pagado`. |
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

Ya son los reales que ha dado el hotel — `src/lib/fixtures.ts`. Todas las
habitaciones admiten hasta 4 personas y tienen el mismo precio:

| Personas | Entre semana | Fin de semana |
|---|---|---|
| 2 | 120 € (60 €/persona) | 140 € (70 €/persona) |
| 3 | 150 € (50 €/persona) | 180 € (60 €/persona) |
| 4 | 160 € (40 €/persona) | 200 € (50 €/persona) |

| Nº | Planta |
|---|---|
| 317 | 3ª planta |
| 409 | 4ª planta |
| 410 | 4ª planta |
| 411 | 4ª planta |
| 412 | 4ª planta |
| 502 | 5ª planta |
| 503 | 5ª planta |
| 504 | 5ª planta |
| 505 | 5ª planta |

> Fin de semana = viernes, sábado o domingo (confirmado por el hotel);
> el resto de días cuenta como entre semana.
