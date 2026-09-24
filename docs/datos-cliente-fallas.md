# Datos que necesitamos del hotel — Fallas 2027

Lista completa para levantar la microweb de reservas de `fallas.hotelvenecia.com`:
reserva de habitaciones, catering de grupo, correos de confirmación y pago.
Cada punto indica a qué parte del proyecto bloquea.

- **Reunión:** 9 de septiembre de 2026
- **Venta:** noches 1–19 de marzo de 2027
- **Idiomas:** ES · EN · IT · FR · DE
- **Estado:** Hito 1 hecho · empezando Hito 2

> Versión navegable (con estilos de impresión) publicada como artifact:
> https://claude.ai/code/artifact/6e021674-47cc-4e38-80c6-6158257f54f5

Ninguna clave se guarda en el código: todas van en variables de entorno (`.env`, ya en `.gitignore`).
Conviene compartirlas por un gestor de contraseñas, no por correo.

---

## Lo mínimo para arrancar el Hito 2

Con estos cuatro puntos podemos empezar a construir el flujo de reserva. El resto se puede ir completando después.

1. Un **correo del hotel** dedicado al proyecto (p. ej. `fallas@hotelvenecia.com`), para usarlo de login en Airtable y en el servicio de correo.
2. Cuenta de **Airtable** con ese correo, base creada, **token de acceso** e **ID de la base**.
3. Método de **envío de correos**: cuenta de Resend + acceso al DNS de `hotelvenecia.com`, o los datos SMTP del buzón de reservas.
4. Tipos de habitación, **cupo** (cuántas se apartan) y **precio por noche** para Fallas — sirve una primera versión aproximada.

---

## 01 · Accesos y cuentas

| ✔ | Punto | Bloquea | Detalle |
|---|---|---|---|
| ☐ | Correo del proyecto en `@hotelvenecia.com` | reserva | Dirección tipo `fallas@hotelvenecia.com` o `reservas@hotelvenecia.com`. Se usará como usuario de Airtable y del servicio de correo, para que la propiedad quede en el hotel desde el principio. |
| ☐ | Cuenta de Airtable + token + ID de base | reserva | Base nueva para las reservas de Fallas. Personal Access Token con permiso de lectura y escritura de registros y lectura de esquema. Nos pasan el token (`pat…`) y el ID de la base (`app…`). |
| ☐ | Acceso al DNS de `hotelvenecia.com` | publicación | Panel del registrador o proveedor de DNS. Hace falta para el registro `CNAME` del subdominio `fallas` y para verificar el dominio de envío de correo. ¿Quién lo gestiona (el hotel, otra agencia)? |
| ☐ | Servicio de correo transaccional | confirmaciones | Opción A — **Resend** (recomendado): cuenta + API key + añadir unos registros al DNS. Opción B — **SMTP** del hotel: host, puerto, usuario y contraseña de `reservas@hotelvenecia.com`. Opción C — que los correos los mande una automatización de Airtable (sin código, lo gestiona el hotel). |
| ☐ | Cuenta de Vercel | publicación | ¿A nombre de la agencia o del hotel? Conectada a GitHub; el despliegue es automático. Aquí se cargan las variables de entorno. |
| ☐ | Credenciales de Redsys (pasarela decidida) | Hito 3 | Banco, código de comercio (FUC), número de terminal, clave secreta SHA-256 y credenciales de pruebas (sandbox). Alta en su portal de la URL de notificación `https://fallas.hotelvenecia.com/api/redsys-notification`. |

## 02 · Habitaciones e inventario

Se venden habitaciones enteras, por orden de llegada, sobre un cupo fijo apartado para las fechas.

| ✔ | Punto | Bloquea | Detalle |
|---|---|---|---|
| ☐ | Tipos de habitación que se ponen a la venta | reserva | Doble, triple, cuádruple, suite… Nombre comercial de cada tipo. |
| ☐ | Capacidad máxima de personas por tipo | reserva | Para validar el número de huéspedes en el formulario. |
| ☐ | Cuáles tienen vistas o balcón a la Plaza del Ayuntamiento | reserva | Es el principal reclamo: se marca en cada habitación. |
| ☐ | Cupo: cuántas habitaciones de cada tipo se apartan | reserva | ¿El cupo es fijo para toda la ventana o cambia según la noche? |
| ☐ | Descripción de cada tipo | contenido | Metros, tipo de cama, baño, servicios (aire, caja fuerte, wifi…). |
| ☐ | Fotos en alta resolución | contenido | De cada tipo de habitación, del edificio, de la fachada a la plaza y de la vista. |
| ☐ | ¿Solo habitación entera, o también por plaza? | reserva | Damos por supuesto que entera. Confirmar. |

