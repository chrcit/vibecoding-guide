// Fig. 8 geometry, built once at build time. Two exhibits, each in its own pane at one shared scale,
// so they sit side by side on wide screens and stack on narrow ones. 18 parts in all.
// Meter: plinth, housing, dial face, needle, coin tray, coin stack.
// Tank: plinth, weekly allowance (a wide glass trough), pipe, stand, the tank, fill marks, refill clock.
import * as k from '../kit/iso';

export const PANE_W = 340;
export const PANE_H = 290;
export const COINS = 12;
const PAD = 16;

const PLINTH: k.Plan = { x: -46, y: -46, w: 92, d: 92, r: 8 };
const HOUSING: k.Plan = { x: -32, y: -32, w: 40, d: 40, r: 3 };
const HOUSING_H = 44;
const DIAL: k.Plane = [HOUSING.x + 20, HOUSING.y + 20];
const COIN: k.Plane = [24, 2];
const COIN_R = 10, COIN_H = 3.2;
const WEEK: k.Plan = { x: -36, y: -40, w: 76, d: 28, r: 0 };
const WEEK_H = 26;
const STAND: k.Plan = { x: -40, y: 2, w: 32, d: 32, r: 3 };
const STAND_H = 6;
const TANK: k.Plan = { x: STAND.x + 2, y: STAND.y + 2, w: 28, d: 28, r: 0 };
const TANK_H = 52;
const CLOCK: k.Plane = [18, 22];

const plinthPoints: k.Point3[] = [
  [PLINTH.x, PLINTH.y, -8], [PLINTH.x + PLINTH.w, PLINTH.y + PLINTH.d, -8],
  [PLINTH.x, PLINTH.y + PLINTH.d, -8], [PLINTH.x + PLINTH.w, PLINTH.y, -8],
];
const meterPoints: k.Point3[] = [...plinthPoints, [HOUSING.x, HOUSING.y, HOUSING_H + 4], [COIN[0], COIN[1], 2 + COINS * COIN_H]];
const tankPoints: k.Point3[] = [...plinthPoints, [TANK.x, TANK.y, STAND_H + TANK_H + 2], [WEEK.x + WEEK.w, WEEK.y, WEEK_H]];
const scale = Math.min(k.fit(meterPoints, PANE_W, PANE_H, PAD).scale, k.fit(tankPoints, PANE_W, PANE_H, PAD).scale);

function base(P: k.Projection) {
  return [k.halo(PLINTH, -8, P), k.solid(k.box(PLINTH, -8, 8, P), { tone: 'base' }), k.line(k.planLine(k.inset(PLINTH, 5), 0, P), 'faint')];
}

function meter(P: k.Projection) {
  const ticks = Array.from({ length: 12 }, (_, i) => {
    const a = (i / 12) * 2 * Math.PI, [c, s] = [Math.cos(a), Math.sin(a)];
    return `M${(c * 10.5).toFixed(2)} ${(s * 10.5).toFixed(2)}L${(c * 13).toFixed(2)} ${(s * 13).toFixed(2)}`;
  }).join('');
  const drop = k.shift([0, 0, 10], P);
  return [
    ...base(P),
    k.solid(k.box(HOUSING, 0, HOUSING_H, P)),
    k.flat(k.ringLine(DIAL[0], DIAL[1], 14, HOUSING_H, P)),
    // the dial: ticks in the top plane, and a needle that turns with CSS inside planeMatrix
    `<g transform="${k.planeMatrix(DIAL, HOUSING_H, P)}"><path class="k-line" d="${ticks}"/>` +
      `<g class="k-move" data-needle style="transform:rotate(-90deg)"><path class="k-line" data-tone="lit" d="M0 0L11 0"/></g>` +
      `<circle class="k-hub" r="1.8"/></g>`,
    k.solid(k.cylinder(COIN[0], COIN[1], COIN_R + 3, 0, 2, P), { crease: false }),
    ...Array.from({ length: COINS }, (_, i) =>
      k.group(k.solid(k.cylinder(COIN[0], COIN[1], COIN_R, 2 + i * COIN_H, COIN_H, P, 32), { tone: 'lit', crease: false }), {
        class: 'k-move', 'data-coin': i, style: `opacity:0;transform:translate(${drop[0].toFixed(1)}px,${drop[1].toFixed(1)}px)`,
      }),
    ),
  ];
}

