// Fig. 12 geometry, built once at build time. 20 parts: the plate, your desk and you (the one lit
// part), seven agent stations each with the task card it holds, and the burn gauge (body and
// needle). The grooves between them are inlays on the plate, one set per shape.
// Agents are drawn once at the origin and moved with transform; a shape the agent is not in fades
// it out where it waits.
import * as k from '../kit/iso';
import { SHAPES, YOU, PARK, type Spot } from './model';

export const W = 640;
export const H = 340;

const PLATE: k.Plan = { x: -100, y: -86, w: 256, d: 172, r: 14 };
const AGENT = 25, AGENT_H = 15;
const CARD: k.Plan = { x: -7.5, y: -9, w: 15, d: 18, r: 1 };
const DESK: k.Plan = { x: YOU[0] - 17, y: YOU[1] - 17, w: 34, d: 34, r: 3 };
const DESK_H = 8;
const GAUGE: k.Plane = [YOU[0] + 2, -66];
const GAUGE_R = 17, GAUGE_H = 10;
const GROOVE = 3.4;
/** Gauge sweep in plane degrees; angles grow clockwise on screen, 225° points away from you. */
const SWEEP: [number, number] = [105, 345];

function corners({ x, y, w, d }: k.Plan, z0: number, z1: number): k.Point3[] {
  const out: k.Point3[] = [];
  for (const px of [x, x + w]) for (const py of [y, y + d]) for (const z of [z0, z1]) out.push([px, py, z]);
  return out;
}

const P = k.fit([...corners(PLATE, -10, 0), [PLATE.x, PLATE.y, 30]], W, H, 18);

const spotOf = (shape: number, i: number): Spot => SHAPES[shape]!.agents[i] ?? PARK[i]!;
const at = (who: number, shape: number): Spot => (who < 0 ? YOU : spotOf(shape, who));

function plate() {
  return [k.halo(PLATE, -10, P), k.solid(k.box(PLATE, -10, 10, P), { tone: 'base' })];
}

/** An axis-aligned strip of groove between two points that share an x or a y. */
function strip([ax, ay]: Spot, [bx, by]: Spot): k.Plane[] {
  const [x0, x1] = [Math.min(ax, bx) - GROOVE, Math.max(ax, bx) + GROOVE];
  const [y0, y1] = [Math.min(ay, by) - GROOVE, Math.max(ay, by) + GROOVE];
  return [[x0, y0], [x1, y0], [x1, y1], [x0, y1]];
}

/** Grooves for one shape: each hand-over runs back from the giver, across, then back to the taker. */
function links(shape: number) {
  const out: string[] = [];
  for (const [from, to] of SHAPES[shape]!.links) {
    const a = at(from, shape), b = at(to, shape);
    const mid = (a[0] + b[0]) / 2;
    const path: Spot[] = a[1] === b[1] ? [a, b] : [a, [mid, a[1]], [mid, b[1]], b];
    for (let i = 0; i < path.length - 1; i++) out.push(k.flat(k.onPlane(strip(path[i]!, path[i + 1]!), 0, P, true), 'inlay', { 'data-groove': '' }));
    out.push(k.line(k.onPlane(path, 0.05, P), 'edge'));
    // a chevron on the last run, pointing at the agent that takes the work
    const last = path[path.length - 2]!;
    const head: k.Plane = [(last[0] + b[0]) / 2 + 4, b[1]];
    out.push(k.flat(k.arrow(head, Math.PI, 8, 0.1, P), 'faint'));
  }
  return k.group(out, { class: 'k-move', 'data-links': shape, style: shape === 0 ? 'opacity:1' : 'opacity:0' });
}

/** One agent station at the origin: a block and the task card it holds. Drawn once, used seven times. */
function agentBody(id: string) {
  const card = k.prism(k.roundedPlan(CARD, 2), AGENT_H, 1.2, P);
  const rows = [0, 1, 2].map((r) => k.line(k.onPlane([[CARD.x + 3.5, CARD.y + 4.5 + r * 4.5], [CARD.x + (r === 2 ? 8 : 11.5), CARD.y + 4.5 + r * 4.5]], AGENT_H + 1.2, P)));
  const foot: k.Plan = { x: -AGENT / 2, y: -AGENT / 2, w: AGENT, d: AGENT, r: 3 };
  return `<defs>${k.group(
    [
      `<path class="k-halo" d="${k.prism(k.roundedPlan(foot, 2), 0, 0.01, P).fill}"/>`,
      k.solid(k.prism(k.roundedPlan(foot, 3), 0, AGENT_H, P)),
      k.solid(card, { crease: false }),
      ...rows,
    ],
    { id },
  )}</defs>`;
}

