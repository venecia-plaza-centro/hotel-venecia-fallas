/**
 * Cloudflare Turnstile: comprueba que quien pulsa «Ir al pago» es una persona y no un
 * script que bloquea días sin pagar. Se activa solo si en Vercel están las dos claves
 * (TURNSTILE_SITE_KEY y TURNSTILE_SECRET_KEY); sin ellas no se pide nada y la web
 * funciona como siempre. Ver docs/turnstile.md.
 */
const env = (k: string): string | undefined => {
  const v = import.meta.env?.[k] ?? process.env[k];
  return v === undefined || v === null || String(v).trim() === '' ? undefined : String(v).trim();
};

/** Clave pública del widget (va en la página). Vacía = captcha desactivado. */
export const turnstileSiteKey = (): string => env('TURNSTILE_SITE_KEY') ?? '';

/** ¿Está activo el captcha? Hacen falta las dos claves. */
export const turnstileEnabled = (): boolean => Boolean(env('TURNSTILE_SITE_KEY') && env('TURNSTILE_SECRET_KEY'));

/**
 * true si el token que mandó el navegador es válido (o si el captcha no está activo).
 * Si Cloudflare no responde se deja pasar: el límite de peticiones por IP sigue
 * protegiendo, y una caída de Cloudflare no debe impedir que un cliente pague.
 */
export async function verifyTurnstile(token: unknown, ip: string): Promise<boolean> {
  if (!turnstileEnabled()) return true;
  const response = typeof token === 'string' ? token.trim() : '';
  if (!response || response.length > 2048) return false;
  try {
    const body = new URLSearchParams({ secret: env('TURNSTILE_SECRET_KEY')!, response });
    if (ip && ip !== 'desconocida') body.set('remoteip', ip);
    const res = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST',
      body,
      signal: AbortSignal.timeout(5000),
    });
    const out = (await res.json()) as { success?: boolean };
    return out.success === true;
  } catch (err) {
    console.error('[turnstile] no se pudo verificar; se deja pasar', err instanceof Error ? err.message : err);
    return true;
  }
}
