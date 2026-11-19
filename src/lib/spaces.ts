/**
 * Espacios del hotel que se alquilan enteros (habitaciones sin mobiliario) para
 * ver la mascletà: precio fijo por día, aforo máximo y solo ciertos días de
 * marzo. Distintos de los balcones (src/lib/booking.ts), que se reservan por
 * personas.
 *
 * Los datos que cambia el hotel (precio, aforo, días, activo, orden) se leen de
 * la tabla `Espacios` de Airtable (docs/airtable-espacios.md). Lo que no cambia
 * (planta, m², fachada y las fotos/descripciones, que viven en la web) y los
 * valores del Excel del hotel están aquí: sirven de base y de respaldo si
 * Airtable no está conectado, la tabla no existe todavía o falla.
 */
import { getSpaceRows, type SpaceRow } from './airtable';

export interface Space {
  /** Id del registro en la tabla `Espacios` de Airtable (vacío con los datos de ejemplo). */
  id?: string;
  /** Identificador estable en URLs y Airtable, ej. "espacio-109". */
  slug: string;
  /** Número del espacio, el que ve el cliente. */
  number: string;
  /** Planta (1 = primera planta, la primera sobre la baja). */
  floor: number;
  m2: number;
  /** Aforo máximo: el espacio se alquila entero, no por persona. */
  capacity: number;
  /** Precio por día (IVA incluido). */
  price: number;
  /** Precio distinto para días concretos de marzo, ej. { 14: 500 }. */
  priceByDay?: Record<number, number>;
  /** Días de marzo de 2027 en que se puede alquilar. */
  days: number[];
  /** Hay recorte de fachada con la ubicación del espacio. */
  hasFacade: boolean;
  /** Orden en el listado (menor primero). La descripción de cada espacio es la
   *  clave `spaces.desc.<número>` en src/i18n/ui.ts. */
  order: number;
}

/** Datos del Excel del hotel (19/11/2026, definitivo): base y respaldo. */
const FIXTURES: Space[] = [
  { slug: 'espacio-109', number: '109', floor: 1, m2: 16, capacity: 12, price: 750, days: [1, 2, 3, 4, 5, 6, 7, 8, 9], hasFacade: true, order: 1 },
  { slug: 'espacio-208', number: '208', floor: 2, m2: 16, capacity: 12, price: 750, days: [1, 2, 4, 7], hasFacade: true, order: 2 },
  { slug: 'espacio-408', number: '408', floor: 4, m2: 30, capacity: 15, price: 900, days: [14], hasFacade: true, order: 4 },
  { slug: 'espacio-506', number: '506', floor: 5, m2: 35, capacity: 20, price: 1300, days: [1, 2], hasFacade: false, order: 5 },
  { slug: 'espacio-602', number: '602', floor: 6, m2: 20, capacity: 8, price: 400, days: [1, 2, 3, 4, 5, 6, 7, 8, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19], hasFacade: true, order: 6 },
  { slug: 'espacio-605', number: '605', floor: 6, m2: 40, capacity: 20, price: 1300, days: [1, 2], hasFacade: true, order: 7 },
  // 704, 800, 801 y 802: precio, aforo y días ya son los del hotel. PROVISIONAL: solo los
  // m² de 800, 801 y 802 (el hotel da «15-22 m²» sin concretar): confirmarlos antes de
  // activar estos espacios en Airtable (hasta entonces no se muestran). El 801 no tiene
  // ningún día libre de momento.
  { slug: 'espacio-704', number: '704', floor: 7, m2: 20, capacity: 20, price: 1350, days: [1, 2], hasFacade: true, order: 8 },
  { slug: 'espacio-800', number: '800', floor: 8, m2: 18, capacity: 15, price: 975, days: [8, 9, 10, 11], hasFacade: true, order: 9 },
  { slug: 'espacio-801', number: '801', floor: 8, m2: 18, capacity: 15, price: 975, days: [], hasFacade: true, order: 10 },
  { slug: 'espacio-802', number: '802', floor: 8, m2: 18, capacity: 15, price: 975, days: [2, 3, 4, 8, 9], hasFacade: true, order: 11 },
];

/**
 * Une las filas de Airtable con los datos fijos de la web. Reglas:
 * - Se muestran solo los espacios con `Activo` marcado y que existan en la web
 *   (tengan fotos y descripción); un `Slug` desconocido se ignora con un aviso.
 * - Aforo, precio o días vacíos o inválidos → valor del Excel (no se deja la
 *   página sin precio). El precio especial es opcional: vacío = sin precio especial.
 * - Tabla sin filas (recién creada) o sin leer → todos los datos del Excel.
 */
export function mergeSpaceRows(rows: SpaceRow[] | null): Space[] {
  if (!rows || rows.length === 0) return [...FIXTURES].sort((a, b) => a.order - b.order);
  const out: Space[] = [];
  for (const r of rows) {
    if (!r.active) continue;
    const base = FIXTURES.find((s) => s.slug === r.slug);
    if (!base) {
      console.warn(`[spaces] «${r.slug}» está en Airtable pero no en la web (faltan fotos y descripción): se ignora`);
      continue;
    }
    const special = r.specialPrice > 0 ? r.specialDays : [];
    out.push({
      ...base,
      id: r.id,
      capacity: r.capacity > 0 ? r.capacity : base.capacity,
      price: r.price > 0 ? r.price : base.price,
      days: r.days.length ? r.days : base.days,
      priceByDay: special.length ? Object.fromEntries(special.map((d) => [d, r.specialPrice])) : undefined,
      order: r.order || base.order,
    });
  }
  return out.sort((a, b) => a.order - b.order);
}

export async function getSpaces(): Promise<Space[]> {
  return mergeSpaceRows(await getSpaceRows());
}

/** Precio de un espacio un día concreto de marzo. */
export function spacePriceForDay(s: Space, day: number): number {
  return s.priceByDay?.[day] ?? s.price;
}

// --- Fechas y precio por día -------------------------------------------------

/** Mes de venta de los espacios: marzo de 2027 (los días van en `Space.days`). */
const SPACE_MONTH = '2027-03';

/** Fecha ISO de un día de marzo: 14 → "2027-03-14". */
export const spaceDate = (day: number) => `${SPACE_MONTH}-${String(day).padStart(2, '0')}`;

/** Los días de marzo en que se alquila este espacio, como fechas ISO. */
export const spaceDates = (s: Space) => s.days.map(spaceDate);

/** ¿Es `date` un día en que este espacio se puede alquilar? */
export function isSpaceDate(s: Space, date: string): boolean {
  return spaceDates(s).includes(date);
}

/** Precio del espacio en una fecha ISO concreta. */
export const priceForSpaceDate = (s: Space, date: string) => spacePriceForDay(s, Number(date.slice(8, 10)));

export async function getSpace(slug: string): Promise<Space | undefined> {
  return (await getSpaces()).find((s) => s.slug === slug);
}
