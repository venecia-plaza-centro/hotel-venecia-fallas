/**
 * Widget de Cloudflare Turnstile para el formulario de datos de la reserva (balcones y
 * espacios). Si la página no trae clave pública (captcha desactivado), no hace nada y
 * `token()` devuelve ''. El widget se pinta cuando el cliente llega al paso de datos
 * (no antes, para no cargar el script de Cloudflare a quien solo mira) y el token, que
 * vale para un solo envío, se pide de nuevo con `reset()` tras cada intento.
 */
declare global {
  interface Window {
    turnstile?: {
      render: (el: HTMLElement, opts: Record<string, unknown>) => string;
      reset: (id?: string) => void;
    };
  }
}

const API = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit';
let loading: Promise<void> | null = null;

function loadApi(): Promise<void> {
  if (window.turnstile) return Promise.resolve();
  loading ??= new Promise((resolve, reject) => {
    const s = document.createElement('script');
    s.src = API;
    s.async = true;
    s.onload = () => resolve();
    s.onerror = () => reject(new Error('turnstile'));
    document.head.appendChild(s);
  });
  return loading;
}

export interface TurnstileControl {
  /** Token actual ('' si aún no está resuelto o el captcha está desactivado). */
  token: () => string;
  /** Pide un token nuevo (el anterior ya no vale tras un envío). */
  reset: () => void;
  /** ¿Hay captcha activo en esta página? */
  active: boolean;
}

export function setupTurnstile(box: HTMLElement | null, siteKey: string, lang: string): TurnstileControl {
  if (!box || !siteKey) return { token: () => '', reset: () => {}, active: false };
  let value = '';
  let widgetId: string | undefined;
  let started = false;

  const start = () => {
    if (started) return;
    started = true;
    loadApi()
      .then(() => {
        widgetId = window.turnstile!.render(box, {
          sitekey: siteKey,
          language: lang,
          theme: 'light',
          callback: (t: string) => (value = t),
          'expired-callback': () => (value = ''),
          'error-callback': () => (value = ''),
        });
      })
      .catch(() => (started = false));
  };

  // Se pinta cuando el cajón se hace visible (paso de datos).
  if ('IntersectionObserver' in window) {
    // 600px de margen: empieza a verificar antes de que el cliente llegue al botón.
    new IntersectionObserver((entries, obs) => {
      if (entries.some((e) => e.isIntersecting)) {
        start();
        obs.disconnect();
      }
    }, { rootMargin: '600px 0px' }).observe(box);
  } else {
    start();
  }

  return {
    active: true,
    token: () => value,
    reset: () => {
      value = '';
      if (widgetId !== undefined) window.turnstile?.reset(widgetId);
    },
  };
}
