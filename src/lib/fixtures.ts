/**
 * Datos de ejemplo que usa la web cuando NO hay credenciales de Airtable
 * (desarrollo local, previews sin secretos). Números de habitación, planta,
 * descripción y precio ya son los reales que pasó el hotel por email
 * (9 de septiembre de 2026): son 9 habitaciones en total, confirmado por
 * el hotel (ver FALLAS.totalRooms en consts.ts).
 *
 * Descripción y precio son iguales en todas las habitaciones (así lo
 * indicó el hotel): balcón privado con vistas a la Plaza del Ayuntamiento,
 * baño privado, Snack Pack incluido. El precio total sale de la tarifa por
 * persona que dio el hotel (65 €/55 €/45 € según sean 2, 3 o 4).
 */
import type { Room } from './booking';

const DESCRIPTION_ES =
  'Vive las Fallas en primera fila. Habitaciones privadas con balcón directo a la plaza y unas vistas espectaculares para no perderte ni un momento. Baño privado, espacios exclusivos y toda la emoción de las Fallas justo delante de ti. Tú, tu reserva y las Fallas.';
const DESCRIPTION_EN =
  "Experience Fallas from the front row. Private rooms with a balcony right onto the square and spectacular views so you don't miss a moment. Private bathroom, exclusive spaces, and all the excitement of Fallas right in front of you. You, your booking, and Fallas.";

// 65 €, 55 € y 45 € por persona según sean 2, 3 o 4 huéspedes.
const PRICES = { 2: 130, 3: 165, 4: 180 };

/** Fotos reales por habitación (public/images/rooms/<numero>/): la vista
 *  desde el balcón, la fachada del hotel con la ventana de esa habitación
 *  señalada, y la habitación en sí. */
function photosFor(roomNumber: string): string[] {
  const base = `/images/rooms/${roomNumber}`;
  return [`${base}/balcon.webp`, `${base}/fachada.webp`, `${base}/habitacion.webp`];
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
