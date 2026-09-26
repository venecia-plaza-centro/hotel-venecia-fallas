/**
 * Interruptor de apertura de ventas. Mientras esté cerrado la web se puede
 * ver, pero no se puede pagar ni bloquear ninguna habitación.
 *
 * Se controla con variables de entorno de Vercel (no hace falta tocar código
 * ni volver a desplegar la web, solo redesplegar tras cambiar la variable):
 *  - SALES_OPEN=true   → ventas abiertas ya.
 *  - SALES_OPEN=false  → ventas cerradas (aunque haya fecha de apertura).
 *  - SALES_OPEN_FROM=2026-11-01T09:00:00+01:00 → se abren solas a esa hora
 *    (si SALES_OPEN no está definida).
 *  - Sin ninguna de las dos: CERRADAS (lo seguro antes del lanzamiento).
 *
 * Solo lo lee el servidor: los pagos ya iniciados siguen confirmándose
 * aunque se cierre justo entonces (/api/redsys-notification no lo mira).
 */
const env = (k: string): string | undefined => import.meta.env?.[k] ?? process.env[k];

export interface SalesStatus {
  open: boolean;
  /** ISO de la apertura programada, si la hay y aún no ha llegado. */
  opensAt?: string;
}

export function salesStatus(now = Date.now()): SalesStatus {
  const flag = env('SALES_OPEN')?.trim().toLowerCase();
  if (flag === 'true') return { open: true };
  if (flag === 'false') return { open: false };

  const from = env('SALES_OPEN_FROM')?.trim();
  const at = from ? Date.parse(from) : NaN;
  if (Number.isFinite(at)) {
    return now >= at ? { open: true } : { open: false, opensAt: new Date(at).toISOString() };
  }
  return { open: false };
}
