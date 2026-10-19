/**
 * Descarga las habitaciones y sus fotos de Airtable AL DESPLEGAR, para que la
 * web no tenga que consultarlas en cada visita.
 *
 * Por qué: el plan gratuito de Airtable da ~1.000 llamadas/mes y las fotos de
 * Airtable llevan una URL que caduca a las ~2 h. Con esto, las habitaciones y
 * las fotos salen de la propia web (cero llamadas a Airtable al navegar) y
 * solo las reservas siguen leyéndose de Airtable.
 *
 * Qué hace (1 sola llamada a la API por despliegue):
 *   1. Lee la tabla Habitaciones (las {Activa}).
 *   2. Descarga cada foto, la reduce (máx. 1600 px de ancho, WebP) y la guarda
 *      en public/media/rooms/<slug>/<n>-<hash>.webp
 *   3. Escribe src/data/rooms.snapshot.json con las habitaciones, con las
 *      fotos ya apuntando a esas rutas locales.
 *
 * Nunca debe romper el despliegue: si falta la clave, si Airtable falla o si
 * la cuota está agotada, avisa y sale con éxito SIN tocar nada; la web sigue
 * funcionando como antes (leyendo Airtable en directo).
 *
 * Para que un cambio de precio/foto en Airtable llegue a la web hay que
 * volver a desplegar (p. ej. "Redeploy" en Vercel).
 */
import { createHash } from 'node:crypto';
import { mkdirSync, rmSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const TOKEN = process.env.AIRTABLE_TOKEN;
const BASE_ID = process.env.AIRTABLE_BASE_ID;
const API = process.env.AIRTABLE_API_URL || 'https://api.airtable.com/v0'; // solo se cambia en pruebas
const PHOTOS_DIR = join(ROOT, 'public', 'media', 'rooms');
const SNAPSHOT = join(ROOT, 'src', 'data', 'rooms.snapshot.json');
const MAX_WIDTH = 1600;

const log = (m) => console.log(`[sync-airtable] ${m}`);
const str = (v) => (typeof v === 'string' && v.trim() ? v : null);
const num = (v) => (typeof v === 'number' && Number.isFinite(v) ? v : 0);

async function listRooms() {
  const rooms = [];
  let offset;
  do {
    const url = new URL(`${API}/${BASE_ID}/${encodeURIComponent('Habitaciones')}`);
    url.searchParams.set('pageSize', '100');
    url.searchParams.set('filterByFormula', '{Activa}');
    if (offset) url.searchParams.set('offset', offset);
    const res = await fetch(url, { headers: { Authorization: `Bearer ${TOKEN}` } });
    if (!res.ok) throw new Error(`Airtable ${res.status}: ${(await res.text()).slice(0, 200)}`);
    const page = await res.json();
    rooms.push(...page.records);
    offset = page.offset;
  } while (offset);
  return rooms;
}

async function loadSharp() {
  try {
    return (await import('sharp')).default;
  } catch {
    return null;
  }
}

/** Descarga una foto y la guarda reducida. Devuelve la ruta pública, o null si falla. */
async function savePhoto(attachment, slug, n, sharp) {
  const res = await fetch(attachment.url);
  if (!res.ok) throw new Error(`foto ${res.status}`);
  const original = Buffer.from(await res.arrayBuffer());
  let out = original;
  let ext = (attachment.filename?.match(/\.(jpe?g|png|webp|gif|avif)$/i)?.[1] ?? 'jpg').toLowerCase();
  if (sharp) {
    out = await sharp(original).rotate().resize({ width: MAX_WIDTH, withoutEnlargement: true }).webp({ quality: 80 }).toBuffer();
    ext = 'webp';
  }
  const hash = createHash('sha1').update(out).digest('hex').slice(0, 8);
  const file = `${n}-${hash}.${ext}`;
  const dir = join(PHOTOS_DIR, slug);
  mkdirSync(dir, { recursive: true });
  writeFileSync(join(dir, file), out);
  return `/media/rooms/${slug}/${file}`;
}

async function main() {
  if (!TOKEN || !BASE_ID) {
    log('sin AIRTABLE_TOKEN / AIRTABLE_BASE_ID: no se sincroniza (se usan los datos de ejemplo o la lectura en directo).');
    return;
  }

  const records = await listRooms();
  if (records.length === 0) throw new Error('Airtable devolvió 0 habitaciones activas; se conserva lo que haya.');

  const sharp = await loadSharp();
  if (!sharp) log('aviso: sharp no está disponible; las fotos se guardan sin reducir.');

  // Se descarga todo a una carpeta limpia; solo si TODO va bien se escribe el snapshot.
  rmSync(PHOTOS_DIR, { recursive: true, force: true });

  const rooms = [];
  let photoCount = 0;
  for (const r of records) {
    const f = r.fields;
    const slug = str(f['Slug']) ?? r.id;
    const attachments = Array.isArray(f['Fotos']) ? f['Fotos'].filter((a) => a && typeof a.url === 'string') : [];
    const photos = [];
    for (let i = 0; i < attachments.length; i++) {
      photos.push(await savePhoto(attachments[i], slug, i + 1, sharp));
      photoCount++;
    }
    rooms.push({
      id: r.id,
      slug,
      roomNumber: str(f['Numero']) ?? '',
      floor: str(f['Planta']) ?? '',
      capacity: num(f['Capacidad']),
      prices: {
        weekday: { 2: num(f['Precio 2p entresemana']), 3: num(f['Precio 3p entresemana']), 4: num(f['Precio 4p entresemana']) },
        weekend: { 2: num(f['Precio 2p finde']), 3: num(f['Precio 3p finde']), 4: num(f['Precio 4p finde']) },
      },
      cupo: num(f['Cupo']) || 1,
      descriptionEs: str(f['Descripcion ES']),
      descriptionEn: str(f['Descripcion EN']),
      photos,
      order: num(f['Orden']),
    });
  }

  rooms.sort((a, b) => a.order - b.order);
  mkdirSync(dirname(SNAPSHOT), { recursive: true });
  writeFileSync(SNAPSHOT, JSON.stringify(rooms, null, 2));
  log(`listo: ${rooms.length} habitaciones y ${photoCount} fotos guardadas (1 llamada a Airtable).`);
}

main().catch((err) => {
  // Nunca se rompe el despliegue por esto: la web seguirá leyendo Airtable en directo.
  log(`AVISO: no se pudo sincronizar (${err.message}). Se sigue sin snapshot.`);
  try {
    rmSync(SNAPSHOT, { force: true });
    rmSync(PHOTOS_DIR, { recursive: true, force: true });
  } catch {}
  process.exit(0);
});
