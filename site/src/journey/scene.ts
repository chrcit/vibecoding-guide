/*
 * The engine behind the journey's picture: it keeps the drawing in step with a scene state, moves
 * pucks along the floor, and runs a chapter's scripts so they can be cut short when the reader
 * scrolls on. Browser only. What is drawn is decided in picture.ts.
 */
import type { Level } from '../lib/levels';
import { picture, puckMarkup, flat, type SceneState, type XY, type Kind, type Camera, type Agent, type Block } from './picture';

const NS = 'http://www.w3.org/2000/svg';
const reduced = matchMedia('(prefers-reduced-motion: reduce)');

/** Thrown inside a script when it has been replaced; `run` swallows it. */
class Stopped extends Error {}

export interface Script {
  /** Pause. Shorter under reduced motion. */
  wait(ms: number): Promise<void>;
  /** Move a puck along a polyline on the floor. */
  send(points: XY[], kind: Kind, opts?: { ms?: number }): Promise<void>;
  /** Change the scene. */
  set(change: (s: SceneState) => void): void;
  /** Throws if this script has been replaced. */
  check(): void;
}

export class Scene {
  state: SceneState = { agents: [] };
  private svg: SVGSVGElement;
  private cam: SVGGElement;
  private pucks: SVGGElement;
  private labels: HTMLElement;
  private ents = new Map<string, { g: SVGGElement; sig: string; order: number }>();
  private labelEls = new Map<string, HTMLElement>();
  private tip: HTMLElement;
  private frame = { w: 800, h: 600 };
  private camera: Camera = { s: 1, tx: 0, ty: 0 };
  private token = 0;
  private drawn?: SceneState;
  /** Called after every draw with the kinds of slab in view, for the key under the drawing. */
  onKinds?: (kinds: Kind[]) => void;
  speed = 1;
  /** The site's base path, put in front of a label's side-view link. */
  base = '/';
  /** The reader's level: labels that name a term show that level's word. run.ts keeps it current. */
  level: Level = 'plain';

  constructor(private root: HTMLElement) {
    root.querySelector('.j-svg')?.remove();
    this.svg = document.createElementNS(NS, 'svg');
    this.svg.setAttribute('class', 'j-svg');
    this.svg.setAttribute('aria-hidden', 'true');
    this.svg.setAttribute('focusable', 'false');
    this.cam = document.createElementNS(NS, 'g');
    this.cam.setAttribute('class', 'j-cam');
    this.pucks = document.createElementNS(NS, 'g');
    this.pucks.setAttribute('class', 'j-pucks');
    this.cam.append(this.pucks);
    this.svg.append(this.cam);
    this.labels = document.createElement('div');
    this.labels.className = 'j-labels';
    // A label made with termLabel() carries its definition: shown in the tip on hover and focus,
    // and in a hidden span for screen readers. A tap follows the link into the side view.
    this.tip = document.createElement('div');
    this.tip.className = 'j-tip';
    this.tip.setAttribute('aria-hidden', 'true');
    this.tip.hidden = true;
    const show = (e: Event) => {
      const el = (e.target as HTMLElement).closest<HTMLElement>('.j-label[data-def]');
      if (el) this.showTip(el);
    };
    const hide = (e: Event) => { if ((e.target as HTMLElement).closest('.j-label[data-def]')) this.tip.hidden = true; };
    this.labels.addEventListener('pointerover', (e) => { if ((e as PointerEvent).pointerType === 'mouse') show(e); });
    this.labels.addEventListener('pointerout', hide);
    this.labels.addEventListener('focusin', show);
    this.labels.addEventListener('focusout', hide);
    root.append(this.svg, this.labels, this.tip);
    this.svg.setAttribute('viewBox', '0 0 800 600');
    this.measure();
    new ResizeObserver(() => { if (this.measure()) this.draw(true); }).observe(root);
  }

  private measure() {
    const r = this.root.getBoundingClientRect();
    if (!r.width || !r.height) return false;
    const h = Math.round((800 * r.height) / r.width);
    if (h === this.frame.h) return false;
    this.frame = { w: 800, h };
    this.svg.setAttribute('viewBox', `0 0 800 ${h}`);
    return true;
  }

  /** Replace the scene. `instant` skips the glide, for the first frame and for resizes. */
  set(state: SceneState, instant = false) {
    this.state = structuredClone(state);
    this.draw(instant);
  }
  change(fn: (s: SceneState) => void) {
    fn(this.state);
    this.draw();
  }
  agent(id: string): Agent {
    const a = this.state.agents.find((x) => x.id === id);
    if (!a) throw new Error(`no agent ${id}`);
    return a;
  }

