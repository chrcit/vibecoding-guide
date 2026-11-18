// Fig. 16 geometry, built once at build time. 17 parts: the plate, the rack, four skill cards and the
// lit copy of the matching one, the context glass, the instruction file, the skill list, the request
// stand, the request sheet, the opened skill, and the empty slot's groove.
import * as k from '../kit/iso';
import { CARDS, MATCH } from './model';

export const W = 640;
export const H = 400;

const PLATE: k.Plan = { x: -104, y: -74, w: 214, d: 132, r: 14 };
const RACK: k.Plan = { x: -92, y: -64, w: 184, d: 18, r: 3 };
const RACK_H = 8;
const CARD = { w: 34, d: 4, h: 48 };
const CARD_Y = -55;
const cardX = (i: number) => -66 + i * 44;
const GLASS: k.Plan = { x: -64, y: 8, w: 104, d: 42, r: 0 };
const GLASS_H = 28;
const FILE: k.Plan = { x: -32, y: 14, w: 24, d: 30, r: 2 };
const FILE_H = 12;
const LIST: k.Plan = { x: -4, y: 14, w: 24, d: 30, r: 2 };
const LIST_H = 6;
const SHEET = { w: 16, d: 24, h: 1.6 };
const SHEET_IN: k.Plane = [30, 29]; // centre of the request once it is in the glass
// The opened skill lands at the back of the glass, the tallest thing in it, so it hides nothing.
const OPEN: k.Plan = { x: -59, y: 13, w: 22, d: 32, r: 2 };
const OPEN_H = 22;
const STAND: k.Plan = { x: 64, y: 14, w: 32, d: 32, r: 3 };
const STAND_H = 12;
const SHEET_ON: k.Plane = [STAND.x + STAND.w / 2, STAND.y + STAND.d / 2];

const P = k.fit(
  [
    [PLATE.x, PLATE.y, -10], [PLATE.x + PLATE.w, PLATE.y + PLATE.d, -10], [PLATE.x, PLATE.y + PLATE.d, -10],
    [PLATE.x + PLATE.w, PLATE.y, -10], [cardX(0) - CARD.w / 2, CARD_Y, RACK_H + CARD.h + 14], [cardX(3) + CARD.w / 2, CARD_Y, RACK_H + CARD.h + 14],
  ],
  W, H, 22,
);

const seg = (a: k.Point3, b: k.Point3) => k.pathOf([k.iso(a, P), k.iso(b, P)]);

/** A closed skill card standing in the rack: its face shows a name line and a short description. */
function card(i: number, tone: 'part' | 'lit') {
  const cx = cardX(i), z = RACK_H, face = CARD_Y + CARD.d / 2;
  const top = z + CARD.h;
  const lines = [
    k.line(seg([cx - 11, face, top - 8], [cx + 4, face, top - 8]), 'edge'),
    k.line(seg([cx - 11, face, top - 15], [cx + 10, face, top - 15]), 'line'),
    k.line(seg([cx - 11, face, top - 20], [cx + 6, face, top - 20]), 'line'),
  ];
  return [k.solid(k.box({ x: cx - CARD.w / 2, y: CARD_Y - CARD.d / 2, w: CARD.w, d: CARD.d, r: 1 }, z, CARD.h, P), { tone }), ...lines];
}

function plate() {
  return [
    k.halo(PLATE, -10, P),
    k.solid(k.box(PLATE, -10, 10, P), { tone: 'base' }),
    k.line(k.planLine(k.inset(PLATE, 6), 0, P), 'faint'),
  ];
}

function rack() {
  // A groove along the rack top: the slot the cards stand in.
  return [
    k.solid(k.box(RACK, 0, RACK_H, P)),
    k.flat(k.planLine({ x: RACK.x + 6, y: CARD_Y - 3, w: RACK.w - 12, d: 6, r: 2 }, RACK_H, P)),
  ];
}

/** The always-loaded contents of the glass: the instruction file and the skill list. */
function standing() {
  const textOn = (p: k.Plan, z: number, rows: number, step: number) =>
    Array.from({ length: rows }, (_, r) => {
      const y = p.y + 6 + r * step;
      return k.line(k.onPlane([[p.x + 4, y], [p.x + p.w - (r % 2 ? 9 : 5), y]], z, P));
    });
  return [
    k.solid(k.box(FILE, 0, FILE_H, P)),
    ...textOn(FILE, FILE_H, 4, 5),
    k.solid(k.box(LIST, 0, LIST_H, P)),
    // one line per installed skill: its name and description, nothing else
    ...CARDS.map((_, r) => k.line(k.onPlane([[LIST.x + 4, LIST.y + 6 + r * 5.5], [LIST.x + LIST.w - 4, LIST.y + 6 + r * 5.5]], LIST_H, P), r === MATCH ? 'edge' : 'line')),
  ];
}

