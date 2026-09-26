/**
 * Pago con Redsys (TPV virtual, integración por redirección). La reserva NO
 * se crea en Airtable hasta que el banco confirma el pago: no se "solicita"
 * nada, lo que el cliente reserva son habitaciones que el sistema ya muestra
 * como libres, así que pagar es lo que confirma la reserva (ver
 * /api/redsys-notification).
 *
 * Sin REDSYS_MERCHANT_CODE + REDSYS_SECRET_KEY la web cae a un modo de
 * demostración: /api/checkout crea la reserva directamente, sin cobrar nada,
 * para poder probar el flujo entero sin TPV.
 *
 * Firma (HMAC_SHA256_V1): la clave de comercio (base64) sirve para cifrar con
 * 3DES el número de pedido; el resultado es la clave con la que se hace el
 * HMAC-SHA256 de los parámetros (base64).
 */
import { createCipheriv, createHmac, randomInt, timingSafeEqual } from 'node:crypto';

const env = (k: string): string | undefined => import.meta.env?.[k] ?? process.env[k];

const MERCHANT_CODE = env('REDSYS_MERCHANT_CODE');
const TERMINAL = env('REDSYS_TERMINAL') ?? '1';
const SECRET_KEY = env('REDSYS_SECRET_KEY');
/** 'live' = TPV real; cualquier otro valor (o vacío) = entorno de pruebas. */
const LIVE = env('REDSYS_ENV') === 'live';

const HOST = LIVE ? 'https://sis.redsys.es' : 'https://sis-t.redsys.es:25443';
export const REDSYS_PAY_URL = `${HOST}/sis/realizarPago`;
const REDSYS_REST_URL = `${HOST}/sis/rest/trataPeticionREST`;

export function redsysEnabled(): boolean {
  return Boolean(MERCHANT_CODE && SECRET_KEY);
}

const CURRENCY_EUR = '978';
/** Código de idioma del TPV (DS_MERCHANT_CONSUMERLANGUAGE). */
const CONSUMER_LANGUAGE: Record<string, string> = { es: '001', en: '002', fr: '004', de: '005', it: '007' };

// --- firma -------------------------------------------------------------

function requireKey(): string {
  if (!SECRET_KEY) throw new Error('REDSYS_SECRET_KEY no configurada');
  return SECRET_KEY;
}

function orderKey(order: string): Buffer {
  const key = Buffer.from(requireKey(), 'base64');
  const cipher = createCipheriv('des-ede3-cbc', key, Buffer.alloc(8, 0));
  cipher.setAutoPadding(false);
  const padded = Buffer.concat([Buffer.from(order, 'utf8')]);
  const rem = padded.length % 8;
  const input = rem ? Buffer.concat([padded, Buffer.alloc(8 - rem, 0)]) : padded;
  return Buffer.concat([cipher.update(input), cipher.final()]);
}

/** Firma de unos parámetros (base64) para un pedido dado. */
function signParams(paramsB64: string, order: string): string {
  return createHmac('sha256', orderKey(order)).update(paramsB64).digest('base64');
}

const toStd = (b64: string) => b64.replace(/-/g, '+').replace(/_/g, '/');

function safeEqual(a: string, b: string): boolean {
  const ba = Buffer.from(a);
  const bb = Buffer.from(b);
  return ba.length === bb.length && timingSafeEqual(ba, bb);
}

const encodeParams = (obj: Record<string, unknown>) =>
  Buffer.from(JSON.stringify(obj), 'utf8').toString('base64');

export function decodeParams(b64: string): Record<string, string> {
  return JSON.parse(Buffer.from(toStd(b64), 'base64').toString('utf8'));
}

// --- pedido ------------------------------------------------------------

/** Nº de pedido de Redsys: 4 dígitos (AAMM) + 8 dígitos aleatorios. */
export function newOrder(now = new Date()): string {
  const yymm = `${String(now.getFullYear()).slice(2)}${String(now.getMonth() + 1).padStart(2, '0')}`;
  return `${yymm}${String(randomInt(0, 100_000_000)).padStart(8, '0')}`;
}

export interface PaymentInput {
  order: string;
  amountEuros: number;
  lang: string;
  description: string;
  holder: string;
  /** Datos de la reserva, devueltos tal cual por Redsys en la notificación. */
  data: Record<string, unknown>;
  /** Texto legible que abre "Datos del comercio" en el email que Redsys manda
   *  al hotel (p. ej. "FALLAS FAL-001 hab412 2027-03-12"), para reconocer de
   *  un vistazo que el pago es de Fallas. Solo letras, cifras, espacios,
   *  guion, punto y guion bajo (Redsys es estricto con otros símbolos). */
  label?: string;
  notificationUrl: string;
  okUrl: string;
  koUrl: string;
}