function agent(i: number, id: string) {
  const used = SHAPES[0]!.agents[i] !== null;
  const [dx, dy] = k.shift([...spotOf(0, i), 0], P);
  return k.group(`<use href="#${id}"/>`, {
    class: 'k-move', 'data-agent': i, style: `transform:translate(${dx.toFixed(1)}px,${dy.toFixed(1)}px);opacity:${used ? 1 : 0}`,
  });
}

function you() {
  return [
    k.solid(k.box(DESK, 0, DESK_H, P)),
    k.halo({ x: YOU[0] - 9, y: YOU[1] - 9, w: 18, d: 18, r: 9 }, DESK_H, P),
    k.solid(k.cylinder(YOU[0], YOU[1], 9, DESK_H, 15, P), { tone: 'lit' }),
  ];
}

const needleAngle = (burn: number) => SWEEP[0] + (SWEEP[1] - SWEEP[0]) * burn;

function gauge() {
  const n = 9;
  const ticks = Array.from({ length: n }, (_, i) => {
    const a = ((SWEEP[0] + ((SWEEP[1] - SWEEP[0]) * i) / (n - 1)) * Math.PI) / 180;
    const [c, s] = [Math.cos(a), Math.sin(a)];
    const r0 = i >= n - 2 ? 9 : 11;
    return { d: `M${(c * r0).toFixed(2)} ${(s * r0).toFixed(2)}L${(c * 14).toFixed(2)} ${(s * 14).toFixed(2)}`, hot: i >= n - 2 };
  });
  const plain = ticks.filter((t) => !t.hot).map((t) => t.d).join('');
  const hot = ticks.filter((t) => t.hot).map((t) => t.d).join('');
  return [
    k.halo({ x: GAUGE[0] - GAUGE_R, y: GAUGE[1] - GAUGE_R, w: 2 * GAUGE_R, d: 2 * GAUGE_R, r: GAUGE_R }, 0, P),
    k.solid(k.cylinder(GAUGE[0], GAUGE[1], GAUGE_R, 0, GAUGE_H, P, 32)),
    `<g transform="${k.planeMatrix(GAUGE, GAUGE_H, P)}"><path class="k-line" d="${plain}"/><path class="k-line" data-tone="edge" d="${hot}"/>` +
      `<g class="k-move" data-needle style="transform:rotate(${needleAngle(SHAPES[0]!.burn)}deg)"><path class="k-line" data-tone="edge" d="M0 0L12 0"/></g>` +
      `<circle class="k-hub" r="1.8"/></g>`,
  ];
}

/** Roles shown as labels over the agents, per shape: [agent index, name]. At most three. */
const ROLES: Record<string, [number, string][]> = {
  solo: [[0, 'Agent']],
  threads: [[0, 'Thread'], [1, 'Thread'], [2, 'Thread']],
  lead: [[0, 'Lead'], [2, 'Helpers']],
  pipeline: [[0, 'Writes'], [1, 'Reviews'], [2, 'Checks']],
  council: [[1, 'Members'], [3, 'Judge']],
  nested: [[0, 'Lead'], [1, 'Helpers'], [4, 'Their helpers']],
};
export const ROLE_SLOTS = 3;

export function drawTeamShapes(uid: string) {
  const id = `${uid}-agent`;
  const label = (p: k.Point3) => k.anchor(p, P, W, H);
  // Back to front: the deepest agents (higher index) sit furthest back in every shape.
  const body = [
    ...plate(),
    ...SHAPES.map((_, i) => links(i)),
    agentBody(id),
    ...Array.from({ length: 7 }, (_, i) => agent(6 - i, id)),
    ...you(),
    ...gauge(),
  ];
  const shapes = SHAPES.map((s, si) => ({
    agents: s.agents.map((_, i) => {
      const [dx, dy] = k.shift([...spotOf(si, i), 0], P);
      return { at: [dx, dy] as k.Flat, on: s.agents[i] !== null };
    }),
    needle: needleAngle(s.burn),
    roles: ROLES[s.id]!.map(([i, name]) => ({ name, ...label([...spotOf(si, i), AGENT_H + 16]) })),
  }));
  return {
    svg: k.svg(W, H, body),
    labels: [
      { name: 'You', id: 'you', at: label([YOU[0], YOU[1], DESK_H + 32]) },
      { name: 'Burn', id: 'burn', at: label([GAUGE[0] + 6, GAUGE[1] - 6, GAUGE_H + 22]) },
    ],
    motion: { shapes },
  };
}
