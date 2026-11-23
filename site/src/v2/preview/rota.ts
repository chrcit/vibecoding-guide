/*
 * Tonight's rota, as the agent builds it in lesson 4. The whole night on one screen, a lane per
 * area and a bar per shift; each person finds their own shift by name and sees when, where and
 * who with. Stages: 'none' (nothing at /rota yet) and 'ready'. The staff and shifts are made up.
 */
import './lantern/lantern.css';
import type { MountApp } from './index';
import { esc, initials, ICON, brand, notFound } from './lantern/ui';
import { fold } from './door/search';

export const url = 'localhost:4321/rota';

type Area = 'door' | 'bar' | 'cloak';
const AREAS: Record<Area, { label: string; hue: string }> = {
  door: { label: 'Door', hue: 'var(--door)' },
  bar: { label: 'Bar', hue: 'var(--bar)' },
  cloak: { label: 'Cloakroom', hue: 'var(--cloak)' },
};
interface Shift { who: string; role: string; area: Area; from: string; to: string }
const SHIFTS: Shift[] = [
  { who: 'Sami Okoro', role: 'Door host', area: 'door', from: '22:00', to: '04:00' },
  { who: 'Finn Gallagher', role: 'Security', area: 'door', from: '22:30', to: '05:00' },
  { who: 'Marek Duda', role: 'Security', area: 'door', from: '23:00', to: '05:00' },
  { who: 'Bea Lindqvist', role: 'Bar lead', area: 'bar', from: '22:00', to: '03:00' },
  { who: 'Tariq Aziz', role: 'Bar', area: 'bar', from: '22:00', to: '04:00' },
  { who: 'Rosa Ibáñez', role: 'Bar', area: 'bar', from: '23:00', to: '05:00' },
  { who: 'Mila Horvat', role: 'Cloakroom', area: 'cloak', from: '22:30', to: '04:30' },
];
const START = 22 * 60, HOURS = 7;
/** Minutes after 22:00, across midnight. */
const off = (t: string) => { const [h, m] = t.split(':').map(Number); return ((h! < 12 ? h! + 24 : h!) * 60 + m!) - START; };
const len = (s: Shift) => off(s.to) - off(s.from);
const dur = (m: number) => `${Math.floor(m / 60)} h${m % 60 ? ` ${m % 60} min` : ''}`;
const first = (n: string) => n.split(' ')[0]!;

let picked: string | null = null;

export const app: MountApp = (el, initial) => {
  let stage = initial;
  let query = '';
  const root = document.createElement('div');
  root.className = 'ln';
  el.append(root);
  const $ = <T extends HTMLElement = HTMLElement>(s: string) => root.querySelector<T>(s);

  function meCard(s: Shift) {
    const others = SHIFTS.filter((x) => x.area === s.area && x.who !== s.who);
    return `<section class="ro-me" style="--hue:${AREAS[s.area].hue};position:relative" aria-label="${esc(first(s.who))}’s shift">
      <button type="button" class="ro-close ln-press" data-close aria-label="Close">${ICON.x}</button>
      <div class="ro-me-top"><span class="pr-av" aria-hidden="true" style="--hue:${AREAS[s.area].hue}">${esc(initials(s.who))}</span><div><b>${esc(s.who)}</b><span>${esc(s.role)} · ${AREAS[s.area].label}</span></div></div>
      <p class="ro-me-time ln-num">${s.from}–${s.to}</p>
      <p class="ro-me-sub">${dur(len(s))} tonight. Doors open at 23:00${off(s.from) < 60 ? ', so you’re on before the first guests' : ''}.</p>
      ${others.length ? `<div class="ro-me-with">${others.map((o) => `<span>${esc(first(o.who))} · ${o.from}–${o.to}</span>`).join('')}</div>` : ''}
    </section>`;
  }

  function lane(a: Area) {
    const shifts = SHIFTS.filter((s) => s.area === a);
    return `<div class="ro-lane" style="--hue:${AREAS[a].hue}">
      <span class="ro-area"><i></i>${AREAS[a].label}</span>
      <div class="ro-track">${shifts.map((s) => {
        const l = (off(s.from) / (HOURS * 60)) * 100, w = (len(s) / (HOURS * 60)) * 100;
        return `<button type="button" class="ro-shift ln-press" data-who="${esc(s.who)}" aria-pressed="${picked === s.who}" style="margin-left:${l.toFixed(2)}%;width:${w.toFixed(2)}%" aria-label="${esc(s.who)}, ${AREAS[a].label}, ${s.from} to ${s.to}"><span>${esc(first(s.who))}</span></button>`;
      }).join('')}</div>
    </div>`;
  }

  function paint(focusFind = false) {
    if (stage === 'none') return notFound(root, '/rota');
    const q = fold(query.trim());
    const matches = q ? SHIFTS.filter((s) => fold(s.who).split(' ').some((w) => w.startsWith(q))) : [];
    const me = SHIFTS.find((s) => s.who === picked);
    root.className = 'ln ln--wide';
    root.innerHTML = `
      <header class="ln-head">${brand('Rota', 'The Lantern · Friday night')}<span class="ln-tag"><i></i>${SHIFTS.length} on tonight</span></header>
      <div class="ln-body"><div class="ln-wide">
        <form class="ro-find" role="search" data-find><label class="pr-field">${ICON.search}<span class="ln-vh">Find your shift</span><input data-q type="search" autocomplete="off" spellcheck="false" placeholder="Find your shift: type your name" value="${esc(query)}"></label></form>
        ${q ? `<div class="ro-sugg">${matches.length ? matches.map((s) => `<button type="button" class="ln-press" data-who="${esc(s.who)}">${esc(s.who)}</button>`).join('') : '<p class="pr-empty" style="padding:4px 4px 0;text-align:left">Nobody by that name is on tonight.</p>'}</div>` : ''}
        ${me ? meCard(me) : ''}
        <div class="ro-axis" aria-hidden="true"><span></span><div class="ro-hours">${Array.from({ length: HOURS + 1 }, (_, i) => `<span style="left:${(i / HOURS) * 100}%">${String((22 + i) % 24).padStart(2, '0')}</span>`).join('')}</div></div>
        ${(Object.keys(AREAS) as Area[]).map(lane).join('')}
      </div></div>`;
    if (focusFind) { const i = $<HTMLInputElement>('[data-q]'); i?.focus({ preventScroll: true }); i?.setSelectionRange(query.length, query.length); }
  }

  root.addEventListener('input', (e) => { const t = e.target as HTMLInputElement; if (t.matches('[data-q]')) { query = t.value; paint(true); } });
  root.addEventListener('submit', (e) => {
    e.preventDefault();
    const q = fold(query.trim());
    const m = SHIFTS.filter((s) => fold(s.who).split(' ').some((w) => w.startsWith(q)));
    if (q && m.length === 1) { picked = m[0]!.who; query = ''; paint(); }
  });
  root.addEventListener('click', (e) => {
    const t = e.target as HTMLElement;
    if (t.closest('[data-close]')) { picked = null; paint(); return; }
    const w = t.closest<HTMLElement>('[data-who]');
    if (w) { picked = picked === w.dataset.who && w.classList.contains('ro-shift') ? null : w.dataset.who!; query = ''; paint(); $('.ln-body')?.scrollTo({ top: 0 }); }
  });

  paint();
  return {
    set(next: string) { if (next !== stage) { stage = next; paint(); } },
    destroy() { root.remove(); },
  };
};
