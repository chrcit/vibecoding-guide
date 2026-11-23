/*
 * Isometric drawing kit for the guide's figures.
 *
 * Adapted from the iso-kit in Anatomy by Ryan (@wheresryan22), MIT licence,
 * https://skills.wheresryan.sh/anatomy. The licence text is in ./LICENSE-anatomy.txt.
 *
 * What changed from Anatomy's kit, and why:
 * - The camera is fixed (azimuth 45°, elevation 30°) so every figure on the site shares one view.
 * - Four face tones (top, left, right, shadow) instead of four facing buckets plus top, named for
 *   what a reader sees on a box. Colours come from the site tokens in ../fig.css, never from here.
 * - One lit accent per figure, painted with --accent, not white or black.
 * - Only the primitives the site's figures use: box, plate, cylinder, pipe, flat arrow, glass box,
 *   top-plane transforms and anchors for HTML labels. No lathe, tubes, audit, WebGL or 3D.
 * - Renders strings at build time; client scripts only move groups with transform and opacity.
 *
 * Coordinates: world units, x and y on the floor, z up. A screen point is `Flat`.
 */

export type Flat = [number, number];
export type Point3 = [number, number, number];
export type Plane = [number, number];
export interface Plan { x: number; y: number; w: number; d: number; r: number }
export interface Projection { origin: Flat; scale: number }

const A = (45 * Math.PI) / 180;
const E = (30 * Math.PI) / 180;
const SIN_A = Math.sin(A), COS_A = Math.cos(A), SIN_E = Math.sin(E), COS_E = Math.cos(E);
const UNIT = Math.sqrt(1.6);

/** World point to screen point. */
export function iso([x, y, z]: Point3, P: Projection): Flat {
  const k = P.scale * UNIT;
  return [P.origin[0] + (x * SIN_A - y * COS_A) * k, P.origin[1] + ((x * COS_A + y * SIN_A) * SIN_E - z * COS_E) * k];
}

/** Larger is nearer the viewer. Sort ascending and paint in that order. */
export const depthOf = ([x, y, z]: Point3) => (x * COS_A + y * SIN_A) * COS_E + z * SIN_E;
export const byDepth = <T>(items: T[], at: (item: T) => Point3) => [...items].sort((a, b) => depthOf(at(a)) - depthOf(at(b)));

/** Screen offset of a world vector, for translating a moving part. */
export function shift([dx, dy, dz]: Point3, P: Projection): Flat {
  const a = iso([0, 0, 0], P), b = iso([dx, dy, dz], P);
  return [b[0] - a[0], b[1] - a[1]];
}

/**
 * Scale and origin that fit the given world points into a width × height drawing. Pass `scale` to
 * centre the points at a scale you already chose, so the panes of one figure share a scale.
 */
export function fit(points: Point3[], width: number, height: number, pad = 24, fixed?: number): Projection {
  const flat = points.map((p) => iso(p, { origin: [0, 0], scale: 1 }));
  const xs = flat.map((p) => p[0]), ys = flat.map((p) => p[1]);
  const [l, r, t, b] = [Math.min(...xs), Math.max(...xs), Math.min(...ys), Math.max(...ys)];
  const scale = fixed ?? Math.min((width - pad * 2) / (r - l), (height - pad * 2) / (b - t));
  return { origin: [width / 2 - ((l + r) / 2) * scale, height / 2 - ((t + b) / 2) * scale], scale };
}

/** A label anchor as percentages of the drawing, for HTML labels laid over the SVG. */
export function anchor(p: Point3, P: Projection, width: number, height: number) {
  const [x, y] = iso(p, P);
  return { left: `${((x / width) * 100).toFixed(2)}%`, top: `${((y / height) * 100).toFixed(2)}%` };
}

// ---------- paths ----------

const n1 = (v: number) => {
  const t = (Math.round(v * 10) / 10).toFixed(1).replace(/\.0$/, '');
  return t === '-0' ? '0' : t;
};
export const pathOf = (pts: Flat[], closed = false) =>
  pts.length ? pts.map(([x, y], i) => `${i ? 'L' : 'M'}${n1(x)} ${n1(y)}`).join('') + (closed ? 'Z' : '') : '';

