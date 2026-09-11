/**
 * Lógica de la experiencia "balcón para la mascletá": tipos, fecha, validación
 * y precio. Independiente de Airtable y de Astro.
 *
 * No es una reserva de noches: cada habitación se alquila por horas (ver
 * FALLAS.accessStart/accessEnd en src/consts.ts) el día elegido dentro de la
 * ventana de Fallas. El Snack Pack va incluido siempre; no hay noches ni
 * extras que sumar. Las 10 habitaciones admiten hasta 4 personas, y el precio
 * depende de cuántas se apunten (2, 3 o 4): ver `Room.prices`.
 */
import { FALLAS, LOCALES, type Locale } from '../consts';

/** Nº de personas admitidos: solo estos tres valores tienen precio. */
export const GUEST_OPTIONS = [2, 3, 4] as const;
export type GuestCount = (typeof GUEST_OPTIONS)[number];

export function isGuestCount(n: unknown): n is GuestCount {
  return (GUEST_OPTIONS as readonly unknown[]).includes(n);
}

export interface Room {
  id: string;
  slug: string;
  /** Número o nombre real de la habitación, ej. "317". */
  roomNumber: string;
  /** Planta, ej. "3ª planta". */
  floor: string;
  capacity: number;
  /** Precio de la experiencia según personas (2, 3 o 4). Snack Pack incluido. */
  prices: Record<GuestCount, number>;
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

/** Precio de la habitación para ese nº de personas (Snack Pack incluido). */
export function priceForGuests(room: Room, guests: GuestCount): number {
  return room.prices[guests];
}

export function buildQuote(room: Room, guests: GuestCount): Quote {
  return { total: priceForGuests(room, guests), currency: 'EUR' };
}

/** Localizador corto tipo `FAL-7Q3KD` (sin caracteres ambiguos). */
export function newLocator(): string {
  const alphabet = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let s = '';
  for (let i = 0; i < 5; i++) s += alphabet[Math.floor(Math.random() * alphabet.length)];
  return `FAL-${s}`;
}
