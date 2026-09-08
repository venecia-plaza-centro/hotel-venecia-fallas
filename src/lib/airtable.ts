/**
 * Acceso a Airtable (REST v0). Tres tablas: Habitaciones, Extras catering,
 * Reservas. Esquema en docs/airtable-esquema.md.
 *
 * Sin AIRTABLE_TOKEN + AIRTABLE_BASE_ID la web cae a los datos de ejemplo
 * (src/lib/fixtures.ts) y `createBooking` solo registra por consola. Así el
 * flujo entero es probable en local sin cuenta de Airtable.
 */
import {
  buildQuote,
  eachNight,
  newLocator,
  type Extra,
  type Room,
  type RoomOffer,
} from './booking';
import { FIXTURE_EXTRAS, FIXTURE_ROOMS } from './fixtures';
import type { Locale } from '../consts';

const TOKEN = import.meta.env.AIRTABLE_TOKEN ?? process.env.AIRTABLE_TOKEN;
const BASE_ID = import.meta.env.AIRTABLE_BASE_ID ?? process.env.AIRTABLE_BASE_ID;

const TABLE = {
  rooms: 'Habitaciones',
  extras: 'Extras catering',
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
  const photo = Array.isArray(f['Foto']) && f['Foto'][0] ? (f['Foto'][0] as any).url ?? null : null;
  return {
    id: r.id,
    slug: str(f['Slug']) ?? r.id,
    name: str(f['Nombre']) ?? 'Habitación',
    type: str(f['Tipo']) ?? 'doble',
    capacity: num(f['Capacidad']),
    plazaView: Boolean(f['Vistas a la plaza']),
    pricePerNight: num(f['Precio noche']),
    cupo: num(f['Cupo']),
    descriptionEs: str(f['Descripcion ES']),
    descriptionEn: str(f['Descripcion EN']),
    photo,
    order: num(f['Orden']),
  };
}

function mapExtra(r: AirtableRecord): Extra {
  const f = r.fields;
  return {
    id: r.id,
    slug: str(f['Slug']) ?? r.id,
    name: str(f['Nombre']) ?? 'Extra',
    descriptionEs: str(f['Descripcion ES']),
    descriptionEn: str(f['Descripcion EN']),
    pricePerPerson: num(f['Precio persona']),
    minPeople: num(f['Minimo personas']),
    order: num(f['Orden']),
  };
}

const bySortOrder = (a: { order: number }, b: { order: number }) => a.order - b.order;

export async function getRooms(): Promise<Room[]> {
  if (!airtableEnabled()) return [...FIXTURE_ROOMS].sort(bySortOrder);
  const recs = await listAll(TABLE.rooms, { filterByFormula: '{Activa}' });
  return recs.map(mapRoom).sort(bySortOrder);
}

export async function getExtras(): Promise<Extra[]> {
  if (!airtableEnabled()) return [...FIXTURE_EXTRAS].sort(bySortOrder);
  const recs = await listAll(TABLE.extras, { filterByFormula: '{Activo}' });
  return recs.map(mapExtra).sort(bySortOrder);
}

interface OverlappingReservation {
  roomId: string;
  from: string;
  to: string;
}

/** Reservas no canceladas que solapan [from, to). Vacío en modo ejemplo. */
async function getOverlappingReservations(
  from: string,
  to: string,
): Promise<OverlappingReservation[]> {
  if (!airtableEnabled()) return [];
  const formula = `AND({Estado}!='cancelada', IS_BEFORE({Entrada}, '${to}'), IS_AFTER({Salida}, '${from}'))`;
  const recs = await listAll(TABLE.bookings, { filterByFormula: formula });
  return recs
    .map((r) => {
      const f = r.fields;
      const link = f['Habitacion'];
      const roomId = Array.isArray(link) && link[0] ? String(link[0]) : '';
      return { roomId, from: str(f['Entrada']) ?? '', to: str(f['Salida']) ?? '' };
    })
    .filter((r) => r.roomId && r.from && r.to);
}

/**
 * Habitaciones con disponibilidad y precio para un rango de fechas.
 * Disponible = en todas las noches del rango, reservas que cubren esa noche
 * < Cupo del tipo. Nunca vende por encima del cupo.
 */
export async function getRoomOffers(from: string, to: string): Promise<RoomOffer[]> {
  const [rooms, reservations] = await Promise.all([
    getRooms(),
    getOverlappingReservations(from, to),
  ]);
  const nights = eachNight(from, to);

  return rooms.map((room) => {
    const forRoom = reservations.filter((r) => r.roomId === room.id);
    const available =
      room.cupo > 0 &&
      nights.every(
        (night) => forRoom.filter((r) => r.from <= night && night < r.to).length < room.cupo,
      );
    const quote = buildQuote(room, null, { from, to });
    return { ...room, available, nights: quote.nights, lodgingTotal: quote.lodging };
  });
}

// --- Crear reserva --------------------------------------------------------

export interface BookingCreate {
  from: string;
  to: string;
  room: Room;
  guests: number;
  extra: Extra | null;
  cateringPeople: number;
  lodging: number;
  catering: number;
  total: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  country?: string;
  notes?: string;
  lang: Locale;
}

export interface BookingResult {
  id: string;
  locator: string;
}

export async function createBooking(input: BookingCreate): Promise<BookingResult> {
  const locator = newLocator();

  const fields: Record<string, unknown> = {
    Localizador: locator,
    Estado: 'solicitada',
    Entrada: input.from,
    Salida: input.to,
    Habitacion: [input.room.id],
    Huespedes: input.guests,
    'Comensales catering': input.extra ? input.cateringPeople : 0,
    'Nombre cliente': input.firstName,
    'Apellidos cliente': input.lastName,
    Email: input.email,
    Telefono: input.phone,
    Idioma: input.lang,
    'Importe alojamiento': input.lodging,
    'Importe catering': input.catering,
    'Importe total': input.total,
    Pago: 'pendiente',
    Origen: 'web',
  };
  if (input.extra) fields.Catering = [input.extra.id];
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
