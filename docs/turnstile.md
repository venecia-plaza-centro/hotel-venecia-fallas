# Captcha de Cloudflare Turnstile

Protege el botón «Ir al pago» (balcones y espacios) de scripts que bloquean días sin pagar.
Es gratis, no pide resolver imágenes (suele verificar solo y, si dudan, muestra una casilla)
y no necesita que el dominio esté en Cloudflare.

## Activarlo (una vez)

1. En <https://dash.cloudflare.com> (cuenta gratuita) → **Turnstile** → **Add widget**.
   - Nombre: `Fallas Hotel Venecia`.
   - Hostname: `fallas.hotelvenecia.com`.
   - Widget mode: **Managed**.
2. Cloudflare da dos claves: **Site key** (pública) y **Secret key** (secreta).
3. En Vercel (cuenta «Hotel Venecia», proyecto de la web) → Settings → Environment Variables,
   solo en **Production**:

   | Variable | Valor |
   |---|---|
   | `TURNSTILE_SITE_KEY` | la Site key |
   | `TURNSTILE_SECRET_KEY` | la Secret key (marcarla como sensible) |

4. **Redesplegar** (la Site key se mete en las páginas al construirlas).

Sin las dos variables el captcha no se pide y todo funciona como antes.

## Cómo funciona

- El widget aparece encima del botón al llegar al paso de datos.
- Al pagar, el navegador manda el token y `/api/checkout` lo comprueba con Cloudflare
  **antes** de bloquear nada. Sin token válido responde 403 `captcha`.
- Si Cloudflare no responde, se deja pasar (sigue el límite de peticiones por IP).

## Probar en local

Cloudflare tiene claves de prueba: Site key `1x00000000000000000000AA` y Secret key
`1x0000000000000000000000000000000AA` (siempre pasan) o `2x0000000000000000000000000000000AA`
(siempre falla).
