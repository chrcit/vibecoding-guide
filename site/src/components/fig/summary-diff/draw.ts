// Fig. 15 geometry, built once at build time. A note card on a stand beside a box of changed lines;
// the lid comes off to show what the box holds. 15 parts: plate, stand, card, the card's writing,
// box floor, four walls, three strips (one lit: the change the card left out), lid.
import * as k from '../kit/iso';

export const W = 640;
export const H = 300;

const GAP = 52;
const CARD_AT: k.Plane = [-GAP, GAP];
const BOX_AT: k.Plane = [GAP, -GAP];
const BOX = 70, WALL = 3, WALL_H = 16, FLOOR_H = 3;
const STAND = 44, STAND_H = 12;

function rowRing(halfU: number, halfV: number, r: number): k.Plane[] {
  const local = k.roundedPlan({ x: -halfU, y: -halfV, w: 2 * halfU, d: 2 * halfV, r }, 6);
  const s = Math.SQRT1_2;
  return local.map(([u, v]) => [s * (u + v), s * (v - u)] as k.Plane);
}
const HALF_U = GAP * Math.SQRT2 + 66, HALF_V = 62;

const boxPlan: k.Plan = { x: BOX_AT[0] - BOX / 2, y: BOX_AT[1] - BOX / 2, w: BOX, d: BOX, r: 3 };
const LIFT: k.Point3 = [-58, -4, 26];

const P = k.fit(
  [
    ...rowRing(HALF_U, HALF_V, 0).map(([x, y]) => [x, y, -10] as k.Point3),
    [boxPlan.x + LIFT[0], boxPlan.y + LIFT[1], WALL_H + 4 + LIFT[2]],
    [CARD_AT[0] - 20, CARD_AT[1] - 20, STAND_H + 30],
  ],
  W, H, 20,
);

function plate() {
  const ring = rowRing(HALF_U, HALF_V, 14);
  return [`<path class="k-halo" d="${k.prism(ring, -10, 0.01, P).fill}"/>`, k.solid(k.prism(ring, -10, 10, P), { tone: 'base' })];
}

/** The summary: a card on a stand, two lines of writing for its two claims. */
function card() {
  const [x, y] = CARD_AT;
  const stand: k.Plan = { x: x - STAND / 2, y: y - STAND / 2, w: STAND, d: STAND, r: 3 };
  const sheet: k.Plan = { x: x - 15, y: y - 18, w: 30, d: 36, r: 1.5 };
  const z = STAND_H + 1.6;
  return [
    k.solid(k.box(stand, 0, STAND_H, P)),
    k.solid(k.box(sheet, STAND_H, 1.6, P), { crease: false }),
    ...[0, 1].map((i) => k.line(k.onPlane([[x - 8 + i * 9, y - 12], [x - 8 + i * 9, y + (i ? 6 : 12)]], z, P), 'edge')),
  ];
}

/** An open box: floor, walls, three strips inside. Back walls before the strips, front walls after. */
function box() {
  const { x, y } = boxPlan;
  const wall = (p: k.Plan) => k.solid(k.box(p, FLOOR_H, WALL_H - FLOOR_H, P));
  const back = [wall({ x, y, w: BOX, d: WALL, r: 1 }), wall({ x, y, w: WALL, d: BOX, r: 1 })];
  const front = [wall({ x: x + BOX - WALL, y, w: WALL, d: BOX, r: 1 }), wall({ x, y: y + BOX - WALL, w: BOX, d: WALL, r: 1 })];
  const strips = [0, 1, 2].map((i) => {
    const plan: k.Plan = { x: x + 12 + i * 17, y: y + 11, w: 10, d: BOX - 22, r: 1 };
    return k.solid(k.box(plan, FLOOR_H, 3, P), i === 2 ? { tone: 'lit', 'data-extra': '' } : {});
  });
  return [k.solid(k.box(boxPlan, 0, FLOOR_H, P)), ...back, ...strips, ...front];
}

function lid() {
  return k.solid(k.box(k.inset(boxPlan, -1.5), WALL_H, 4, P));
}

export function drawSummaryDiff() {
  const at = (p: k.Point3) => k.anchor(p, P, W, H);
  return {
    svg: k.svg(W, H, [...plate(), ...card(), ...box(), k.group(lid(), { class: 'k-move', 'data-lid': '', style: 'transform:translate(0px,0px)' })]),
    labels: [
      { name: 'Summary', id: 'summary', at: at([CARD_AT[0] - 10, CARD_AT[1] - 10, STAND_H + 26]) },
      { name: 'Diff', id: 'diff', at: at([BOX_AT[0] + BOX / 2 + 14, BOX_AT[1] + BOX / 2 + 14, 0]) },
      { name: 'Not in the summary', id: 'extra', at: at([boxPlan.x + BOX - 14, boxPlan.y + 8, WALL_H + 20]) },
    ],
    motion: { lift: k.shift(LIFT, P) },
  };
}
