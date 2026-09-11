/**
 * Lógica de la experiencia "balcón para la mascletà": tipos, fecha, validación
 * y precio. Independiente de Airtable y de Astro.
 *
 * No es una reserva de noches: cada habitación se alquila por horas (ver
 * FALLAS.accessStart/accessEnd en src/consts.ts) el día elegido dentro de la
 * ventana de Fallas. El precio es plano por habitación y ya incluye el Snack
 * Pack; no hay noches ni extras que sumar.
 */
import { FALLAS, LOCALES, type Locale } from '../consts';

export interface Room {
  id: string;
  slug: string;
  /** Número o nombre real de la habitación, ej. "317". */
  roomNumber: string;
  /** Planta, ej. "3ª planta". */
  floor: string;
  capacity: number;
  /** Descripción de la cama, ej. "Cama doble o dos camas". */
  bed: string;
  price: number;
  /** Cuántas unidades de esta habitación exacta hay (normalmente 1). */
  cupo: number;
  descriptionEs: string | null;
  descriptionEn: string | null;
  /** Fotos en orden; la primera es la principal. Vacío si no hay aún. */
  photos: string[];
  order: number;
}

/** Habitación con su disponibilidad ya calculada para una fecha. */
export interface RoomOffer extends Room {
  available: boolean;
}

export interface Quote {
  total: number;
  currency: 'EUR';
}

// --- Fechas -----------------------------------------------------------------

const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/;

/** Primer día de la ventana de Fallas (= FALLAS.saleStart). */
export const FIRST_DAY = FALLAS.saleStart;
/** Último día de la ventana de Fallas (= FALLAS.saleEnd). */
export const LAST_DAY = FALLAS.saleEnd;

export type DateError = 'formato' | 'fuera-de-ventana';

export interface DateValidation {
  ok: boolean;
  error?: DateError;
}

/** Valida que la fecha es un día real dentro de la ventana de Fallas. */
export function validateDate(date: string): DateValidation {
  if (!ISO_DATE.test(date)) return { ok: false, error: 'formato' };
  if (date < FIRST_DAY || date > LAST_DAY) return { ok: false, error: 'fuera-de-ventana' };
  return { ok: true };
}

export function isLocale(x: unknown): x is Locale {
  return typeof x === 'string' && (LOCALES as readonly string[]).includes(x);
}

// --- Importes --------------------------------------------------------------

/** Precio de la experiencia: plano por habitación, Snack Pack incluido. */
export function buildQuote(room: Room): Quote {
  return { total: room.price, currency: 'EUR' };
}

/** Localizador corto tipo `FAL-7Q3KD` (sin caracteres ambiguos). */
export function newLocator(): string {
  const alphabet = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let s = '';
  for (let i = 0; i < 5; i++) s += alphabet[Math.floor(Math.random() * alphabet.length)];
  return `FAL-${s}`;
}
