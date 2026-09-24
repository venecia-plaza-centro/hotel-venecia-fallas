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
import { allSaleDays, type Room, type RoomOffer } from './booking';
import { FIXTURE_ROOMS } from './fixtures';
import { FALLAS, type Locale } from '../consts';

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
  createdTime?: string;
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
      weekday: {
        2: num(f['Precio 2p entresemana']),
        3: num(f['Precio 3p entresemana']),
        4: num(f['Precio 4p entresemana']),
      },
      weekend: {
        2: num(f['Precio 2p finde']),
        3: num(f['Precio 3p finde']),
        4: num(f['Precio 4p finde']),
      },
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

/**
 * Reservas que ocupan una habitación: las no canceladas, salvo los bloqueos
 * ("en pago") que ya han caducado. Un bloqueo es el registro que se crea
 * cuando el cliente pasa al TPV: reserva la habitación FALLAS.holdMinutes
 * minutos; si no paga en ese tiempo deja de contar y la habitación vuelve a
 * salir libre (sin borrar nada: el propio registro lleva su hora de
 * creación). `excludeLocator` deja fuera una reserva concreta (la propia, al
 * confirmar su pago).
 */
function activeBookingFormula(excludeLocator?: string): string {
  const parts = [
    `{Estado}!='cancelada'`,
    `OR({Estado}!='en pago', DATETIME_DIFF(NOW(), CREATED_TIME(), 'minutes') < ${FALLAS.holdMinutes})`,
  ];
  if (excludeLocator) parts.push(`{Localizador}!='${excludeLocator.replace(/['"\\]/g, '')}'`);
  return parts.join(', ');
}

/**
 * Reservas activas (ver activeBookingFormula) que cumplan `extra` (otra
 * condición de fórmula, opcional). Si Airtable rechazara la fórmula de los
 * bloqueos (p. ej. un cambio en la base), se cae a la comprobación simple
 * "no cancelada" en vez de romper las reservas: en ese caso los bloqueos
 * cuentan hasta que se cancelen a mano.
 */
async function listActiveBookings(extra?: string, excludeLocator?: string): Promise<AirtableRecord[]> {
  const wrap = (cond: string) => `AND(${cond}${extra ? `, ${extra}` : ''})`;
  try {
    return await listAll(TABLE.bookings, { filterByFormula: wrap(activeBookingFormula(excludeLocator)) });
  } catch (err) {
    if (!(err instanceof AirtableError)) throw err;
    console.error('[airtable] fórmula de bloqueos rechazada, uso la simple', err);
    return listAll(TABLE.bookings, { filterByFormula: wrap(`{Estado}!='cancelada'`) });
  }
}

