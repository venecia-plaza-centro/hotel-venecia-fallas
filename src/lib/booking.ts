/**
 * Lógica de reserva independiente de Airtable y de Astro: tipos, fechas,
 * validación de la estancia y cálculo de importes. Se prueba y se razona sola.
 */
import { FALLAS, LOCALES, type Locale } from '../consts';

export interface Room {
  id: string;
  slug: string;
  name: string;
  type: 'doble' | 'triple' | 'cuadruple' | 'suite' | string;
  capacity: number;
  plazaView: boolean;
  pricePerNight: number;
  cupo: number;
  descriptionEs: string | null;
  descriptionEn: string | null;
  photo: string | null;
  order: number;
}

export interface Extra {
  id: string;
  slug: string;
  name: string;
  descriptionEs: string | null;
  descriptionEn: string | null;
  pricePerPerson: number;
  minPeople: number;
  order: number;
}

/** Habitación con su disponibilidad y precio ya calculados para un rango. */
export interface RoomOffer extends Room {
  available: boolean;
  nights: number;
  lodgingTotal: number;
}

export interface Quote {
  nights: number;
  lodging: number;
  catering: number;
  total: number;
  currency: 'EUR';
}

// --- Fechas -----------------------------------------------------------------

const DAY_MS = 86_400_000;
const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/;

/** 'YYYY-MM-DD' → Date en UTC (sin sorpresas de zona horaria). */
export function parseDate(s: string): Date {
  const [y, m, d] = s.split('-').map(Number);
  return new Date(Date.UTC(y, m - 1, d));
}

export function toISODate(d: Date): string {
  return d.toISOString().slice(0, 10);
}

export function addDays(s: string, n: number): string {
  return toISODate(new Date(parseDate(s).getTime() + n * DAY_MS));
}

/** Número de noches entre entrada y salida. */
export function countNights(from: string, to: string): number {
  return Math.round((parseDate(to).getTime() - parseDate(from).getTime()) / DAY_MS);
}

/** Lista de noches ['2027-03-01', ...] que cubre la estancia [from, to). */
export function eachNight(from: string, to: string): string[] {
  const out: string[] = [];
  for (let t = parseDate(from).getTime(); t < parseDate(to).getTime(); t += DAY_MS) {
    out.push(toISODate(new Date(t)));
  }
  return out;
}

/** Primer día que se puede reservar como noche (= FALLAS.saleStart). */
export const FIRST_NIGHT = FALLAS.saleStart;
/** Última noche reservable (= FALLAS.saleEnd). */
export const LAST_NIGHT = FALLAS.saleEnd;
/** Última fecha válida de salida (día siguiente a la última noche). */
export const LAST_CHECKOUT = addDays(FALLAS.saleEnd, 1);

export type StayError =
  | 'formato'
  | 'orden'
  | 'fuera-de-ventana'
  | 'minimo-noches';

export interface StayValidation {
  ok: boolean;
  error?: StayError;
  nights: number;
}

/** Valida que [from, to) cae dentro de la ventana de Fallas y cumple el mínimo. */
export function validateStay(from: string, to: string): StayValidation {
  if (!ISO_DATE.test(from) || !ISO_DATE.test(to)) return { ok: false, error: 'formato', nights: 0 };
  const nights = countNights(from, to);
  if (nights <= 0) return { ok: false, error: 'orden', nights };
  if (from < FIRST_NIGHT || to > LAST_CHECKOUT) {
    return { ok: false, error: 'fuera-de-ventana', nights };
  }
  if (nights < FALLAS.minNights) return { ok: false, error: 'minimo-noches', nights };
  return { ok: true, nights };
}

export function isLocale(x: unknown): x is Locale {
  return typeof x === 'string' && (LOCALES as readonly string[]).includes(x);
}

// --- Importes --------------------------------------------------------------

export interface QuoteRequest {
  from: string;
  to: string;
  cateringPeople?: number;
}

/** Calcula los importes de una reserva. `extra` = null si no se añade catering. */
export function buildQuote(room: Room, extra: Extra | null, req: QuoteRequest): Quote {
  const nights = countNights(req.from, req.to);
  const lodging = round2(room.pricePerNight * nights);
  const people = extra ? Math.max(0, Math.trunc(req.cateringPeople ?? 0)) : 0;
  const catering = extra ? round2(extra.pricePerPerson * people) : 0;
  return { nights, lodging, catering, total: round2(lodging + catering), currency: 'EUR' };
}

function round2(n: number): number {
  return Math.round((n + Number.EPSILON) * 100) / 100;
}

/** Localizador corto tipo `FAL-7Q3KD` (sin caracteres ambiguos). */
export function newLocator(): string {
  const alphabet = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let s = '';
  for (let i = 0; i < 5; i++) s += alphabet[Math.floor(Math.random() * alphabet.length)];
  return `FAL-${s}`;
}
