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
