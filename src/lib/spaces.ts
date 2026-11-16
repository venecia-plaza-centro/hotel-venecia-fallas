/**
 * Espacios del hotel que se alquilan enteros (habitaciones sin mobiliario) para
 * ver la mascletà: precio fijo por día, aforo máximo y solo ciertos días de
 * marzo. Distintos de los balcones (src/lib/booking.ts), que se reservan por
 * personas.
 *
 * De momento los datos están aquí, a la espera de pasarlos a Airtable (tabla
 * `Espacios`) como ya se hizo con las habitaciones. `getSpaces()` es el único
 * punto de entrada: cuando se conecte Airtable solo cambia su cuerpo.
 */

export interface Space {
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

const SPACES: Space[] = [
  { slug: 'espacio-109', number: '109', floor: 1, m2: 16, capacity: 12, price: 750, days: [1, 2], hasFacade: true, order: 1 },
  { slug: 'espacio-208', number: '208', floor: 2, m2: 16, capacity: 12, price: 750, days: [1, 2], hasFacade: true, order: 2 },
  { slug: 'espacio-210', number: '210', floor: 2, m2: 10, capacity: 8, price: 480, priceByDay: { 14: 500 }, days: [1, 2, 3, 14], hasFacade: true, order: 3 },
  { slug: 'espacio-408', number: '408', floor: 4, m2: 30, capacity: 15, price: 920, days: [14], hasFacade: true, order: 4 },
  { slug: 'espacio-506', number: '506', floor: 5, m2: 35, capacity: 20, price: 1300, days: [1, 2], hasFacade: false, order: 5 },
  { slug: 'espacio-602', number: '602', floor: 6, m2: 20, capacity: 8, price: 480, days: [1, 2, 3], hasFacade: true, order: 6 },
  { slug: 'espacio-605', number: '605', floor: 6, m2: 40, capacity: 20, price: 1300, days: [1, 2], hasFacade: true, order: 7 },
];

export async function getSpaces(): Promise<Space[]> {
  return [...SPACES].sort((a, b) => a.order - b.order);
}

/** Precio de un espacio un día concreto de marzo. */
export function spacePriceForDay(s: Space, day: number): number {
  return s.priceByDay?.[day] ?? s.price;
}
