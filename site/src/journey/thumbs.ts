// Small pictures of lessons that play: the home page, the part overviews' strips and the library.
//
//   <Thumb id="check" />   (components/journey/Thumb.astro)
//
// Each thumb draws its lesson's overview picture (the part overview's step for that lesson) when it
// comes near the screen, and plays that step's short loop while it is hovered or focused, or, on a
// touch screen, while it is the thumb nearest the middle of the screen. One plays at a time.
// Labels and the line under the picture stay hidden: the thumb is a picture and a name.
import { Scene } from './scene';
import { chapters } from './chapters';
import { parts, rung } from './rungs';
import type { Ctx } from './chapter';
import { getLevel } from '../lib/levels';

const reduced = matchMedia('(prefers-reduced-motion: reduce)');
const fine = matchMedia('(hover: hover) and (pointer: fine)');

interface Live { el: HTMLElement; scene: Scene; ctx: Ctx; def: NonNullable<ReturnType<typeof stepOf>> }
const live = new Map<HTMLElement, Live>();
let playing: Live | null = null;

function stepOf(id: string) {
  const r = rung(id);
  if (!r) return null;
  const part = parts.find((p) => p.n === r.part)!;
  return chapters[part.chapter]?.steps[id] ?? null;
}

function mount(el: HTMLElement, data: Record<string, unknown>) {
  if (live.has(el)) return live.get(el)!;
  const def = stepOf(el.dataset.thumb!);
  const stage = el.querySelector<HTMLElement>('.j-thumb-stage');
  if (!def || !stage) return null;
  const scene = new Scene(stage);
  scene.base = document.querySelector<HTMLElement>('[data-thumbs]')?.dataset.base ?? '/';
  scene.speed = 1.4;
  const ctx: Ctx = { scene, level: getLevel(), mem: {}, keep: {}, data, say() {}, model() {}, stat() {} };
  scene.level = ctx.level;
  try { scene.set(def.scene(ctx), true); } catch { return null; }
  const one = { el, scene, ctx, def };
  live.set(el, one);
  el.setAttribute('data-drawn', '');
  return one;
}

function play(one: Live | null) {
  if (playing === one) return;
  if (playing) { playing.scene.stop(); playing.el.removeAttribute('data-playing'); rest(playing); }
  playing = one;
  if (!one || reduced.matches) return;
  one.el.setAttribute('data-playing', '');
  one.ctx.mem = {};
  try { one.def.enter?.(one.ctx); } catch { /* a demo that needs more than a thumb has: stay still */ }
}
function rest(one: Live) {
  try { one.scene.set(one.def.scene(one.ctx), true); } catch { /* keep the last frame */ }
}

export function bootThumbs(root: ParentNode = document) {
  const thumbs = [...root.querySelectorAll<HTMLElement>('[data-thumb]')];
  if (!thumbs.length) return;
  const dataEl = document.querySelector<HTMLScriptElement>('script[data-thumbs-data]');
  const data = dataEl ? JSON.parse(dataEl.textContent || '{}') : {};

  const near = new IntersectionObserver((entries) => {
    for (const e of entries) if (e.isIntersecting) { mount(e.target as HTMLElement, data); near.unobserve(e.target); }
  }, { rootMargin: '300px 0px' });
  thumbs.forEach((t) => near.observe(t));

  for (const t of thumbs) {
    t.addEventListener('pointerenter', (e) => { if (e.pointerType === 'mouse') play(mount(t, data)); });
    t.addEventListener('pointerleave', (e) => { if (e.pointerType === 'mouse' && playing?.el === t) play(null); });
    t.addEventListener('focusin', () => play(mount(t, data)));
    t.addEventListener('focusout', () => { if (playing?.el === t) play(null); });
  }

  // On a touch screen nothing hovers: the thumb nearest the middle of the screen plays.
  const hub = document.querySelector<HTMLElement>('[data-thumbs]');
  if (!fine.matches && hub?.dataset.centre !== 'off') {
    let queued = false;
    const centre = () => {
      queued = false;
      let best: HTMLElement | null = null, dist = Infinity;
      for (const t of thumbs) {
        const r = t.getBoundingClientRect();
        if (r.bottom < 0 || r.top > innerHeight || r.right < 0 || r.left > innerWidth) continue;
        const d = Math.hypot(r.left + r.width / 2 - innerWidth / 2, r.top + r.height / 2 - innerHeight / 2);
        if (d < dist) { dist = d; best = t; }
      }
      play(best ? mount(best, data) : null);
    };
    const onScroll = () => { if (!queued) { queued = true; requestAnimationFrame(centre); } };
    addEventListener('scroll', onScroll, { passive: true });
    document.addEventListener('scroll', onScroll, { passive: true, capture: true });
    onScroll();
  }

  document.addEventListener('acg:level', () => {
    const level = getLevel();
    for (const one of live.values()) { one.ctx.level = level; one.scene.level = level; if (one !== playing) rest(one); }
    if (playing) { const p = playing; playing = null; play(p); }
  });
  document.addEventListener('visibilitychange', () => { if (document.hidden) play(null); });
}
