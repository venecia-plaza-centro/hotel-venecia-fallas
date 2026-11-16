/**
 * Reserva de un ESPACIO en /reservar/?espacio=109: elegir un día de los que el
 * hotel abre para ese espacio, datos del cliente y pago en el TPV. El precio
 * lo calcula siempre el servidor (/api/checkout con kind "space"); aquí solo se
 * enseña. El flujo de balcones (Book.astro) no se toca: en modo espacio no arranca.
 */
import { isSpaceMode, spaceNumberFromUrl } from './space-mode';

interface Day { date: string; price: number; available: boolean }
interface Offer { slug: string; number: string; capacity: number; days: Day[] }
type Step = 'date' | 'details' | 'done';

function init() {
  const cfg = JSON.parse(document.getElementById('book-config')!.textContent || '{}');
  const T: Record<string, string> = {
    ...JSON.parse(document.getElementById('book-i18n')!.textContent || '{}'),
    ...JSON.parse(document.getElementById('space-i18n')!.textContent || '{}'),
  };
  const $ = <E extends HTMLElement = HTMLElement>(sel: string, root: ParentNode = document) => root.querySelector(sel) as E;
  const fmt = (key: string, vars: Record<string, string | number> = {}) =>
    (T[key] || key).replace(/\{(\w+)\}/g, (_, k) => String(vars[k] ?? ''));
  const money = (n: number) =>
    new Intl.NumberFormat(cfg.locale, { style: 'currency', currency: 'EUR', maximumFractionDigits: 0, useGrouping: 'always' } as Intl.NumberFormatOptions).format(n);
  // "IVA incluido": la parte tras el punto medio de "por día · IVA incluido".
  const vat = () => (T['spaces.card.perday'].split('·')[1] ?? '').trim();
  const longDate = (iso: string) => {
    const s = new Intl.DateTimeFormat(cfg.locale, { weekday: 'long', day: 'numeric', month: 'long' }).format(new Date(`${iso}T00:00:00`));
    return s.charAt(0).toUpperCase() + s.slice(1);
  };

  const params = new URLSearchParams(location.search);
  const paidToken = params.get('paid') && params.get('r') ? params.get('r') : null;
  const number = spaceNumberFromUrl();

  // ---- Pantalla: solo el flujo de espacios -------------------------------
  const flow = $('#space-flow');
  flow.hidden = false;
  for (const sel of ['#book-chosen', '#book-closed', '.book-steps:not(#space-steps)', '.book-grid:not(#space-grid)']) {
    document.querySelectorAll<HTMLElement>(sel).forEach((el) => (el.hidden = true));
  }
  const heroH1 = document.querySelector('.page-hero h1');
  const heroLead = document.querySelector('.page-hero .lead');
  if (heroH1) heroH1.textContent = T['spaces.book.h1'];
  if (heroLead) heroLead.textContent = T['spaces.book.lead'];

  const panels: Record<Step, HTMLElement> = {
    date: $('[data-sstep-panel="date"]'),
    details: $('[data-sstep-panel="details"]'),
    done: $('[data-sstep-panel="done"]'),
  };
  const order: Step[] = ['date', 'details', 'done'];
  function show(step: Step) {
    for (const k of order) panels[k].hidden = k !== step;
    document.querySelectorAll<HTMLElement>('[data-sstep]').forEach((li) => {
      const s = li.dataset.sstep as Step;
      li.classList.toggle('is-done', order.indexOf(s) < order.indexOf(step));
      li.classList.toggle('is-active', s === step);
    });
    $('h2', panels[step])?.focus();
    panels[step].scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
  const setErr = (id: string, msg = '') => ($(`#${id}`).textContent = msg);

  // ---- Estado ------------------------------------------------------------
  let offer: Offer | null = null;
  let selected: Day | null = null;

  const taken = $('#space-taken');

  function renderDays() {
    const box = $('#space-days');
    box.replaceChildren();
    for (const d of offer!.days) {
      const dt = new Date(`${d.date}T00:00:00`);
      const b = document.createElement('button');
      b.type = 'button';
      b.className = 'space-day' + (selected?.date === d.date ? ' is-selected' : '') + (d.available ? '' : ' is-full');
      b.disabled = !d.available;
      b.setAttribute('aria-pressed', String(selected?.date === d.date));
      b.innerHTML = `
        <span class="sd-wd">${new Intl.DateTimeFormat(cfg.locale, { weekday: 'short' }).format(dt)}</span>
        <span class="sd-n">${dt.getDate()}</span>
        <span class="sd-m">${new Intl.DateTimeFormat(cfg.locale, { month: 'long' }).format(dt)}</span>
        <span class="sd-p">${d.available ? money(d.price) : T['book.date.legend.full']}</span>`;
      b.addEventListener('click', () => {
        selected = d;
        setErr('space-err-date');
        renderDays();
        ($('#space-next') as HTMLButtonElement).disabled = false;
      });
      box.appendChild(b);
    }
    ($('#space-next') as HTMLButtonElement).disabled = !selected;
  }

  function showClosed(opensAt?: string) {
    $('#space-closed').hidden = false;
    $('#space-steps').hidden = true;
    $('#space-grid').hidden = true;
    $('#space-chosen').hidden = true;
    const d = $('#space-closed-date');
    if (opensAt) {
      d.textContent = fmt('book.closed.opens', {
        date: new Intl.DateTimeFormat(cfg.locale, { dateStyle: 'long', timeStyle: 'short' }).format(new Date(opensAt)),
      });
      d.hidden = false;
    }
  }

  // ---- Vuelta del banco: pago hecho ------------------------------------------
  function renderDone(data: { locator: string; date: string; room: { roomNumber: string }; guests: number; quote: { total: number }; email: string }, paid: boolean, persisted = true) {
    $('#space-done-title').textContent = T['book.done.title'];
    $('#space-done-body').textContent = fmt('book.done.body.email', { email: data.email });
    $('#space-done-locator').textContent = data.locator;
    const row = (k: string, v: string) => `<div class="sum-row"><span>${k}</span><span>${v}</span></div>`;
    $('#space-done-summary').innerHTML =
      row(T['book.summary.date'], longDate(data.date)) +
      // "Espacio" en singular: el título de la ficha sin su número ("Espacio {n}").
      row(fmt('spaces.card.title', { n: '' }).trim(), fmt('spaces.card.title', { n: data.room.roomNumber })) +
      row(T['book.summary.guests'], fmt('spaces.glance.people', { n: data.guests })) +
      `<div class="sum-total"><span>${T['book.summary.total']}</span><strong>${money(data.quote.total)}</strong></div>`;
    $('#space-done-demo-payment').hidden = paid;
    $('#space-done-demo').hidden = persisted;
    show('done');
  }

  if (paidToken) {
    $('#space-chosen').hidden = true;
    show('done');
    fetch(`/api/checkout-status?r=${encodeURIComponent(paidToken)}`)
      .then((r) => r.json())
      .then((data) => {
        if (!data.ok) throw new Error(data.error || 'error');
        renderDone(data, true, data.persisted);
        history.replaceState(null, '', location.pathname);
      })
      .catch(() => {
        // No se pudo leer la confirmación (el pago sí se ha hecho): aviso y salida a Inicio.
        $('#space-done-title').textContent = T['book.err.service'];
        $('#space-done-summary').replaceChildren();
      });
    return;
  }

  // ---- Reserva normal ---------------------------------------------------------
  if (!number) {
    location.replace(cfg.urls.spaces);
    return;
  }
  $('#space-chosen-name').textContent = fmt('spaces.card.title', { n: number });
  if (params.get('canceled')) setErr('space-err-date', T['book.err.canceled']);

  fetch('/api/sales-status?for=space')
    .then((r) => r.json())
    .then((st) => {
      if (!st.open) showClosed(st.opensAt);
    })
    .catch(() => {});

  fetch(`/api/space-availability?space=espacio-${number}`)
    .then((r) => r.json())
    .then((data) => {
      offer = data.ok ? (data.spaces[0] as Offer | undefined) ?? null : null;
      if (!offer) throw new Error('espacio');
      $('#space-notice').innerHTML =
        `<strong>${fmt('spaces.card.whole', { n: offer.capacity })}</strong><br />` +
        `${T['spaces.info.hours.l']}: ${fmt('spaces.info.hours.t', { start: cfg.accessStart, end: cfg.accessEnd }).replace(/\.$/, '')} · ${vat()}`;
      if (!offer.days.some((d) => d.available)) setErr('space-err-date', T['spaces.book.soldout']);
      renderDays();
    })
    .catch(() => {
      // Espacio que no existe (o la API no responde): de vuelta a la página de espacios.
      location.replace(cfg.urls.spaces);
    });

  ($('#space-next') as HTMLButtonElement).addEventListener('click', () => {
    if (!selected) return setErr('space-err-date', T['book.date.err.generic']);
    $('#space-recap').innerHTML = `<strong>${fmt('spaces.card.title', { n: offer!.number })}</strong> · ${longDate(selected.date)} · ${money(selected.price)} <small>${vat()}</small>`;
    taken.hidden = true;
    show('details');
  });
  document.querySelectorAll<HTMLElement>('[data-sback]').forEach((b) => b.addEventListener('click', () => show('date')));
  $('#space-taken-cta').addEventListener('click', () => {
    taken.hidden = true;
    show('date');
  });

  // ---- Datos y pago -------------------------------------------------------------
  const form = $<HTMLFormElement>('#space-form');
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    setErr('space-err-details');
    taken.hidden = true;
    form.querySelectorAll('.invalid').forEach((el) => el.classList.remove('invalid'));
    const fd = new FormData(form);
    const val = (k: string) => String(fd.get(k) ?? '').trim();
    const payload = {
      kind: 'space',
      spaceSlug: offer!.slug,
      date: selected!.date,
      firstName: val('firstName'),
      lastName: val('lastName'),
      email: val('email'),
      phone: val('phone'),
      country: val('country'),
      notes: val('notes'),
      consent: fd.get('consent') === 'on',
      lang: cfg.locale,
    };
    const bad: string[] = [];
    if (!payload.firstName) bad.push('firstName');
    if (!payload.lastName) bad.push('lastName');
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(payload.email)) bad.push('email');
    if (payload.phone.replace(/\D/g, '').length < 6) bad.push('phone');
    const mark = (names: string[]) => names.forEach((n) => form.querySelector(`[name="${n}"]`)?.classList.add('invalid'));
    if (bad.length) {
      mark(bad);
      return setErr('space-err-details', T['book.details.err.fields']);
    }
    if (!payload.consent) return setErr('space-err-details', T['book.details.err.consent']);

    const btn = $<HTMLButtonElement>('#space-submit');
    const label = btn.textContent;
    btn.disabled = true;
    btn.textContent = T['book.details.sending'];
    try {
      const res = await fetch('/api/checkout', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(payload) });
      const data = await res.json();
      if (data.ok && data.mode === 'redirect') {
        // Redsys: formulario POST firmado que lleva al cliente al TPV.
        const f = document.createElement('form');
        f.method = 'POST';
        f.action = data.form.action;
        for (const [name, value] of Object.entries(data.form.fields)) {
          const i = document.createElement('input');
          i.type = 'hidden';
          i.name = name;
          i.value = String(value);
          f.appendChild(i);
        }
        document.body.appendChild(f);
        f.submit();
        return;
      }
      if (data.ok) {
        // Modo demostración (sin TPV): reserva creada sin cobrar.
        renderDone(
          { locator: data.locator, date: data.date, room: { roomNumber: data.space.number }, guests: offer!.capacity, quote: data.quote, email: payload.email },
          false,
          data.persisted,
        );
        return;
      }
      if (data.error === 'datos') {
        mark(data.fields || []);
        setErr('space-err-details', T['book.details.err.fields']);
      } else if (data.error === 'sin-disponibilidad') {
        // Ese día se acaba de ocupar: se tacha y se avisa con el cuadro.
        const day = offer!.days.find((d) => d.date === selected!.date);
        if (day) day.available = false;
        selected = null;
        renderDays();
        taken.hidden = false;
        taken.scrollIntoView({ behavior: 'smooth', block: 'center' });
      } else if (data.error === 'ventas-cerradas') {
        showClosed();
      } else if (res.status === 429 || data.error === 'demasiadas-solicitudes') {
        setErr('space-err-details', T['book.err.ratelimit']);
      } else if (data.error === 'servicio') {
        setErr('space-err-details', T['book.err.service']);
      } else {
        setErr('space-err-details', T['book.err.generic']);
      }
    } catch {
      setErr('space-err-details', T['book.err.service']);
    } finally {
      btn.disabled = false;
      btn.textContent = label;
    }
  });
}

if (document.getElementById('space-flow') && isSpaceMode()) init();
