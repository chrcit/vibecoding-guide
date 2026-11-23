/*
 * Which step of a journey page is on show, and how the reader moves to another. Knows nothing
 * about layout or the picture: whoever drives it (a scroll position, Back and Next, a swipe, the
 * arrow keys, a link) calls goTo, next or prev, and whoever shows the step listens for "change".
 *
 *   const nav = new Steps([...root.querySelectorAll('[data-step]')], { shown: (el) => … });
 *   nav.addEventListener('change', (e) => { const { el, index, total, cause } = e.detail; … });
 *   nav.start();           // the step named in the address (#many), else the first one shown
 *   nav.next(); nav.prev(); nav.goTo(2); nav.goTo('many');
 *
 * The step on show is kept in the address as #<step id> (history.replaceState, so Back in the
 * browser still leaves the page), and a change of the address (a link to #many on the same page)
 * moves to that step. A page opened without a hash keeps a clean address until the reader moves.
 */

/** What moved the reader: the layout uses it to decide whether to scroll the step into place. */
export type Cause = 'start' | 'button' | 'key' | 'swipe' | 'link' | 'control' | 'level' | 'resume';

export interface StepChange {
  el: HTMLElement;
  /** Its place among the steps shown, from 0. */
  index: number;
  /** How many steps are shown. */
  total: number;
  cause: Cause;
  /** The same step again (the level changed, the tab came back): run it again. */
  again: boolean;
}

export interface StepsOptions {
  /** Whether a step is shown now (steps for higher reader levels may be hidden). Default: all. */
  shown?: (el: HTMLElement) => boolean;
  /** Keep the step on show in the address. Default true. */
  hash?: boolean;
}

export class Steps extends EventTarget {
  private cur: HTMLElement | null = null;
  private started = false;
  private readonly shownFn: (el: HTMLElement) => boolean;
  private readonly hash: boolean;

  constructor(readonly all: HTMLElement[], opts: StepsOptions = {}) {
    super();
    this.shownFn = opts.shown ?? (() => true);
    this.hash = opts.hash ?? true;
    if (this.hash) addEventListener('hashchange', () => { const el = this.fromHash(); if (el) this.goTo(el, 'link'); });
  }

  /** The steps shown now, in page order. */
  get list() { return this.all.filter(this.shownFn); }
  get current() { return this.cur; }
  /** The current step's place among the steps shown, or -1 before start. */
  get index() { return this.cur ? this.list.indexOf(this.cur) : -1; }
  get total() { return this.list.length; }
  get atFirst() { return this.index <= 0; }
  get atLast() { return this.index === this.total - 1; }

  /** Show the step named in the address, or else the first step shown (or `fallback`). */
  start(fallback?: HTMLElement | null) {
    const linked = this.fromHash();
    const el = linked ?? fallback ?? this.list[0];
    if (el) this.set(el, linked ? 'link' : 'start', false);
    this.started = true;
    return !!linked;
  }

  /** Move to a step: by its place among the steps shown (clamped), its id, or the element. */
  goTo(to: number | string | HTMLElement, cause: Cause = 'button') {
    const list = this.list;
    const el = typeof to === 'number' ? list[Math.max(0, Math.min(list.length - 1, to))]
      : typeof to === 'string' ? this.all.find((s) => s.id === to || s.dataset.step === to)
      : to;
    if (!el || el === this.cur) return false;
    this.set(el, cause, false);
    return true;
  }
  next(cause: Cause = 'button') { return this.goTo(Math.max(0, this.index) + 1, cause); }
  prev(cause: Cause = 'button') { return this.goTo(Math.max(0, this.index - 1), cause); }

  /**
   * The steps shown have changed (a new reader level): stay on the current step if it is still
   * shown, else go to the nearest one before it (or after it), and announce it again either way.
   */
  refresh(cause: Cause = 'level') {
    const list = this.list;
    const was = this.cur;
    let el = was && list.includes(was) ? was : null;
    if (!el && was) {
      const at = this.all.indexOf(was);
      el = [...list].reverse().find((s) => this.all.indexOf(s) < at) ?? list.find((s) => this.all.indexOf(s) > at) ?? null;
    }
    el ??= list[0] ?? null;
    if (el) this.set(el, cause, el === was);
  }

  /** Announce the current step again without moving (the tab came back into view). */
  again(cause: Cause = 'resume') { if (this.cur) this.set(this.cur, cause, true); }

  private set(el: HTMLElement, cause: Cause, again: boolean) {
    this.cur = el;
    if (this.hash && el.id && (this.started || location.hash) && location.hash !== `#${el.id}`) {
      history.replaceState(history.state, '', `#${el.id}`);
    }
    const list = this.list;
    this.dispatchEvent(new CustomEvent<StepChange>('change', { detail: { el, index: list.indexOf(el), total: list.length, cause, again } }));
  }

  private fromHash() {
    const id = decodeURIComponent(location.hash.slice(1));
    const el = id ? this.all.find((s) => s.id === id) : undefined;
    return el && this.shownFn(el) ? el : undefined;
  }
}
