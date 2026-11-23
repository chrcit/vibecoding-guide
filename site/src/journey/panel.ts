/*
  The lesson panel on a wide page (components/journey/PanelHead, StepNav, NextLesson, LessonSheet;
  styles/journey-panel.css): the step navigator at the bottom of the panel (a segment per step,
  Back, "2 of 5", Next) and, on the last step, the box that leads to the next lesson. Also opens the
  guide's contents sheet, on every width.

  Which step is on show is steps.ts; run.ts drives it and runs the step. This file only draws the
  navigator and sends its clicks to the stepper. The arrow keys are run.ts's, for both layouts.
  Whether the navigator is shown (the wide layout) is decided in the stylesheet.
*/
import type { Steps } from './steps';
import { bootSheet } from './sheet';

export function bootPanel(root: HTMLElement, steps: Steps) {
  const dots = root.querySelector<HTMLOListElement>('[data-jp-dots]');
  const prev = root.querySelector<HTMLButtonElement>('[data-jp-prev]');
  const next = root.querySelector<HTMLButtonElement>('[data-jp-next]');
  const pos = root.querySelector<HTMLElement>('[data-jp-pos]');
  const nextBox = root.querySelector<HTMLAnchorElement>('[data-jp-nextbox]');
  const sheet = root.querySelector<HTMLDialogElement>('[data-jp-sheet]');
  const trigger = root.querySelector<HTMLButtonElement>('[data-jp-toc]');
  if (sheet && trigger) bootSheet(trigger, sheet);

  // One segment per step the reader's level shows; rebuilt only when that set changes.
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
    const last = steps.atLast;
    if (prev) prev.disabled = at <= 0;
    if (next) next.disabled = last;
    root.toggleAttribute('data-last', last);
    if (nextBox) nextBox.tabIndex = last ? 0 : -1;
    if (pos && at >= 0) {
      const title = list[at]?.querySelector('h2')?.textContent?.trim() ?? '';
      const n = document.createElement('b'); n.textContent = `${at + 1}`;
      const of = document.createElement('span'); of.className = 'jp-of'; of.textContent = ` of ${list.length}`;
      const t = document.createElement('span'); t.className = 'visually-hidden'; t.textContent = `: ${title}`;
      pos.replaceChildren(n, of, t);
    }
  }

  steps.addEventListener('change', () => {
    const hadFocus = document.activeElement === next;
    render();
    // Next is gone on the last step: carry its focus on to the box that leads to the next lesson.
    if (hadFocus && next?.disabled && nextBox) nextBox.focus();
  });
  dots?.addEventListener('click', (e) => {
    const b = (e.target as HTMLElement).closest<HTMLElement>('.jp-dot');
    if (b) steps.goTo(Number(b.dataset.i), 'button');
  });
  prev?.addEventListener('click', () => steps.prev('button'));
  next?.addEventListener('click', () => steps.next('button'));
}