/** Campos del formulario POST que redirige al cliente al TPV. */
export function buildPayment(p: PaymentInput) {
  if (!MERCHANT_CODE) throw new Error('REDSYS_MERCHANT_CODE no configurado');
  const payload = Buffer.from(JSON.stringify(p.data), 'utf8').toString('base64url');
  const label = (p.label ?? '').replace(/[^A-Za-z0-9 ._-]/g, '').trim();
  const merchantData = label ? `${label} ${payload}` : payload;
  const paramsB64 = encodeParams({
    DS_MERCHANT_AMOUNT: String(Math.round(p.amountEuros * 100)),
    DS_MERCHANT_ORDER: p.order,
    DS_MERCHANT_MERCHANTCODE: MERCHANT_CODE,
    DS_MERCHANT_CURRENCY: CURRENCY_EUR,
    DS_MERCHANT_TRANSACTIONTYPE: '0',
    DS_MERCHANT_TERMINAL: TERMINAL,
    DS_MERCHANT_MERCHANTURL: p.notificationUrl,
    DS_MERCHANT_URLOK: p.okUrl,
    DS_MERCHANT_URLKO: p.koUrl,
    DS_MERCHANT_MERCHANTNAME: 'Hotel Venecia Plaza Centro',
    DS_MERCHANT_PRODUCTDESCRIPTION: p.description,
    DS_MERCHANT_TITULAR: p.holder,
    DS_MERCHANT_CONSUMERLANGUAGE: CONSUMER_LANGUAGE[p.lang] ?? '001',
    DS_MERCHANT_MERCHANTDATA: merchantData,
  });
  return {
    action: REDSYS_PAY_URL,
    fields: {
      Ds_SignatureVersion: 'HMAC_SHA256_V1',
      Ds_MerchantParameters: paramsB64,
      Ds_Signature: signParams(paramsB64, p.order),
    },
  };
}

/** Datos de la reserva que viajan en DS_MERCHANT_MERCHANTDATA. */
export function readMerchantData(params: Record<string, string>): Record<string, string> {
  const raw = params.Ds_MerchantData ?? '';
  // Puede llevar delante el texto legible ("FALLAS FAL-001 …"): los datos
  // codificados son lo que va tras el último espacio.
  // Redsys puede devolver los espacios como "+" (los datos codificados no
  // llevan "+": son base64url).
  let decoded = raw.replace(/\+/g, ' ');
  try {
    decoded = decodeURIComponent(decoded);
  } catch {
    /* ya venía sin codificar */
  }
  const encoded = decoded.trim().split(/\s+/).pop() ?? '';
  try {
    return JSON.parse(Buffer.from(encoded, 'base64url').toString('utf8'));
  } catch {
    return {};
  }
}

/** Valida la firma de una notificación de Redsys y devuelve sus parámetros
 *  (null si la firma no es válida). */
export function verifyNotification(form: {
  Ds_SignatureVersion?: string;
  Ds_MerchantParameters?: string;
  Ds_Signature?: string;
}): Record<string, string> | null {
  const { Ds_SignatureVersion, Ds_MerchantParameters, Ds_Signature } = form;
  if (Ds_SignatureVersion !== 'HMAC_SHA256_V1' || !Ds_MerchantParameters || !Ds_Signature) return null;
  let params: Record<string, string>;
  try {
    params = decodeParams(Ds_MerchantParameters);
  } catch {
    return null;
  }
  const order = params.Ds_Order;
  if (!order) return null;
  const expected = signParams(Ds_MerchantParameters, order);
  return safeEqual(toStd(Ds_Signature), expected) ? params : null;
}

/** Ds_Response 0000–0099 = operación autorizada. */
export function isAuthorised(params: Record<string, string>): boolean {
  const code = Number(params.Ds_Response);
  return Number.isInteger(code) && code >= 0 && code <= 99;
}

/** Devolución (transaction type 3) por la API REST de Redsys. Devuelve true
 *  si el banco la acepta; en cualquier otro caso false (hay que hacerla a
 *  mano desde el portal). */
export async function refundOrder(order: string, amountCents: number): Promise<boolean> {
  if (!MERCHANT_CODE) return false;
  try {
    const paramsB64 = encodeParams({
      DS_MERCHANT_AMOUNT: String(amountCents),
      DS_MERCHANT_ORDER: order,
      DS_MERCHANT_MERCHANTCODE: MERCHANT_CODE,
      DS_MERCHANT_CURRENCY: CURRENCY_EUR,
      DS_MERCHANT_TRANSACTIONTYPE: '3',
      DS_MERCHANT_TERMINAL: TERMINAL,
    });
    const res = await fetch(REDSYS_REST_URL, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        Ds_SignatureVersion: 'HMAC_SHA256_V1',
        Ds_MerchantParameters: paramsB64,
        Ds_Signature: signParams(paramsB64, order),
      }),
    });
    const out = (await res.json()) as { Ds_MerchantParameters?: string };
    if (!out.Ds_MerchantParameters) return false;
    const p = decodeParams(out.Ds_MerchantParameters);
    return isAuthorised(p);
  } catch (err) {
    console.error('[redsys] fallo al devolver el pago', err);
    return false;
  }
}

// --- token de vuelta ---------------------------------------------------

/** Al volver del TPV (URL OK) la web necesita los datos para pintar la
 *  confirmación sin depender de que la notificación ya se haya procesado.
 *  Viajan en la URL firmados con la clave del comercio: no se pueden
 *  inventar ni alterar. */
export function signReturnToken(data: Record<string, unknown>): string {
  const body = Buffer.from(JSON.stringify(data), 'utf8').toString('base64url');
  const sig = createHmac('sha256', requireKey()).update(body).digest('base64url');
  return `${body}.${sig}`;
}

export function readReturnToken(token: string): Record<string, any> | null {
  const [body, sig] = token.split('.');
  if (!body || !sig) return null;
  const expected = createHmac('sha256', requireKey()).update(body).digest('base64url');
  if (!safeEqual(sig, expected)) return null;
  try {
    return JSON.parse(Buffer.from(body, 'base64url').toString('utf8'));
  } catch {
    return null;
  }
}
