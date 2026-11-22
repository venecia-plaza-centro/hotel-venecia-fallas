/**
 * Ampliar fotos (balcones y espacios): al pulsar una foto se abre a pantalla
 * completa en un <dialog> nativo, con flechas, deslizar con el dedo, teclado
 * (← → Esc) y cierre pulsando fuera. Por delegación de eventos en `document`:
 * sirve para las fichas de balcones (`.room-card-media`) y para el visor de
 * cada espacio (`.space-gallery .stage`: foto, foto 2, fachada y plano).
 */
interface Item { src: string; alt: string; contain: boolean; }

const LABELS: Record<string, { close: string; prev: string; next: string }> = {
  es: { close: 'Cerrar', prev: 'Anterior', next: 'Siguiente' },
  en: { close: 'Close', prev: 'Previous', next: 'Next' },
  it: { close: 'Chiudi', prev: 'Precedente', next: 'Successiva' },
  fr: { close: 'Fermer', prev: 'Précédente', next: 'Suivante' },
  de: { close: 'Schließen', prev: 'Zurück', next: 'Weiter' },
};
const L = LABELS[(document.documentElement.lang || 'es').slice(0, 2)] || LABELS.es;

let dlg: HTMLDialogElement | null = null;
let items: Item[] = [];
let index = 0;
let opener: HTMLElement | null = null;

function build(): HTMLDialogElement {
  const d = document.createElement('dialog');
  d.className = 'lightbox';
  d.setAttribute('aria-label', L.close);
  d.innerHTML = `
    <button type="button" class="lb-close" aria-label="${L.close}">&times;</button>
    <button type="button" class="lb-nav lb-prev" aria-label="${L.prev}"><svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m15 6-6 6 6 6"/></svg></button>
    <figure class="lb-fig"><img class="lb-img" alt="" draggable="false" /></figure>
    <button type="button" class="lb-nav lb-next" aria-label="${L.next}"><svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m9 6 6 6-6 6"/></svg></button>
    <div class="lb-count" aria-live="polite"></div>`;
  document.body.appendChild(d);

  d.querySelector('.lb-close')!.addEventListener('click', () => d.close());
  d.querySelector('.lb-prev')!.addEventListener('click', () => show(index - 1));
  d.querySelector('.lb-next')!.addEventListener('click', () => show(index + 1));
  // Pulsar fuera de la foto (en el fondo) cierra.
  d.addEventListener('click', (e) => {
    const t = e.target as HTMLElement;
    if (t === d || t.classList.contains('lb-fig')) d.close();
  });
  d.addEventListener('close', () => { opener?.focus?.({ preventScroll: true }); opener = null; });
  d.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') show(index - 1);
    else if (e.key === 'ArrowRight') show(index + 1);
  });

  let x0 = 0, y0 = 0;
  d.addEventListener('touchstart', (e) => { x0 = e.touches[0].clientX; y0 = e.touches[0].clientY; }, { passive: true });
  d.addEventListener('touchend', (e) => {
    const dx = e.changedTouches[0].clientX - x0;
    const dy = e.changedTouches[0].clientY - y0;
    if (Math.abs(dx) > 40 && Math.abs(dx) > Math.abs(dy)) show(index + (dx < 0 ? 1 : -1));
  }, { passive: true });
  return d;
}

function show(i: number) {
  if (!dlg || !items.length) return;
  index = (i + items.length) % items.length;
  const it = items[index];
  const img = dlg.querySelector<HTMLImageElement>('.lb-img')!;
  img.src = it.src;
  img.alt = it.alt;
  img.classList.toggle('contain', it.contain);
  const multi = items.length > 1;
  dlg.classList.toggle('single', !multi);
  dlg.querySelector('.lb-count')!.textContent = multi ? `${index + 1} / ${items.length}` : '';
}

function open(list: Item[], start: number, from: HTMLElement) {
  if (!list.length) return;
  dlg ||= build();
  items = list;
  opener = from;
  show(start);
  if (!dlg.open) dlg.showModal();
}

document.addEventListener('click', (e) => {
  const target = e.target as HTMLElement | null;
  if (!target) return;

  // Espacios: la imagen grande del visor (foto, foto 2, fachada, plano).
  const stage = target.closest<HTMLElement>('.space-gallery .stage');
  if (stage) {
    const imgs = Array.from(stage.querySelectorAll<HTMLImageElement>('img'));
    const list = imgs.map((im) => ({ src: im.currentSrc || im.src, alt: im.alt, contain: im.classList.contains('contain') }));
    const start = Math.max(0, imgs.findIndex((im) => im.classList.contains('on')));
    // Foto grande: se usa la versión de 1600 px, no la de 800 que elige srcset en pantallas pequeñas.
    list.forEach((it) => { it.src = it.src.replace('-800.webp', '-1600.webp'); });
    open(list, start, stage);
    return;
  }

  // Balcones: la foto de la ficha (no las flechas ni los puntos del carrusel).
  const media = target.closest<HTMLElement>('.room-card-media');
  if (media && !target.closest('.room-card-nav')) {
    const photos: string[] = JSON.parse(media.dataset.photos || '[]');
    if (!photos.length) return;
    const title = media.querySelector('img')?.alt || '';
    open(photos.map((src) => ({ src, alt: title, contain: false })), parseInt(media.dataset.idx || '0', 10), media);
  }
});