export function roundedPlan({ x, y, w, d, r }: Plan, steps = 6): Plane[] {
  const rad = Math.max(0, Math.min(r, w / 2, d / 2));
  const corners: [number, number, number][] = [
    [x + w - rad, y + rad, -90], [x + w - rad, y + d - rad, 0], [x + rad, y + d - rad, 90], [x + rad, y + rad, 180],
  ];
  const out: Plane[] = [];
  for (const [cx, cy, start] of corners) {
    const count = rad > 0 ? steps : 0;
    for (let s = 0; s <= count; s++) {
      const a = ((start + (count ? (90 * s) / count : 45)) * Math.PI) / 180;
      out.push([cx + rad * Math.cos(a), cy + rad * Math.sin(a)]);
    }
  }
  return out;
}

export const circleRing = (cx: number, cy: number, r: number, steps = 36): Plane[] =>
  Array.from({ length: steps }, (_, i) => [cx + r * Math.cos((i / steps) * 2 * Math.PI), cy + r * Math.sin((i / steps) * 2 * Math.PI)] as Plane);

export const inset = ({ x, y, w, d, r }: Plan, by: number): Plan => ({ x: x + by, y: y + by, w: w - 2 * by, d: d - 2 * by, r: Math.max(0, r - by) });

function area(pts: Plane[] | Flat[]) {
  let s = 0;
  for (let i = 0; i < pts.length; i++) {
    const [ax, ay] = pts[i]!, [bx, by] = pts[(i + 1) % pts.length]!;
    s += ax * by - bx * ay;
  }
  return s / 2;
}

export function hull(points: Flat[]): Flat[] {
  const s = [...points].sort((a, b) => a[0] - b[0] || a[1] - b[1]);
  if (s.length < 3) return s;
  const cross = (o: Flat, a: Flat, b: Flat) => (a[0] - o[0]) * (b[1] - o[1]) - (a[1] - o[1]) * (b[0] - o[0]);
  const half = (list: Flat[]) => {
    const out: Flat[] = [];
    for (const p of list) {
      while (out.length >= 2 && cross(out[out.length - 2]!, out[out.length - 1]!, p) <= 0) out.pop();
      out.push(p);
    }
    return out.slice(0, -1);
  };
  return [...half(s), ...half([...s].reverse())];
}

// ---------- solids ----------

export type Face = 'left' | 'right' | 'shadow';

/** The painted pieces of one solid. Each string is an SVG path `d`. */
export interface Solid { fill: string; top: string; left: string; right: string; shadow: string; outline: string; crease: string }

/**
 * A vertical prism: the ring extruded from z up by h. Side faces are sorted into three tones by how
 * much they face the light (from the back left); the top is the lightest tone.
 */
export function prism(ring: Plane[], z: number, h: number, P: Projection): Solid {
  const n = ring.length;
  const ccw = area(ring) > 0;
  const normals = ring.map(([ax, ay], i) => {
    const [bx, by] = ring[(i + 1) % n]!;
    const len = Math.hypot(bx - ax, by - ay) || 1;
    return (ccw ? [(by - ay) / len, -(bx - ax) / len] : [-(by - ay) / len, (bx - ax) / len]) as Plane;
  });
  const facing = normals.map(([nx, ny]) => nx * COS_A + ny * SIN_A > 1e-9);
  const top = ring.map(([x, y]) => iso([x, y, z + h], P));
  const bot = ring.map(([x, y]) => iso([x, y, z], P));
  const faces: Record<Face, string[]> = { left: [], right: [], shadow: [] };
  const outline: string[] = [];
  const crease: string[] = [];
  for (let i = 0; i < n; i++) {
    const j = (i + 1) % n;
    if (facing[i]) {
      const [nx, ny] = normals[i]!;
      const lit = (nx * -SIN_A + ny * COS_A + 1) / 2;
      const face: Face = lit >= 0.5 ? 'left' : lit >= 0.12 ? 'right' : 'shadow';
      if (h > 0) faces[face].push(pathOf([top[i]!, top[j]!, bot[j]!, bot[i]!], true));
      crease.push(pathOf([top[i]!, top[j]!]));
      if (h > 0) outline.push(pathOf([bot[i]!, bot[j]!]));
    } else {
      outline.push(pathOf([top[i]!, top[j]!]));
    }
    if (h > 0 && facing[(i + n - 1) % n] !== facing[i]) outline.push(pathOf([top[i]!, bot[i]!]));
  }
  return {
    fill: pathOf(hull([...top, ...bot]), true),
    top: pathOf(top, true),
    left: faces.left.join(''),
    right: faces.right.join(''),
    shadow: faces.shadow.join(''),
    outline: outline.join(''),
    crease: crease.join(''),
  };
}

