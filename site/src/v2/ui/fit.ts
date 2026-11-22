/*
 * The picture in the browser panel: fit it to its drawing, and mark the annotation that is new.
 *
 * The engine (journey/scene.ts) frames the whole floor in whatever box it gets, so in a tall panel
 * the drawing sits small in the middle. fitStage scales the stage (drawing and annotations
 * together, transform only) until the drawing and its annotations fill the view with a margin. It
 * refits when the annotations or the view change, and only when the change is worth a move.
 */

export interface Fit {
  /** Fit again now (`glide` animates the move) or after the scene settles. */
  refit(glide: boolean): void;
  destroy(): void;
}

/**
 * `view` is the clipping box, `stage` the engine's root inside it (absolutely positioned, the
 * view's size). `onLabels` runs whenever the scene redraws its annotations.
 */
export function fitStage(view: HTMLElement, stage: HTMLElement, reduced: MediaQueryList, onLabels: () => void): Fit {
  let cam = { s: 1, x: 0, y: 0 };
  let timer = 0;
  /** Until then, a redraw of the annotations fits at once too: the move that caused it was still. */
  let quietUntil = 0;

  function fit(glide: boolean) {
    const v = view.getBoundingClientRect();
    if (!v.width || !v.height) return;
    const parts = [stage.querySelector('.j-cam'), ...stage.querySelectorAll('.j-label')].filter(Boolean) as Element[];
    let l = Infinity, t = Infinity, r = -Infinity, b = -Infinity;
    for (const el of parts) {
      const q = el.getBoundingClientRect();
      if (!q.width || !q.height) continue;
      // Back to the stage's own coordinates, undoing the current fit.
      l = Math.min(l, (q.left - v.left - cam.x) / cam.s); t = Math.min(t, (q.top - v.top - cam.y) / cam.s);
      r = Math.max(r, (q.right - v.left - cam.x) / cam.s); b = Math.max(b, (q.bottom - v.top - cam.y) / cam.s);
    }
    if (!isFinite(l)) return;
    const s = Math.max(1, Math.min(1.5, (v.width * 0.9) / (r - l), (v.height * 0.86) / (b - t)));
    const next = { s, x: v.width / 2 - (s * (l + r)) / 2, y: v.height / 2 - (s * (t + b)) / 2 };
    if (Math.abs(next.s - cam.s) < 0.04 * cam.s && Math.abs(next.x - cam.x) < 12 && Math.abs(next.y - cam.y) < 12) return;
    cam = next;
    stage.toggleAttribute('data-glide', glide && !reduced.matches);
    stage.style.transform = `translate(${cam.x.toFixed(1)}px, ${cam.y.toFixed(1)}px) scale(${cam.s.toFixed(3)})`;
  }
  // A glide waits for the labels to land; a resize fits at once.
  const refit = (glide: boolean) => {
    if (!glide) quietUntil = performance.now() + 400;
    else if (performance.now() < quietUntil) glide = false;
    clearTimeout(timer);
    timer = window.setTimeout(() => fit(glide), glide ? 650 : 0);
  };

  const ro = new ResizeObserver(() => refit(false));
  ro.observe(view);
  const mo = new MutationObserver((list) => {
    onLabels();
    // Any change to the annotations (added, removed or reworded) can move the drawing's bounds.
    if (list.some((m) => (m.target instanceof Element ? m.target : m.target.parentElement)?.closest('.j-labels'))) refit(true);
  });
  mo.observe(stage, { childList: true, subtree: true, characterData: true });

  return { refit, destroy() { ro.disconnect(); mo.disconnect(); clearTimeout(timer); } };
}

/** Outline the annotations whose words are in `fresh`: what this point changed. */
export function markLabels(stage: HTMLElement, fresh: Set<string>) {
  for (const el of stage.querySelectorAll<HTMLElement>('.j-label')) {
    const on = fresh.has((el.dataset.text ?? el.textContent ?? '').trim());
    if (on !== el.hasAttribute('data-changed')) el.toggleAttribute('data-changed', on);
  }
}
