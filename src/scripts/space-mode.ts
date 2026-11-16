/**
 * ¿La página /reservar/ está en "modo espacio"? Lo está cuando llega con
 * `?espacio=109` (desde la página de Espacios) o al volver del TPV de un pago de
 * espacio (el token de vuelta lleva `kind: "space"`). Lo comparten el script de
 * balcones (Book.astro), que en ese caso no arranca, y el de espacios.
 */

/** Número del espacio pedido en la URL ("109"), solo si tiene forma válida. */
export function spaceNumberFromUrl(): string | null {
  const n = new URLSearchParams(location.search).get('espacio');
  return n && /^\d{3}$/.test(n) ? n : null;
}

/** ¿El token de vuelta del pago (?r=…) es de un espacio? Solo para enrutar la
 *  pantalla: el servidor valida la firma de verdad en /api/checkout-status. */
function returnTokenIsSpace(): boolean {
  const token = new URLSearchParams(location.search).get('r');
  if (!token) return false;
  try {
    const b64 = token.split('.')[0].replace(/-/g, '+').replace(/_/g, '/');
    const json = new TextDecoder().decode(Uint8Array.from(atob(b64), (c) => c.charCodeAt(0)));
    return JSON.parse(json).kind === 'space';
  } catch {
    return false;
  }
}

export function isSpaceMode(): boolean {
  const q = new URLSearchParams(location.search);
  return q.has('espacio') || (q.has('paid') && returnTokenIsSpace());
}
