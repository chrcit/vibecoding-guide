/*
  The wiki at build time: the articles in ../wiki, the links between them,
  and the graph those links make, laid out once by a seeded force simulation
  so every build draws the same picture.

  getWiki() is the one entry point. It validates the collection and throws
  with a message naming the file when something is wrong: an unknown
  cluster, a title or summary that does not match the body, a link to an
  article that does not exist.
*/
import { getCollection, type CollectionEntry } from 'astro:content';

export type Shape = 'circle' | 'diamond' | 'triangle' | 'cross' | 'hexagon' | 'triangle-down' | 'ring' | 'square';
export type Tone = 'ink' | 'accent' | 'green' | 'blue';
export type Cluster = { id: string; label: string; shape: Shape; tone: Tone };

// The order here is the order of the index, the legend and the keyboard path
// through the graph. Neighbouring clusters differ in shape and colour.
export const CLUSTERS: Cluster[] = [
  { id: 'basics', label: 'Basics', shape: 'circle', tone: 'ink' },
  { id: 'context', label: 'Context', shape: 'diamond', tone: 'accent' },
  { id: 'working', label: 'Working with an agent', shape: 'triangle', tone: 'green' },
  { id: 'models', label: 'Models and cost', shape: 'square', tone: 'blue' },
  { id: 'checking', label: 'Checking the work', shape: 'hexagon', tone: 'accent' },
  { id: 'teams', label: 'Many agents', shape: 'cross', tone: 'blue' },
  { id: 'web', label: 'The web', shape: 'ring', tone: 'green' },
  { id: 'shipping', label: 'Shipping', shape: 'triangle-down', tone: 'ink' },
];
export const clusterOf = (id: string) => CLUSTERS.find((c) => c.id === id)!;

export type Article = {
  slug: string;
  title: string;
  summary: string;
  cluster: string;
  aliases: string[];
  updated: Date;
  /** Still an outline: the body carries a <!-- stub --> marker. */
  stub: boolean;
  /** Articles this one links to, in order of first appearance. */
  out: string[];
  /** Articles that link here. */
  in: string[];
  entry: CollectionEntry<'wiki'>;
};

export type GraphNode = {
  slug: string;
  title: string;
  cluster: string;
  summary: string;
  aliases: string[];
  degree: number;
  /** Layout position, in the graph's user units. */
  x: number;
  y: number;
  r: number;
  /** Shown as a label when the graph is zoomed out. */
  major: boolean;
};
export type Graph = {
  nodes: GraphNode[];
  /** Undirected, each pair once, as indices into nodes. */
  edges: [number, number][];
  viewBox: { x: number; y: number; w: number; h: number };
  clusterLabels: { id: string; label: string; x: number; y: number }[];
};

export type Wiki = {
  articles: Article[];
  bySlug: Map<string, Article>;
  graph: Graph;
  /** Article slugs that share an edge with this one, either direction. */
  neighbours: (slug: string) => string[];
};

// ---------------------------------------------------------------- parsing

