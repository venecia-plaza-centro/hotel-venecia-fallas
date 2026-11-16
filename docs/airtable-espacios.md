# Airtable — tabla `Espacios` (alquiler de espacios enteros)

Se añade a la **misma base** que `Habitaciones` y `Reservas`. Los espacios son
habitaciones sin mobiliario que se alquilan **enteras, por día**, de 13:00 a
15:00 h, con precio fijo (IVA incluido) y un aforo máximo. No se reservan por
personas como los balcones.

Qué vive dónde:

- **En Airtable (lo que el hotel puede cambiar):** precio, días disponibles,
  aforo, si el espacio está activo y el orden.
- **En la web (no cambia):** fotos, planos, fachadas, descripciones traducidas
  a 5 idiomas, planta y metros cuadrados.

## 1. Tabla nueva `Espacios`

Un registro por espacio. Hoy son 7 (el 704 se añadirá cuando el hotel mande sus
datos).

| Campo | Tipo Airtable | Notas |
|---|---|---|
| `Nombre` | Single line text (**campo principal**) | Ej.: `Espacio 109`. Solo para identificar el registro. |
| `Slug` | Single line text | Identificador estable que usa la web. Ej.: `espacio-109`. **No cambiar** una vez publicado. |
| `Numero` | Single line text | El número que ve el cliente, ej. `109`. Debe coincidir con las fotos de la web. |
| `Aforo` | Number (entero) | Máximo de personas. El espacio se alquila entero. |
| `Precio` | Currency (EUR) | Precio por día, IVA incluido. |
| `Dias` | Multiple select | Días de **marzo de 2027** en que se puede alquilar. Opciones: `1`, `2`, `3` … `19`. |
| `Precio especial` | Currency (EUR) | _Opcional._ Precio distinto para los días de `Dias precio especial`. |
| `Dias precio especial` | Multiple select | _Opcional._ Mismas opciones `1`–`19`. Ej.: `14` para que el 14 de marzo cueste el `Precio especial`. |
| `Orden` | Number | Orden en el listado (menor primero). |
| `Activo` | Checkbox | Desmarcar para retirar un espacio de la venta sin borrarlo. |

### Valores iniciales (los del Excel del hotel)

| Nombre | Slug | Numero | Aforo | Precio | Dias | Precio especial | Dias precio especial | Orden |
|---|---|---|---|---|---|---|---|---|
| Espacio 109 | espacio-109 | 109 | 12 | 750 | 1, 2 | | | 1 |
| Espacio 208 | espacio-208 | 208 | 12 | 750 | 1, 2 | | | 2 |
| Espacio 210 | espacio-210 | 210 | 8 | 480 | 1, 2, 3, 14 | 500 | 14 | 3 |
| Espacio 408 | espacio-408 | 408 | 15 | 920 | 14 | | | 4 |
| Espacio 506 | espacio-506 | 506 | 20 | 1300 | 1, 2 | | | 5 |
| Espacio 602 | espacio-602 | 602 | 8 | 480 | 1, 2, 3 | | | 6 |
| Espacio 605 | espacio-605 | 605 | 20 | 1300 | 1, 2 | | | 7 |

**Atajo:** `docs/espacios.csv` trae estos mismos valores. En Airtable:
*Add or import → CSV file → Create a new table*. Después hay que revisar los
tipos de campo (la importación los adivina): `Dias` y `Dias precio especial` →
**Multiple select**; `Precio` y `Precio especial` → **Currency (EUR)**;
`Activo` → **Checkbox** (marcados todos); `Nombre` como campo principal.

## 2. Un campo nuevo en `Reservas`

| Campo | Tipo Airtable | Notas |
|---|---|---|
| `Espacio` | Link to another record → `Espacios` | **Un solo registro** (desmarcar «Allow linking to multiple records»). _Lo rellena la web._ |

Una reserva de balcón rellena `Habitacion`; una de espacio rellena `Espacio`
(y `Habitacion` queda vacío). El resto de campos de `Reservas` se reutilizan
tal cual: `Fecha`, `Estado`, `Pago`, `Importe total`, `Nombre cliente`…,
`Pedido Redsys`, `Codigo autorizacion`.

## 3. Cómo usa la web esos datos

- Solo se muestran los espacios con **`Activo` marcado**. Un registro cuyo `Slug`
  no exista en la web (no tiene fotos ni descripción) se ignora con un aviso en
  el registro del servidor. Para añadir un espacio nuevo (p. ej. el 704) hay que
  preparar antes sus fotos y textos en la web.
- **Aforo, Precio o Dias vacíos** → la web usa los valores del Excel del hotel
  (así nunca queda un espacio sin precio por un despiste). **Precio especial y
  Dias precio especial son opcionales**: vacíos = sin precio especial.
- Un cambio en Airtable se ve en `/espacios/` en **como máximo ~10-15 minutos**,
  sin volver a desplegar: la página consulta `/api/spaces` al abrirse y pone al
  día precios, aforo y días. (Un espacio que se desmarque como `Activo`
  desaparece; cambiar el `Orden` sí requiere un nuevo despliegue.)
- Si Airtable no responde o la tabla aún no existe, se usan los datos de ejemplo
  de `src/lib/spaces.ts` y la web no se rompe.
- El **precio que se cobra** se calculará siempre en el servidor a partir de esta
  tabla, nunca con lo que muestra el navegador.

## 4. Comprobaciones al crear la tabla

- El **token** de la web ya tiene acceso a toda la base, así que la tabla
  nueva queda cubierta sin tocar nada. (Si en Airtable el token está limitado
  a tablas concretas, hay que añadirle `Espacios`.)
- Los estados de `Reservas` (`en pago`, `confirmada`, `cancelada`, `caducada`)
  y el bloqueo de 15 minutos mientras se paga funcionan igual para espacios.
- Avisar cuando esté creada: se comprueba que la web lee bien sus datos
  (`/api/spaces` debe devolver lo de Airtable y no el respaldo).

## 5. Cómo se abre la venta de espacios

Los espacios se venden con **su propio interruptor**, independiente del de los
balcones. Hasta que no se active, `/reservar/?espacio=…` enseña «las reservas
aún no están abiertas» y `/api/checkout` rechaza los pagos de espacios (403),
aunque los balcones estén vendiendo.

En Vercel (Settings → Environment Variables):

| Variable | Valor | Efecto |
|---|---|---|
| `SPACES_OPEN` | `true` | Abre la venta de espacios (necesita además que las ventas generales estén abiertas: `SALES_OPEN`). Cualquier otro valor, o no definirla = cerrada. |

Después hay que **volver a desplegar** para que Vercel la lea (igual que `SALES_OPEN`).

### Lista para el lanzamiento
1. Tabla `Espacios` creada y campo `Espacio` en `Reservas` (apartados 1 y 2).
2. `/api/spaces` devuelve los datos de Airtable (no el respaldo).
3. Reserva de prueba con el TPV en modo test: se bloquea, se paga, queda `confirmada` con su `Espacio` enlazado, y llegan los dos correos.
4. Prueba de dos clientes a la vez sobre el mismo espacio y día: solo uno lo consigue.
5. Hacer visible la página: `inNav`/`inFooter` a `true` y quitar `'spaces'` de `NOINDEX_PAGES` en `src/i18n/pages.ts`.
   (La cabecera apila «Preguntas frecuentes» en dos líneas sola en cuanto «Espacios» entra en el menú; no hay que tocar nada más.)
6. `SPACES_OPEN=true` y redespliegue.
