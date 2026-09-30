/**
 * Límite de peticiones muy simple, en memoria (por instancia de función de
 * Vercel: no es un límite distribuido entre instancias, pero basta para
 * encarecer el caso real de abuso — un script disparando el mismo endpoint
 * muchas veces seguidas desde la misma IP para bloquear habitaciones sin
 * pagar — sin depender de ningún servicio externo.
 */
const buckets = new Map<string, { count: number; resetAt: number }>();

/** true si `key` ha superado `max` peticiones en la ventana `windowMs`. */
export function isRateLimited(key: string, max: number, windowMs: number): boolean {
  const now = Date.now();
  const bucket = buckets.get(key);
  if (!bucket || now > bucket.resetAt) {
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    return false;
  }
  bucket.count += 1;
  return bucket.count > max;
}

/** IP del cliente a partir de las cabeceras que pone Vercel delante. */
export function clientIp(request: Request): string {
  const fwd = request.headers.get('x-forwarded-for');
  return fwd?.split(',')[0]?.trim() || request.headers.get('x-real-ip') || 'desconocida';
}
