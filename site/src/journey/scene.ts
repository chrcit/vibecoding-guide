/*
 * The engine behind the journey's picture: it keeps the drawing in step with a scene state, moves
 * pucks along the floor, and runs a chapter's scripts so they can be cut short when the reader
 * scrolls on. Browser only. What is drawn is decided in picture.ts.
 */
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
  private frame = { w: 800, h: 600 };
  private camera: Camera = { s: 1, tx: 0, ty: 0 };
  private token = 0;
  private drawn?: SceneState;
  /** Called after every draw with the kinds of slab in view, for the key under the drawing. */
  onKinds?: (kinds: Kind[]) => void;
  speed = 1;
  /** The site's base path, put in front of a label's side-view link. */
  base = '/';

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
    root.append(this.svg, this.labels);
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
    const pic = picture(this.state, this.frame, this.drawn);
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
        el.textContent = l.text;
        if (l.side) { (el as HTMLAnchorElement).href = this.base + l.side; el.setAttribute('data-side', ''); }
        el.style.opacity = '0';
        this.labels.append(el);
        this.labelEls.set(l.key, el);
        el.style.left = `${(l.x / this.frame.w) * 100}%`;
        el.style.top = `${(l.y / this.frame.h) * 100}%`;
        void el.offsetWidth;
      } else {
        if (el.textContent !== l.text) el.textContent = l.text;
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
    this.onKinds?.(pic.kinds);
    if (instant || reduced.matches) requestAnimationFrame(() => requestAnimationFrame(() => this.root.removeAttribute('data-instant')));
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