/** A box or plate with rounded corners in plan. */
export const box = (plan: Plan, z: number, h: number, P: Projection) => prism(roundedPlan(plan), z, h, P);

/** An upright cylinder. */
export const cylinder = (cx: number, cy: number, r: number, z: number, h: number, P: Projection, steps = 24) =>
  prism(circleRing(cx, cy, r, steps), z, h, P);

/**
 * A horizontal pipe along x or y, from `from` to `to` (same y/x and z). Drawn as a round body with
 * a highlight band and an end cap on the end nearer the viewer.
 */
export function pipe(from: Point3, to: Point3, r: number, P: Projection) {
  const alongX = Math.abs(to[0] - from[0]) > Math.abs(to[1] - from[1]);
  const section = (c: Point3, steps = 24) =>
    Array.from({ length: steps }, (_, i) => {
      const a = (i / steps) * 2 * Math.PI, u = r * Math.cos(a), v = r * Math.sin(a);
      return iso(alongX ? [c[0], c[1] + u, c[2] + v] : [c[0] + u, c[1], c[2] + v], P);
    });
  const a = section(from), b = section(to);
  const near = depthOf(to) > depthOf(from) ? b : a;
  const shine = (c: Point3, s: number): Point3 => (alongX ? [c[0], c[1] - r * 0.35, c[2] + r * s] : [c[0] - r * 0.35, c[1], c[2] + r * s]);
  const band = [iso(shine(from, 0.95), P), iso(shine(to, 0.95), P), iso(shine(to, 0.55), P), iso(shine(from, 0.55), P)];
  return { fill: pathOf(hull([...a, ...b]), true), shine: pathOf(band, true), cap: pathOf(near, true) };
}

/**
 * A glass vessel: an open box you can see into. `back` is the floor and the far walls seen from
 * inside, `clip` is the inside silhouette (clip the contents to it), `front` the near glass faces,
 * `edges` every visible edge. To show a level, draw the contents as a full-height box and translate
 * it down by `shift([0, 0, -drop])`: the clip trims it, so the motion stays transform-only.
 */
export function glass(plan: Plan, z: number, h: number, P: Projection) {
  const ring = roundedPlan(plan, 3);
  const s = prism(ring, z, h, P);
  const n = ring.length;
  const ccw = area(ring) > 0;
  const back: string[] = [pathOf(ring.map(([x, y]) => iso([x, y, z], P)), true)];
  const front: string[] = [];
  for (let i = 0; i < n; i++) {
    const [ax, ay] = ring[i]!, [bx, by] = ring[(i + 1) % n]!;
    const nx = ccw ? by - ay : ay - by, ny = ccw ? ax - bx : bx - ax;
    const quad = pathOf([iso([ax, ay, z], P), iso([bx, by, z], P), iso([bx, by, z + h], P), iso([ax, ay, z + h], P)], true);
    (nx * COS_A + ny * SIN_A > 1e-9 ? front : back).push(quad);
  }
  return { back: back.join(''), clip: s.fill, front: front.join(''), edges: s.outline + s.crease + s.top };
}

// ---------- flat marks on a horizontal plane ----------

/** A path on the plane z through world points (x, y). */
export const onPlane = (pts: Plane[], z: number, P: Projection, closed = false) => pathOf(pts.map(([x, y]) => iso([x, y, z], P)), closed);

/** The outline of a plan drawn on the plane z, for grooves and inlays. */
export const planLine = (plan: Plan, z: number, P: Projection) => onPlane(roundedPlan(plan), z, P, true);

/** A ring drawn on the plane z. */
export const ringLine = (cx: number, cy: number, r: number, z: number, P: Projection, steps = 48) => onPlane(circleRing(cx, cy, r, steps), z, P, true);

/** A flat annulus (ring band) on the plane z, filled with the even-odd rule. */
export const annulus = (cx: number, cy: number, r0: number, r1: number, z: number, P: Projection) =>
  ringLine(cx, cy, r1, z, P, 56) + ringLine(cx, cy, r0, z, P, 56);

/** A flat chevron arrow on the plane z, pointing from `at` along angle `a` (radians, world). */
export function arrow(at: Plane, a: number, size: number, z: number, P: Projection) {
  const [ux, uy] = [Math.cos(a), Math.sin(a)], [vx, vy] = [-uy, ux];
  const p = (s: number, t: number): Plane => [at[0] + ux * s * size + vx * t * size, at[1] + uy * s * size + vy * t * size];
  return onPlane([p(-0.5, -0.6), p(0.4, 0), p(-0.5, 0.6), p(-0.2, 0)], z, P, true);
}

