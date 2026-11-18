// Fig. 14 geometry, built once at build time. Two target boards in panes at one shared scale.
// Per pane, 6 parts: plinth, board, rings, the centre (the right answer), the pins (one part, ten
// pins), and the average ring (lit). 12 in all.
import * as k from '../kit/iso';
import { NOISE, BIAS, BIAS_AT, STEPS, averages, type Plane } from './model';

const FIRST = STEPS[0]!;
const FIRST_AVG = averages(FIRST);

export const PANE_W = 340;
export const PANE_H = 270;
const PAD = 14;

const PLINTH: k.Plan = { x: -72, y: -72, w: 144, d: 144, r: 10 };
const BOARD_R = 66, BOARD_H = 8, TOP = BOARD_H;
const PIN_H = 16, PIN_R = 1.6, HEAD_R = 4.2, HEAD_H = 3.5;

const points: k.Point3[] = [
  [PLINTH.x, PLINTH.y, -8], [PLINTH.x + PLINTH.w, PLINTH.y + PLINTH.d, -8],
  [PLINTH.x, PLINTH.y + PLINTH.d, -8], [PLINTH.x + PLINTH.w, PLINTH.y, -8], [PLINTH.x, PLINTH.y, TOP + PIN_H + HEAD_H + 6],
];
const P = k.fit(points, PANE_W, PANE_H, PAD);

function board() {
  return [
    k.halo(PLINTH, -8, P),
    k.solid(k.box(PLINTH, -8, 8, P), { tone: 'base' }),
    k.solid(k.cylinder(0, 0, BOARD_R, 0, BOARD_H, P, 48)),
    ...[18, 36, 54].map((r) => k.line(k.ringLine(0, 0, r, TOP, P), r === 54 ? 'faint' : 'line')),
    `<path class="k-flat nb-bull" d="${k.ringLine(0, 0, 5.5, TOP, P, 24)}"/>`,
  ];
}

function average([x, y]: Plane) {
  const [sx, sy] = k.shift([x, y, 0], P);
  return k.group(k.flat(k.annulus(0, 0, 6.5, 9.5, TOP, P), "lit"), { class: "k-move", "data-average": "", style: `transform:translate(${sx.toFixed(1)}px,${sy.toFixed(1)}px)` });
}

/** Pins, painted back to front. Each starts hidden, lifted above the board. */
function pins(list: Plane[]) {
  const lift = k.shift([0, 0, 16], P);
  const order = k.byDepth(list.map((p, i) => ({ p, i })), ({ p }) => [p[0], p[1], TOP]);
  return order.map(({ p: [x, y], i }) =>
    k.group(
      [
        k.solid(k.cylinder(x, y, PIN_R, TOP, PIN_H, P, 10), { crease: false }),
        k.solid(k.cylinder(x, y, HEAD_R, TOP + PIN_H, HEAD_H, P, 16)),
      ],
      { class: 'k-move', 'data-pin': i, style: i < FIRST.runs ? "opacity:1;transform:translate(0px,0px)" : `opacity:0;transform:translate(${lift[0].toFixed(1)}px,${lift[1].toFixed(1)}px)` },
    ),
  );
}

export function drawNoiseBias() {
  const at = (p: k.Point3) => k.anchor(p, P, PANE_W, PANE_H);
  return {
    panes: [
      {
        svg: k.svg(PANE_W, PANE_H, [...board(), average(FIRST_AVG.noise), ...pins(NOISE)]),
        labels: [
          { name: 'Noise', id: 'noise', at: at([-BOARD_R, -BOARD_R, TOP + 18]) },
          { name: 'Right answer', id: 'centre', at: at([30, 30, TOP + 4]) },
        ],
      },
      {
        svg: k.svg(PANE_W, PANE_H, [...board(), average(FIRST_AVG.bias), k.group(pins(BIAS), { class: 'k-move', 'data-cluster': '' })]),
        labels: [
          { name: 'Bias', id: 'bias', at: at([-BOARD_R, -BOARD_R, TOP + 18]) },
        ],
      },
    ],
    /** Screen offset of one world unit along x and y on the board, and the shift that fixes the bias. */
    motion: { ux: k.shift([1, 0, 0], P), uy: k.shift([0, 1, 0], P), fix: k.shift([-BIAS_AT[0], -BIAS_AT[1], 0], P) },
  };
}
