/**
 * «Los espacios de un vistazo»: si «Espacio 109 · 1ª planta» no cabe en una línea,
 * «1ª planta» baja ENTERO a la línea de debajo (nunca se parte «1ª / planta») y el
 * punto de separación se oculta, porque ya no separa nada.
 *
 * El navegador no dice si una línea se ha partido, así que se mide: se muestra el
 * punto, se compara la altura de «Espacio 109» con la de «1ª planta» y, si está más
 * abajo, se marca con `is-stacked` (que oculta el punto). Todo en el mismo instante,
 * antes de pintar, para que no parpadee.
 */
function update(): void {
  document.querySelectorAll<HTMLElement>('.glance-name').forEach((name) => {
    const title = name.querySelector<HTMLElement>('strong');
    const floor = name.querySelector<HTMLElement>('.glance-floor');
    if (!title || !floor) return;
    name.classList.remove('is-stacked');
    if (floor.offsetTop > title.offsetTop + 2) name.classList.add('is-stacked');
  });
}

update();
window.addEventListener('resize', update, { passive: true });
document.fonts?.ready.then(update);
const list = document.querySelector('.glance-list');
if (list && 'ResizeObserver' in window) new ResizeObserver(update).observe(list);
