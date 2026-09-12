/**
 * Acceso a Airtable (REST v0). Dos tablas: Habitaciones y Reservas.
 * Esquema en docs/airtable-esquema.md.
 *
 * No es una reserva de noches: cada registro de Reservas es una habitación
 * alquilada por horas un día concreto (ventana en FALLAS.accessStart/End).
 *
 * Sin AIRTABLE_TOKEN + AIRTABLE_BASE_ID la web cae a los datos de ejemplo
 * (src/lib/fixtures.ts) y `createBooking` solo registra por consola. Así el
 * flujo entero es probable en local sin cuenta de Airtable.
 */
import { newLocator, type ConfirmChannel, type Room, type RoomOffer } from './booking';
import { FIXTURE_ROOMS } from './fixtures';
import type { Locale } from '../consts';

const TOKEN = import.meta.env.AIRTABLE_TOKEN ?? process.env.AIRTABLE_TOKEN;
const BASE_ID = import.meta.env.AIRTABLE_BASE_ID ?? process.env.AIRTABLE_BASE_ID;

const TABLE = {
  rooms: 'Habitaciones',
  bookings: 'Reservas',
} as const;

export function airtableEnabled(): boolean {
  return Boolean(TOKEN && BASE_ID);
}

export class AirtableError extends Error {
  constructor(
    message: string,
    readonly status = 502,
  ) {
    super(message);
    this.name = 'AirtableError';
  }
}

interface AirtableRecord {
  id: string;
  fields: Record<string, unknown>;
}

async function airtable(
  path: string,
  init?: RequestInit & { query?: Record<string, string> },
): Promise<any> {
  const url = new URL(`https://api.airtable.com/v0/${BASE_ID}/${path}`);
  for (const [k, v] of Object.entries(init?.query ?? {})) url.searchParams.set(k, v);

  const res = await fetch(url, {
    ...init,
    headers: {
      Authorization: `Bearer ${TOKEN}`,
      'Content-Type': 'application/json',
      ...init?.headers,
    },
  });

  if (!res.ok) {
    const body = await res.text();
    throw new AirtableError(
      `Airtable ${res.status} en ${path}: ${body.slice(0, 300)}`,
      res.status === 429 ? 503 : 502,
    );
  }
  return res.json();
}

/** Recorre la paginación de Airtable y devuelve todos los registros. */
async function listAll(
  table: string,
  query: Record<string, string> = {},
): Promise<AirtableRecord[]> {
  const records: AirtableRecord[] = [];
  let offset: string | undefined;
  do {
    const page = await airtable(encodeURIComponent(table), {
      query: { pageSize: '100', ...query, ...(offset ? { offset } : {}) },
    });
    records.push(...(page.records as AirtableRecord[]));
    offset = page.offset;
  } while (offset);
  return records;
}

const str = (v: unknown): string | null => (typeof v === 'string' && v.trim() ? v : null);
const num = (v: unknown): number => (typeof v === 'number' && Number.isFinite(v) ? v : 0);

function mapRoom(r: AirtableRecord): Room {
  const f = r.fields;
  const photos = Array.isArray(f['Fotos'])
    ? (f['Fotos'] as any[]).map((a) => a?.url).filter((u): u is string => typeof u === 'string')
    : [];
  return {
    id: r.id,
    slug: str(f['Slug']) ?? r.id,
    roomNumber: str(f['Numero']) ?? '',
    floor: str(f['Planta']) ?? '',
    capacity: num(f['Capacidad']),
    prices: {
      2: num(f['Precio 2p']),
      3: num(f['Precio 3p']),
      4: num(f['Precio 4p']),
    },
    cupo: num(f['Cupo']) || 1,
    descriptionEs: str(f['Descripcion ES']),
    descriptionEn: str(f['Descripcion EN']),
    photos,
    order: num(f['Orden']),
  };
}

const bySortOrder = (a: { order: number }, b: { order: number }) => a.order - b.order;

export async function getRooms(): Promise<Room[]> {
  if (!airtableEnabled()) return [...FIXTURE_ROOMS].sort(bySortOrder);
  const recs = await listAll(TABLE.rooms, { filterByFormula: '{Activa}' });
  return recs.map(mapRoom).sort(bySortOrder);
}

