// Fig. 17 geometry, built once at build time. 24 parts: the bench, the agent's block and its glass
// window, four sockets, four plugs, four cables, and the four things outside the project: a browser
// (foot, neck, screen), an issue tracker (two cards), a database (three discs) and a mail envelope.
// What moves: a plug slides from where it lies on its cable into its socket; the window's level rises
// a band per connector plugged in; the thing at the cable's far end lights while it is selected.
import * as k from '../kit/iso';
import { CONNECTORS, START, levelOf, type ConnectorId } from './model';

export const W = 640;
export const H = 380;

const PLATE: k.Plan = { x: -104, y: -104, w: 208, d: 208, r: 14 };
const HUB = 44, HUB_H = 14;
const GLASS: k.Plan = { x: -15, y: -15, w: 30, d: 30, r: 0 };
const GLASS_H = 54;
const SOCKET = 13, SOCKET_H = 6;
const PLUG = 8, PLUG_H = 10;
const D_SOCKET = 33, D_REST = 48, D_CABLE = 56, D_OBJECT = 74;

/**
 * Direction of each connector on the bench, along the world axes so that nothing stands behind the
 * agent's tall window: -x is back left on screen, -y back right, +y front left, +x front right.
 */
const DIR: Record<ConnectorId, k.Plane> = { browser: [-1, 0], database: [0, -1], tracker: [0, 1], mail: [1, 0] };
const at = (id: ConnectorId, d: number): k.Plane => [DIR[id][0] * d, DIR[id][1] * d];
const centre = ([x, y]: k.Plane, w: number, d = w, r = 2): k.Plan => ({ x: x - w / 2, y: y - d / 2, w, d, r });

const P = k.fit(
  [
    [PLATE.x, PLATE.y, -10], [PLATE.x + PLATE.w, PLATE.y + PLATE.d, -10],
    [PLATE.x, PLATE.y + PLATE.d, -10], [PLATE.x + PLATE.w, PLATE.y, -10],
    [GLASS.x, GLASS.y, HUB_H + GLASS_H + 4],
  ],
  W, H, 26,
);
const pt = (p: k.Point3) => k.iso(p, P);

function bench() {
  return [
    k.halo(PLATE, -10, P),
    k.solid(k.box(PLATE, -10, 10, P), { tone: 'base' }),
    k.line(k.planLine(k.inset(PLATE, 7), 0, P), 'faint'),
  ];
}

/** A cable on the bench from the socket out to the thing it reaches. */
const cable = (id: ConnectorId) => k.line(k.onPlane([at(id, D_SOCKET + 4), at(id, D_CABLE)], 0.2, P), 'faint', { 'data-cable': id });

function socket(id: ConnectorId) {
  const c = at(id, D_SOCKET);
  return [
    k.solid(k.box(centre(c, SOCKET), 0, SOCKET_H, P)),
    k.flat(k.planLine(centre(c, PLUG + 1, PLUG + 1, 1.5), SOCKET_H, P)),
  ];
}

/** A plug lying on its cable; the script slides it into the socket. */
const plug = (id: ConnectorId) =>
  k.group(k.solid(k.box(centre(at(id, D_REST), PLUG, PLUG, 2), 0, PLUG_H, P)), {
    class: 'k-move', 'data-plug': id, style: 'transform:translate(0px,0px)',
  });

function browser() {
  const [x, y] = at('browser', D_OBJECT);
  // A screen standing on a foot, turned to face the agent (its face is the plane x = x + 2).
  const screen: k.Plan = { x: x - 2, y: y - 26, w: 4, d: 52, r: 1 };
  const z0 = 14, h = 36;
  const face = x + 2.05;
  const rows = [0.8, 0.62, 0.47, 0.32, 0.17].map((f, i) =>
    k.pathOf([pt([face, y - 19, z0 + h * f]), pt([face, y + (i === 0 ? -2 : i === 4 ? 4 : 17), z0 + h * f])]),
  );
  return k.group(
    [
      k.solid(k.box(centre([x, y], 18, 28, 3), 0, 3, P)),
      k.solid(k.box(centre([x - 1, y], 4, 5, 1), 3, z0 - 3, P)),
      k.solid(k.box(screen, z0, h, P)),
      k.line(rows.join('')),
    ],
    { 'data-object': 'browser' },
  );
}

