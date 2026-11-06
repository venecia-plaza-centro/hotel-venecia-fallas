/**
 * Carrusel de fotos de las .room-card (flechas y deslizar con el dedo), por
 * delegación de eventos en `document`: sirve para todas las fichas de la
 * página, también las que se crean después con JavaScript (paso "Balcón" de
 * Reservar). Se importa desde RoomCard.astro y desde Book.astro; al ser un
 * módulo, aunque lo importen los dos solo se ejecuta una vez por página (si
 * se registrara dos veces, cada clic avanzaría 2 fotos).
 */
  // Delegación de eventos: sirve para todas las .room-card de la página
  // (Home puede mostrar varias, Habitaciones las nueve).
  function goToPhoto(media: HTMLElement, dir: number) {
    const photos: string[] = JSON.parse(media.dataset.photos || '[]');
    if (!photos.length) return;
    let idx = parseInt(media.dataset.idx || '0', 10);
    idx = (idx + dir + photos.length) % photos.length;
    media.dataset.idx = String(idx);
    const img = media.querySelector('img');
    if (img) img.src = photos[idx];
    media.querySelectorAll('[data-dot]').forEach((d) => {
      d.classList.toggle('is-active', d.getAttribute('data-dot') === String(idx));
    });
  }

  document.addEventListener('click', (e) => {
    const btn = (e.target as HTMLElement)?.closest('.room-card-nav') as HTMLButtonElement | null;
    if (!btn) return;
    const media = btn.closest('.room-card-media') as HTMLElement | null;
    if (!media) return;
    goToPhoto(media, Number(btn.dataset.dir));
  });

  // Deslizar con el dedo en móvil, además de las flechas: los botones son
  // pequeños para un gesto que en cualquier galería de fotos se espera
  // poder hacer directamente arrastrando la imagen.
  let touchStartX = 0;
  let touchStartY = 0;
  let touchMedia: HTMLElement | null = null;
  document.addEventListener(
    'touchstart',
    (e) => {
      const media = (e.target as HTMLElement)?.closest('.room-card-media') as HTMLElement | null;
      touchMedia = media;
      if (!media) return;
      touchStartX = e.touches[0].clientX;
      touchStartY = e.touches[0].clientY;
    },
    { passive: true },
  );
  document.addEventListener(
    'touchend',
    (e) => {
      if (!touchMedia) return;
      const dx = e.changedTouches[0].clientX - touchStartX;
      const dy = e.changedTouches[0].clientY - touchStartY;
      // Solo cuenta como swipe si el movimiento es sobre todo horizontal
      // (si no, sería un scroll vertical de la página).
      if (Math.abs(dx) > 40 && Math.abs(dx) > Math.abs(dy)) {
        goToPhoto(touchMedia, dx < 0 ? 1 : -1);
      }
      touchMedia = null;
    },
    { passive: true },
  );
