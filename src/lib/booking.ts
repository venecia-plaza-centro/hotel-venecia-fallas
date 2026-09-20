/**
 * Lógica de la experiencia "balcón para la mascletá": tipos, fecha, validación
 * y precio. Independiente de Airtable y de Astro.
 *
 * No es una reserva de noches: cada habitación se alquila por horas (ver
 * FALLAS.accessStart/accessEnd en src/consts.ts) el día elegido dentro de la
 * ventana de Fallas. El Snack Pack va incluido siempre; no hay noches ni
 * extras que sumar. Las 9 habitaciones admiten hasta 4 personas, y el precio
 * depende de cuántas se apunten (2, 3 o 4) Y de si el día elegido es entre
 * semana o fin de semana (viernes, sábado o domingo): ver `Room.prices`.
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
  /** Precio de la experiencia según personas (2, 3 o 4) y tipo de día.
   *  Snack Pack incluido siempre. Ver `isWeekend` para saber qué tabla
   *  aplica a una fecha. */
  prices: { weekday: Record<GuestCount, number>; weekend: Record<GuestCount, number> };
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

/** Datos de una reserva ya decidida, para avisar al cliente por email y al
 *  hotel. Compartido por email.ts. */
export interface BookingNotification {
  locator: string;
  room: Room;
  date: string;
  guests: number;
  quote: Quote;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  notes?: string;
  lang: Locale;
  /** true = pago ya cobrado de verdad en Stripe. false = modo demostración
   *  sin pasarela conectada (no se ha cobrado nada realmente). */
  paid: boolean;
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

/** Todas las fechas ISO de la ventana de venta, de FIRST_DAY a LAST_DAY. */
export function allSaleDays(): string[] {
  const days: string[] = [];
  const d = new Date(`${FIRST_DAY}T00:00:00Z`);
  const last = new Date(`${LAST_DAY}T00:00:00Z`);
  while (d <= last) {
    days.push(d.toISOString().slice(0, 10));
    d.setUTCDate(d.getUTCDate() + 1);
  }
  return days;
}

export function isLocale(x: unknown): x is Locale {
  return typeof x === 'string' && (LOCALES as readonly string[]).includes(x);
}

/** Fin de semana = viernes, sábado o domingo (confirmado por el hotel).
 *  Se calcula en UTC, como el resto de fechas de esta ventana. */
export function isWeekend(date: string): boolean {
  const day = new Date(`${date}T00:00:00Z`).getUTCDay(); // 0=domingo … 6=sábado
  return day === 0 || day === 5 || day === 6;
}

// --- Importes --------------------------------------------------------------

/** Precio de la habitación para ese nº de personas y fecha (entre semana o
 *  fin de semana). Snack Pack incluido. */
export function priceForGuests(room: Room, guests: GuestCount, date: string): number {
  return room.prices[isWeekend(date) ? 'weekend' : 'weekday'][guests];
}

export function buildQuote(room: Room, guests: GuestCount, date: string): Quote {
  return { total: priceForGuests(room, guests, date), currency: 'EUR' };
}
