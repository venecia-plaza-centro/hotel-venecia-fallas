/**
 * Visor de cada espacio en /espacios/: la foto grande y, debajo, miniaturas de
 * Foto · Plano · Ubicación. Al pulsar una miniatura (o deslizar en el móvil) la
 * imagen grande cambia. Sin JavaScript se ve la foto principal.
 */
function select(gallery: HTMLElement, index: number) {
  const imgs = gallery.querySelectorAll<HTMLImageElement>('.stage img');
  const thumbs = gallery.querySelectorAll<HTMLButtonElement>('.thumb');
  const i = (index + imgs.length) % imgs.length;
  imgs.forEach((im, k) => {
    im.classList.toggle('on', k === i);
    im.setAttribute('aria-hidden', String(k !== i));
  });
  thumbs.forEach((t, k) => {
    t.classList.toggle('on', k === i);
    t.setAttribute('aria-pressed', String(k === i));
  });
  gallery.dataset.index = String(i);
}

document.querySelectorAll<HTMLElement>('[data-gallery]').forEach((gallery) => {
  gallery.querySelectorAll<HTMLButtonElement>('.thumb').forEach((t, k) => t.addEventListener('click', () => select(gallery, k)));

  // Deslizar con el dedo sobre la imagen grande (solo si el gesto es sobre todo horizontal).
  const stage = gallery.querySelector<HTMLElement>('.stage');
  let x0 = 0;
  let y0 = 0;
  stage?.addEventListener('touchstart', (e) => { x0 = e.touches[0].clientX; y0 = e.touches[0].clientY; }, { passive: true });
  stage?.addEventListener('touchend', (e) => {
    const dx = e.changedTouches[0].clientX - x0;
    const dy = e.changedTouches[0].clientY - y0;
    if (Math.abs(dx) > 40 && Math.abs(dx) > Math.abs(dy)) select(gallery, Number(gallery.dataset.index || 0) + (dx < 0 ? 1 : -1));
  }, { passive: true });
});
