// Wires a journey page together: the picture, the steps that scroll past it, and their controls.
import { Scene } from './scene';
import { chapters } from './chapters';
import { STEP_NOTES } from './notes';
import type { Ctx } from './chapter';
import type { Kind } from './picture';
import { getLevel } from '../lib/levels';

const KIND_NAMES: Record<Kind, string> = { rules: 'instructions', you: 'you', model: 'the model', tool: 'tool results', sum: 'summary', bad: 'problem' };
const KIND_ORDER: Kind[] = ['rules', 'you', 'model', 'tool', 'sum', 'bad'];

/** The first number in a readout value ("3 of 6" is 3, "$0.42" is 0.42); NaN when there is none. */
const firstNumber = (v: string) => { const m = v.replace(/,/g, '').match(/-?\d+(\.\d+)?/); return m ? Number(m[0]) : NaN; };

export function boot(root: HTMLElement) {
  const chapter = chapters[root.dataset.chapter ?? ''];
  const stage = root.querySelector<HTMLElement>('.j-stage');
  if (!chapter || !stage) return;
  const scene = new Scene(stage);
  scene.base = root.dataset.base ?? '/';
  root.setAttribute('data-ready', '');
  const syncDetails = () => {
    const level = getLevel();
    for (const d of root.querySelectorAll<HTMLDetailsElement>('details[data-open-for]')) {
      d.open = (d.dataset.openFor ?? '').split(' ').includes(level);
    }
  };
  syncDetails();
  const sayEl = root.querySelector<HTMLElement>('.j-say')!;
  const statEl = root.querySelector<HTMLElement>('.j-stats')!;
  const modelEl = root.querySelector<HTMLElement>('.j-model');
  const keyEl = root.querySelector<HTMLElement>('.j-key')!;
  const steps = [...root.querySelectorAll<HTMLElement>('[data-step]')];
  const dataEl = root.querySelector<HTMLScriptElement>('script[data-journey-data]');
  const isOverview = root.dataset.chapter === 'foundations' || root.dataset.chapter === 'whole' || root.dataset.chapter === 'week';

  const ctx: Ctx = {
    scene,
    level: getLevel(),
    mem: {},
    keep: {},
    data: dataEl ? JSON.parse(dataEl.textContent || '{}') : {},
    say(who, text) {
      sayEl.replaceChildren();
      if (who) { const b = document.createElement('b'); b.textContent = who; sayEl.append(b, ' '); }
      sayEl.append(text);
    },
    model(part, text) {
      if (!modelEl) return;
      if (!part && !text) { modelEl.replaceChildren(); modelEl.hidden = true; return; }
      modelEl.replaceChildren();
      if (part) { const b = document.createElement('b'); b.textContent = part; modelEl.append(b, ' '); }
      modelEl.append(text);
      modelEl.hidden = false;
    },
    stat(pairs) {
      // A counter that goes down within a step was restarted by a control: flash the readout.
      const before = lastStat;
      lastStat = new Map(pairs.map(([n, v]) => [n, String(v)]));
      const restarted = pairs.some(([n, v]) => {
        const was = before.get(n);
        return was !== undefined && !/%/.test(String(v)) && firstNumber(String(v)) < firstNumber(was);
      });
      if (restarted) { statEl.removeAttribute('data-reset'); void statEl.offsetWidth; statEl.setAttribute('data-reset', ''); }
      statEl.replaceChildren(...pairs.map(([name, value, tag]) => {
        const d = document.createElement('div');
        const dt = document.createElement('dt'); dt.textContent = name;
        const dd = document.createElement('dd'); dd.textContent = String(value);
        if (tag) { const t = document.createElement('span'); t.className = 'j-tag'; t.textContent = tag; dd.append(' ', t); }
        d.append(dt, dd);
        return d;
      }));
    },
  };
  scene.onKinds = (kinds) => {
    const want = KIND_ORDER.filter((k) => kinds.includes(k));
    if (keyEl.dataset.kinds === want.join()) return;
    keyEl.dataset.kinds = want.join();
    const item = (b: string, text: string) => { const li = document.createElement('li'); li.dataset.b = b; li.textContent = text; return li; };
    // Slabs first, then the tint a model takes while it works.
    keyEl.replaceChildren(...want.map((k) => item(k, KIND_NAMES[k])), item('busy', 'working'));
  };

  let current: HTMLElement | null = null;
  let lastStat = new Map<string, string>();
  // On a narrow page the picture sits on top and has little room: the note and the colour key move
  // out of the sticky view into the step on show, under its text. On a wide page they stay under
  // the picture.
  const readEl = root.querySelector<HTMLElement>('.j-read')!;
  const extra = document.createElement('div');
  extra.className = 'j-step-extra';
  function placeExtras() {
    if (wide()) { if (modelEl && modelEl.parentElement !== readEl) readEl.append(...[modelEl, keyEl].filter(Boolean) as HTMLElement[]); extra.remove(); return; }
    if (!current) return;
    if (extra.parentElement !== current) current.append(extra);
    if (modelEl && modelEl.parentElement !== extra) extra.append(modelEl);
    if (keyEl.parentElement !== extra) extra.append(keyEl);
  }
  function activate(el: HTMLElement, instant = false) {
    if (el === current) return;
    current?.removeAttribute('data-active');
    current = el;
    el.setAttribute('data-active', '');
    const def = chapter.steps[el.dataset.step!];
    if (!def) return;
    scene.stop();
    scene.speed = 1;
    ctx.level = getLevel();
    scene.level = ctx.level;
    ctx.mem = {};
    ctx.say(null, '');
    const note = STEP_NOTES[root.dataset.chapter ?? '']?.[el.dataset.step!];
    if (note) ctx.model(note.part, note.text[ctx.level]);
    else ctx.model('', '');
    ctx.stat([]);
    lastStat = new Map();
    statEl.removeAttribute('data-reset');
    for (const b of el.querySelectorAll<HTMLElement>('.pick[data-multi] button')) b.setAttribute('aria-pressed', String(b.hasAttribute('data-default')));
    for (const b of el.querySelectorAll<HTMLElement>('[data-default]')) pressOnly(b);
    placeExtras();
    scene.set(def.scene(ctx), instant);
    def.enter?.(ctx);
    if (isOverview) {
      root.querySelectorAll<HTMLElement>('[data-rung-link]').forEach((a) => {
        const here = a.dataset.rungLink === el.dataset.step;
        a.toggleAttribute('data-here', here);
        if (here && !a.closest('.j-strip')) centreInRail(a);
      });
    }
  }

  // The rail scrolls sideways on a narrow page: keep the lesson on show in the middle of it.
  function centreInRail(a: HTMLElement) {
    const list = a.closest<HTMLElement>('.j-rail-all');
    if (!list || list.scrollWidth <= list.clientWidth) return;
    const l = a.getBoundingClientRect(), r = list.getBoundingClientRect();
    list.scrollLeft += l.left - r.left - (r.width - l.width) / 2;
  }
  const mineInRail = root.querySelector<HTMLElement>('.j-rail a[aria-current="page"]');
  if (mineInRail) centreInRail(mineInRail);

  // The last step whose top has passed the reading line is the one on show.
  // Two columns or one is decided in the stylesheet, by the room the page has.
  const wide = () => getComputedStyle(root).display === 'grid';
  function pick() {
    const view = root.querySelector<HTMLElement>('.j-view')!.getBoundingClientRect();
    const line = wide() ? innerHeight * 0.62 : view.bottom + (innerHeight - view.bottom) * 0.55;
    let best: HTMLElement | null = null;
    for (const s of steps) {
      if (!s.offsetParent) continue;
      if (!best || s.getBoundingClientRect().top < line) best = s;
    }
    if (best) activate(best, !current);
  }
  let queued = false;
  const onScroll = () => { if (queued) return; queued = true; requestAnimationFrame(() => { queued = false; pick(); }); };
  addEventListener('scroll', onScroll, { passive: true });
  addEventListener('resize', () => { placeExtras(); onScroll(); });
  // A change of level re-runs the step on show: its picture (labels that name a term pick their
  // word for the level), its script (ctx.level), the line under the picture, the readout and the
  // note. A step only for higher levels may have just been hidden: then the one now in view runs.
  document.addEventListener('acg:level', () => {
    ctx.level = getLevel();
    syncDetails();
    const el = current;
    current = null;
    el?.removeAttribute('data-active');
    if (el?.offsetParent) activate(el, true);
    else pick();
  });
  pick();

  function pressOnly(btn: HTMLElement) {
    const group = btn.closest('.pick');
    // In a group of switches each button is on or off by itself; its action sets the state.
    if (!group || group.hasAttribute('data-multi')) return;
    for (const b of group.querySelectorAll('button')) b.setAttribute('aria-pressed', String(b === btn));
  }
  root.addEventListener('click', (e) => {
    const btn = (e.target as HTMLElement).closest<HTMLElement>('[data-do]');
    if (!btn) return;
    const step = btn.closest<HTMLElement>('[data-step]');
    if (step && step !== current) activate(step);
    pressOnly(btn);
    chapter.actions?.[btn.dataset.do!]?.(ctx, btn.dataset.val ?? '', btn);
  });
  root.addEventListener('input', (e) => {
    const el = (e.target as HTMLElement).closest<HTMLInputElement>('[data-bind]');
    if (!el) return;
    const step = el.closest<HTMLElement>('[data-step]');
    if (step && step !== current) activate(step);
    const out = el.closest('.control')?.querySelector('output');
    if (out) out.textContent = el.dataset.unit ? `${el.value}${el.dataset.unit}` : el.value;
    chapter.inputs?.[el.dataset.bind!]?.(ctx, el.value, el);
  });
  // Pause the picture when the tab is hidden, so a loop does not pile up work.
  document.addEventListener('visibilitychange', () => { if (document.hidden) scene.stop(); else if (current) { const el = current; current = null; activate(el); } });
}