## 03 · Precios

El precio se calcula en el servidor a partir de estos datos; el cliente no puede manipularlo.

| ✔ | Punto | Bloquea | Detalle |
|---|---|---|---|
| ☐ | Precio por noche de cada tipo para Fallas | reserva | Tarifa específica de estas fechas. |
| ☐ | ¿Incluye desayuno? ¿IVA incluido en el precio mostrado? | reserva | Alojamiento lleva IVA del 10 %. Decidir si se muestra desglosado. |
| ☐ | Tasa turística / impuesto municipal | reserva | ¿Se cobra aparte en la web, se paga en el hotel o va incluido? |
| ☐ | ¿Precio único o distinto en noches clave? | reserva | Nit del Foc (18) y Cremà (19) suelen tener demanda distinta. |
| ☐ | Fianza o depósito a la llegada | contenido | ¿Se pide? ¿Importe? Se menciona en las condiciones. |
| ☐ | Niños, cunas y camas supletorias | reserva | Política y coste, si aplica a estos tipos de habitación. |

## 04 · Estancia y reglas de reserva

Definen qué combinaciones de fechas puede elegir el cliente.

| ✔ | Punto | Bloquea | Detalle |
|---|---|---|---|
| ☐ | Mínimo de noches para las fechas de Fallas | reserva | Ahora en el código está a 2, sin confirmar. ¿Y máximo? |
| ☐ | Horas de check-in y check-out | contenido | Y si el día de mascletá pueden llegar antes de las 14:00 y dejar equipaje. |
| ☐ | ¿Se reserva noche a noche o por paquetes de fechas cerradas? | reserva | Cambia por completo el diseño del selector de fechas. |
| ☐ | ¿Se admite la noche del 28 de febrero (víspera)? | reserva | La ventana actual es 1–19 de marzo. |

## 05 · Grupos y catering

Varias habitaciones juntas más un paquete de aperitivo valenciano antes de la mascletá.

| ✔ | Punto | Bloquea | Detalle |
|---|---|---|---|
| ☐ | En qué consiste el paquete de grupo | grupos | Número mínimo de habitaciones o de personas, qué se reserva junto. |
| ☐ | Qué incluye el catering — lista exacta | grupos | Horchata, fartons, longaniza, embutidos, bebida… detalle de lo que se sirve. |
| ☐ | Precio por persona del catering | grupos | Y si hay menús alternativos (con/sin alcohol, vegetariano, alérgenos). |
| ☐ | Desde dónde se ve la mascletá en el paquete | contenido | Balcones de las habitaciones, terraza común, azotea… y aforo máximo de ese espacio. |
| ☐ | Dónde se sirve el catering | contenido | En la habitación, en un salón, en la terraza. |
| ☐ | ¿Se puede contratar catering sin reservar habitación? | grupos | Define si el catering es un extra de la reserva o un producto aparte. |
| ☐ | Antelación mínima y forma de pago para grupos | grupos | ¿Señal o pago completo por adelantado? ¿Cuántos días antes hay que cerrarlo? |

## 06 · Cancelación y condiciones

Necesario antes de cobrar. Se muestra en el resumen de la reserva y en el correo de confirmación.

| ✔ | Punto | Bloquea | Detalle |
|---|---|---|---|
| ☐ | Política de cancelación exacta para Fallas | pago | Plazos y penalizaciones (%). ¿Tarifa reembolsable frente a no reembolsable? |
| ☐ | Modificación de fechas | contenido | ¿Se permite? ¿Con coste? |
| ☐ | Qué ocurre si se suspende la mascletá | contenido | Lluvia o motivos de seguridad. Aunque sea poco probable, conviene dejarlo por escrito. |
| ☐ | Puntos para redactar las condiciones de reserva | contenido | Nos vale un borrador o una llamada para redactarlo nosotros y que lo valide su asesoría. |

## 07 · Textos legales

Imprescindibles antes de abrir pagos. Los revisa la asesoría del hotel.

| ✔ | Punto | Bloquea | Detalle |
|---|---|---|---|
| ☐ | Aviso legal | pago | Razón social, CIF, domicilio, datos de registro mercantil. |
| ☐ | Número de registro de establecimiento turístico | pago | Obligatorio mostrarlo en la Comunitat Valenciana. |
| ☐ | Condiciones de reserva y política de cancelación (versión legal) | pago | La versión definitiva que se enlaza en el pie y en el checkout. |
| ☐ | Política de privacidad (RGPD) | pago | Responsable, finalidad, datos recogidos, plazo de conservación y encargados del tratamiento (Airtable, pasarela de pago, servicio de correo). |
| ☐ | Política de cookies y analítica | contenido | ¿Quieren Google Analytics o píxel de Meta? Si es así, hace falta banner de consentimiento. |

