/*
  The steps of a journey page as a list you move through: which one is on show, go to one, next,
  back, and a `change` event when it moves. The step id is kept in the URL hash, so
  /journey/meter/#many opens on that step.

  Minimal on purpose: the desktop panel (panel.ts) drives it, and run.ts plays the step it lands
  on. A step that the reader's level hides (`data-for-level`) is skipped.

    const steps = new Steps(root);
    steps.addEventListener('change', (e) => play((e as StepEvent).detail.step));
    steps.next(); steps.prev(); steps.goTo('many');
*/
import { getLevel } from '../lib/levels';

export interface StepChange {
  /** Where it is now, counted over the steps the reader's level shows. */
  index: number;
  step: HTMLElement;
  /** Where it was, or -1 when nothing was on show. */
  from: number;
  /** Why it moved: a button or key, the URL hash, the first load, or a change of level. */
  reason: 'nav' | 'hash' | 'init' | 'level' | 'sync';
}
export type StepEvent = CustomEvent<StepChange>;

/** Whether the reader's level shows this step. Same test as levels.css. */
export function levelShows(el: HTMLElement): boolean {
  const only = el.dataset.forLevel;
  return !only || only.split(' ').includes(getLevel());
}

export class Steps extends EventTarget {
  readonly root: HTMLElement;
  #current: HTMLElement | null = null;
  #hash: boolean;

  constructor(root: HTMLElement, opts: { hash?: boolean } = {}) {
    super();
    this.root = root;
    this.#hash = opts.hash ?? true;
    if (this.#hash) addEventListener('hashchange', () => { const el = this.#fromHash(); if (el) this.goTo(el, { reason: 'hash' }); });
  }

  /** Every step on the page, in order, whatever the level. */
  get all(): HTMLElement[] { return [...this.root.querySelectorAll<HTMLElement>('[data-step]')]; }
  /** The steps the reader's level shows. */
  get list(): HTMLElement[] { return this.all.filter(levelShows); }
  get count(): number { return this.list.length; }
  get current(): HTMLElement | null { return this.#current; }
  get index(): number { return this.#current ? this.list.indexOf(this.#current) : -1; }
  get isFirst(): boolean { return this.index <= 0; }
  get isLast(): boolean { const n = this.count; return n > 0 && this.index === n - 1; }

  /** The step the page should open on: the one in the URL hash, else the first. */
  initial(): HTMLElement | null { return this.#fromHash() ?? this.list[0] ?? null; }

  /** Show a step by index, id or element. Returns false when there is nowhere to go. */
  goTo(target: number | string | HTMLElement, opts: { reason?: StepChange['reason']; hash?: boolean } = {}): boolean {
    const list = this.list;
    let el: HTMLElement | undefined;
    if (typeof target === 'number') el = list[Math.max(0, Math.min(list.length - 1, target))];
    else if (typeof target === 'string') el = list.find((s) => s.dataset.step === target);
    else el = list.includes(target) ? target : undefined;
    if (!el) return false;
    const from = this.index;
    const moved = el !== this.#current;
    this.#current = el;
    if (this.#hash && opts.hash !== false) this.#writeHash(el);
    if (moved || opts.reason === 'init') this.dispatchEvent(new CustomEvent<StepChange>('change', { detail: { index: list.indexOf(el), step: el, from, reason: opts.reason ?? 'nav' } }));
    return moved;
  }
  next(): boolean { return this.index < this.count - 1 && this.goTo(this.index + 1); }
  prev(): boolean { return this.index > 0 && this.goTo(this.index - 1); }

  /** Record a step something else put on show (the scroll, on a narrow page), without a change event. */
  sync(el: HTMLElement) { this.#current = el; }

  /** After a change of level: stay on the step, or move to the nearest one the level still shows. */
  refresh() {
    const el = this.#current;
    if (el && levelShows(el)) { this.dispatchEvent(new CustomEvent<StepChange>('change', { detail: { index: this.index, step: el, from: this.index, reason: 'level' } })); return; }
    const all = this.all, at = el ? all.indexOf(el) : 0;
    const near = all.slice(at).find(levelShows) ?? all.slice(0, at).reverse().find(levelShows);
    this.#current = null;
    if (near) this.goTo(near, { reason: 'level' });
  }

  #fromHash(): HTMLElement | null {
    const id = decodeURIComponent(location.hash.slice(1));
    return id ? this.list.find((s) => s.dataset.step === id) ?? null : null;
  }
  #writeHash(el: HTMLElement) {
    const id = el.dataset.step!;
    const first = this.list[0] === el;
    // The first step needs no hash: the plain lesson URL stays clean.
    const want = first ? location.pathname + location.search : `#${id}`;
    if (first ? location.hash === '' : location.hash === `#${id}`) return;
    history.replaceState(history.state, '', want);
  }
}