/** A glass vessel with water in it; the water group moves down as the level falls. */
function vessel(plan: k.Plan, z: number, h: number, name: string, id: string, P: k.Projection) {
  const g = k.glass(plan, z, h, P);
  const water = k.box(k.inset(plan, 1.5), z, h - 3, P);
  return [
    `<clipPath id="${id}"><path d="${g.clip}"/></clipPath>`,
    `<path class="k-glass-back" d="${g.back}"/>`,
    `<g clip-path="url(#${id})"><g class="k-move k-water" data-water="${name}">${k.solid(water, { crease: false })}</g></g>`,
    `<path class="k-glass-front" d="${g.front}"/>`,
    `<path class="k-glass-edges" d="${g.edges}"/>`,
  ];
}

function tank(uid: string, P: k.Projection) {
  const ticks = Array.from({ length: 5 }, (_, i) => {
    const a = (i / 5) * 2 * Math.PI - Math.PI / 2, [c, s] = [Math.cos(a), Math.sin(a)];
    return `M${(c * 6.5).toFixed(2)} ${(s * 6.5).toFixed(2)}L${(c * 8.6).toFixed(2)} ${(s * 8.6).toFixed(2)}`;
  }).join('');
  const mark = (f: number) => k.pathOf([[TANK.x + 20, TANK.y + TANK.d, STAND_H + TANK_H * f], [TANK.x + 26, TANK.y + TANK.d, STAND_H + TANK_H * f]].map((p) => k.iso(p as k.Point3, P)));
  return [
    ...base(P),
    ...vessel(WEEK, 0, WEEK_H, 'week', `${uid}-week`, P),
    k.pipeSvg(k.pipe([STAND.x + 16, WEEK.y + WEEK.d, 3.5], [STAND.x + 16, STAND.y, 3.5], 2.6, P)),
    k.solid(k.box(STAND, 0, STAND_H, P)),
    ...vessel(TANK, STAND_H, TANK_H, 'tank', `${uid}-tank`, P),
    ...[0.25, 0.5, 0.75].map((f) => k.line(mark(f))),
    k.solid(k.cylinder(CLOCK[0], CLOCK[1], 11, 0, 4, P)),
    `<g transform="${k.planeMatrix(CLOCK, 4, P)}"><path class="k-line" d="${ticks}"/>` +
      `<g class="k-move" data-hand style="transform:rotate(-90deg)"><path class="k-line" data-tone="edge" d="M0 0L7.5 0"/></g><circle class="k-hub" r="1.4"/></g>`,
  ];
}

export function drawMeterTank(uid: string) {
  const PM = k.fit(meterPoints, PANE_W, PANE_H, PAD, scale);
  const PT = k.fit(tankPoints, PANE_W, PANE_H, PAD, scale);
  const at = (P: k.Projection) => (p: k.Point3) => k.anchor(p, P, PANE_W, PANE_H);
  const [m, t] = [at(PM), at(PT)];
  return {
    panes: [
      {
        svg: k.svg(PANE_W, PANE_H, meter(PM)),
        labels: [
          { name: 'API meter', id: 'meter', at: m([HOUSING.x + 20, HOUSING.y + 20, HOUSING_H + 22]) },
          { name: 'Bill', id: 'bill', at: m([COIN[0] + 20, COIN[1] + 20, 0]) },
        ],
      },
      {
        svg: k.svg(PANE_W, PANE_H, tank(uid, PT)),
        labels: [
          { name: 'Week', id: 'week', at: t([WEEK.x + WEEK.w - 4, WEEK.y + 6, WEEK_H + 16]) },
          { name: 'Tank', id: 'tank', at: t([TANK.x + 14, TANK.y + 14, STAND_H + TANK_H + 20]) },
          { name: 'Refill clock', id: 'clock', at: t([CLOCK[0] + 18, CLOCK[1] + 18, 0]) },
        ],
      },
    ],
    motion: { unit: k.shift([0, 0, -1], PT), tankH: TANK_H - 3, weekH: WEEK_H - 3, coinDrop: k.shift([0, 0, 10], PM) },
  };
}
