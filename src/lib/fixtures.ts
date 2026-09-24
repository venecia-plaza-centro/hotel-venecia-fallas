/**
 * Datos de ejemplo que usa la web cuando NO hay credenciales de Airtable
 * (desarrollo local, previews sin secretos). Números de habitación, planta,
 * descripción y precio ya son los reales que pasó el hotel por email
 * (9 de septiembre de 2026): son 9 habitaciones en total, confirmado por
 * el hotel (ver FALLAS.totalRooms en consts.ts).
 *
 * Descripción y precio son iguales en todas las habitaciones (así lo
 * indicó el hotel): balcón privado con vistas a la Plaza del Ayuntamiento,
 * baño privado, Snack Pack incluido. El precio por persona baja cuantos
 * más seáis, y sube en fin de semana (viernes, sábado o domingo) frente a
 * entre semana (actualizado tras el email del hotel del 17/09/2026).
 */
import type { Room } from './booking';

const DESCRIPTION_ES =
  'Viva las Fallas en primera fila. Habitaciones privadas con balcón directo a la plaza y unas vistas espectaculares para no perderse ni un momento. Baño privado, espacios exclusivos y toda la emoción de las Fallas justo delante de usted. Usted, su reserva y las Fallas.';
const DESCRIPTION_EN =
  "Experience Fallas from the front row. Private rooms with a balcony right onto the square and spectacular views so you don't miss a moment. Private bathroom, exclusive spaces, and all the excitement of Fallas right in front of you. You, your booking, and Fallas.";

// Entre semana: 60 €/50 €/40 € por persona según sean 2, 3 o 4 huéspedes.
// Fin de semana (vie/sáb/dom): 70 €/60 €/50 € por persona.
const PRICES = {
  weekday: { 2: 120, 3: 150, 4: 160 },
  weekend: { 2: 140, 3: 180, 4: 200 },
};

/** Fotos reales por habitación (public/images/rooms/<numero>/): la vista
 *  desde el balcón, la fachada del hotel con la ventana de esa habitación
 *  señalada, y la habitación en sí. Algunas habitaciones tienen una foto
 *  extra que va la primera (la 409: otra vista del balcón). */
const FIRST_PHOTO: Record<string, string> = {
  '409': 'plaza.webp',
};

function photosFor(roomNumber: string): string[] {
  const base = `/images/rooms/${roomNumber}`;
  const first = FIRST_PHOTO[roomNumber];
  return [
    ...(first ? [`${base}/${first}`] : []),
    `${base}/balcon.webp`,
    `${base}/fachada.webp`,
    `${base}/habitacion.webp`,
  ];
}

function room(roomNumber: string, floor: string, order: number): Room {
  return {
    id: `fix-${roomNumber}`,
    slug: `habitacion-${roomNumber}`,
    roomNumber,
    floor,
    capacity: 4,
    prices: PRICES,
    cupo: 1,
    descriptionEs: DESCRIPTION_ES,
    descriptionEn: DESCRIPTION_EN,
    photos: photosFor(roomNumber),
    order,
  };
}

export const FIXTURE_ROOMS: Room[] = [
  room('317', '3ª planta', 1),
  room('409', '4ª planta', 2),
  room('410', '4ª planta', 3),
  room('411', '4ª planta', 4),
  room('412', '4ª planta', 5),
  room('502', '5ª planta', 6),
  room('503', '5ª planta', 7),
  room('504', '5ª planta', 8),
  room('505', '5ª planta', 9),
];