## 08 · Marca y contacto

Parte ya está en el esqueleto con datos supuestos; hay que confirmarlos.

| ✔ | Punto | Bloquea | Detalle |
|---|---|---|---|
| ☐ | Confirmar teléfono, WhatsApp y email de reservas | contenido | En el código hay `+34 963 52 42 67` y WhatsApp `+34 691 20 17 17`. ¿Son correctos para esta campaña? |
| ☐ | Confirmar dirección y horario de atención | contenido | Ahora: `Plaza del Ayuntamiento, 3 · 46002 València`. |
| ☐ | Logo en vectorial y guía de marca | contenido | SVG o AI. El estilo es el mismo que la web nueva de hotelvenecia.com; si hay algún matiz para Fallas, indicarlo. |
| ☐ | Redes sociales del hotel | contenido | Para el pie de página. |
| ☐ | Enlace desde hotelvenecia.com a la microweb | publicación | ¿Lo coloca el hotel, quien lleve la web principal, o nosotros? |

## 09 · Contenido y traducciones

ES y EN están redactados; IT, FR y DE están pendientes.

| ✔ | Punto | Bloquea | Detalle |
|---|---|---|---|
| ☐ | Revisión de los textos en español | contenido | El hotel valida el contenido de ejemplo y lo ajusta a su tono. |
| ☐ | Traducciones a IT, FR y DE | contenido | ¿Las aporta el hotel o las encargamos nosotros? Presupuesto aparte si es lo segundo. |
| ☐ | Nombres oficiales de los tipos de habitación en cada idioma | contenido | Para que coincidan con el resto de canales del hotel. |
| ☐ | Fotos del catering y de mascletás vistas desde el hotel | contenido | Son las imágenes que más venden esta campaña. |

## 10 · Operativa y notificaciones

Cómo trabaja el hotel con las reservas que entran.

| ✔ | Punto | Bloquea | Detalle |
|---|---|---|---|
| ☐ | A qué correos del hotel llega el aviso de nueva reserva | confirmaciones | Puede ser más de uno (recepción, reservas, dirección). |
| ☐ | Quién revisa Airtable y confirma las reservas | operativa | Persona responsable y con qué frecuencia lo mira. |
| ☐ | ¿Confirmación automática al pagar o manual por el hotel? | reserva | Mientras no haya pago (Hito 2), la reserva entra como «solicitada» y el hotel la confirma. Con pago (Hito 3) puede ser automática. |
| ☐ | Reservas «solicitadas» sin pagar: ¿cuánto se mantienen? | reserva | Para liberar el cupo si no se completa el pago en X horas. |
| ☐ | ¿Se emite factura? ¿Se piden datos fiscales en el formulario? | reserva | Añade campos al paso de datos del cliente. |

## 11 · Calendario y fechas

Confirmar la ventana de venta y las fechas señaladas.

| ✔ | Punto | Bloquea | Detalle |
|---|---|---|---|
| ☐ | Confirmar ventana de venta | reserva | Ahora: noches del 1 al 19 de marzo de 2027, salida el 20. Mascletá diaria a las 14:00 en la Plaza del Ayuntamiento. |
| ☐ | Fechas señaladas para el calendario | contenido | Plantà (15), Ofrenda (17–18), Nit del Foc (18), Cremà (19). Confirmar con el programa oficial cuando salga. |
| ☐ | Fecha objetivo de publicación y apertura de reservas | planificación | Marca el ritmo de los tres hitos. |

## 12 · Pago · Hito 3

Se enchufa en el paso de pago sin rehacer el resto del flujo. Conviene decidirlo pronto aunque se implemente al final.

| ✔ | Punto | Bloquea | Detalle |
|---|---|---|---|
| ☐ | Credenciales de Redsys | pago | Ver detalle en el punto 01. |
| ☐ | ¿Cobro total o señal? | pago | Por ejemplo 30 % ahora y el resto a la llegada, o el 100 % por adelantado. |
| ☐ | ¿Factura automática tras el pago? | pago | Y con qué serie y numeración. |

---

*Documento de trabajo · Hotel Venecia Plaza Centro — Fallas 2027.
Preparado para la reunión del 9 de septiembre de 2026 · sujeto a cambios según lo que se acuerde.*
