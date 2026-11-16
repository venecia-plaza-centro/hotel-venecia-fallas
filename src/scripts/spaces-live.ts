/**
 * Pone al día lo que /espacios/ enseña (precio, aforo, días) con los datos
 * reales de Airtable. La página es estática: se generó al desplegar, y si el
 * hotel cambia un precio sin volver a desplegar, lo publicado no coincidiría
 * con lo que se cobra. Si /api/spaces falla, se queda lo que trae la página.
 */
interface LiveSpace {
  number: string;
  capacity: number;
  price: number;
  priceByDay: Record<string, number>;
  days: number[];
}

interface LiveConfig {
  lang: string;
  locale: string;
  strings: Record<string, string>;
}

const fill = (s: string, vars: Record<string, string | number>) =>
  s.replace(/\{(\w+)\}/g, (_, k) => String(vars[k] ?? ''));

export function applyLive(spaces: LiveSpace[], cfg: LiveConfig, root: Document = document) {
  const money = (n: number) =>
    new Intl.NumberFormat(cfg.locale, { style: 'currency', currency: 'EUR', maximumFractionDigits: 0, useGrouping: 'always' } as Intl.NumberFormatOptions).format(n);
  const list = new Intl.ListFormat(cfg.locale, { style: 'long', type: 'conjunction' });
  const dayList = (days: number[]) =>
    fill(cfg.strings['spaces.days.fmt'], { days: list.format(days.map((d) => (cfg.lang === 'de' ? `${d}.` : String(d)))) });

  const byNumber = new Map(spaces.map((s) => [s.number, s]));
  const setText = (el: Element | null, text: string) => {
    if (el && el.textContent !== text) el.textContent = text;
  };

  root.querySelectorAll<HTMLElement>('[data-space]').forEach((el) => {
    const live = byNumber.get(el.dataset.space || '');
    // Un espacio que ya no está activo en Airtable deja de enseñarse.
    el.hidden = !live;
    if (!live) return;

    if (el.matches('li')) {
      const m2 = el.dataset.m2 || '';
      setText(el.querySelector('.js-g-meta'), `${fill(cfg.strings['spaces.card.size'], { n: m2 })} · ${fill(cfg.strings['spaces.glance.people'], { n: live.capacity })}`);
      setText(el.querySelector('.js-g-price'), money(live.price));
      return;
    }

    setText(el.querySelector('.js-cap'), fill(cfg.strings['spaces.card.cap'], { n: live.capacity }));
    setText(el.querySelector('.js-whole'), fill(cfg.strings['spaces.card.whole'], { n: live.capacity }));
    setText(el.querySelector('.js-days'), fill(cfg.strings['spaces.card.days'], { days: dayList(live.days) }));
    setText(el.querySelector('.js-price'), money(live.price));

    // Precios especiales: se rehacen enteros (puede haber 0, 1 o varios).
    const box = el.querySelector('.js-special');
    if (box) {
      box.replaceChildren(
        ...Object.entries(live.priceByDay).map(([day, price]) => {
          const em = document.createElement('em');
          em.textContent = fill(cfg.strings['spaces.card.special'], { date: dayList([Number(day)]), price: money(price) });
          return em;
        }),
      );
    }
  });

  // El adorno dorado va entre fichas: la primera visible no lleva (si se oculta una, se recalcula).
  const visible = [...root.querySelectorAll<HTMLElement>('article.space')].filter((a) => !a.hidden);
  root.querySelectorAll<HTMLElement>('article.space').forEach((a) => a.classList.toggle('is-first', a === visible[0]));
}

const cfgEl = document.getElementById('spaces-live-config');
if (cfgEl) {
  const cfg = JSON.parse(cfgEl.textContent || '{}') as LiveConfig;
  fetch('/api/spaces')
    .then((r) => r.json())
    .then((data) => {
      if (data?.ok && Array.isArray(data.spaces) && data.spaces.length) applyLive(data.spaces, cfg);
    })
    .catch(() => {});
}
