// Wires a journey page together: the picture, the steps and how the reader moves between them,
// and the steps' controls.
//
// Two layouts, chosen in the stylesheet by the room the page has (journey.css):
// - Wide (60rem or more): the steps scroll past the picture and the step whose top passes the
//   reading line is the one on show. Back and Next on the picture, and the arrow keys, scroll the
//   step before or after into that place.
// - Narrow: the step on show is the only one shown, in a panel under the picture that scrolls on
//   its own. Back and Next under the picture, the arrow keys and a swipe on the picture change it.
// Either way the step on show is in the address (#step-id), so a link can open it. Which step is on
// show, and moving to another, is steps.ts; this file only drives it and shows the step.
import { Scene } from './scene';
import { Overlay } from './overlay';
import { noScreen } from './screen';
import { Steps, type StepChange } from './steps';
import { bootPanel } from './panel';
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
  const overlay = new Overlay(stage, scene);
  root.setAttribute('data-ready', '');
  const syncDetails = () => {
    const level = getLevel();
    for (const d of root.querySelectorAll<HTMLDetailsElement>('details[data-open-for]')) {
      d.open = (d.dataset.openFor ?? '').split(' ').includes(level);
    }
  };
  syncDetails();
  const sayEl = root.querySelector<HTMLElement>('.j-say')!;
  const saidEl = root.querySelector<HTMLElement>('.j-said')!;
  const statEl = root.querySelector<HTMLElement>('.j-stats')!;
  const modelEl = root.querySelector<HTMLElement>('.j-model');
  const keyEl = root.querySelector<HTMLElement>('.j-key')!;
  const panel = root.querySelector<HTMLElement>('.j-steps')!;
  const bar = root.querySelector<HTMLElement>('.j-nav')!;
  const backBtn = bar.querySelector<HTMLButtonElement>('[data-nav="back"]')!;
  const nextBtn = bar.querySelector<HTMLButtonElement>('[data-nav="next"]')!;
  const onLink = bar.querySelector<HTMLAnchorElement>('[data-nav="on"]')!;
  const countEl = bar.querySelector<HTMLElement>('[data-nav-count]')!;
  const titleEl = bar.querySelector<HTMLElement>('[data-nav-title]')!;
  bar.hidden = false;
  const stepEls = [...root.querySelectorAll<HTMLElement>('[data-step]')];
  const dataEl = root.querySelector<HTMLScriptElement>('script[data-journey-data]');
  const isOverview = root.dataset.chapter === 'foundations' || root.dataset.chapter === 'whole' || root.dataset.chapter === 'week';

  // Labels on the picture keep clear of the counter chip, and of the step buttons where they sit
  // on the picture (wide layout).
  scene.reserve = () => {
    const out = [];
    const chip = overlay.chipBox();
    if (chip) out.push(chip);
    if (wide()) {
      const s = stage.getBoundingClientRect(), n = bar.getBoundingClientRect();
      if (n.width) out.push({ l: n.left - s.left, t: n.top - s.top, w: n.width, h: n.height });
    }
    return out;
  };
  scene.onDraw = () => overlay.follow();

  let current: HTMLElement | null = null;
  let lastStat = new Map<string, string>();
  const defOf = (el: HTMLElement | null) => (el ? chapter.steps[el.dataset.step!] : undefined);

  const ctx: Ctx = {
    scene,
    level: getLevel(),
    mem: {},
    keep: {},
    data: dataEl ? JSON.parse(dataEl.textContent || '{}') : {},
    screen: noScreen,
    say(who, text) {
      // Someone in the picture said it: a bubble at their part, and the same line for screen
      // readers (the bubble is part of the picture, which they hear as one description).
      if (who && text && overlay.say(who, text)) {
        saidEl.textContent = `${who}: ${text}`;
        return;
      }
      // Narration, and speakers with no part on the picture: the line in the step text.
      sayEl.replaceChildren();
      if (who && text) { const b = document.createElement('b'); b.textContent = who; sayEl.append(b, ' '); }
      if (text) sayEl.append(text);
    },
    model(part, text) {
      if (!modelEl) return;
      // No lead-in labels: "Added to the model ·" goes. On an overview the step's heading already
      // names the lesson, so the note has no lead-in at all, and a note that only repeats the step's
      // own text is not shown.
      part = (part ?? '').replace(/^\s*Added to the model\s*·\s*/i, '');
      if (isOverview) {
        part = '';
        const said = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim();
        const own = current ? [...current.children].filter((c) => !c.classList.contains('j-step-extra')).map((c) => c.textContent ?? '').join(' ') : '';
        if (text && said(own).includes(said(text).slice(0, 80))) text = '';
      }
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
        // Readers took a "made-up" pill for placeholder data: the pill says "example", and the
        // sentence beside the number says the job or rate is made up.
        if (tag) { const t = document.createElement('span'); t.className = 'j-tag'; t.textContent = tag.replace(/^made[- ]up\b/i, 'example'); dd.append(' ', t); }
        d.append(dt, dd);
        return d;
      }));
      const chipBefore = overlay.chipBox();
      overlay.counter(pairs, defOf(current)?.counter ?? chapter.counter, ctx, restarted);
      const chipAfter = overlay.chipBox();
      if (chipBefore?.w !== chipAfter?.w || chipBefore?.h !== chipAfter?.h) scene.relayout();
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

  // What the run says beyond the picture is reading, not watching: the narration line, the
  // readout, the note and the colour key sit in the step on show, under its text and controls and
  // above its <More> and the card that leads on.
  const extra = root.querySelector<HTMLElement>('.j-step-extra')!;
  function placeExtras() {
    if (!current) return;
    const isEnd = (c: Element) => c.matches('.j-more-info, .j-end, .j-next, .j-ov-foot')
      || (c.matches('.for-level') && !!c.firstElementChild?.matches('.j-more-info'));
    const end = [...current.children].find((c) => c !== extra && isEnd(c)) ?? null;
    if (extra.parentElement !== current || extra.nextElementSibling !== end) current.insertBefore(extra, end);
    extra.hidden = false;
  }

  // ---------- which step is on show ----------

  const levelOk = (s: HTMLElement) => !s.dataset.forLevel || s.dataset.forLevel.split(' ').includes(getLevel());
  // Which step is on show, Back and Next, and the address (steps.ts). The layouts below drive it.
  const nav = new Steps(stepEls, { shown: levelOk });
  // Two columns or one is decided in the stylesheet, by the room the page has.
  const wide = () => getComputedStyle(root).display === 'grid';

  /** Run a step: its picture, its script, the lines and numbers around it. */
  function activate(el: HTMLElement, instant = false) {
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
    overlay.speakers = Object.fromEntries(Object.entries({ ...chapter.speakers, ...def.speakers }).map(([k, v]) => [k.trim().toLowerCase(), v]));
    overlay.clear();
    saidEl.textContent = '';
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

  nav.addEventListener('change', (e) => {
    const { el, cause } = (e as CustomEvent<StepChange>).detail;
    activate(el, cause === 'start' || cause === 'link' || cause === 'level');
    updateBar();
    // The reader asked for this step: bring it into place. A step picked by the scroll already is.
    if (cause === 'start' || cause === 'control' || cause === 'resume') return;
    panel.scrollTop = 0;
  });

  /** Back, Next, "2 of 4 · title", and what the narrow layout shows around the step. */
  function updateBar() {
    const { index, total, atFirst: first, atLast: last } = nav;
    countEl.textContent = `${Math.max(1, index + 1)} of ${total}`;
    titleEl.textContent = current?.querySelector('h2')?.textContent ?? '';
    backBtn.disabled = first;
    // On the last step of a narrow page Next leads on to what the step's closing card leads to.
    const on = last ? (current?.querySelector<HTMLAnchorElement>('a.j-next') ?? root.querySelector<HTMLAnchorElement>('.j-steps a.j-next')) : null;
    const leadOn = !!on && !wide();
    onLink.hidden = !leadOn;
    nextBtn.hidden = leadOn;
    nextBtn.disabled = last;
    if (on) {
      onLink.href = on.href;
      onLink.setAttribute('aria-label', `Next: ${on.querySelector('b')?.textContent ?? 'next lesson'}`);
    }
    root.toggleAttribute('data-at-first', first);
    root.toggleAttribute('data-at-last', last);
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

  // Wide: the last step whose top has passed the reading line is the one on show.
  // The layout changes with the room (a phone turned, the side view opened): keep the same step.
  let wasWide = wide();
  addEventListener('resize', () => {
    const now = wide();
    if (now !== wasWide) {
      wasWide = now;
      updateBar();
      if (current) panel.scrollTop = 0;
    }
  });

  // A change of level re-runs the step on show: its picture (labels that name a term pick their
  // word for the level), its script (ctx.level), the narration line, the readout and the note.
  // A step only for higher levels may have just been hidden: then the nearest one shown runs.
  document.addEventListener('acg:level', () => {
    ctx.level = getLevel();
    syncDetails();
    nav.refresh('level');
  });

  // ---------- Back, Next, keys, swipe ----------

  backBtn.addEventListener('click', () => nav.prev('button'));
  nextBtn.addEventListener('click', () => nav.next('button'));
  document.addEventListener('keydown', (e) => {
    if (e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') return;
    if (e.altKey || e.ctrlKey || e.metaKey || e.shiftKey || e.defaultPrevented) return;
    const t = e.target as HTMLElement | null;
    if (t?.closest('input, textarea, select, [contenteditable=""], [contenteditable="true"], [role="slider"], [role="tablist"], dialog')) return;
    // Only while the journey is in view (the page may be scrolled down to its footer).
    const r = root.getBoundingClientRect();
    if (r.bottom < innerHeight * 0.3 || r.top > innerHeight * 0.7) return;
    e.preventDefault();
    if (e.key === 'ArrowRight') nav.next('key'); else nav.prev('key');
  });

  // A swipe across the picture steps (narrow layout). Up and down is left to the browser, so the
  // page still scrolls; the panel scrolls on its own and never steps.
  let touch: { x: number; y: number; t: number; id: number } | null = null;
  let swiped = false;
  stage.addEventListener('pointerdown', (e) => {
    if (e.pointerType === 'mouse' || wide()) return;
    touch = { x: e.clientX, y: e.clientY, t: performance.now(), id: e.pointerId };
  });
  stage.addEventListener('pointercancel', () => { touch = null; });
  stage.addEventListener('pointerup', (e) => {
    if (!touch || e.pointerId !== touch.id) return;
    const dx = e.clientX - touch.x, dy = e.clientY - touch.y, dt = performance.now() - touch.t;
    touch = null;
    if (Math.abs(dx) < 48 || Math.abs(dx) < Math.abs(dy) * 1.5 || dt > 900) return;
    swiped = true;
    setTimeout(() => { swiped = false; }, 400);
    if (dx < 0) nav.next('swipe'); else nav.prev('swipe');
  });
  // A swipe that started on a label is not a tap on it.
  stage.addEventListener('click', (e) => { if (swiped) { e.preventDefault(); e.stopPropagation(); swiped = false; } }, true);

  // ---------- start ----------

  // The wide layout's navigator and next box, and the contents sheet (panel.ts).
  bootPanel(root, nav);
  // A link to one step (#many) opens it; else the first step.
  const linked = nav.start();
  if (linked) {
    // The browser may have scrolled the page to the step: both layouts are one screen tall.
    const top = () => { if (scrollY > 0 && root.getBoundingClientRect().top < 0) scrollTo({ top: 0 }); };
    top();
    addEventListener('load', top, { once: true });
  }

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
    if (step && step !== current) nav.goTo(step, 'control');
    pressOnly(btn);
    chapter.actions?.[btn.dataset.do!]?.(ctx, btn.dataset.val ?? '', btn);
  });
  root.addEventListener('input', (e) => {
    const el = (e.target as HTMLElement).closest<HTMLInputElement>('[data-bind]');
    if (!el) return;
    const step = el.closest<HTMLElement>('[data-step]');
    if (step && step !== current) nav.goTo(step, 'control');
    const out = el.closest('.control')?.querySelector('output');
    if (out) out.textContent = el.dataset.unit ? `${el.value}${el.dataset.unit}` : el.value;
    chapter.inputs?.[el.dataset.bind!]?.(ctx, el.value, el);
  });
  // Pause the picture when the tab is hidden, so a loop does not pile up work.
  document.addEventListener('visibilitychange', () => { if (document.hidden) scene.stop(); else nav.again('resume'); });
}