/** Reservas activas para una habitación en esa fecha. Vacío en modo ejemplo. */
async function countBookedForDate(
  date: string,
  roomIds: string[],
  excludeLocator?: string,
): Promise<Map<string, number>> {
  const counts = new Map<string, number>();
  if (!airtableEnabled() || roomIds.length === 0) return counts;

  // IS_SAME (no igualdad de texto): el campo Fecha es internamente una
  // fecha/hora, y {Fecha}='YYYY-MM-DD' nunca coincide aunque se vea igual
  // en la interfaz — esto dejaba la comprobación de disponibilidad rota
  // para cualquier reserva real (todo parecía siempre libre).
  const recs = await listActiveBookings(`IS_SAME({Fecha}, '${date}', 'day')`, excludeLocator);
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
export async function getRoomOffers(date: string, excludeLocator?: string): Promise<RoomOffer[]> {
  const rooms = await getRooms();
  const booked = await countBookedForDate(
    date,
    rooms.map((r) => r.id),
    excludeLocator,
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

/**
 * Slugs de las habitaciones sin ningún día libre en toda la ventana de
 * venta (1-12 de marzo): para avisarlo ya en Home/Habitaciones, en vez de
 * que el cliente solo lo descubra al entrar en el flujo de reserva. Una
 * sola consulta a Airtable (todas las reservas no canceladas) en vez de
 * una por día. Vacío en modo ejemplo: sin Airtable no hay reservas reales
 * que contar, así que ninguna habitación puede aparecer agotada.
 */
export async function getSoldOutRoomSlugs(): Promise<string[]> {
  if (!airtableEnabled()) return [];
  const rooms = await getRooms();
  if (rooms.length === 0) return [];

  const recs = await listActiveBookings();
  const countByRoomDate = new Map<string, number>();
  for (const r of recs) {
    const link = r.fields['Habitacion'];
    const roomId = Array.isArray(link) && link[0] ? String(link[0]) : '';
    const date = str(r.fields['Fecha']);
    if (!roomId || !date) continue;
    const key = `${roomId}|${date}`;
    countByRoomDate.set(key, (countByRoomDate.get(key) ?? 0) + 1);
  }

  const days = allSaleDays();
  return rooms
    .filter((room) => days.every((date) => (countByRoomDate.get(`${room.id}|${date}`) ?? 0) >= room.cupo))
    .map((room) => room.slug);
}

// --- Crear reserva --------------------------------------------------------

// Modo demo (sin Airtable): no hay dónde contar las reservas ya hechas, así
// que se lleva la cuenta en memoria del propio proceso mientras dure.
let demoLocatorCounter = 0;

/** Localizador correlativo tipo `FAL-000123`: cuenta las reservas ya
 *  creadas en Airtable y suma uno. Con muy poco volumen (9 habitaciones,
 *  12 días) el riesgo de que dos pagos casi simultáneos cuenten el mismo
 *  total y generen el mismo número es prácticamente nulo; si ocurriera, no
 *  afecta a la reserva en sí (fecha/habitación/pago), solo se repetiría el
 *  número de referencia. */
export async function newLocator(): Promise<string> {
  const n = airtableEnabled() ? (await listAll(TABLE.bookings)).length + 1 : ++demoLocatorCounter;
  return `FAL-${String(n).padStart(6, '0')}`;
}

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
  /** Ya generado antes de cobrar (al mandar al cliente al TPV), para
   *  poder mostrárselo al cliente en cuanto vuelve del pago. Si no se pasa,
   *  se genera uno nuevo aquí (modo demo, sin pasarela). */
  locator?: string;
  /**
   * true = el pago ya se ha completado en Redsys antes de llamar aquí (esto
   * solo lo crea la notificación del banco: no hay "solicitud" sin pagar).
   * false = modo demostración sin Redsys conectado, no se ha cobrado nada.
   */
  paid: boolean;
  /** true = bloqueo temporal: la habitación queda reservada mientras el
   *  cliente paga en el TPV (Estado "en pago"). Se confirma o se libera
   *  después (ver confirmHeldBooking / cancelBooking). */
  hold?: boolean;
}

export interface BookingResult {
  id: string;
  locator: string;
}

export async function createBooking(input: BookingCreate): Promise<BookingResult> {
  const locator = input.locator ?? (await newLocator());

  const fields: Record<string, unknown> = {
    Localizador: locator,
    Estado: input.paid ? 'confirmada' : input.hold ? 'en pago' : 'solicitada',
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
    'Confirmar por': 'email',
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

// --- Bloqueo temporal de habitación (mientras el cliente paga) ------------

export interface HeldBooking {
  id: string;
  estado: string;
  roomId: string;
  date: string;
  /** Instante de creación (ISO): de él depende que el bloqueo siga vigente. */
  createdTime: string;
}

/** Reserva/bloqueo con ese localizador, si existe. */
export async function findBooking(locator: string): Promise<HeldBooking | null> {
  if (!airtableEnabled()) return null;
  const safe = locator.replace(/["'\\]/g, '');
  const recs = await listAll(TABLE.bookings, { filterByFormula: `{Localizador}='${safe}'`, maxRecords: '1' });
  const r = recs[0];
  if (!r) return null;
  const link = r.fields['Habitacion'];
  return {
    id: r.id,
    estado: str(r.fields['Estado']) ?? '',
    roomId: Array.isArray(link) && link[0] ? String(link[0]) : '',
    date: str(r.fields['Fecha'])?.slice(0, 10) ?? '',
    createdTime: r.createdTime ?? '',
  };
}

/**
 * Bloquea la habitación FALLAS.holdMinutes minutos. Devuelve false si otra
 * persona la tenía ya (o la ha bloqueado en el mismo instante).
 *
 * Dos clientes pueden llegar aquí a la vez y ver la habitación libre; por eso
 * después de crear el bloqueo se vuelve a mirar quién lo tiene: gana el
 * registro más antiguo (a igualdad, el de menor localizador) y el otro se
 * cancela al momento.
 */
export async function placeHold(input: Omit<BookingCreate, 'paid' | 'hold'>): Promise<boolean> {
  const { locator } = await createBooking({ ...input, paid: false, hold: true });
  if (!airtableEnabled()) return true;

  const recs = await listActiveBookings(`IS_SAME({Fecha}, '${input.date}', 'day')`);
  const sameRoom = recs
    .filter((r) => {
      const link = r.fields['Habitacion'];
      return Array.isArray(link) && link[0] === input.room.id;
    })
    .sort(
      (a, b) =>
        String(a.createdTime).localeCompare(String(b.createdTime)) ||
        String(a.fields['Localizador']).localeCompare(String(b.fields['Localizador'])),
    );
  const winners = sameRoom.slice(0, input.room.cupo);
  const mine = sameRoom.find((r) => r.fields['Localizador'] === locator);
  if (mine && winners.some((w) => w.id === mine.id)) return true;

  if (mine) await cancelBooking(mine.id);
  return false;
}

/** El pago se ha confirmado: el bloqueo pasa a reserva pagada. */
export async function confirmHeldBooking(id: string, total: number): Promise<void> {
  if (!airtableEnabled()) return;
  await airtable(`${encodeURIComponent(TABLE.bookings)}/${id}`, {
    method: 'PATCH',
    body: JSON.stringify({
      fields: { Estado: 'confirmada', Pago: 'pagado', 'Importe total': total },
      typecast: true,
    }),
  });
}

/** Libera la habitación (pago denegado o reembolsado). */
export async function cancelBooking(id: string): Promise<void> {
  if (!airtableEnabled()) return;
  await airtable(`${encodeURIComponent(TABLE.bookings)}/${id}`, {
    method: 'PATCH',
    body: JSON.stringify({ fields: { Estado: 'cancelada' }, typecast: true }),
  });
}