  private draw(instant = false) {
    const pic = picture(this.state, { ...this.frame, level: this.level }, this.drawn);
    this.drawn = structuredClone(this.state);
    if (instant || reduced.matches) this.root.setAttribute('data-instant', '');
    const seen = new Set<string>();
    for (const e of pic.ents) {
      seen.add(e.key);
      let rec = this.ents.get(e.key);
      const tf = `translate(${e.x.toFixed(1)}px, ${e.y.toFixed(1)}px) scale(${e.scale})`;
      if (!rec) {
        const g = document.createElementNS(NS, 'g');
        g.setAttribute('class', 'j-ent');
        g.dataset.key = e.key;
        g.style.transform = tf;
        g.style.opacity = '0';
        const after = [...this.ents.values()].filter((r) => r.order > e.order).sort((a, b) => a.order - b.order)[0];
        this.cam.insertBefore(g, after ? after.g : this.pucks);
        rec = { g, sig: '', order: e.order };
        this.ents.set(e.key, rec);
        void g.getBoundingClientRect();
      }
      if (rec.sig !== e.sig) { rec.g.innerHTML = e.html(); rec.sig = e.sig; }
      for (const [n, v] of Object.entries(e.attrs)) rec.g.setAttribute(n, v);
      rec.g.style.transform = tf;
      rec.g.style.opacity = '1';
    }
    for (const [key, rec] of this.ents) {
      if (seen.has(key)) continue;
      rec.g.style.opacity = '0';
      this.ents.delete(key);
      setTimeout(() => rec.g.remove(), instant || reduced.matches ? 0 : 500);
    }
    this.camera = pic.cam;
    this.cam.style.transform = `translate(${pic.cam.tx.toFixed(1)}px, ${pic.cam.ty.toFixed(1)}px) scale(${pic.cam.s.toFixed(3)})`;

    const live = new Set<string>();
    for (const l of pic.labels) {
      live.add(l.key);
      let el = this.labelEls.get(l.key);
      if (!el) {
        el = document.createElement(l.side ? 'a' : 'span');
        el.className = 'j-label';
        fillLabel(el, l.text, l.def);
        if (l.side) { (el as HTMLAnchorElement).href = this.base + l.side; el.setAttribute('data-side', ''); }
        el.style.opacity = '0';
        this.labels.append(el);
        this.labelEls.set(l.key, el);
        el.style.left = `${(l.x / this.frame.w) * 100}%`;
        el.style.top = `${(l.y / this.frame.h) * 100}%`;
        void el.offsetWidth;
      } else {
        if (el.dataset.text !== l.text || (el.dataset.def ?? '') !== (l.def ?? '')) {
          // A label that takes a new word (a change of level, a script) flashes once.
          if (el.dataset.text !== l.text) { el.removeAttribute('data-level-new'); void el.offsetWidth; el.setAttribute('data-level-new', ''); setTimeout(() => el.removeAttribute('data-level-new'), 1600); }
          fillLabel(el, l.text, l.def);
        }
        if (l.side) (el as HTMLAnchorElement).href = this.base + l.side;
      }
      el.dataset.place = l.place;
      el.style.left = `${(l.x / this.frame.w) * 100}%`;
      el.style.top = `${(l.y / this.frame.h) * 100}%`;
      el.style.opacity = '1';
    }
    for (const [key, el] of this.labelEls) {
      if (live.has(key)) continue;
      el.style.opacity = '0';
      this.labelEls.delete(key);
      setTimeout(() => el.remove(), 300);
    }
    this.spread(pic.labels);
    this.onKinds?.(pic.kinds);
    if (instant || reduced.matches) requestAnimationFrame(() => requestAnimationFrame(() => this.root.removeAttribute('data-instant')));
  }

  /**
   * Keep labels apart and inside the frame. Works from where each label is going (not where it is
   * mid-glide): labels that would overlap are pushed apart vertically, away from their anchor's
   * side, and a label that would cross the frame's edge is pulled back in. The nudge is --dx/--dy.
   */
  private spread(labels: { key: string; x: number; y: number; place: string }[]) {
    const W = this.root.clientWidth, H = this.root.clientHeight;
    if (!W || !H) return;
    const boxes: { el: HTMLElement; l: number; t: number; w: number; h: number; place: string }[] = [];
    for (const lab of labels) {
      const el = this.labelEls.get(lab.key);
      if (!el) continue;
      const w = el.offsetWidth, h = el.offsetHeight, x = (lab.x / this.frame.w) * W, y = (lab.y / this.frame.h) * H;
      const l = lab.place === 'left' ? x - w - 8 : lab.place === 'right' ? x + 8 : x - w / 2;
      const t = lab.place === 'top' ? y - h - 6 : lab.place === 'bottom' ? y + 8 : y - h / 2;
      boxes.push({ el, l, t, w, h, place: lab.place });
    }
    const pad = 4, gap = 2;
    const hit = (a: typeof boxes[0], b: typeof boxes[0]) => a.l < b.l + b.w + gap && b.l < a.l + a.w + gap && a.t < b.t + b.h + gap && b.t < a.t + a.h + gap;
    const placed: typeof boxes = [];
    for (const b of [...boxes].sort((a, c) => a.t - c.t)) {
      const t0 = b.t;
      b.l = Math.max(pad, Math.min(W - pad - b.w, b.l));
      b.t = Math.max(pad, Math.min(H - pad - b.h, b.t));
      for (let i = 0; i < 6; i++) {
        const other = placed.find((o) => hit(o, b));
        if (!other) break;
        // Move away from the label it hits: above it for a label that sits on top of its part,
        // below it otherwise, and the other way when that would leave the frame.
        const up = other.t - b.h - gap, down = other.t + other.h + gap;
        b.t = b.place === 'top' && up >= pad ? up : down + b.h <= H - pad ? down : Math.max(pad, up);
      }
      placed.push(b);
      b.el.style.setProperty('--dy', `${Math.round(b.t - t0)}px`);
    }
    for (const b of boxes) {
      const x = (parseFloat(b.el.style.left) / 100) * W;
      const l0 = b.place === 'left' ? x - b.w - 8 : b.place === 'right' ? x + 8 : x - b.w / 2;
      b.el.style.setProperty('--dx', `${Math.round(b.l - l0)}px`);
    }
  }

