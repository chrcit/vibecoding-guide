// Fig. 5 geometry, built once at build time. 17 parts: the plate; two belts (a frame and an end
// roller each), one per turn of the agent; six step boxes on the first belt and four on the second;
// your message (the one lit part); a glass bin for thrown-away work. Slats on the belts are marks.
import * as k from '../kit/iso';
import { STEPS, SENT_AFTER } from './model';

export const W = 640;
export const H = 360;

const PLATE: k.Plan = { x: -122, y: -62, w: 272, d: 120, r: 12 };
const BELT_X0 = -106, BELT_X1 = 94;
const Y1 = -26, Y2 = 28;
const BELT_D = 24, BELT_H = 7;
const BOX = 16, BOX_H = 12;
const BIN: k.Plan = { x: 104, y: Y1 - 19, w: 38, d: 38, r: 0 };
const BIN_H = 20;

const slotX = (i: number) => -90 + i * 28;
/** Belt slot of each step on the first belt: the slot after the last step done is kept for a steer. */
const slotOf = (j: number) => (j < SENT_AFTER ? j : j + 1);
const REDO = STEPS.length - SENT_AFTER;

const P = k.fit([
  [PLATE.x, PLATE.y, -8], [PLATE.x + PLATE.w, PLATE.y + PLATE.d, -8], [PLATE.x, PLATE.y + PLATE.d, -8], [PLATE.x + PLATE.w, PLATE.y, -8],
  [BELT_X0, Y1, 30],
], W, H, 22);

const sq = (x: number, y: number, s: number, r = 2): k.Plan => ({ x: x - s / 2, y: y - s / 2, w: s, d: s, r });

function belt(y: number) {
  const plan: k.Plan = { x: BELT_X0, y: y - BELT_D / 2, w: BELT_X1 - BELT_X0, d: BELT_D, r: 3 };
  const slats = [];
  for (let x = BELT_X0 + 10; x < BELT_X1 - 4; x += 14) slats.push(k.line(k.onPlane([[x, y - BELT_D / 2 + 3], [x, y + BELT_D / 2 - 3]], BELT_H, P), 'faint'));
  return [
    k.halo(plan, 0, P),
    k.solid(k.box(plan, 0, BELT_H, P)),
    k.flat(k.planLine(k.inset(plan, 2.5), BELT_H, P)),
    ...slats,
    k.pipeSvg(k.pipe([BELT_X1 + 1, y - BELT_D / 2 + 1, BELT_H / 2 + 0.5], [BELT_X1 + 1, y + BELT_D / 2 - 1, BELT_H / 2 + 0.5], 4.2, P)),
  ];
}

function stepBox(x: number, y: number, attrs: Record<string, string | number>) {
  return k.group([k.solid(k.box(sq(x, y, BOX), BELT_H, BOX_H, P))], { class: 'k-move', ...attrs });
}

/** Where each thrown-away box lands in the bin, two by two. */
const binSpot = (i: number): k.Plane => [BIN.x + 10 + (i % 2) * 18, BIN.y + 10 + Math.floor(i / 2) * 18];

export function drawSteerOrQueue() {
  const g = k.glass(BIN, 0, BIN_H, P);
  const toBin = Array.from({ length: REDO }, (_, i) => {
    const [bx, by] = binSpot(i);
    return k.shift([bx - slotX(slotOf(SENT_AFTER + i)), by - Y1, 1 - BELT_H], P);
  });
  const card: k.Plan = { x: -9, y: -6.5, w: 18, d: 13, r: 1.5 };
  const cardAt = { queue: k.shift([slotX(0), Y2, 0], P), steer: k.shift([slotX(SENT_AFTER), Y1, 0], P) };
  const tr = ([x, y]: k.Flat) => `transform:translate(${x.toFixed(1)}px,${y.toFixed(1)}px)`;

  const body = [
    k.halo(PLATE, -8, P),
    k.solid(k.box(PLATE, -8, 8, P), { tone: 'base' }),
    ...belt(Y1),
    `<path class="k-glass-back" d="${g.back}"/>`,
    // Turn 1. Steps after the message start on the belt; in the queued state they sit in the bin.
    ...STEPS.map((_, j) => stepBox(slotX(slotOf(j)), Y1, j >= SENT_AFTER
      ? { 'data-step': j, style: tr(toBin[j - SENT_AFTER]!) }
      : { 'data-step': j })),
    `<path class="k-glass-front" d="${g.front}"/>`,
    `<path class="k-glass-edges" d="${g.edges}"/>`,
    ...belt(Y2),
    // Turn 2: the same steps done again, visible only when the message was queued.
    ...Array.from({ length: REDO }, (_, i) => stepBox(slotX(i + 1), Y2, { 'data-redo': i })),
    k.group([k.halo(card, BELT_H, P), k.solid(k.box(card, BELT_H, 4, P), { tone: 'lit' })], {
      class: 'k-move', 'data-card': '', style: `transform:translate(${(cardAt.queue[0]).toFixed(1)}px,${(cardAt.queue[1]).toFixed(1)}px)`,
    }),
  ];
  const label = (p: k.Point3) => k.anchor(p, P, W, H);
  return {
    svg: k.svg(W, H, body),
    labels: [
      { name: 'Turn 1', id: 'turn-1', at: label([BELT_X0 + 6, Y1 - 20, BELT_H + 26]) },
      { name: 'Turn 2', id: 'turn-2', at: label([BELT_X0 + 4, Y2 + 30, 0]) },
      { name: 'Your message', id: 'message', at: label([slotX(0) - 6, Y2 + 30, 26]) },
      { name: 'Thrown away', id: 'bin', at: label([BIN.x + BIN.w / 2, BIN.y + BIN.d / 2, BIN_H + 22]) },
    ],
    motion: {
      toBin,
      cardAt,
      messageLabel: { queue: label([slotX(0) - 6, Y2 + 30, 26]), steer: label([slotX(SENT_AFTER), Y1 - 4, BELT_H + 34]) },
    },
  };
}