/** Reservas no canceladas para una habitación en esa fecha. Vacío en modo ejemplo. */
async function countBookedForDate(date: string, roomIds: string[]): Promise<Map<string, number>> {
  const counts = new Map<string, number>();
  if (!airtableEnabled() || roomIds.length === 0) return counts;

  const formula = `AND({Estado}!='cancelada', {Fecha}='${date}')`;
  const recs = await listAll(TABLE.bookings, { filterByFormula: formula });
  for (const r of recs) {
    const link = r.fields['Habitacion'];
    const roomId = Array.isArray(link) && link[0] ? String(link[0]) : '';
    if (!roomId) continue;
    counts.set(roomId, (counts.get(roomId) ?? 0) + 1);
  }
  return counts;
}

/**
 * Habitaciones con disponibilidad para una fecha. Disponible = reservas ya
 * hechas para esa habitación en esa fecha < Cupo (normalmente 1: es una
 * habitación real concreta, no un tipo).
 */
export async function getRoomOffers(date: string): Promise<RoomOffer[]> {
  const rooms = await getRooms();
  const booked = await countBookedForDate(
    date,
    rooms.map((r) => r.id),
  );
  return rooms.map((room) => ({
    ...room,
    available: (booked.get(room.id) ?? 0) < room.cupo,
  }));
}

/**
 * Nº de habitaciones libres por fecha, para pintar el calendario de
 * disponibilidad antes de elegir día (no depende del nº de personas: la
 * disponibilidad es "¿está ya reservada esa habitación ese día?", ajeno a
 * cuántos huéspedes se apunten).
 */
export async function getAvailabilitySummary(dates: string[]): Promise<Record<string, number>> {
  const rooms = await getRooms();
  const roomIds = rooms.map((r) => r.id);
  const summary: Record<string, number> = {};
  for (const date of dates) {
    const booked = await countBookedForDate(date, roomIds);
    summary[date] = rooms.filter((r) => (booked.get(r.id) ?? 0) < r.cupo).length;
  }
  return summary;
}

// --- Crear reserva --------------------------------------------------------

export interface BookingCreate {
  date: string;
  room: Room;
  guests: number;
  total: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  country?: string;
  notes?: string;
  lang: Locale;
  /** Cómo quiere el cliente que le llegue la confirmación: email o teléfono. */
  confirmVia: ConfirmChannel;
  /** Ya generado antes de cobrar (p.ej. al crear la sesión de Stripe), para
   *  poder mostrárselo al cliente en cuanto vuelve del pago. Si no se pasa,
   *  se genera uno nuevo aquí (modo demo, sin pasarela). */
  locator?: string;
  /**
   * true = el pago ya se ha completado en Stripe antes de llamar aquí (esto
   * solo lo crea el webhook tras cobrar: no hay "solicitud" sin pagar).
   * false = modo demostración sin Stripe conectado, no se ha cobrado nada.
   */
  paid: boolean;
}

export interface BookingResult {
  id: string;
  locator: string;
}

export async function createBooking(input: BookingCreate): Promise<BookingResult> {
  const locator = input.locator ?? newLocator();

  const fields: Record<string, unknown> = {
    Localizador: locator,
    Estado: input.paid ? 'confirmada' : 'solicitada',
    Fecha: input.date,
    Habitacion: [input.room.id],
    Huespedes: input.guests,
    'Nombre cliente': input.firstName,
    'Apellidos cliente': input.lastName,
    Email: input.email,
    Telefono: input.phone,
    Idioma: input.lang,
    'Importe total': input.total,
    Pago: input.paid ? 'pagado' : 'pendiente',
    Origen: 'web',
    'Confirmar por': input.confirmVia === 'phone' ? 'telefono' : 'email',
  };
  if (input.country) fields.Pais = input.country;
  if (input.notes) fields.Notas = input.notes;

  if (!airtableEnabled()) {
    console.info('[airtable:ejemplo] reserva no persistida →', { locator, ...fields });
    return { id: `fix-${locator}`, locator };
  }

  const created = await airtable(encodeURIComponent(TABLE.bookings), {
    method: 'POST',
    body: JSON.stringify({ fields, typecast: true }),
  });
  return { id: created.id as string, locator };
}