/** The request: a sheet with three lines of text, centred on (0, 0) at z 0; moved with a translate. */
function sheet(at: k.Plane, z: number) {
  const [x, y] = at;
  const plan: k.Plan = { x: x - SHEET.w / 2, y: y - SHEET.d / 2, w: SHEET.w, d: SHEET.d, r: 1 };
  return [
    k.solid(k.box(plan, z, SHEET.h, P), { crease: false }),
    ...[0, 1, 2].map((r) => k.line(k.onPlane([[plan.x + 3, plan.y + 6 + r * 6], [plan.x + plan.w - (r === 2 ? 8 : 3), plan.y + 6 + r * 6]], z + SHEET.h, P))),
  ];
}

/** The opened skill: the whole file, a thick stack of pages, lit. */
function opened() {
  const face = OPEN.y + OPEN.d;
  const pages = [6, 12, 18].map((z) => k.line(seg([OPEN.x + 2, face, z], [OPEN.x + OPEN.w - 2, face, z]), 'lit'));
  const text = [0, 1, 2, 3].map((r) => k.line(k.onPlane([[OPEN.x + 4, OPEN.y + 6 + r * 6], [OPEN.x + OPEN.w - (r % 2 ? 9 : 4), OPEN.y + 6 + r * 6]], OPEN_H, P)));
  return [k.solid(k.box(OPEN, 0, OPEN_H, P), { tone: 'lit' }), ...pages, ...text];
}

const px = ([x, y]: k.Flat) => `translate(${x.toFixed(1)}px,${y.toFixed(1)}px)`;

export function drawSkillLoads(uid: string) {
  const g = k.glass(GLASS, 0, GLASS_H, P);
  const m = cardX(MATCH);
  // Card motion: pulled forward out of the rack when it matches; then towards the glass as it opens.
  const pull = k.shift([0, 12, 3], P);
  const into = k.shift([OPEN.x + OPEN.w / 2 - m, OPEN.y + OPEN.d / 2 - CARD_Y, 4], P);
  const drop = k.shift([0, 0, 22], P);
  const send = k.shift([SHEET_IN[0] - SHEET_ON[0], SHEET_IN[1] - SHEET_ON[1], -STAND_H], P);

  const body = [
    ...plate(),
    ...rack(),
    ...CARDS.flatMap((_, i) => (i === MATCH ? [k.group(card(i, 'part'), { class: 'k-move', 'data-card': 'rest' })] : card(i, 'part'))),
    k.group(card(MATCH, 'lit'), { class: 'k-move', 'data-card': 'lit', style: 'opacity:0;transform:translate(0px,0px)' }),
    // The stand is painted before the glass so the request can be painted once, between the glass
    // contents behind it and the opened skill in front of it, wherever it is.
    k.solid(k.box(STAND, 0, STAND_H, P)),
    `<clipPath id="${uid}-glass"><path d="${g.clip}"/></clipPath>`,
    `<path class="k-glass-back" d="${g.back}"/>`,
    k.group(k.group(opened(), { class: 'k-move', 'data-open': '', style: `opacity:0;transform:${px(drop)}` }), { 'clip-path': `url(#${uid}-glass)` }),
    ...standing(),
    k.group(sheet(SHEET_ON, STAND_H), { class: 'k-move', 'data-sheet': '', style: 'transform:translate(0px,0px)' }),
    `<path class="k-glass-front" d="${g.front}"/>`,
    `<path class="k-glass-edges" d="${g.edges}"/>`,
  ];
  const at = (p: k.Point3) => k.anchor(p, P, W, H);
  return {
    svg: k.svg(W, H, body),
    labels: [
      // Anchored at each card's top left corner. SkillLoads.astro sets the names above and to the
      // right of it on wide frames and centres the numbered keys on the card on narrow ones, so the
      // staggered names never cover a neighbouring card.
      ...CARDS.map((c, i) => ({ name: c.name, id: c.id, at: at([cardX(i) - CARD.w / 2, CARD_Y + CARD.d / 2, RACK_H + CARD.h]) })),
      { name: 'Context', id: 'context', at: at([GLASS.x + 22, GLASS.y + GLASS.d + 12, 0]) },
      { name: 'Your request', id: 'request', at: at([STAND.x + STAND.w + 6, STAND.y + STAND.d + 6, 0]) },
    ],
    motion: { pull, into, drop, send },
  };
}
