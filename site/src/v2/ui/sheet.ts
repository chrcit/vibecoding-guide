/*
 * The browser panel as a sheet on a phone. Closed, it waits below the screen, laid out, so the
 * picture keeps its size; it slides up and back with transform only (styles/v2.css). Drag its top
 * down to close it: it follows the finger, and a fling or a quarter of its height closes it.
 */

export interface Sheet {
  readonly open: boolean;
  set(on: boolean): void;
}

export function sheet(opts: {
  browser: HTMLElement;
  scrim: HTMLElement;
  /** The part of the sheet that drags. */
  top: HTMLElement;
  /** Made inert while the sheet is open. */
  behind: HTMLElement;
  /** Gets focus when the sheet opens. */
  close: HTMLElement;
  /** Gets focus back when it closes. */
  opener: HTMLElement;
  phone: MediaQueryList;
}): Sheet {
  const { browser, scrim, top, behind, close, opener, phone } = opts;
  let open = false;

  function set(on: boolean) {
    if (on === open) return;
    open = on;
    browser.toggleAttribute('data-open', on);
    scrim.toggleAttribute('data-open', on);
    behind.inert = on;
    if (on) {
      browser.setAttribute('role', 'dialog');
      browser.setAttribute('aria-modal', 'true');
      close.focus({ preventScroll: true });
    } else {
      browser.removeAttribute('role');
      browser.removeAttribute('aria-modal');
      if (phone.matches) opener.focus({ preventScroll: true });
    }
  }

  scrim.addEventListener('click', () => set(false));
  close.addEventListener('click', () => set(false));
  browser.addEventListener('keydown', (e) => { if (e.key === 'Escape' && open) { e.stopPropagation(); set(false); } });
  phone.addEventListener('change', () => { if (!phone.matches) set(false); });

  let drag: { id: number; y0: number; dy: number; moved: boolean; t: number; v: number } | null = null;
  let swallow = false;
  top.addEventListener('pointerdown', (e) => {
    if (!open || !phone.matches || e.button !== 0) return;
    drag = { id: e.pointerId, y0: e.clientY, dy: 0, moved: false, t: e.timeStamp, v: 0 };
  });
  top.addEventListener('pointermove', (e) => {
    if (!drag || e.pointerId !== drag.id) return;
    const dy = e.clientY - drag.y0;
    if (!drag.moved) {
      if (Math.abs(dy) < 6) return;
      drag.moved = true;
      top.setPointerCapture(e.pointerId);
      browser.setAttribute('data-drag', '');
    }
    drag.v = (dy - drag.dy) / Math.max(1, e.timeStamp - drag.t);
    drag.t = e.timeStamp;
    drag.dy = dy;
    // Upward pulls resist; downward follows 1:1.
    browser.style.transform = `translateY(${dy < 0 ? dy * 0.15 : dy}px)`;
  });
  const end = (e: PointerEvent) => {
    if (!drag || e.pointerId !== drag.id) return;
    const d = drag;
    drag = null;
    if (!d.moved) return;
    swallow = true;
    setTimeout(() => { swallow = false; }, 0);
    browser.removeAttribute('data-drag');
    browser.style.transform = '';
    if (d.dy > browser.getBoundingClientRect().height * 0.25 || d.v > 0.5) set(false);
  };
  top.addEventListener('pointerup', end);
  top.addEventListener('pointercancel', end);
  // A drag that ends over a tab is not a click on it.
  top.addEventListener('click', (e) => { if (swallow) { e.stopPropagation(); e.preventDefault(); } }, { capture: true });

  return { get open() { return open; }, set };
}
