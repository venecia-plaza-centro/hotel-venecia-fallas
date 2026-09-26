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

// --- Memoria temporal (para gastar menos llamadas a Airtable) ---------------
// Airtable limita las llamadas a la API (en el plan gratuito, muy pocas al
// mes). Las lecturas que solo sirven para MOSTRAR (habitaciones, calendario,
// "completa") se guardan unos segundos en memoria y comparten una sola
// consulta entre muchos visitantes. Las comprobaciones que deciden un
// bloqueo o un pago NO usan la memoria (fresh): siempre leen en directo.
// Vercel además cachea las respuestas de la API (ver lib/api.ts, cacheJson).
const memo = new Map<string, { at: number; value: Promise<unknown> }>();

function cached<T>(key: string, ttlMs: number, load: () => Promise<T>): Promise<T> {
  const hit = memo.get(key);
  if (hit && Date.now() - hit.at < ttlMs) return hit.value as Promise<T>;
  const value = load();
  memo.set(key, { at: Date.now(), value });
  value.catch(() => memo.delete(key)); // un error no se queda guardado
  return value;
}

/** Olvida lo guardado de reservas: tras escribir, esta instancia ve el cambio. */
function forgetBookings() {
  for (const k of memo.keys()) if (k.startsWith('bookings')) memo.delete(k);
}

const ROOMS_TTL_MS = 120_000; // las habitaciones casi nunca cambian
const BOOKINGS_TTL_MS = 15_000; // la disponibilidad que se enseña, con 15 s de retraso como máximo

export async function getRooms(): Promise<Room[]> {
  if (!airtableEnabled()) return [...FIXTURE_ROOMS].sort(bySortOrder);
  return cached('rooms', ROOMS_TTL_MS, async () => {
    const recs = await listAll(TABLE.rooms, { filterByFormula: '{Activa}' });
    return recs.map(mapRoom).sort(bySortOrder);
  });
}

/**
 * Reservas que ocupan una habitación: las no canceladas, salvo los bloqueos
 * ("en pago") que ya han caducado. Un bloqueo es el registro que se crea
 * cuando el cliente pasa al TPV: reserva la habitación FALLAS.holdMinutes
 * minutos; si no paga en ese tiempo deja de contar y la habitación vuelve a
 * salir libre (sin borrar nada: el propio registro lleva su hora de
 * creación).
 *
 * La caducidad se calcula aquí, con `createdTime` de Airtable, y no con
 * fórmulas de fecha de Airtable: en una prueba real DATETIME_DIFF(NOW(),
 * CREATED_TIME()) salía con el signo cambiado dentro de filterByFormula.
 */
function isExpiredHold(r: AirtableRecord, now = Date.now()): boolean {
  if (str(r.fields['Estado']) !== 'en pago') return false;
  const created = Date.parse(r.createdTime ?? '');
  if (!Number.isFinite(created)) return false;
  return now - created > FALLAS.holdMinutes * 60_000;
}

/**
 * Reservas activas (no canceladas y sin bloqueo caducado). Se lee la lista
 * entera (son pocas: como mucho unas 100 reservas) y el filtrado por fecha o
 * habitación se hace en el código, así una sola consulta sirve a todos los
 * días del calendario. `fresh` = leer en directo, sin memoria (para decidir
 * un bloqueo o un pago). `excludeLocator` deja fuera una reserva concreta (la
 * propia, al confirmar su pago).
 */
async function listActiveBookings(opts: { fresh?: boolean; excludeLocator?: string } = {}): Promise<AirtableRecord[]> {
  const load = () => listAll(TABLE.bookings, { filterByFormula: "{Estado}!='cancelada'" });
  const recs = opts.fresh ? await load() : await cached('bookings', BOOKINGS_TTL_MS, load);
  const now = Date.now();
  return recs.filter(
    (r) =>
      !isExpiredHold(r, now) &&
      (!opts.excludeLocator || str(r.fields['Localizador']) !== opts.excludeLocator),
  );
}

const bookingDate = (r: AirtableRecord) => str(r.fields['Fecha'])?.slice(0, 10);

