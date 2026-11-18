/*
  The client layer of the wiki graph (GraphView.astro). The SVG is complete
  without this; here it gets a camera (pan, zoom, pinch), highlighting on
  hover and focus, a card with the summary, search, a cluster filter,
  arrow-key travel between nodes, and labels that stay 14px on screen and
  hide where they would overlap. No dependencies.

  The camera is the SVG's viewBox: (cx, cy) is the graph point at the middle
  of the stage, k is screen pixels per graph unit.
*/

type Node = { s: string; t: string; u: string; c: string; x: number; y: number; r: number; d: number; m: boolean; nb: number[] };
type Data = {
  vb: { x: number; y: number; w: number; h: number };
  nodes: Node[];
  edges: [number, number][];
  search: string[];
  marks: Record<string, { d: string; tone: string }>;
};
type Box = { x: number; y: number; w: number; h: number };

const reduced = () => matchMedia('(prefers-reduced-motion: reduce)').matches;
const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v));
const overlap = (a: Box, b: Box) => a.x < b.x + b.w && b.x < a.x + a.w && a.y < b.y + b.h && b.y < a.y + a.h;
const SVGNS = 'http://www.w3.org/2000/svg';

export function mountGraph(root: HTMLElement) {
  if (root.dataset.mounted) return;
  root.dataset.mounted = '1';
  const data: Data = JSON.parse(root.querySelector('.gv-data')!.textContent!);
  const stage = root.querySelector<HTMLElement>('[data-stage]')!;
  const svg = root.querySelector<SVGSVGElement>('.gv-svg')!;
  const nodeEls = [...svg.querySelectorAll<SVGAElement>('.gv-node')];
  const posEls = nodeEls.map((a) => a.querySelector<SVGGElement>('.gv-pos')!);
  const lblEls = nodeEls.map((a) => a.querySelector<SVGTextElement>('.gv-lbl')!);
  const lineEls = [...svg.querySelectorAll<SVGLineElement>('.gv-edges line')];
  const card = root.querySelector<HTMLElement>('.gv-card')!;
  const cardMk = card.querySelector<HTMLElement>('.gv-card-mk')!;
  const cardA = card.querySelector<HTMLAnchorElement>('.gv-card-a')!;
  const cardS = card.querySelector<HTMLElement>('.gv-card-s')!;
  const input = root.querySelector<HTMLInputElement>('.gv-q')!;
  const results = root.querySelector<HTMLUListElement>('.gv-results')!;
  const chips = [...root.querySelectorAll<HTMLButtonElement>('.gv-chip')];
  const zoomBox = root.querySelector<HTMLElement>('.gv-zoom')!;
  const live = root.querySelector<HTMLElement>('.gv-live')!;
  const N = data.nodes;

  // ------------------------------------------------------------ geometry
  // Positions as drawn. On a tall, narrow stage the whole picture turns a
  // quarter (clockwise), so a landscape graph fills a phone.
  let rotated = false;
  let P = N.map((n) => ({ x: n.x, y: n.y }));
  let bounds: Box = { ...data.vb };

  function orient(turn: boolean) {
    rotated = turn;
    const vb = data.vb;
    const rot = (p: { x: number; y: number }) => (turn ? { x: -p.y, y: p.x } : { x: p.x, y: p.y });
    P = N.map(rot);
    bounds = turn ? { x: -(vb.y + vb.h), y: vb.x, w: vb.h, h: vb.w } : { ...vb };
    P.forEach((p, i) => posEls[i].setAttribute('transform', `translate(${p.x} ${p.y})`));
    data.edges.forEach(([a, b], i) => {
      const l = lineEls[i];
      l.setAttribute('x1', String(P[a].x)); l.setAttribute('y1', String(P[a].y));
      l.setAttribute('x2', String(P[b].x)); l.setAttribute('y2', String(P[b].y));
    });
  }

  // ------------------------------------------------------------ camera
  let W = stage.clientWidth, H = stage.clientHeight;
  const cam = { cx: bounds.x + bounds.w / 2, cy: bounds.y + bounds.h / 2, k: 1 };
  let touched = false; // the reader has moved the camera themselves
  let anim = 0;

  // The title, search and cluster row sit over the graph on wide screens;
  // fitting leaves room for them.
  const topBar = root.querySelector<HTMLElement>('.gv-top')!;
  const chipRow = root.querySelector<HTMLElement>('.gv-clusters')!;
  function insets() {
    const fr = stage.getBoundingClientRect();
    const t = getComputedStyle(topBar).position === 'absolute' ? Math.max(0, topBar.getBoundingClientRect().bottom - fr.top) : 0;
    const b = Math.max(0, fr.bottom - chipRow.getBoundingClientRect().top);
    return { t: Math.min(t, H * 0.3), b: Math.min(b, H * 0.3) };
  }
  /** The camera that shows these nodes, clear of the overlays. */
  function fitNodes(idx: number[], maxK = Infinity) {
    const ins = insets();
    const pts = idx.map((i) => P[i]);
    const xs = pts.map((p) => p.x), ys = pts.map((p) => p.y);
    const x0 = Math.min(...xs), x1 = Math.max(...xs), y0 = Math.min(...ys), y1 = Math.max(...ys);
    const mx = Math.min(100, W * 0.1), mt = 28, mb = 44; // room for labels, which sit under their nodes
    const aw = Math.max(80, W - 2 * mx), ah = Math.max(80, H - ins.t - ins.b - mt - mb);
    const k = Math.min(aw / Math.max(1, x1 - x0), ah / Math.max(1, y1 - y0), maxK);
    const sy = ins.t + mt + ah / 2;
    return { cx: (x0 + x1) / 2, cy: (y0 + y1) / 2 - (sy - H / 2) / k, k };
  }
  const ALL = N.map((_, i) => i);
  const fitAll = () => fitNodes(ALL);
  const fitAllK = () => fitAll().k;
  const kMin = () => fitAllK() * 0.55;
  const kMax = () => Math.max(3, fitAllK() * 4);
  // Marks grow a little when the graph is small on screen, so they stay visible.
  const nodeScale = (k: number) => (k < 0.72 ? Math.min(0.72 / k, 2.4) : 1);

  function apply() {
    const { cx, cy, k } = cam;
    svg.setAttribute('viewBox', `${cx - W / 2 / k} ${cy - H / 2 / k} ${W / k} ${H / k}`);
    svg.style.setProperty('--k', String(k));
    svg.style.setProperty('--ns', String(nodeScale(k)));
    scheduleLabels();
    if (current !== null && !card.hidden) placeCard(current);
  }

  function animateTo(t: { cx: number; cy: number; k: number }) {
    cancelAnimationFrame(anim);
    t.k = clamp(t.k, kMin(), kMax());
    if (reduced()) { Object.assign(cam, t); apply(); return; }
    const from = { ...cam };
    const start = performance.now();
    const dur = 420;
    const step = (now: number) => {
      const p = Math.min(1, (now - start) / dur);
      const e = 1 - Math.pow(1 - p, 3);
      cam.cx = from.cx + (t.cx - from.cx) * e;
      cam.cy = from.cy + (t.cy - from.cy) * e;
      cam.k = from.k * Math.pow(t.k / from.k, e);
      apply();
      if (p < 1) anim = requestAnimationFrame(step);
    };
    anim = requestAnimationFrame(step);
  }

  const toScreen = (p: { x: number; y: number }) => ({ x: (p.x - cam.cx) * cam.k + W / 2, y: (p.y - cam.cy) * cam.k + H / 2 });
  const toGraph = (sx: number, sy: number) => ({ x: (sx - W / 2) / cam.k + cam.cx, y: (sy - H / 2) / cam.k + cam.cy });

  function zoomAt(sx: number, sy: number, factor: number) {
    const k = clamp(cam.k * factor, kMin(), kMax());
    const g = toGraph(sx, sy);
    cam.k = k;
    cam.cx = g.x - (sx - W / 2) / k;
    cam.cy = g.y - (sy - H / 2) / k;
    apply();
  }

  function fitVisible() {
    const idx = ALL.filter((i) => !out[i]);
    if (!idx.length || idx.length === N.length) return animateTo(fitAll());
    animateTo(fitNodes(idx, Math.max(fitAllK() * 2.2, 1.1)));
  }

  function ensureVisible(i: number) {
    const s = toScreen(P[i]);
    const m = Math.min(90, W * 0.18);
    if (s.x > m && s.x < W - m && s.y > m && s.y < H - m) return;
    animateTo({ cx: P[i].x, cy: P[i].y, k: cam.k });
  }

  // ------------------------------------------------------------ labels
  // Widths are measured once at --k: 1, where 14px text is 14 graph units:
  // the same as its width on screen at any zoom.
  let widths: number[] = [];
  function measure() {
    const k0 = svg.style.getPropertyValue('--k');
    svg.style.setProperty('--k', '1');
    widths = lblEls.map((t) => { try { return t.getComputedTextLength(); } catch { return t.textContent!.length * 7; } });
    svg.style.setProperty('--k', k0 || '1');
  }

  let labelFrame = 0;
  const scheduleLabels = () => { if (!labelFrame) labelFrame = requestAnimationFrame(() => { labelFrame = 0; placeLabels(); }); };
  const SPOTS = ['below', 'above', 'right', 'left'] as const;
  const LH = 18; // label box height in screen pixels

  /** Shows the labels that fit, most important first: under the node, else above, right or left of it. */
  function placeLabels() {
    const k = cam.k, ns = nodeScale(k);
    const scr = P.map(toScreen);
    const vis = scr.map((s) => s.x > -80 && s.x < W + 80 && s.y > -40 && s.y < H + 40);
    const rad = N.map((n) => n.r * ns * k);
    const marks: (Box & { i: number })[] = [];
    N.forEach((_, i) => {
      if (!vis[i] || out[i]) return;
      const r = rad[i] + 2;
      marks.push({ x: scr[i].x - r, y: scr[i].y - r, w: 2 * r, h: 2 * r, i });
    });
    // The overlays (title and search, cluster chips, zoom buttons) count as taken.
    const fr = stage.getBoundingClientRect();
    const placed: Box[] = [topBar, ...chips, zoomBox]
      .filter((el) => el.offsetParent !== null && (el !== topBar || getComputedStyle(topBar).position === 'absolute'))
      .map((el) => { const r = el.getBoundingClientRect(); return { x: r.left - fr.left - 4, y: r.top - fr.top - 4, w: r.width + 8, h: r.height + 8 }; });
    const inside = (b: Box) => b.x >= 4 && b.y >= 4 && b.x + b.w <= W - 4 && b.y + b.h <= H - 4;
    const focus = current !== null ? new Set([current, ...N[current].nb]) : null;
    const rank = (i: number) =>
      (i === current ? 0 : focus?.has(i) ? 1 : peek && N[i].c === peek ? 2 : matches.has(i) ? 2 : N[i].m ? 3 : 4) * 1000 - N[i].d;
    const order = N.map((_, i) => i).sort((a, b) => rank(a) - rank(b));
    for (const i of order) {
      const el = lblEls[i];
      let spot: (typeof SPOTS)[number] | null = null;
      if (vis[i] && !out[i] && (!focus || focus.has(i)) && (!peek || N[i].c === peek)) {
        const s = scr[i], r = rad[i], w = widths[i] + 6;
        // Two tries: clear of every mark; then, for the hubs, over small marks if need be.
        for (const strict of [true, false]) {
          if (!strict && !(N[i].m || i === current)) break;
          for (const at of SPOTS) {
          const b =
            at === 'below' ? { x: s.x - w / 2, y: s.y + r + 3, w, h: LH } :
            at === 'above' ? { x: s.x - w / 2, y: s.y - r - 3 - LH, w, h: LH } :
            at === 'right' ? { x: s.x + r + 4, y: s.y - LH / 2, w, h: LH } :
            { x: s.x - r - 4 - w, y: s.y - LH / 2, w, h: LH };
          if (!inside(b) || placed.some((p) => overlap(p, b))) continue;
          // Only over marks painted earlier (lower index), so the label lands on top of them.
          if (marks.some((m) => m.i !== i && overlap(m, b) && (strict || N[m.i].m || m.i > i))) continue;
          spot = at;
          placed.push(b);
          break;
          }
          if (spot) break;
        }
        if (!spot && i === current) spot = 'below';
      }
      el.classList.toggle('off', !spot);
      if (spot && el.dataset.at !== spot) {
        el.dataset.at = spot;
        el.setAttribute('text-anchor', spot === 'right' ? 'start' : spot === 'left' ? 'end' : 'middle');
        el.setAttribute('dominant-baseline', spot === 'below' ? 'hanging' : spot === 'above' ? 'auto' : 'central');
      }
    }
  }

  // ------------------------------------------------------------ highlight and card
  let current: number | null = null; // the highlighted node
  let pinned: number | null = null;  // kept highlighted after a tap, a search pick or ?focus=
  let hovered: number | null = null;
  let focused: number | null = null;

  function setCurrent(i: number | null, mode: 'mouse' | 'focus' | 'touch' | 'pin' = 'mouse') {
    if (current !== null) {
      nodeEls[current].classList.remove('cur');
      for (const j of N[current].nb) nodeEls[j].classList.remove('nb');
    }
    for (const l of lineEls) l.classList.remove('on');
    current = i;
    svg.classList.toggle('hl', i !== null);
    if (i === null) { card.hidden = true; scheduleLabels(); return; }
    nodeEls[i].classList.add('cur');
    for (const j of N[i].nb) nodeEls[j].classList.add('nb');
    data.edges.forEach(([a, b], e) => { if (a === i || b === i) lineEls[e].classList.add('on'); });
    const n = N[i];
    const m = data.marks[n.c];
    cardMk.innerHTML = `<svg class="cmark" width="14" height="14" viewBox="-10 -10 20 20" aria-hidden="true"><path d="${m.d}" fill-rule="evenodd" style="fill:var(--${m.tone})"/></svg>`;
    cardA.textContent = n.t;
    cardA.href = nodeEls[i].getAttribute('href')!;
    cardA.tabIndex = mode === 'touch' ? 0 : -1;
    cardS.textContent = n.u;
    card.classList.toggle('touch', mode === 'touch');
    card.hidden = false;
    placeCard(i);
    scheduleLabels();
  }

  function placeCard(i: number) {
    const docked = W < 640;
    card.classList.toggle('docked', docked);
    if (docked) { card.style.transform = ''; return; }
    const s = toScreen(P[i]);
    const r = N[i].r * nodeScale(cam.k) * cam.k;
    const cw = card.offsetWidth, ch = card.offsetHeight;
    let x = s.x + r + 18;
    if (x + cw > W - 12) x = s.x - r - 18 - cw;
    x = clamp(x, 12, W - cw - 12);
    const y = clamp(s.y - ch / 2, 12, H - ch - 12);
    card.style.transform = `translate(${Math.round(x)}px, ${Math.round(y)}px)`;
  }

  const settle = () => {
    const want = focused ?? hovered ?? pinned;
    if (want !== current) setCurrent(want, want === pinned && want !== null ? (card.classList.contains('touch') ? 'touch' : 'pin') : 'mouse');
  };

  // ------------------------------------------------------------ filter and search
  const filter = new Set<string>();
  let peek: string | null = null; // a cluster previewed by hovering or focusing its chip
  let query = '';
  let matches = new Set<number>();
  let out: boolean[] = N.map(() => false);

  function applyFilter() {
    out = N.map((n, i) => (filter.size > 0 && !filter.has(n.c)) || (query !== '' && !matches.has(i)));
    nodeEls.forEach((el, i) => {
      el.classList.toggle('out', out[i]);
      if (out[i]) el.setAttribute('tabindex', '-1'); else el.removeAttribute('tabindex');
    });
    data.edges.forEach(([a, b], e) => lineEls[e].classList.toggle('out', out[a] || out[b]));
    root.classList.toggle('filtering', filter.size > 0);
    if (current !== null && out[current] && current !== pinned) setCurrent(null);
    scheduleLabels();
  }

  function search(q: string) {
    const terms = q.toLowerCase().trim().split(/\s+/).filter(Boolean);
    query = terms.join(' ');
    const scored: { i: number; s: number }[] = [];
    if (terms.length) {
      N.forEach((n, i) => {
        const title = n.t.toLowerCase();
        const hay = data.search[i];
        const sum = n.u.toLowerCase();
        if (!terms.every((t) => hay.includes(t) || sum.includes(t))) return;
        const q0 = terms.join(' ');
        const s = title.startsWith(q0) ? 0 : new RegExp(`\\b${q0.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}`).test(title) ? 1 : title.includes(q0) ? 2 : terms.every((t) => hay.includes(t)) ? 3 : 4;
        scored.push({ i, s });
      });
      scored.sort((a, b) => a.s - b.s || N[b.i].d - N[a.i].d);
    }
    matches = new Set(scored.map((x) => x.i));
    applyFilter();
    renderResults(scored.slice(0, 8).map((x) => x.i));
  }

  let active = -1;
  let shown: number[] = [];
  function renderResults(list: number[]) {
    shown = list;
    active = list.length ? 0 : -1;
    results.innerHTML = '';
    if (!query) { results.hidden = true; input.setAttribute('aria-expanded', 'false'); input.removeAttribute('aria-activedescendant'); return; }
    if (!list.length) {
      const li = document.createElement('li');
      li.className = 'r-none';
      li.textContent = 'No article matches.';
      results.append(li);
    }
    list.forEach((i, k) => {
      const n = N[i];
      const m = data.marks[n.c];
      const li = document.createElement('li');
      li.id = `${root.id}-opt-${i}`;
      li.setAttribute('role', 'option');
      li.dataset.i = String(i);
      li.innerHTML = `<span class="r-t"><svg class="cmark" width="13" height="13" viewBox="-10 -10 20 20" aria-hidden="true"><path d="${m.d}" fill-rule="evenodd" style="fill:var(--${m.tone})"/></svg></span><span class="r-s"></span>`;
      li.querySelector('.r-t')!.append(n.t);
      li.querySelector('.r-s')!.textContent = n.u;
      li.addEventListener('pointerdown', (e) => e.preventDefault());
      li.addEventListener('click', () => choose(i));
      li.addEventListener('pointermove', () => { if (active !== k) { active = k; markActive(); } });
      results.append(li);
    });
    results.hidden = false;
    input.setAttribute('aria-expanded', 'true');
    markActive();
  }
  function markActive() {
    [...results.querySelectorAll('[role=option]')].forEach((li, k) => li.setAttribute('aria-selected', String(k === active)));
    const el = active >= 0 ? results.querySelector<HTMLElement>(`[role=option]:nth-child(${active + 1})`) : null;
    if (el) { input.setAttribute('aria-activedescendant', el.id); el.scrollIntoView({ block: 'nearest' }); }
    else input.removeAttribute('aria-activedescendant');
  }
  function choose(i: number) {
    input.value = '';
    search('');
    if (filter.size && !filter.has(N[i].c)) { filter.clear(); syncChips(); applyFilter(); }
    pinned = i;
    touched = true;
    animateTo({ cx: P[i].x, cy: P[i].y, k: Math.max(cam.k, Math.min(fitAllK() * 2.2, 1.4)) });
    nodeEls[i].focus({ preventScroll: true });
  }

  function syncChips() {
    for (const b of chips) b.setAttribute('aria-pressed', String(filter.has(b.dataset.cluster!)));
  }

  // ------------------------------------------------------------ events
  input.addEventListener('input', () => search(input.value));
  input.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowDown' && shown.length) { e.preventDefault(); active = (active + 1) % shown.length; markActive(); }
    else if (e.key === 'ArrowUp' && shown.length) { e.preventDefault(); active = (active - 1 + shown.length) % shown.length; markActive(); }
    else if (e.key === 'Enter' && shown.length) { e.preventDefault(); choose(shown[Math.max(0, active)]); }
    else if (e.key === 'Escape') { if (input.value) { e.preventDefault(); input.value = ''; search(''); } }
  });
  input.addEventListener('blur', () => { results.hidden = true; input.setAttribute('aria-expanded', 'false'); });
  input.addEventListener('focus', () => { if (query) { results.hidden = false; input.setAttribute('aria-expanded', 'true'); } });

  const setPeek = (id: string | null) => {
    peek = id;
    svg.classList.toggle('peek', !!id);
    nodeEls.forEach((el, i) => el.classList.toggle('pk', N[i].c === id));
    data.edges.forEach(([a, b], e) => lineEls[e].classList.toggle('pk', !!id && N[a].c === id && N[b].c === id));
    scheduleLabels();
  };
  for (const b of chips) {
    b.addEventListener('pointerenter', (e) => { if (e.pointerType === 'mouse') setPeek(b.dataset.cluster!); });
    b.addEventListener('pointerleave', () => setPeek(null));
    b.addEventListener('focus', () => setPeek(b.dataset.cluster!));
    b.addEventListener('blur', () => setPeek(null));
    b.addEventListener('click', () => {
      const id = b.dataset.cluster!;
      if (filter.has(id)) filter.delete(id); else filter.add(id);
      syncChips();
      applyFilter();
      touched = true;
      fitVisible();
      const count = out.filter((o) => !o).length;
      live.textContent = filter.size ? `${count} articles shown` : 'All articles shown';
    });
  }

  zoomBox.addEventListener('click', (e) => {
    const b = (e.target as Element).closest<HTMLButtonElement>('button');
    if (!b) return;
    touched = true;
    const z = b.dataset.zoom;
    if (z === 'fit') return fitVisible();
    animateTo({ cx: cam.cx, cy: cam.cy, k: cam.k * (z === 'in' ? 1.6 : 1 / 1.6) });
  });

  const nodeIndex = (t: EventTarget | null) => {
    const a = (t as Element | null)?.closest?.('.gv-node') as SVGAElement | null;
    return a ? Number(a.dataset.i) : null;
  };

  svg.addEventListener('pointerover', (e) => {
    if (e.pointerType === 'touch') return;
    const i = nodeIndex(e.target);
    if (i === null || out[i]) return;
    hovered = i;
    settle();
  });
  svg.addEventListener('pointerout', (e) => {
    if (e.pointerType === 'touch') return;
    const i = nodeIndex(e.target);
    if (i === null || nodeIndex(e.relatedTarget) === i) return;
    hovered = null;
    settle();
  });
  svg.addEventListener('focusin', (e) => {
    const i = nodeIndex(e.target);
    if (i === null) return;
    focused = i;
    if (pinned !== null && pinned !== i) pinned = null;
    setCurrent(i, 'focus');
    ensureVisible(i);
  });
  svg.addEventListener('focusout', (e) => {
    if (nodeIndex(e.relatedTarget) !== null) return;
    focused = null;
    settle();
  });

  // Pointer: drag to pan, two fingers to pinch. Capture starts only once a
  // drag is under way, so a plain click still reaches the link.
  const pts = new Map<number, { x: number; y: number }>();
  let drag: { x: number; y: number; cx: number; cy: number; moved: boolean; id: number } | null = null;
  let pinch: { d: number; k: number; g: { x: number; y: number } } | null = null;
  let suppressClick = false;
  let lastType = 'mouse';
  const local = (e: PointerEvent) => { const r = stage.getBoundingClientRect(); return { x: e.clientX - r.left, y: e.clientY - r.top }; };

  svg.addEventListener('pointerdown', (e) => {
    lastType = e.pointerType;
    if (e.button !== 0) return;
    pts.set(e.pointerId, local(e));
    cancelAnimationFrame(anim);
    if (pts.size === 1) {
      const p = local(e);
      drag = { x: p.x, y: p.y, cx: cam.cx, cy: cam.cy, moved: false, id: e.pointerId };
    } else if (pts.size === 2) {
      const [a, b] = [...pts.values()];
      const mid = { x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 };
      pinch = { d: Math.hypot(a.x - b.x, a.y - b.y) || 1, k: cam.k, g: toGraph(mid.x, mid.y) };
      drag = null;
      suppressClick = true;
    }
  });
  svg.addEventListener('pointermove', (e) => {
    if (!pts.has(e.pointerId)) return;
    const p = local(e);
    pts.set(e.pointerId, p);
    if (pinch && pts.size >= 2) {
      const [a, b] = [...pts.values()];
      const mid = { x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 };
      const k = clamp(pinch.k * (Math.hypot(a.x - b.x, a.y - b.y) / pinch.d), kMin(), kMax());
      cam.k = k;
      cam.cx = pinch.g.x - (mid.x - W / 2) / k;
      cam.cy = pinch.g.y - (mid.y - H / 2) / k;
      touched = true;
      apply();
      return;
    }
    if (!drag || drag.id !== e.pointerId) return;
    const dx = p.x - drag.x, dy = p.y - drag.y;
    if (!drag.moved && Math.hypot(dx, dy) < 5) return;
    if (!drag.moved) {
      drag.moved = true;
      touched = true;
      stage.classList.add('dragging');
      try { svg.setPointerCapture(e.pointerId); } catch { /* the pointer may already be gone */ }
    }
    cam.cx = drag.cx - dx / cam.k;
    cam.cy = drag.cy - dy / cam.k;
    apply();
  });
  const end = (e: PointerEvent) => {
    pts.delete(e.pointerId);
    if (drag?.id === e.pointerId) {
      if (drag.moved) suppressClick = true;
      drag = null;
    }
    if (pts.size < 2) pinch = null;
    if (!pts.size) stage.classList.remove('dragging');
  };
  svg.addEventListener('pointerup', end);
  svg.addEventListener('pointercancel', end);

  svg.addEventListener('click', (e) => {
    if (suppressClick) { suppressClick = false; e.preventDefault(); e.stopPropagation(); return; }
    const i = nodeIndex(e.target);
    if (i === null) {
      // A click on empty space lets go of whatever was held.
      pinned = null; hovered = null;
      if (focused === null) setCurrent(null);
      return;
    }
    if (lastType === 'touch' && pinned !== i) {
      // First tap shows the card; a second tap, or the card's title, opens it.
      e.preventDefault();
      pinned = i;
      setCurrent(i, 'touch');
    }
  }, true);

  stage.addEventListener('wheel', (e) => {
    e.preventDefault();
    touched = true;
    const p = local(e as unknown as PointerEvent);
    const line = e.deltaMode === 1 ? 16 : e.deltaMode === 2 ? H : 1;
    const dx = e.deltaX * line, dy = e.deltaY * line;
    const trackpadPan = !e.ctrlKey && e.deltaMode === 0 && (Math.abs(dx) > 0.5 || (Math.abs(dy) < 40 && !Number.isInteger(dy)));
    if (trackpadPan) {
      cancelAnimationFrame(anim);
      cam.cx += dx / cam.k;
      cam.cy += dy / cam.k;
      apply();
    } else {
      cancelAnimationFrame(anim);
      zoomAt(p.x, p.y, Math.exp(-dy * (e.ctrlKey ? 0.012 : 0.0016)));
    }
  }, { passive: false });

  // Keys on a node: arrows travel, + and - zoom, 0 shows everything.
  root.addEventListener('keydown', (e) => {
    const i = nodeIndex(e.target);
    if (i === null) return;
    const dirs: Record<string, [number, number]> = { ArrowRight: [1, 0], ArrowLeft: [-1, 0], ArrowDown: [0, 1], ArrowUp: [0, -1] };
    if (dirs[e.key]) {
      e.preventDefault();
      const j = step(i, dirs[e.key]);
      if (j !== null) nodeEls[j].focus({ preventScroll: true });
    } else if (e.key === '+' || e.key === '=') { e.preventDefault(); touched = true; animateTo({ ...cam, k: cam.k * 1.6 }); }
    else if (e.key === '-' || e.key === '_') { e.preventDefault(); touched = true; animateTo({ ...cam, k: cam.k / 1.6 }); }
    else if (e.key === '0') { e.preventDefault(); fitVisible(); }
    else if (e.key === 'Escape') { pinned = null; if (filter.size) { filter.clear(); syncChips(); applyFilter(); fitVisible(); } }
  });

  /** The best node in a direction: within a cone, near, and a neighbour if possible. */
  function step(i: number, [ux, uy]: [number, number]) {
    let best: number | null = null, bestScore = Infinity;
    N.forEach((n, j) => {
      if (j === i || out[j]) return;
      const vx = P[j].x - P[i].x, vy = P[j].y - P[i].y;
      const along = vx * ux + vy * uy;
      if (along <= 0) return;
      const across = Math.abs(vx * uy - vy * ux);
      if (across > along * 1.7) return;
      let score = along + across * 1.6;
      if (N[i].nb.includes(j)) score *= 0.55;
      if (score < bestScore) { bestScore = score; best = j; }
    });
    return best;
  }

  // Tabbing to a node can make the browser scroll the clipped stage; keep it still.
  stage.addEventListener('scroll', () => { stage.scrollTop = 0; stage.scrollLeft = 0; });

  // ------------------------------------------------------------ start
  root.classList.add('js');
  input.disabled = false;
  chips.forEach((b) => (b.disabled = false));
  zoomBox.hidden = false;
  W = stage.clientWidth; H = stage.clientHeight;
  orient(W / H < 0.85 && data.vb.w > data.vb.h);
  measure();
  Object.assign(cam, fitAll());
  apply();
  document.fonts?.ready.then(() => { measure(); scheduleLabels(); });

  new ResizeObserver(() => {
    const w = stage.clientWidth, h = stage.clientHeight;
    if (!w || !h || (w === W && h === H)) return;
    W = w; H = h;
    const turn = W / H < 0.85 && data.vb.w > data.vb.h;
    if (turn !== rotated) { orient(turn); touched = false; }
    if (!touched) Object.assign(cam, filter.size ? cam : fitAll());
    apply();
  }).observe(stage);

  // Starting state: #n-<slug> from an article page, or the review page's data-state.
  const hash = decodeURIComponent(location.hash.slice(1));
  const fromHash = root.id === 'gv' && hash.startsWith('n-') ? hash.slice(2) : '';
  const state = fromHash ? `focus:${fromHash}` : root.dataset.state ?? '';
  const [kind, value = ''] = state.split(/:(.*)/s);
  const bySlug = (s: string) => N.findIndex((n) => n.s === s);
  if (kind === 'focus' && bySlug(value) >= 0) {
    const i = bySlug(value);
    pinned = i;
    Object.assign(cam, { cx: P[i].x, cy: P[i].y, k: clamp(Math.min(fitAllK() * 2, 1.25), kMin(), kMax()) });
    apply();
    setCurrent(i, 'pin');
  } else if (kind === 'cluster' && chips.some((b) => b.dataset.cluster === value)) {
    filter.add(value);
    syncChips();
    applyFilter();
    fitVisible();
  } else if (kind === 'search') {
    input.value = value;
    search(value);
    results.hidden = true;
    input.setAttribute('aria-expanded', 'false');
  } else if (!reduced()) {
    svg.classList.add('enter');
    setTimeout(() => svg.classList.remove('enter'), 1800);
  }
}
