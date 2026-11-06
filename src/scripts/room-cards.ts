/**
 * Fichas de balcón (.room-card): disponibilidad y fotos al día + carrusel.
 * Lo importa la página que las muestra (Rooms.astro), no el componente: ver el
 * comentario en RoomCard.astro.
 */
// Home y Habitaciones son páginas estáticas: esto se consulta aparte,
// en el navegador, para que una habitación que se agota después del
// último despliegue se marque igualmente sin esperar a un rebuild.
fetch('/api/rooms-availability')
  .then((r) => r.json())
  .then((data) => {
    if (!data.ok) return;
    for (const slug of data.soldOut as string[]) {
      document.querySelectorAll(`.room-card[data-room-slug="${slug}"]`).forEach((card) => {
        card.classList.add('is-soldout');
      });
    }
  })
  .catch(() => {});

// Las fotos de Airtable llevan una URL firmada que caduca a las pocas
// horas: la que se guardó en el build de esta página estática puede
// llevar rato caducada. Se piden las vigentes y se sustituyen aquí.
// Si las fotos ya son de la propia web (/media/...) no caducan y no se pide nada.
const photosExpire = [...document.querySelectorAll<HTMLElement>('.room-card-media')].some((m) =>
  /"https?:/.test(m.dataset.photos || ''),
);
(photosExpire ? fetch('/api/room-photos') : Promise.reject('fotos locales'))
  .then((r) => r.json())
  .then((data) => {
    if (!data.ok) return;
    const photosBySlug = data.photos as Record<string, string[]>;
    document.querySelectorAll<HTMLElement>('.room-card[data-room-slug]').forEach((card) => {
      const slug = card.dataset.roomSlug || '';
      const fresh = photosBySlug[slug];
      if (!fresh || !fresh.length) return;
      const media = card.querySelector<HTMLElement>('.room-card-media');
      if (!media) return;
      media.dataset.photos = JSON.stringify(fresh);
      const idx = parseInt(media.dataset.idx || '0', 10);
      const img = media.querySelector('img');
      if (img) img.src = fresh[idx] ?? fresh[0];
    });
  })
  .catch(() => {});

// El carrusel de fotos (flechas y deslizar) es un módulo compartido con la
// página de Reservar, que crea estas fichas con JavaScript.
import './room-carousel';