/**
 * An SVG transform that maps local (u, v) on the plane z, centred on `at`, onto the drawing.
 * Draw a dial or needle around (0, 0) inside it, then rotate an inner group with CSS.
 */
export function planeMatrix(at: Plane, z: number, P: Projection) {
  const o = iso([at[0], at[1], z], P), u = iso([at[0] + 1, at[1], z], P), v = iso([at[0], at[1] + 1, z], P);
  const f = (x: number) => Math.round(x * 1000) / 1000;
  return `matrix(${f(u[0] - o[0])} ${f(u[1] - o[1])} ${f(v[0] - o[0])} ${f(v[1] - o[1])} ${f(o[0])} ${f(o[1])})`;
}

// ---------- SVG strings ----------

const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/"/g, '&quot;');
type Attrs = Record<string, string | number | undefined | false>;
const attrs = (a: Attrs = {}) =>
  Object.entries(a).filter(([, v]) => v !== undefined && v !== false).map(([k, v]) => ` ${k}="${esc(String(v))}"`).join('');

/**
 * Paint a solid. `tone`: `part` (default), `base` (darker, for plates and plinths) or `lit` (the
 * one accent the reader should watch). Extra attributes go on the group.
 */
export function solid(s: Solid, { tone = 'part', crease = true, ...extra }: { tone?: 'part' | 'base' | 'lit'; crease?: boolean } & Attrs = {}) {
  return `<g class="k-solid" data-tone="${tone}"${attrs(extra)}>` +
    `<path class="k-fill" d="${s.fill}"/>` +
    (s.left ? `<path class="k-left" d="${s.left}"/>` : '') +
    (s.right ? `<path class="k-right" d="${s.right}"/>` : '') +
    (s.shadow ? `<path class="k-shadow" d="${s.shadow}"/>` : '') +
    `<path class="k-top" d="${s.top}"/>` +
    (crease && s.crease ? `<path class="k-crease" d="${s.crease}"/>` : '') +
    `<path class="k-edge" d="${s.outline}"/></g>`;
}

/** Paint a pipe from `pipe()`. */
export const pipeSvg = (p: ReturnType<typeof pipe>, extra: Attrs = {}) =>
  `<g class="k-pipe"${attrs(extra)}><path class="k-fill k-right" d="${p.fill}"/><path class="k-top" d="${p.shine}"/><path class="k-left" d="${p.cap}"/><path class="k-edge" d="${p.fill}"/><path class="k-crease" d="${p.cap}"/></g>`;

/** A line. `tone`: `edge`, `line` (default), `faint`, `lit` or `green`. */
export const line = (d: string, tone: 'edge' | 'line' | 'faint' | 'lit' | 'green' = 'line', extra: Attrs = {}) =>
  d ? `<path class="k-line" data-tone="${tone}" d="${d}"${attrs(extra)}/>` : '';

/** A flat filled shape (inlay, groove, arrow) on a plane. `tone`: `inlay` or `lit`. */
export const flat = (d: string, tone: 'inlay' | 'lit' | 'faint' = 'inlay', extra: Attrs = {}) =>
  `<path class="k-flat" data-tone="${tone}" d="${d}" fill-rule="evenodd"${attrs(extra)}/>`;

/** Small screw heads or terminal dots. */
export const dots = (pts: Flat[], r = 1.4) => `<g class="k-dots">${pts.map(([x, y]) => `<circle cx="${n1(x)}" cy="${n1(y)}" r="${r}"/>`).join('')}</g>`;

/** The soft shadow under a plan resting on z. */
export const halo = (plan: Plan, z: number, P: Projection) => `<path class="k-halo" d="${box(plan, z, 0.01, P).fill}"/>`;

export const group = (children: string | string[], extra: Attrs = {}) => `<g${attrs(extra)}>${Array.isArray(children) ? children.join('') : children}</g>`;

/** The outer SVG. It is decorative to assistive tech: the frame carries the text alternative. */
export const svg = (width: number, height: number, body: string | string[]) =>
  `<svg class="k-svg" viewBox="0 0 ${width} ${height}" width="${width}" height="${height}" aria-hidden="true" focusable="false">${Array.isArray(body) ? body.join('') : body}</svg>`;
