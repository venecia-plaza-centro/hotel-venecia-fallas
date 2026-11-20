/**
 * «Los espacios de un vistazo»: si en algún espacio «Espacio 109 · 1ª planta» no cabe en
 * una línea, en TODOS «1ª planta» baja ENTERO a la línea de debajo (nunca se parte «1ª / planta») y el
 * punto de separación se oculta, porque ya no separa nada.
 *
 * El navegador no dice si una línea se ha partido, así que se mide: se muestra el
 * punto, se compara la altura de «Espacio 109» con la de «1ª planta» y, si está más
 * abajo, se marca con `is-stacked` (que oculta el punto). Todo en el mismo instante,
 * antes de pintar, para que no parpadee.
 */
function update(): void {
  const names = [...document.querySelectorAll<HTMLElement>('.glance-name')];
  // Primero todos en una línea; si en alguno la planta no cabe, TODOS la bajan: así la
  // lista se ve igual de ordenada (si solo la bajaran los largos, «Espacio 109 · 1ª planta»
  // quedaría en una línea y «Espacio 208 / 2ª planta» en dos).
  names.forEach((name) => name.classList.remove('is-stacked'));
  const anyWraps = names.some((name) => {
    const title = name.querySelector<HTMLElement>('strong');
    const floor = name.querySelector<HTMLElement>('.glance-floor');
    return Boolean(title && floor && floor.offsetTop > title.offsetTop + 2);
  });
  if (anyWraps) names.forEach((name) => name.classList.add('is-stacked'));
}

update();
window.addEventListener('resize', update, { passive: true });
document.fonts?.ready.then(update);
const list = document.querySelector('.glance-list');
if (list && 'ResizeObserver' in window) new ResizeObserver(update).observe(list);
