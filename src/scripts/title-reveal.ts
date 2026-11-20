/**
 * Títulos de sección (h2) con movimiento: los que quedan por debajo de la pantalla al cargar
 * se ocultan un poco (más abajo y transparentes) y aparecen subiendo cuando se llega a ellos.
 * Los que ya se ven al cargar no se tocan (sin parpadeo). Sin JavaScript, o con «reducir
 * movimiento», todos se ven como siempre (la CSS de `h2.reveal` solo existe sin esa preferencia).
 */
const titles = [...document.querySelectorAll<HTMLElement>('main h2')].filter((h) => !h.closest('.page-hero') && !h.closest('.hero'));
if ('IntersectionObserver' in window && titles.length) {
  const below = titles.filter((h) => h.getBoundingClientRect().top > window.innerHeight * 0.92);
  const io = new IntersectionObserver(
    (entries) => {
      for (const e of entries) {
        if (e.isIntersecting) {
          e.target.classList.add('is-in');
          io.unobserve(e.target);
        }
      }
    },
    { rootMargin: '0px 0px -12% 0px', threshold: 0.15 },
  );
  below.forEach((h) => {
    h.classList.add('reveal');
    io.observe(h);
  });
}
