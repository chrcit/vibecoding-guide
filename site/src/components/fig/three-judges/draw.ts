// Fig. 13 geometry, built once at build time. Three benches in a row on one long plate, each with
// its judge and a lamp; the change (the lit block) moves to whichever bench is judging it.
// 18 parts: plate, track, three benches, the note card, the screen and its stand, the test rig's
// two posts, bar and calendar block, three lamps, the change.
import * as k from '../kit/iso';
import { JUDGES, type JudgeId } from './model';

export const W = 640;
export const H = 280;

const GAP = 76; // distance between bench centres along each axis
const BENCH = 52, BENCH_H = 14;
const TOP = BENCH_H;
const STATIONS: Record<JudgeId, k.Plane> = { summary: [-GAP, GAP], review: [0, 0], test: [GAP, -GAP] };

/** A rounded rectangle on the diagonal through the stations: u runs along the row, v across it. */
function rowRing(halfU: number, halfV: number, r: number): k.Plane[] {
  const local = k.roundedPlan({ x: -halfU, y: -halfV, w: 2 * halfU, d: 2 * halfV, r }, 6);
  const s = Math.SQRT1_2;
  return local.map(([u, v]) => [s * (u + v), s * (v - u)] as k.Plane);
}

const HALF_U = GAP * Math.SQRT2 + 52, HALF_V = 50;
const plateCorners: k.Point3[] = rowRing(HALF_U, HALF_V, 0).map(([x, y]) => [x, y, -10] as k.Point3);
const P = k.fit([...plateCorners, [-GAP - 20, GAP - 20, TOP + 46], [GAP - 20, -GAP - 20, TOP + 46]], W, H, 22);

const centre = ([x, y]: k.Plane, s: number): k.Plan => ({ x: x - s / 2, y: y - s / 2, w: s, d: s, r: 3 });

/** Where the change rests on a bench: the front corner, nearest the reader. */
const SPOT = (id: JudgeId): k.Plane => [STATIONS[id][0] + 13, STATIONS[id][1] + 13];
const LAMP = (id: JudgeId): k.Plane => [STATIONS[id][0] + 14, STATIONS[id][1] - 14];

function plate() {
  return [
    `<path class="k-halo" d="${k.prism(rowRing(HALF_U, HALF_V, 14), -10, 0.01, P).fill}"/>`,
    k.solid(k.prism(rowRing(HALF_U, HALF_V, 14), -10, 10, P), { tone: 'base' }),
    k.flat(k.prism(rowRing(HALF_U - 30, 8, 4), 0, 0.01, P).top),
  ];
}

function bench(id: JudgeId) {
  return k.solid(k.box(centre(STATIONS[id], BENCH), 0, BENCH_H, P));
}

/** The agent's own report: a card lying on the bench, two lines of writing. */
function card() {
  const [x, y] = STATIONS.summary;
  const sheet: k.Plan = { x: x - 20, y: y - 18, w: 24, d: 28, r: 1 };
  return [
    k.solid(k.box(sheet, TOP, 1.4, P), { crease: false }),
    ...[0, 1, 2].map((i) => k.line(k.onPlane([[x - 15 + i * 6, y - 13], [x - 15 + i * 6, y + (i === 2 ? -2 : 5)]], TOP + 1.4, P))),
  ];
}

/** A second agent: a screen on a stand, facing the change. */
function screen() {
  const [x, y] = STATIONS.review;
  return [
    k.solid(k.box({ x: x - 16, y: y - 6, w: 8, d: 8, r: 1 }, TOP, 8, P)),
    k.solid(k.box({ x: x - 18, y: y - 20, w: 5, d: 34, r: 1.5 }, TOP + 8, 26, P)),
    // the screen's face: four lines of the diff it is reading
    ...[0, 1, 2, 3].map((i) => {
      const z = TOP + 8 + 20 - i * 5;
      const pts: k.Point3[] = [[x - 13, y - 15, z], [x - 13, y + (i === 3 ? 0 : 9), z]];
      return k.line(k.pathOf(pts.map((p) => k.iso(p, P))));
    }),
  ];
}

/** A test rig: a frame holding the date under test, a calendar block. */
function rig() {
  const [x, y] = STATIONS.test;
  const a: k.Plane = [x - 14, y - 20], b: k.Plane = [x - 14, y + 4];
  const posts = [a, b].map(([px, py]) => k.solid(k.cylinder(px, py, 2.4, TOP, 30, P, 14)));
  const bar = k.solid(k.box({ x: a[0] - 2.5, y: a[1] - 2.5, w: 5, d: b[1] - a[1] + 5, r: 1 }, TOP + 30, 4, P));
  const cal: k.Plan = { x: x - 20, y: y - 14, w: 12, d: 12, r: 1.5 };
  return {
    back: posts[0]!,
    middle: [
      k.solid(k.box(cal, TOP, 14, P)),
      k.line(k.planLine(k.inset(cal, 3), TOP + 14, P)),
    ],
    front: [posts[1]!, bar],
  };
}

function lamp(id: JudgeId) {
  const [x, y] = LAMP(id);
  return k.group([k.solid(k.cylinder(x, y, 8, TOP, 3, P)), k.solid(k.cylinder(x, y, 6, TOP + 3, 10, P))], { 'data-lamp': id === JUDGES[0]!.id ? JUDGES[0]!.verdict : 'off', 'data-lamp-for': id });
}

function change() {
  const plan: k.Plan = { x: -9, y: -7, w: 18, d: 14, r: 1.5 };
  return [k.halo(plan, TOP, P), k.solid(k.box(plan, TOP, 6, P), { tone: 'lit' })];
}

const restOf = (id: JudgeId) => {
  const [x, y] = SPOT(id);
  return k.shift([x, y, 0], P);
};

export function drawThreeJudges() {
  const r = rig();
  const first = JUDGES[0]!.id;
  const [fx, fy] = restOf(first);
  const body = [
    ...plate(),
    bench('summary'),
    ...card(),
    lamp('summary'),
    bench('review'),
    ...screen(),
    lamp('review'),
    bench('test'),
    r.back,
    ...r.middle,
    ...r.front,
    lamp('test'),
    k.group(change(), { class: 'k-move', 'data-change': '', style: `transform:translate(${fx.toFixed(1)}px,${fy.toFixed(1)}px)` }),
  ];
  const at = (p: k.Point3) => k.anchor(p, P, W, H);
  const [sx, sy] = STATIONS.summary, [vx, vy] = STATIONS.review, [tx, ty] = STATIONS.test;
  return {
    svg: k.svg(W, H, body),
    labels: [
      { name: 'Its summary', id: 'summary', at: at([sx - 8, sy - 6, TOP + 40]) },
      { name: 'Second agent', id: 'review', at: at([vx - 16, vy - 4, TOP + 60]) },
      { name: 'Test', id: 'test', at: at([tx - 14, ty - 8, TOP + 56]) },
    ],
    motion: { rest: Object.fromEntries(JUDGES.map((j) => [j.id, restOf(j.id)])) as Record<JudgeId, k.Flat> },
  };
}
