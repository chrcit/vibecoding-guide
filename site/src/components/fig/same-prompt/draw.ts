// Fig. 4 geometry, built once at build time. One workbench. Always on it: the code (a box of
// folders), the prompt card and the output tray with a check lamp. The orange tray is what the
// agent was told; with context it fills with four objects and the output grows.
// 15 parts: bench, code box, prompt card, context tray, holiday list, screenshot, AGENTS.md book,
// done note, output tray, three output sheets, lamp base, lamp.
import * as k from '../kit/iso';

export const W = 640;
export const H = 360;

const BENCH: k.Plan = { x: -92, y: -60, w: 184, d: 120, r: 10 };
const CODE: k.Plan = { x: -80, y: 10, w: 36, d: 36, r: 2.5 };
const CODE_H = 24;
const CARD: k.Plan = { x: -24, y: 30, w: 34, d: 22, r: 1 };
const TRAY: k.Plan = { x: -34, y: -54, w: 66, d: 54, r: 3 };
const TRAY_H = 3;
const OUT: k.Plan = { x: 40, y: -18, w: 40, d: 40, r: 3 };
const OUT_H = 3;
const LAMP: k.Plane = [64, 40];
const RISE = 16;

const P = k.fit(
  [
    [BENCH.x, BENCH.y, -12], [BENCH.x + BENCH.w, BENCH.y + BENCH.d, -12],
    [BENCH.x, BENCH.y + BENCH.d, -12], [BENCH.x + BENCH.w, BENCH.y, -12],
    [CODE.x, CODE.y + CODE.d, CODE_H + 8], [TRAY.x + TRAY.w, TRAY.y, 30],
  ],
  W, H, 20,
);

/** Ruled lines across a sheet lying at z, as on a page of text. */
function ruled(plan: k.Plan, z: number, rows: number, inset = 4) {
  const out: string[] = [];
  const gap = (plan.d - inset * 2) / Math.max(1, rows - 1);
  for (let i = 0; i < rows; i++) {
    const y = plan.y + inset + i * gap;
    const end = plan.x + plan.w - inset - (i === rows - 1 ? plan.w * 0.3 : 0);
    out.push(k.line(k.onPlane([[plan.x + inset, y], [end, y]], z, P)));
  }
  return out;
}

const hidden = () => {
  const up = k.shift([0, 0, RISE], P);
  return `opacity:0;transform:translate(${up[0].toFixed(1)}px,${up[1].toFixed(1)}px)`;
};

/** A thing that appears with context: drawn at rest, hidden and raised until shown. */
const arrives = (children: string[], hook: Record<string, string | number>) =>
  k.group(children, { class: 'k-move', style: hidden(), ...hook });

function context() {
  const z = TRAY_H;
  const list: k.Plan = { x: TRAY.x + 5, y: TRAY.y + 5, w: 24, d: 30, r: 1 };
  const shot: k.Plan = { x: TRAY.x + 35, y: TRAY.y + 5, w: 26, d: 20, r: 1.5 };
  const book: k.Plan = { x: TRAY.x + 36, y: TRAY.y + 30, w: 24, d: 18, r: 1.5 };
  const note: k.Plan = { x: TRAY.x + 6, y: TRAY.y + 39, w: 22, d: 11, r: 1 };
  return [
    arrives([k.solid(k.box(list, z, 1.2, P), { crease: false }), ...ruled(list, z + 1.2, 5)], { 'data-ctx': 'list' }),
    arrives([k.solid(k.box(shot, z, 2.4, P)), k.flat(k.planLine(k.inset(shot, 3), z + 2.4, P)), k.line(k.onPlane([[shot.x + 7, shot.y + 6], [shot.x + 19, shot.y + 6]], z + 2.4, P), 'edge')], { 'data-ctx': 'shot' }),
    arrives([k.solid(k.box(book, z, 7, P)), k.line(k.planLine(k.inset(book, 4), z + 7, P), 'faint')], { 'data-ctx': 'agents' }),
    arrives([k.solid(k.box(note, z, 1.2, P), { crease: false }), ...ruled(note, z + 1.2, 2, 3)], { 'data-ctx': 'done' }),
  ];
}

function output() {
  const sheet = (i: number): k.Plan => ({ x: OUT.x + 6 + i * 2, y: OUT.y + 6 - i * 2, w: 26, d: 28, r: 1 });
  return [0, 1, 2].map((i) => {
    const z = OUT_H + i * 2;
    const parts = [k.solid(k.box(sheet(i), z, 1.4, P), { crease: false }), ...ruled(sheet(i), z + 1.4, 4)];
    return i === 0 ? k.group(parts, { 'data-sheet': i }) : arrives(parts, { 'data-sheet': i });
  });
}

export function drawSamePrompt() {
  const body = [
    k.halo(BENCH, -12, P),
    k.solid(k.box(BENCH, -12, 12, P), { tone: 'base' }),
    k.line(k.planLine(k.inset(BENCH, 6), 0, P), 'faint'),
    // back to front: the tray is furthest back, then the code, the output, the card and the lamp
    k.solid(k.box(TRAY, 0, TRAY_H, P), { tone: 'lit' }),
    ...context(),
    k.solid(k.box(OUT, 0, OUT_H, P)),
    ...output(),
    k.solid(k.box(CODE, 0, CODE_H, P)),
    ...[8, 16].map((dz) => k.line(k.pathOf([[CODE.x + CODE.w, CODE.y, dz], [CODE.x + CODE.w, CODE.y + CODE.d, dz], [CODE.x, CODE.y + CODE.d, dz]].map((p) => k.iso(p as k.Point3, P))))),
    k.solid(k.box(CARD, 0, 1.4, P), { crease: false }),
    ...ruled(CARD, 1.4, 2, 5),
    k.solid(k.cylinder(LAMP[0], LAMP[1], 8, 0, 3, P)),
    k.group(k.solid(k.cylinder(LAMP[0], LAMP[1], 5.5, 3, 8, P)), { 'data-lamp': 'off' }),
  ];
  const at = (p: k.Point3) => k.anchor(p, P, W, H);
  return {
    svg: k.svg(W, H, body),
    labels: [
      { name: 'What it was given', id: 'tray', at: at([TRAY.x + TRAY.w / 2, TRAY.y - 6, 34]) },
      { name: 'The code', id: 'code', at: at([CODE.x + 18, CODE.y + 18, CODE_H + 18]) },
      { name: 'The prompt', id: 'prompt', at: at([CARD.x + CARD.w + 20, CARD.y + CARD.d + 20, 0]) },
      { name: 'What came back', id: 'out', at: at([OUT.x + OUT.w + 24, OUT.y - 4, 18]) },
      { name: 'Check', id: 'lamp', at: at([LAMP[0] + 24, LAMP[1] + 16, 0]) },
    ],
  };
}
