/*
 * The splitter between the chat and the browser panel (desktop). Drag it, or focus it and use the
 * arrow keys (Shift for bigger steps, Home and End for the limits). A double click resets it. The
 * width lives in --v2-bw on the main area; styles/v2.css clamps it so the chat keeps its room.
 */

const MIN_BROWSER = 18 * 16;
const MIN_CHAT = 30.5 * 16;

export function splitter(main: HTMLElement, split: HTMLElement, browser: HTMLElement, root: HTMLElement) {
  function setWidth(px: number) {
    const w = main.getBoundingClientRect().width;
    const bw = Math.round(Math.max(MIN_BROWSER, Math.min(w - MIN_CHAT, px)));
    main.style.setProperty('--v2-bw', `${bw}px`);
    split.setAttribute('aria-valuenow', String(Math.round((bw / w) * 100)));
  }
  split.setAttribute('aria-valuenow', '50');

  split.addEventListener('pointerdown', (e) => {
    if (e.button !== 0) return;
    e.preventDefault();
    split.setPointerCapture(e.pointerId);
    const x0 = e.clientX, w0 = browser.getBoundingClientRect().width;
    root.setAttribute('data-resizing', '');
    const move = (m: PointerEvent) => setWidth(w0 - (m.clientX - x0));
    const up = () => {
      root.removeAttribute('data-resizing');
      split.removeEventListener('pointermove', move);
      split.removeEventListener('pointerup', up);
      split.removeEventListener('pointercancel', up);
    };
    split.addEventListener('pointermove', move);
    split.addEventListener('pointerup', up);
    split.addEventListener('pointercancel', up);
  });
  split.addEventListener('dblclick', () => { main.style.removeProperty('--v2-bw'); split.setAttribute('aria-valuenow', '50'); });
  split.addEventListener('keydown', (e) => {
    const w = browser.getBoundingClientRect().width;
    const step = e.shiftKey ? 96 : 32;
    if (e.key === 'ArrowLeft') setWidth(w + step);
    else if (e.key === 'ArrowRight') setWidth(w - step);
    else if (e.key === 'Home') setWidth(Infinity);
    else if (e.key === 'End') setWidth(0);
    else return;
    e.preventDefault();
    e.stopPropagation();
  });
}