/** Reservas activas por habitación en esa fecha. Vacío en modo ejemplo. */
async function countBookedForDate(
  date: string,
  roomIds: string[],
  opts: { fresh?: boolean; excludeLocator?: string } = {},
): Promise<Map<string, number>> {
  const counts = new Map<string, number>();
  if (!airtableEnabled() || roomIds.length === 0) return counts;

  for (const r of await listActiveBookings(opts)) {
    if (bookingDate(r) !== date) continue;
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
export async function getRoomOffers(
  date: string,
  opts: { fresh?: boolean; excludeLocator?: string } = {},
): Promise<RoomOffer[]> {
  const rooms = await getRooms();
  const booked = await countBookedForDate(
    date,
    rooms.map((r) => r.id),
    opts,
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
 * cuántos huéspedes se apunten). Con `roomSlug`, además indica si esa
 * habitación concreta sigue libre cada día (`roomFree`), para tachar los días
 * en que el cliente que viene de "Reservar habitación X" no puede tenerla.
 * Una sola consulta a Airtable para todos los días.
 */
export async function getAvailabilitySummary(
  dates: string[],
  roomSlug?: string,
): Promise<Record<string, { free: number; roomFree?: boolean }>> {
  const rooms = await getRooms();
  const booked = new Map<string, number>(); // "idHabitación|fecha" → reservas activas
  if (airtableEnabled()) {
    for (const r of await listActiveBookings()) {
      const link = r.fields['Habitacion'];
      const roomId = Array.isArray(link) && link[0] ? String(link[0]) : '';
      const date = str(r.fields['Fecha'])?.slice(0, 10);
      if (!roomId || !date) continue;
      const key = `${roomId}|${date}`;
      booked.set(key, (booked.get(key) ?? 0) + 1);
    }
  }
  const isFree = (room: Room, date: string) => (booked.get(`${room.id}|${date}`) ?? 0) < room.cupo;
  const wanted = roomSlug ? rooms.find((r) => r.slug === roomSlug) : undefined;

  const summary: Record<string, { free: number; roomFree?: boolean }> = {};
  for (const date of dates) {
    summary[date] = {
      free: rooms.filter((r) => isFree(r, date)).length,
      ...(wanted ? { roomFree: isFree(wanted, date) } : {}),
    };
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

// Modo demo (sin Airtable): no hay dónde mirar qué números existen ya, así
// que se lleva la cuenta en memoria del propio proceso mientras dure.
let demoLocatorCounter = 0;

const formatLocator = (n: number) => `FAL-${String(n).padStart(3, '0')}`;

/** Localizador correlativo tipo `FAL-001`, `FAL-002`… (3 cifras; pasa a 4 al
 *  llegar a 1000). Se toma el número más alto que exista en Airtable y se
 *  suma uno, así no se repite aunque se cancelen o se borren reservas
 *  intermedias. Si dos pagos casi simultáneos calcularan el mismo número,
 *  se comprueba que no exista ya y se prueba con el siguiente. */
export async function newLocator(): Promise<string> {
  if (!airtableEnabled()) return formatLocator(++demoLocatorCounter);

  const recs = await listAll(TABLE.bookings, { 'fields[]': 'Localizador' });
  let max = 0;
  for (const r of recs) {
    const m = /^FAL-(\d+)$/.exec(str(r.fields['Localizador']) ?? '');
    if (m) max = Math.max(max, Number(m[1]));
  }
  for (let n = max + 1; n <= max + 20; n++) {
    const locator = formatLocator(n);
    if (!(await findBooking(locator))) return locator;
  }
  throw new AirtableError('No se ha podido generar un localizador único', 503);
}

export interface PaymentRef {
  order: string;
  authCode?: string;
}

/** Campos de Airtable con los datos del pago. */
function paymentFields(p?: PaymentRef): Record<string, string> {
  if (!p) return {};
  return {
    'Pedido Redsys': p.order,
    ...(p.authCode ? { 'Codigo autorizacion': p.authCode } : {}),
  };
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
  /** Datos del pago de Redsys (solo en reservas pagadas), para localizar la
   *  operación en el portal del banco si hay que devolverla. */
  payment?: PaymentRef;
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
  Object.assign(fields, paymentFields(input.payment));
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
  forgetBookings();
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

  const recs = await listActiveBookings({ fresh: true });
  const sameRoom = recs
    .filter((r) => {
      const link = r.fields['Habitacion'];
      return bookingDate(r) === input.date && Array.isArray(link) && link[0] === input.room.id;
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

/** El pago se ha confirmado: el bloqueo pasa a reserva pagada. Si Airtable
 *  rechazara los campos del pago (p. ej. una base sin ellos), se confirma igual
 *  sin ellos: lo importante es que la reserva no se pierda. */
export async function confirmHeldBooking(id: string, total: number, payment?: PaymentRef): Promise<void> {
  if (!airtableEnabled()) return;
  const patch = (extra: Record<string, string>) =>
    airtable(`${encodeURIComponent(TABLE.bookings)}/${id}`, {
      method: 'PATCH',
      body: JSON.stringify({
        fields: { Estado: 'confirmada', Pago: 'pagado', 'Importe total': total, ...extra },
        typecast: true,
      }),
    });
  try {
    await patch(paymentFields(payment));
  } catch (err) {
    if (!(err instanceof AirtableError) || !payment) throw err;
    console.error('[airtable] no se pudieron guardar los datos del pago, confirmo sin ellos', err);
    await patch({});
  }
  forgetBookings();
}

/** Libera la habitación (pago denegado o reembolsado). */
export async function cancelBooking(id: string): Promise<void> {
  if (!airtableEnabled()) return;
  await airtable(`${encodeURIComponent(TABLE.bookings)}/${id}`, {
    method: 'PATCH',
    body: JSON.stringify({ fields: { Estado: 'cancelada' }, typecast: true }),
  });
  forgetBookings();
}
