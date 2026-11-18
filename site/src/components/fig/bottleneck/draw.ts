// Fig. 6 geometry, built once at build time. 19 parts: the plate; eight belts, one per agent; a box
// for each agent (mid-belt while it works, on the counter in front of you when it is finished and
// waiting); the counter; your desk, the one lit part.
import * as k from '../kit/iso';
import { MAX_AGENTS, queueSlots } from './model';

export const W = 640;
export const H = 400;

const PLATE: k.Plan = { x: -126, y: -96, w: 232, d: 192, r: 14 };
const BELT_X0 = -116, BELT_X1 = 14, BELT_D = 13, BELT_H = 6;
const BOX = 11, BOX_H = 10;
const MID_X = -62;
const COUNTER: k.Plan = { x: 20, y: -88, w: 16, d: 176, r: 3 };
const DESK: k.Plan = { x: 54, y: -24, w: 40, d: 48, r: 3 };
const DESK_H = 20;

export const beltY = (i: number) => -77 + i * 22;

const P = k.fit([
  [PLATE.x, PLATE.y, -8], [PLATE.x + PLATE.w, PLATE.y + PLATE.d, -8], [PLATE.x, PLATE.y + PLATE.d, -8], [PLATE.x + PLATE.w, PLATE.y, -8],
  [DESK.x, DESK.y, DESK_H + 10],
], W, H, 22);

/** Places on the counter in front of the desk, nearest first, alternating either side. */
const slotY = (j: number) => (j % 2 ? 1 : -1) * (7 + Math.floor(j / 2) * 15);

/** `agents` and `waiting` set the first frame, so it is right without JavaScript. */
export function drawBottleneck(agents: number, waiting: number) {
  const counterX = COUNTER.x + COUNTER.w / 2;
  const toSlot = Array.from({ length: MAX_AGENTS }, (_, i) =>
    Array.from({ length: MAX_AGENTS }, (_, j) => k.shift([counterX - MID_X, slotY(j) - beltY(i), 8 - BELT_H], P)));
  const slots = queueSlots(agents, waiting);
  const px = ([x, y]: k.Flat) => `${x.toFixed(1)}px,${y.toFixed(1)}px`;
  const belts = Array.from({ length: MAX_AGENTS }, (_, i) => {
    const y = beltY(i);
    const plan: k.Plan = { x: BELT_X0, y: y - BELT_D / 2, w: BELT_X1 - BELT_X0, d: BELT_D, r: 2.5 };
    return k.group([
      k.solid(k.box(plan, 0, BELT_H, P)),
      k.line(k.onPlane([[BELT_X0 + 4, y], [BELT_X1 - 3, y]], BELT_H, P), 'faint'),
    ], { class: 'k-move', 'data-belt': i, style: `opacity:${i < agents ? 1 : 0.3}` });
  });
  // Boxes are painted after the counter so a waiting box sits on it.
  const boxes = Array.from({ length: MAX_AGENTS }, (_, i) => {
    const box: k.Plan = { x: MID_X - BOX / 2, y: beltY(i) - BOX / 2, w: BOX, d: BOX, r: 1.5 };
    const s = slots[i]!;
    return k.group(k.solid(k.box(box, BELT_H, BOX_H, P)), {
      class: 'k-move', 'data-box': i,
      style: `opacity:${i < agents ? 1 : 0};transform:translate(${s >= 0 ? px(toSlot[i]![s]!) : '0px,0px'})`,
    });
  });
  const body = [
    k.halo(PLATE, -8, P),
    k.solid(k.box(PLATE, -8, 8, P), { tone: 'base' }),
    ...belts,
    k.solid(k.box(COUNTER, 0, 8, P)),
    k.halo(DESK, 0, P),
    k.solid(k.box(DESK, 0, DESK_H, P), { tone: 'lit' }),
    ...boxes,
  ];
  const label = (p: k.Point3) => k.anchor(p, P, W, H);
  return {
    svg: k.svg(W, H, body),
    labels: [
      { name: 'Agents', id: 'agents', at: label([BELT_X0 + 10, beltY(0) - 16, 14]) },
      { name: 'Finished, waiting', id: 'queue', at: label([COUNTER.x + 8, -58, 30]) },
      { name: 'You', id: 'you', at: label([DESK.x + DESK.w / 2, DESK.y + DESK.d / 2, DESK_H + 18]) },
    ],
    motion: { toSlot },
  };
}