const LINK = /\]\(\s*(?:\.\/)?([A-Za-z0-9_-]+)\.md(?:#[^)\s]*)?\s*\)|^\s*\[[^\]]+\]:\s*(?:\.\/)?([A-Za-z0-9_-]+)\.md/gm;
const norm = (s: string) => s.replace(/\s+/g, ' ').trim();
const plain = (s: string) => s.replace(/\[([^\]]*)\]\([^)]*\)/g, '$1').replace(/[*_`]/g, '');

function parseBody(body: string) {
  const clean = body.replace(/<!--[\s\S]*?-->/g, '').replace(/^```[\s\S]*?^```/gm, '').replace(/`[^`\n]*`/g, '');
  const links: string[] = [];
  for (const m of clean.matchAll(LINK)) {
    const slug = m[1] ?? m[2];
    if (slug && slug.toLowerCase() !== 'readme' && !links.includes(slug)) links.push(slug);
  }
  const blocks = body.replace(/<!--[\s\S]*?-->/g, '').split(/\n\s*\n/).map((b) => b.trim()).filter(Boolean);
  const h1 = blocks[0]?.match(/^#\s+(.+)$/)?.[1]?.trim();
  const first = blocks[1] ? norm(plain(blocks[1])) : '';
  return { links, h1, first, stub: /<!--\s*stub\s*-->/.test(body) };
}

// ---------------------------------------------------------------- layout

function hashString(s: string) {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) h = Math.imul(h ^ s.charCodeAt(i), 16777619);
  return h >>> 0;
}
/** mulberry32: a small seeded generator, so the layout is the same on every build. */
export function seeded(seed: string) {
  let a = hashString(seed);
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export const nodeRadius = (degree: number) => 5 + 2.1 * Math.sqrt(degree);
/** Approximate width of a label in user units at the graph's label size. */
export const labelWidth = (title: string) => title.length * 7.1 + 6;
const LABEL_GAP = 4;
const LABEL_H = 18;

type P = { x: number; y: number };

/**
 * A deterministic force layout. Clusters get anchors (basics in the middle,
 * the rest on a ring), nodes start near their anchor with seeded jitter, and
 * a Fruchterman-Reingold style simulation with a pull towards the anchor
 * settles them. A final pass pushes apart overlapping node-and-label boxes.
 */
export function layout(nodes: { slug: string; cluster: string; title: string; degree: number }[], edges: [number, number][], seed = 'acg-wiki') {
  const rand = seeded(seed);
  const n = nodes.length;
  const W = 1200, H = 800;
  const ring = CLUSTERS.filter((c) => c.id !== 'basics');
  const anchor = new Map<string, P>();
  anchor.set('basics', { x: W / 2, y: H / 2 });
  ring.forEach((c, i) => {
    const a = -Math.PI / 2 + (i / ring.length) * Math.PI * 2;
    anchor.set(c.id, { x: W / 2 + Math.cos(a) * W * 0.36, y: H / 2 + Math.sin(a) * H * 0.38 });
  });

  const p: P[] = nodes.map((nd) => {
    const a = anchor.get(nd.cluster) ?? { x: W / 2, y: H / 2 };
    return { x: a.x + (rand() - 0.5) * 120, y: a.y + (rand() - 0.5) * 120 };
  });
  const L = 92; // ideal edge length
  const iterations = 700;
  for (let it = 0; it < iterations; it++) {
    const t = 40 * (1 - it / iterations) + 0.5;
    const d: P[] = p.map(() => ({ x: 0, y: 0 }));
    for (let i = 0; i < n; i++) {
      for (let j = i + 1; j < n; j++) {
        let dx = p[i].x - p[j].x, dy = p[i].y - p[j].y;
        let dist = Math.hypot(dx, dy);
        if (dist < 0.01) { dx = rand() - 0.5; dy = rand() - 0.5; dist = 0.5; }
        const f = (L * L) / dist;
        const fx = (dx / dist) * f, fy = (dy / dist) * f;
        d[i].x += fx; d[i].y += fy; d[j].x -= fx; d[j].y -= fy;
      }
    }
    for (const [a, b] of edges) {
      const dx = p[a].x - p[b].x, dy = p[a].y - p[b].y;
      const dist = Math.max(0.01, Math.hypot(dx, dy));
      const f = (dist * dist) / L;
      const fx = (dx / dist) * f, fy = (dy / dist) * f;
      d[a].x -= fx; d[a].y -= fy; d[b].x += fx; d[b].y += fy;
    }
    for (let i = 0; i < n; i++) {
      const a = anchor.get(nodes[i].cluster)!;
      d[i].x += (a.x - p[i].x) * 1.1;
      d[i].y += (a.y - p[i].y) * 1.1;
      const len = Math.hypot(d[i].x, d[i].y);
      if (len > 0) {
        const m = Math.min(len, t);
        p[i].x += (d[i].x / len) * m;
        p[i].y += (d[i].y / len) * m;
      }
    }
  }

  // Boxes: the mark and the label under it. Push overlapping boxes apart.
  const box = (i: number) => {
    const r = nodeRadius(nodes[i].degree);
    const w = Math.max(r * 2, labelWidth(nodes[i].title)) + 10;
    return { x: p[i].x - w / 2, y: p[i].y - r - 6, w, h: r * 2 + LABEL_GAP + LABEL_H + 10 };
  };
  for (let pass = 0; pass < 400; pass++) {
    let moved = false;
    for (let i = 0; i < n; i++) {
      for (let j = i + 1; j < n; j++) {
        const A = box(i), B = box(j);
        const ox = Math.min(A.x + A.w, B.x + B.w) - Math.max(A.x, B.x);
        const oy = Math.min(A.y + A.h, B.y + B.h) - Math.max(A.y, B.y);
        if (ox <= 0 || oy <= 0) continue;
        moved = true;
        if (ox < oy * 1.6) {
          const s = (p[i].x < p[j].x ? -1 : 1) * (ox / 2 + 0.5);
          p[i].x += s; p[j].x -= s;
        } else {
          const s = (p[i].y < p[j].y ? -1 : 1) * (oy / 2 + 0.5);
          p[i].y += s; p[j].y -= s;
        }
      }
    }
    if (!moved) break;
  }
  return { positions: p.map((q) => ({ x: Math.round(q.x * 10) / 10, y: Math.round(q.y * 10) / 10 })), box };
}

function placeClusterLabels(nodes: GraphNode[]) {
  const boxes = nodes.map((nd) => {
    const w = Math.max(nd.r * 2, labelWidth(nd.title)) + 6;
    return { x: nd.x - w / 2, y: nd.y - nd.r - 4, w, h: nd.r * 2 + LABEL_GAP + LABEL_H + 6 };
  });
  const cx = nodes.reduce((s, nd) => s + nd.x, 0) / nodes.length;
  const cy = nodes.reduce((s, nd) => s + nd.y, 0) / nodes.length;
  const placed: { x: number; y: number; w: number; h: number }[] = [];
  const out: Graph['clusterLabels'] = [];
  for (const c of CLUSTERS) {
    const own = nodes.filter((nd) => nd.cluster === c.id);
    if (!own.length) continue;
    const mx = own.reduce((s, nd) => s + nd.x, 0) / own.length;
    const my = own.reduce((s, nd) => s + nd.y, 0) / own.length;
    const spread = Math.max(...own.map((nd) => Math.hypot(nd.x - mx, nd.y - my)));
    const w = c.label.length * 11 + 8, h = 30;
    let best = { x: mx, y: my, score: Infinity };
    for (let k = 0; k < 24; k++) {
      const a = (k / 24) * Math.PI * 2;
      for (const rr of [spread * 0.6, spread + 20, spread + 50]) {
        const x = mx + Math.cos(a) * rr, y = my + Math.sin(a) * rr;
        const b = { x: x - w / 2, y: y - h / 2, w, h };
        let score = 0;
        for (const o of [...boxes, ...placed]) {
          const ox = Math.min(b.x + b.w, o.x + o.w) - Math.max(b.x, o.x);
          const oy = Math.min(b.y + b.h, o.y + o.h) - Math.max(b.y, o.y);
          if (ox > 0 && oy > 0) score += ox * oy;
        }
        // Prefer close to the cluster, and on its outer side.
        const outward = (x - mx) * (mx - cx) + (y - my) * (my - cy);
        score += rr * 1.5 - (c.id === 'basics' ? 0 : outward * 0.02);
        if (score < best.score) best = { x, y, score };
      }
    }
    placed.push({ x: best.x - w / 2, y: best.y - h / 2, w, h });
    out.push({ id: c.id, label: c.label, x: Math.round(best.x), y: Math.round(best.y) });
  }
  return { labels: out, boxes: [...boxes, ...placed] };
}

// ---------------------------------------------------------------- loading

// Routes under /wiki/ that are not articles.
const RESERVED = new Set(['graph', 'graph.json', 'index']);

let cached: Promise<Wiki> | undefined;
export function getWiki(): Promise<Wiki> {
  cached ??= load();
  return cached;
}

async function load(): Promise<Wiki> {
  const entries = await getCollection('wiki');
  const known = new Set(CLUSTERS.map((c) => c.id));
  const slugs = new Set(entries.map((e) => e.id));
  const problems: string[] = [];
  const order = (c: string) => CLUSTERS.findIndex((x) => x.id === c);

  const articles: Article[] = entries.map((e) => {
    const file = `wiki/${e.id}.md`;
    const d = e.data;
    if (!known.has(d.cluster)) problems.push(`${file}: cluster "${d.cluster}" is not one of ${[...known].join(', ')}.`);
    const body = parseBody(e.body ?? '');
    if (body.h1 !== d.title) problems.push(`${file}: the body should start with "# ${d.title}" (found ${body.h1 ? `"# ${body.h1}"` : 'no title'}).`);
    if (body.first !== norm(d.summary)) problems.push(`${file}: the first paragraph must be the summary, word for word.\n    summary: ${d.summary}\n    first paragraph: ${body.first || '(none)'}`);
    for (const l of body.links) if (!slugs.has(l)) problems.push(`${file}: links to ./${l}.md, which does not exist.`);
    if (RESERVED.has(e.id)) problems.push(`${file}: "${e.id}" is taken by a page of the wiki itself; rename the file.`);
    return {
      slug: e.id,
      title: d.title,
      summary: d.summary,
      cluster: d.cluster,
      aliases: d.aliases ?? [],
      updated: d.updated,
      stub: body.stub,
      out: body.links.filter((l) => l !== e.id && slugs.has(l)),
      in: [],
      entry: e,
    };
  });
  if (problems.length) throw new Error(`The wiki has ${problems.length} problem${problems.length > 1 ? 's' : ''}:\n  ${problems.join('\n  ')}`);

  articles.sort((a, b) => order(a.cluster) - order(b.cluster) || a.title.localeCompare(b.title, 'en'));
  const bySlug = new Map(articles.map((a) => [a.slug, a]));
  for (const a of articles) for (const t of a.out) bySlug.get(t)!.in.push(a.slug);
  for (const a of articles) a.in.sort((x, y) => bySlug.get(x)!.title.localeCompare(bySlug.get(y)!.title, 'en'));

  // Undirected edges, each pair once.
  const index = new Map(articles.map((a, i) => [a.slug, i]));
  const seen = new Set<string>();
  const edges: [number, number][] = [];
  const nb = new Map<string, Set<string>>(articles.map((a) => [a.slug, new Set()]));
  for (const a of articles) {
    for (const t of a.out) {
      const i = index.get(a.slug)!, j = index.get(t)!;
      const key = i < j ? `${i}-${j}` : `${j}-${i}`;
      nb.get(a.slug)!.add(t);
      nb.get(t)!.add(a.slug);
      if (seen.has(key)) continue;
      seen.add(key);
      edges.push(i < j ? [i, j] : [j, i]);
    }
  }
  edges.sort((a, b) => a[0] - b[0] || a[1] - b[1]);

  const base = articles.map((a) => ({ slug: a.slug, cluster: a.cluster, title: a.title, degree: nb.get(a.slug)!.size }));
  const { positions } = layout(base, edges);
  const ranked = [...base].sort((a, b) => b.degree - a.degree || a.title.localeCompare(b.title, 'en'));
  const majors = new Set(ranked.slice(0, 14).map((x) => x.slug));
  const nodes: GraphNode[] = articles.map((a, i) => ({
    slug: a.slug,
    title: a.title,
    cluster: a.cluster,
    summary: a.summary,
    aliases: a.aliases,
    degree: base[i].degree,
    x: positions[i].x,
    y: positions[i].y,
    r: Math.round(nodeRadius(base[i].degree) * 10) / 10,
    major: majors.has(a.slug),
  }));
  const { labels, boxes } = placeClusterLabels(nodes);
  const pad = 24;
  const minX = Math.min(...boxes.map((b) => b.x)) - pad;
  const minY = Math.min(...boxes.map((b) => b.y)) - pad;
  const maxX = Math.max(...boxes.map((b) => b.x + b.w)) + pad;
  const maxY = Math.max(...boxes.map((b) => b.y + b.h)) + pad;
  const viewBox = { x: Math.floor(minX), y: Math.floor(minY), w: Math.ceil(maxX - minX), h: Math.ceil(maxY - minY) };

  return {
    articles,
    bySlug,
    graph: { nodes, edges, viewBox, clusterLabels: labels },
    neighbours: (slug) => [...(nb.get(slug) ?? [])],
  };
}

// ---------------------------------------------------------------- drawing helpers

/** An SVG path for a cluster's mark, centred on 0,0. */
export function shapePath(shape: Shape, r: number): string {
  const f = (v: number) => Math.round(v * 100) / 100;
  const poly = (pts: [number, number][]) => 'M' + pts.map(([x, y]) => `${f(x)} ${f(y)}`).join('L') + 'Z';
  const regular = (k: number, rot: number, rr: number) =>
    Array.from({ length: k }, (_, i) => {
      const a = rot + (i / k) * Math.PI * 2;
      return [Math.cos(a) * rr, Math.sin(a) * rr] as [number, number];
    });
  const circle = (rr: number, sweep = 1) => `M${f(-rr)} 0a${f(rr)} ${f(rr)} 0 1 ${sweep} ${f(rr * 2)} 0a${f(rr)} ${f(rr)} 0 1 ${sweep} ${f(-rr * 2)} 0Z`;
  switch (shape) {
    case 'circle': return circle(r);
    case 'ring': return circle(r * 1.05) + circle(r * 0.55, 0);
    case 'square': { const s = r * 0.86; return poly([[-s, -s], [s, -s], [s, s], [-s, s]]); }
    case 'diamond': return poly(regular(4, -Math.PI / 2, r * 1.22));
    case 'triangle': return poly(regular(3, -Math.PI / 2, r * 1.3).map(([x, y]) => [x, y + r * 0.2]));
    case 'triangle-down': return poly(regular(3, Math.PI / 2, r * 1.3).map(([x, y]) => [x, y - r * 0.2]));
    case 'hexagon': return poly(regular(6, 0, r * 1.1));
    case 'cross': {
      const a = r * 1.1, b = r * 0.42;
      return poly([[-b, -a], [b, -a], [b, -b], [a, -b], [a, b], [b, b], [b, a], [-b, a], [-b, b], [-a, b], [-a, -b], [-b, -b]]);
    }
  }
}

/** Splits a title into lines of at most `max` characters, breaking at spaces. */
export function wrap(title: string, max: number): string[] {
  const lines: string[] = [];
  let cur = '';
  for (const w of title.split(/\s+/)) {
    if (!cur) cur = w;
    else if ((cur + ' ' + w).length <= max) cur += ' ' + w;
    else { lines.push(cur); cur = w; }
  }
  if (cur) lines.push(cur);
  return lines;
}