function database() {
  const [x, y] = at('database', D_OBJECT);
  return k.group(
    [0, 1, 2].map((i) => k.solid(k.cylinder(x, y, 20, i * 11, 10, P))).concat(k.line(k.ringLine(x, y, 13, 32, P), 'faint')),
    { 'data-object': 'database' },
  );
}

function tracker() {
  const [x, y] = at('tracker', D_OBJECT);
  const top = { x: x - 19 + 4, y: y - 14 - 4, w: 38, d: 28, r: 1.5 };
  const lines = [0, 1, 2].map((i) => k.onPlane([[top.x + 6, top.y + 7 + i * 6], [top.x + (i === 2 ? 18 : 31), top.y + 7 + i * 6]], 6, P));
  return k.group(
    [
      k.solid(k.box({ x: x - 19, y: y - 14, w: 38, d: 28, r: 1.5 }, 0, 3, P)),
      k.solid(k.box(top, 3, 3, P)),
      k.line(lines.join('')),
    ],
    { 'data-object': 'tracker' },
  );
}

function mail() {
  const [x, y] = at('mail', D_OBJECT);
  // An envelope lying with its flap edge towards the agent (the -x side).
  const env: k.Plan = { x: x - 15, y: y - 22, w: 30, d: 44, r: 1 };
  const flap = k.onPlane([[env.x + 1, env.y + 1], [x + 2, y], [env.x + 1, env.y + env.d - 1]], 5, P);
  return k.group([k.solid(k.box(env, 0, 5, P)), k.line(flap)], { 'data-object': 'mail' });
}

/** The agent: a block with its context window, a glass vessel, on top. The water is the window's level. */
function agent(uid: string) {
  const g = k.glass(GLASS, HUB_H, GLASS_H, P);
  const water = k.box(k.inset(GLASS, 1.5), HUB_H, GLASS_H - 3, P);
  const [dx, dy] = k.shift([0, 0, -(1 - levelOf(START)) * (GLASS_H - 3)], P);
  return [
    k.solid(k.box(centre([0, 0], HUB, HUB, 3), 0, HUB_H, P)),
    `<clipPath id="${uid}-window"><path d="${g.clip}"/></clipPath>`,
    `<path class="k-glass-back" d="${g.back}"/>`,
    `<g clip-path="url(#${uid}-window)"><g class="k-move k-water" data-water style="transform:translate(${dx.toFixed(1)}px,${dy.toFixed(1)}px)">${k.solid(water, { crease: false })}</g></g>`,
    `<path class="k-glass-front" d="${g.front}"/>`,
    `<path class="k-glass-edges" d="${g.edges}"/>`,
  ];
}

export function drawWireIn(uid: string) {
  const ids = CONNECTORS.map((c) => c.id);
  const body = [
    ...bench(),
    ...ids.map(cable),
    // back to front: the browser is furthest back, the mail nearest the viewer
    browser(),
    database(),
    ...socket('browser'), plug('browser'),
    ...socket('database'), plug('database'),
    ...agent(uid),
    ...socket('tracker'), plug('tracker'),
    ...socket('mail'), plug('mail'),
    tracker(),
    mail(),
  ];
  const label = (p: k.Point3) => k.anchor(p, P, W, H);
  const names = Object.fromEntries(CONNECTORS.map((c) => [c.id, c.name]));
  const into = (id: ConnectorId) => {
    const [a, b] = [at(id, D_REST), at(id, D_SOCKET)];
    return k.shift([b[0] - a[0], b[1] - a[1], SOCKET_H - 2], P);
  };
  return {
    svg: k.svg(W, H, body),
    labels: [
      { name: 'Agent', id: 'agent', at: label([0, 0, HUB_H + GLASS_H + 16]) },
      { name: names.browser!, id: 'browser', at: label([...at('browser', D_OBJECT), 66] as k.Point3) },
      { name: names.database!, id: 'database', at: label([...at('database', D_OBJECT), 52] as k.Point3) },
      { name: names.tracker!, id: 'tracker', at: label([...at('tracker', D_OBJECT + 36), 0] as k.Point3) },
      { name: names.mail!, id: 'mail', at: label([...at('mail', D_OBJECT + 34), 0] as k.Point3) },
    ],
    motion: {
      plug: Object.fromEntries(ids.map((id) => [id, into(id)])) as Record<ConnectorId, k.Flat>,
      unit: k.shift([0, 0, -1], P),
      waterH: GLASS_H - 3,
    },
  };
}