  private showTip(el: HTMLElement) {
    this.tip.textContent = el.dataset.def ?? '';
    this.tip.hidden = false;
    const box = this.root.getBoundingClientRect(), r = el.getBoundingClientRect(), t = this.tip.getBoundingClientRect();
    const below = r.top - box.top < box.height * 0.55;
    const x = Math.max(4, Math.min(box.width - t.width - 4, r.left - box.left + r.width / 2 - t.width / 2));
    const y = below ? r.bottom - box.top + 6 : r.top - box.top - t.height - 6;
    this.tip.style.left = `${x}px`;
    this.tip.style.top = `${Math.max(4, y)}px`;
  }

  // ---------- scripts ----------

  /** Stop whatever script is running and clear pucks off the floor. */
  stop() {
    this.token++;
    this.pucks.replaceChildren();
  }

  /** Run a script. A second call replaces the first. Resolves true if it ran to the end. */
  async run(fn: (h: Script) => Promise<void>): Promise<boolean> {
    this.stop();
    const mine = this.token;
    const check = () => { if (mine !== this.token) throw new Stopped(); };
    const h: Script = {
      check,
      wait: async (ms) => {
        await new Promise((r) => setTimeout(r, (reduced.matches ? Math.min(ms, 160) : ms) / this.speed));
        check();
      },
      set: (change) => { check(); this.change(change); },
      send: async (points, kind, opts = {}) => {
        check();
        if (reduced.matches || points.length < 2) { await h.wait(120); return; }
        const pts = points.map(([x, y]) => flat(x, y, 3));
        const lens = pts.slice(1).map((p, i) => Math.hypot(p[0] - pts[i]![0], p[1] - pts[i]![1]));
        const total = lens.reduce((a, b) => a + b, 0) || 1;
        const g = document.createElementNS(NS, 'g');
        g.setAttribute('class', 'j-puck');
        g.innerHTML = puckMarkup(kind);
        this.pucks.append(g);
        let acc = 0;
        const frames = pts.map((p, i) => {
          if (i) acc += lens[i - 1]!;
          return { transform: `translate(${p[0].toFixed(1)}px, ${p[1].toFixed(1)}px)`, offset: acc / total };
        });
        const ms = (opts.ms ?? Math.max(320, total * 5.2)) / this.speed;
        const anim = g.animate(frames, { duration: ms, easing: 'cubic-bezier(0.45, 0, 0.3, 1)', fill: 'forwards' });
        try { await anim.finished; } catch { /* cancelled */ }
        g.remove();
        check();
      },
    };
    try { await fn(h); return true; } catch (e) { if (e instanceof Stopped) return false; throw e; }
  }

  /** Add a slab to an agent's window. */
  push(id: string, t: Block['t'], h: number) {
    this.change((s) => { const a = s.agents.find((x) => x.id === id); if (a) (a.blocks ??= []).push({ t, h }); });
  }
  /** How full an agent's window is, 0 to 1. */
  fill(id: string) {
    const a = this.agent(id);
    return (a.blocks ?? []).reduce((n, b) => n + b.h, 0) / (a.cap ?? 60);
  }
}

/** A label's text, and its definition in a span only screen readers read (the tip is for sight). */
function fillLabel(el: HTMLElement, text: string, def?: string) {
  el.dataset.text = text;
  if (def) {
    el.dataset.def = def;
    const sr = document.createElement('span');
    sr.className = 'visually-hidden';
    sr.textContent = `: ${def}`;
    el.replaceChildren(text, sr);
  } else {
    delete el.dataset.def;
    el.textContent = text;
  }
}
