/**
 * Datos del cliente que llegan al pago, limpiados y con tope de longitud. Los
 * mismos topes que viajan en los datos del pago de Redsys (ver
 * DS_MERCHANT_MERCHANTDATA): lo que se guarda en Airtable es lo que confirma el
 * banco, y nadie puede meter megabytes en un campo. Lo usa el pago de espacios
 * (el de balcones lleva su propia copia en pages/api/checkout.ts).
 */
import { DEFAULT_LOCALE, type Locale } from '../consts';
import { isLocale } from './booking';

const EMAIL_RE = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;
const MAX = { name: 60, email: 100, phone: 30, country: 40, notes: 200 } as const;
const str = (v: unknown, max: number) => (typeof v === 'string' ? v.trim().slice(0, max) : '');

export interface CustomerInput {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  country: string;
  notes: string;
  lang: Locale;
}

/** Campos válidos o la lista de los que faltan / están mal. */
export function readCustomer(body: Record<string, unknown>): { ok: true; data: CustomerInput } | { ok: false; fields: string[] } {
  const firstName = str(body.firstName, MAX.name);
  const lastName = str(body.lastName, MAX.name);
  // El email no se recorta en silencio (quedaría otra dirección): si es más largo, se rechaza.
  const emailRaw = typeof body.email === 'string' ? body.email.trim() : '';
  const email = emailRaw.length <= MAX.email ? emailRaw : '';
  const phone = str(body.phone, MAX.phone);

  const fields: string[] = [];
  if (!firstName) fields.push('firstName');
  if (!lastName) fields.push('lastName');
  if (!EMAIL_RE.test(email)) fields.push('email');
  if (phone.replace(/\D/g, '').length < 6) fields.push('phone');
  if (body.consent !== true) fields.push('consent');
  if (fields.length) return { ok: false, fields };

  return {
    ok: true,
    data: {
      firstName,
      lastName,
      email,
      phone,
      country: str(body.country, MAX.country),
      notes: str(body.notes, MAX.notes),
      lang: isLocale(body.lang) ? body.lang : DEFAULT_LOCALE,
    },
  };
}
