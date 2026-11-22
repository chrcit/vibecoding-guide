/*
  The lesson panel on a wide page (components/journey/PanelHead, StepNav, NextLesson, LessonSheet;
  styles/journey-panel.css). One step at a time in a column of fixed height beside the picture:
  the lesson and the guide's contents at the top, the step's title and text, the step navigator at
  the bottom, and on the last step a box that leads to the next lesson.

  Whether the page is wide enough is decided in the stylesheet (the journey container at 60rem):
  the step navigator is shown there and nowhere else, and this script reads that. On a narrow page
  the steps scroll past the picture as before and the panel does nothing but the contents sheet.
*/
import type { Steps, StepEvent } from './steps';
import { bootSheet } from './sheet';

export type Mode = 'panel' | 'scroll';
export interface Panel { readonly mode: Mode }

const isField = (el: Element | null) =>
  !!el && (el.matches('input, select, textarea, [contenteditable=""], [contenteditable="true"]') || !!el.closest('[role="slider"], [role="textbox"]'));

export function bootPanel(root: HTMLElement, steps: Steps, opts: { onMode?: (mode: Mode, was: Mode) => void } = {}): Panel {
  const nav = root.querySelector<HTMLElement>('[data-jp-nav]');
  const dots = root.querySelector<HTMLOListElement>('[data-jp-dots]');
  const prev = root.querySelector<HTMLButtonElement>('[data-jp-prev]');
  const next = root.querySelector<HTMLButtonElement>('[data-jp-next]');
  const pos = root.querySelector<HTMLElement>('[data-jp-pos]');
  const body = root.querySelector<HTMLElement>('.j-steps');
  const nextBox = root.querySelector<HTMLAnchorElement>('[data-jp-nextbox]');
  const sheet = root.querySelector<HTMLDialogElement>('[data-jp-sheet]');
  const trigger = root.querySelector<HTMLButtonElement>('[data-jp-toc]');
  if (sheet && trigger) bootSheet(trigger, sheet);

  let mode: Mode = 'scroll';
  const read = (): Mode => (nav && getComputedStyle(nav).display !== 'none' ? 'panel' : 'scroll');
  const setMode = () => {
    const now = read();
    if (now === mode) return;
    const was = mode;
    mode = now;
    root.dataset.mode = now;
    opts.onMode?.(now, was);
    render();
  };

  // The navigator: one segment per step the reader's level shows, Back, the count, Next.
  let shape = '';
  function render() {
    const list = steps.list, at = steps.index;
    const sig = list.map((s) => s.dataset.step).join();
    if (dots && sig !== shape) {
      shape = sig;
      dots.replaceChildren(...list.map((s, i) => {
        const li = document.createElement('li');
        const b = document.createElement('button');
        const name = s.querySelector('h2')?.textContent?.trim() ?? s.dataset.step!;
        b.type = 'button';
        b.className = 'jp-dot';
        b.dataset.i = String(i);
        b.title = name;
        b.setAttribute('aria-label', `Step ${i + 1}: ${name}`);
        li.append(b);
        return li;
      }));
    }
    dots?.querySelectorAll<HTMLButtonElement>('.jp-dot').forEach((b, i) => {
      if (i === at) b.setAttribute('aria-current', 'step'); else b.removeAttribute('aria-current');
      b.toggleAttribute('data-done', i < at);
    });
    const last = steps.isLast;
    if (prev) prev.disabled = at <= 0;
    if (next) next.disabled = last;
    root.toggleAttribute('data-last', last);
    if (nextBox) nextBox.tabIndex = last || mode !== 'panel' ? 0 : -1;
    if (pos && at >= 0) {
      const title = list[at]?.querySelector('h2')?.textContent?.trim() ?? '';
      pos.innerHTML = '';
      const n = document.createElement('b'); n.textContent = `${at + 1}`;
      const of = document.createElement('span'); of.className = 'jp-of'; of.textContent = ` of ${list.length}`;
      const t = document.createElement('span'); t.className = 'visually-hidden'; t.textContent = `: ${title}`;
      pos.append(n, of, t);
    }
  }

  steps.addEventListener('change', (e) => {
    const { reason } = (e as StepEvent).detail;
    const hadFocus = document.activeElement === next;
    render();
    // Each step starts at its top.
    if (mode === 'panel' && body && reason !== 'level') body.scrollTop = 0;
    // Next is gone on the last step: carry its focus on to the box that leads to the next lesson.
    if (hadFocus && next?.disabled && nextBox) nextBox.focus();
  });
  dots?.addEventListener('click', (e) => {
    const b = (e.target as HTMLElement).closest<HTMLElement>('.jp-dot');
    if (b) steps.goTo(Number(b.dataset.i));
  });
  prev?.addEventListener('click', () => steps.prev());
  next?.addEventListener('click', () => steps.next());

  // Left and right arrows step, unless the reader is in a field, a slider or the contents sheet.
  document.addEventListener('keydown', (e) => {
    if (mode !== 'panel' || e.defaultPrevented || e.altKey || e.ctrlKey || e.metaKey || e.shiftKey) return;
    if (e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') return;
    if (sheet?.open || isField(document.activeElement) || document.documentElement.dataset.sideview === 'max') return;
    if (document.activeElement?.closest('dialog, .side-view, [role="dialog"], [role="menu"], [role="listbox"], [role="radiogroup"], [role="tablist"]')) return;
    const moved = e.key === 'ArrowRight' ? steps.next() : steps.prev();
    if (moved) e.preventDefault();
  });

  root.dataset.mode = mode;
  new ResizeObserver(setMode).observe(root.parentElement ?? root);
  setMode();
  return { get mode() { return mode; } };
}
