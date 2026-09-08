/**
 * Datos de ejemplo que usa la web cuando NO hay credenciales de Airtable
 * (desarrollo local, previews sin secretos). Cifras inventadas: las reales
 * las pone el hotel en Airtable sin tocar código.
 *
 * Están alineados con docs/airtable-esquema.md.
 */
import type { Extra, Room } from './booking';

export const FIXTURE_ROOMS: Room[] = [
  {
    id: 'fix-doble-vistas-plaza',
    slug: 'doble-vistas-plaza',
    name: 'Doble Vistas Plaza',
    type: 'doble',
    capacity: 2,
    plazaView: true,
    pricePerNight: 180,
    cupo: 4,
    descriptionEs: 'Habitación doble con balcón a la Plaza del Ayuntamiento, en primera línea de la mascletà.',
    descriptionEn: 'Double room with a balcony over Plaza del Ayuntamiento, front row for the mascletà.',
    photo: null,
    order: 1,
  },
  {
    id: 'fix-triple-vistas-plaza',
    slug: 'triple-vistas-plaza',
    name: 'Triple Vistas Plaza',
    type: 'triple',
    capacity: 3,
    plazaView: true,
    pricePerNight: 240,
    cupo: 3,
    descriptionEs: 'Habitación triple con vistas a la plaza. Ideal para familias o grupos pequeños.',
    descriptionEn: 'Triple room facing the square. Great for families or small groups.',
    photo: null,
    order: 2,
  },
  {
    id: 'fix-cuadruple-familiar',
    slug: 'cuadruple-familiar',
    name: 'Cuádruple Familiar',
    type: 'cuadruple',
    capacity: 4,
    plazaView: false,
    pricePerNight: 300,
    cupo: 2,
    descriptionEs: 'Habitación amplia para cuatro personas. Interior, más tranquila.',
    descriptionEn: 'Spacious room for four. Interior-facing and quieter.',
    photo: null,
    order: 3,
  },
  {
    id: 'fix-suite-balcon',
    slug: 'suite-balcon',
    name: 'Suite Balcón',
    type: 'suite',
    capacity: 2,
    plazaView: true,
    pricePerNight: 360,
    cupo: 1,
    descriptionEs: 'Suite con salón y balcón privado sobre la plaza. La mejor vista del hotel.',
    descriptionEn: 'Suite with a lounge and a private balcony over the square. The best view in the hotel.',
    photo: null,
    order: 4,
  },
];

export const FIXTURE_EXTRAS: Extra[] = [
  {
    id: 'fix-aperitivo-valenciano',
    slug: 'aperitivo-valenciano',
    name: 'Aperitivo valenciano',
    descriptionEs: 'Horchata y fartons, longaniza y embutidos de la tierra, y bebida. Servido antes de la mascletà.',
    descriptionEn: 'Horchata and fartons, local longaniza and cold cuts, and a drink. Served before the mascletà.',
    pricePerPerson: 25,
    minPeople: 4,
    order: 1,
  },
];
