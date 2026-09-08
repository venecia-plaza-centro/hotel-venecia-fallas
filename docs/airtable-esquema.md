# Esquema de Airtable — Reservas Fallas 2027

Base que gestiona el hotel. Tres tablas: **Habitaciones**, **Extras catering** y **Reservas**.

- El **precio siempre se calcula en el servidor** a partir de `Habitaciones` y `Extras catering`; el cliente nunca envía importes.
- **Disponibilidad** = para cada noche del rango pedido, `Cupo` del tipo − reservas no canceladas que cubren esa noche.
- Los campos marcados _(lo rellena la web)_ los escribe la API al crear la reserva; el resto los gestiona el hotel.

Cómo crear la base: o bien la montáis a mano con estas tablas, o nos pasáis el
token con permiso de escritura de esquema (`schema.bases:write`) y la creamos
nosotros por API. En ambos casos hacen falta el **token** (`pat…`) y el **ID de
la base** (`app…`).

---

## Tabla `Habitaciones`

Un registro por **tipo** de habitación que se vende para Fallas.

| Campo | Tipo Airtable | Notas |
|---|---|---|
| `Nombre` | Single line text (**campo principal**) | Nombre comercial. Ej.: `Doble Vistas Plaza` |
| `Slug` | Single line text | Identificador estable que usa la web. minúsculas-con-guiones. Ej.: `doble-vistas-plaza`. **No cambiar** una vez publicado. |
| `Tipo` | Single select | `doble` · `triple` · `cuadruple` · `suite` |
| `Capacidad` | Number (entero) | Nº máximo de huéspedes. |
| `Vistas a la plaza` | Checkbox | Marca las que dan a la Plaza del Ayuntamiento. |
| `Precio noche` | Currency (EUR) | Tarifa Fallas por noche, IVA incluido. |
| `Cupo` | Number (entero) | Cuántas habitaciones de este tipo se apartan para la ventana. |
| `Descripcion ES` | Long text | Opcional. Texto de la ficha en español. |
| `Descripcion EN` | Long text | Opcional. |
| `Foto` | Attachment | Opcional. 1ª imagen = principal. |
| `Orden` | Number | Orden en el listado (menor primero). |
| `Activa` | Checkbox | Desmarca para retirar de la venta sin borrar el registro. |

## Tabla `Extras catering`

Un registro por paquete de catering que se puede añadir a una reserva.

| Campo | Tipo Airtable | Notas |
|---|---|---|
| `Nombre` | Single line text (**campo principal**) | Ej.: `Aperitivo valenciano` |
| `Slug` | Single line text | Ej.: `aperitivo-valenciano`. **No cambiar** tras publicar. |
| `Descripcion ES` | Long text | Qué incluye (horchata, fartons, longaniza, bebida…). |
| `Descripcion EN` | Long text | Opcional. |
| `Precio persona` | Currency (EUR) | Precio por comensal, IVA incluido. |
| `Minimo personas` | Number (entero) | Opcional. Mínimo de comensales para contratarlo. |
| `Activo` | Checkbox | Desmarca para ocultarlo. |
| `Orden` | Number | Orden en el listado. |

## Tabla `Reservas`

Un registro por reserva. Mientras no haya pago (Hito 2) entra como `solicitada`.

| Campo | Tipo Airtable | Notas |
|---|---|---|
| `Localizador` | Single line text (**campo principal**) | _(lo rellena la web)_ Código corto, ej.: `FAL-7Q3KD`. |
| `Estado` | Single select | `solicitada` · `confirmada` · `cancelada`. Nueva reserva = `solicitada`. |
| `Entrada` | Date | _(lo rellena la web)_ Noche de llegada. |
| `Salida` | Date | _(lo rellena la web)_ Día de salida (no se pernocta). |
| `Noches` | Formula | `DATETIME_DIFF({Salida},{Entrada},'days')` |
| `Habitacion` | Link → `Habitaciones` (single) | _(lo rellena la web)_ |
| `Huespedes` | Number (entero) | _(lo rellena la web)_ |
| `Catering` | Link → `Extras catering` (single) | _(lo rellena la web)_ Vacío si no añade catering. |
| `Comensales catering` | Number (entero) | _(lo rellena la web)_ 0 si no hay catering. |
| `Nombre cliente` | Single line text | _(lo rellena la web)_ |
| `Apellidos cliente` | Single line text | _(lo rellena la web)_ |
| `Email` | Email | _(lo rellena la web)_ |
| `Telefono` | Phone number | _(lo rellena la web)_ |
| `Pais` | Single line text | _(lo rellena la web)_ Opcional. |
| `Notas` | Long text | _(lo rellena la web)_ Peticiones del cliente. |
| `Idioma` | Single select | _(lo rellena la web)_ `es` · `en` · `it` · `fr` · `de` |
| `Importe alojamiento` | Currency (EUR) | _(lo rellena la web)_ `Precio noche` × `Noches`. |
| `Importe catering` | Currency (EUR) | _(lo rellena la web)_ `Precio persona` × `Comensales catering`. |
| `Importe total` | Currency (EUR) | _(lo rellena la web)_ Suma de los dos anteriores. |
| `Pago` | Single select | `pendiente` · `pagado`. Hito 3. Nueva reserva = `pendiente`. |
| `Origen` | Single select | `web` · `telefono` · `email`. Nueva reserva web = `web`. |
| `Creada` | Created time | Automático de Airtable. |

### Cómo se calcula la disponibilidad

Para una petición de fechas `[entrada, salida)`:

1. Se leen las reservas con `Estado` distinto de `cancelada` que solapan el rango
   (`Entrada < salida` **y** `Salida > entrada`).
2. Para cada noche del rango y cada tipo de habitación se cuenta cuántas de esas
   reservas cubren esa noche.
3. El tipo está disponible si en **todas** las noches del rango
   `reservas_que_cubren < Cupo`.

Así nunca se vende por encima del cupo.

---

## Datos de ejemplo (los que usa la web en local hasta tener la base real)

### Habitaciones

| Nombre | Slug | Tipo | Capacidad | Vistas plaza | Precio noche | Cupo |
|---|---|---|---|---|---|---|
| Doble Vistas Plaza | `doble-vistas-plaza` | doble | 2 | sí | 180 € | 4 |
| Triple Vistas Plaza | `triple-vistas-plaza` | triple | 3 | sí | 240 € | 3 |
| Cuádruple Familiar | `cuadruple-familiar` | cuadruple | 4 | no | 300 € | 2 |
| Suite Balcón | `suite-balcon` | suite | 2 | sí | 360 € | 1 |

### Extras catering

| Nombre | Slug | Precio persona | Mínimo personas |
|---|---|---|---|
| Aperitivo valenciano | `aperitivo-valenciano` | 25 € | 4 |

> Cifras inventadas para poder programar y probar el flujo. Las reales las pone
> el hotel en Airtable y **no requieren tocar código**.
