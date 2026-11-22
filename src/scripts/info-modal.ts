/**
 * Abre y cierra las ventanas emergentes de información (InfoModal.astro). Los botones llevan
 * `data-info-open="<id del dialog>"`. Se cierra con la X (`data-info-close`), con Esc (lo hace el
 * propio <dialog>) o pulsando en la parte oscura de fuera. Mientras está abierta, la página de
 * detrás no se desplaza.
 */
document.addEventListener('click', (e) => {
  const target = e.target as HTMLElement | null;
  if (!target) return;

  const opener = target.closest<HTMLElement>('[data-info-open]');
  if (opener) {
    const dlg = document.getElementById(opener.dataset.infoOpen || '') as HTMLDialogElement | null;
    if (dlg && typeof dlg.showModal === 'function' && !dlg.open) {
      // Si el botón es un enlace (p. ej. «Reservar»), se abre la ventana en vez de seguir el enlace.
      e.preventDefault();
      dlg.showModal();
      document.body.style.overflow = 'hidden';
      dlg.querySelector<HTMLElement>('.info-modal-body')?.scrollTo({ top: 0 });
    }
    return;
  }

  if (target.closest('[data-info-close]')) {
    (target.closest('dialog') as HTMLDialogElement | null)?.close();
    return;
  }

  // Clic fuera de la caja (en el fondo oscuro del propio <dialog>).
  if (target instanceof HTMLDialogElement && target.classList.contains('info-modal')) target.close();
});

document.addEventListener(
  'close',
  (e) => {
    if ((e.target as HTMLElement).classList?.contains('info-modal')) document.body.style.overflow = '';
  },
  true,
);

/**
 * Apertura automática (`data-auto` en el <dialog>): al entrar en la página sale la ventana de
 * información, una sola vez por visita (sessionStorage), pasado un instante para que se vea antes la
 * cabecera. No sale si el visitante llega a una sección concreta (enlace con #ancla, p. ej. «Reservar»
 * en la cabecera) ni si hay otra ventana abierta. Si el navegador no deja guardar, sale igualmente.
 */
document.querySelectorAll<HTMLDialogElement>('dialog.info-modal[data-auto]').forEach((dlg) => {
  const key = `info-seen-${dlg.id}`;
  try {
    if (sessionStorage.getItem(key)) return;
  } catch { /* sin almacenamiento: se abre igualmente */ }
  if (location.hash) return;
  window.setTimeout(() => {
    if (document.querySelector('dialog[open]') || typeof dlg.showModal !== 'function') return;
    dlg.showModal();
    document.body.style.overflow = 'hidden';
    dlg.querySelector<HTMLElement>('.info-modal-body')?.scrollTo({ top: 0 });
    try { sessionStorage.setItem(key, '1'); } catch { /* ignorar */ }
  }, 900);
});
