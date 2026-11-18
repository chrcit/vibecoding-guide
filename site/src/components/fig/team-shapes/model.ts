// Fig. 12, six ways to run a team. The same pieces (you, up to seven agents, the work each holds)
// arranged six ways. The drawing, the gauge and the readout all read from this list.
// No prices or limits here: cost is said relative to working solo, in words.

export type ShapeId = 'solo' | 'threads' | 'lead' | 'pipeline' | 'council' | 'nested';

/** A place on the plate, in world units: x runs away from you, y across. */
export type Spot = [number, number];

export interface Shape {
  id: ShapeId;
  /** Button text. */
  name: string;
  /** Where each of the seven agents stands, or null when the shape does not use it. */
  agents: (Spot | null)[];
  /** Who hands work to whom: -1 is you, otherwise an agent index. */
  links: [number, number][];
  /** Where the burn gauge points, 0 (idle) to 1 (flat out). Relative, not a measurement. */
  burn: number;
  /** The readout: what it is, when to use it, what it costs against solo, how it fails. */
  says: string;
}

/** Depth levels along x, from you at the front to the deepest helpers at the back. */
export const YOU: Spot = [128, 0];
const L1 = 52, L2 = -14, L3 = -78;
const WIDE = 56;

export const SHAPES: Shape[] = [
  {
    id: 'solo',
    name: 'Solo',
    agents: [[L1, 0], null, null, null, null, null, null],
    links: [[-1, 0]],
    burn: 0.12,
    says: 'Solo: you and one agent on one task. Use it for almost everything, and always first. It is the baseline cost. It fails when the task outgrows one conversation and the agent starts to forget the start of it.',
  },
  {
    id: 'threads',
    name: 'Threads',
    agents: [[L1, -WIDE], [L1, 0], [L1, WIDE], null, null, null, null],
    links: [[-1, 0], [-1, 1], [-1, 2]],
    burn: 0.38,
    says: 'Parallel threads: three separate conversations, each on its own task, and you coordinate them. Use it when the tasks do not touch each other. It costs about one solo run per thread. It fails when you cannot review as fast as they finish, or two threads edit the same files.',
  },
  {
    id: 'lead',
    name: 'Lead',
    agents: [[L1, 0], [L2, -WIDE], [L2, 0], [L2, WIDE], null, null, null],
    links: [[-1, 0], [0, 1], [0, 2], [0, 3]],
    burn: 0.5,
    says: 'A lead with helpers: one agent starts helpers for side jobs, such as searching the code or running the tests, and each hands back a short summary. Use it to keep the lead’s context clean. It costs the lead plus every helper. It fails when a summary leaves out the one detail that mattered.',
  },
  {
    id: 'pipeline',
    name: 'Pipeline',
    agents: [[L1, 0], [L2, 0], [L3, 0], null, null, null, null],
    links: [[-1, 0], [0, 1], [1, 2]],
    burn: 0.4,
    says: 'A pipeline: each agent’s output is the next one’s input. One writes the change, one reviews it, one runs the checks. Use it when each step has a clear hand-over. It costs a little more than one run per stage. It fails when a stage passes on a mistake that every later stage trusts.',
  },
  {
    id: 'council',
    name: 'Council',
    agents: [[L1, -WIDE], [L1, 0], [L1, WIDE], [L2, 0], null, null, null],
    links: [[-1, 0], [-1, 1], [-1, 2], [0, 3], [1, 3], [2, 3]],
    burn: 0.72,
    says: 'A council: several models, ideally from different labs, answer or review the same thing, and one judges. Use it for a hard decision or a risky change. It costs one run per member and then some, every round. It fails when nobody can agree and the rounds never stop.',
  },
  {
    id: 'nested',
    name: 'Nested',
    agents: [[L1, 0], [L2, -WIDE * 0.75], [L2, WIDE * 0.75], [L3, -WIDE * 1.2], [L3, -WIDE * 0.4], [L3, WIDE * 0.4], [L3, WIDE * 1.2]],
    links: [[-1, 0], [0, 1], [0, 2], [1, 3], [1, 4], [2, 5], [2, 6]],
    burn: 0.95,
    says: 'Nested teams: helpers that start helpers of their own. Use it rarely, for a big job that splits cleanly into parts and parts of parts. It costs the most here: every layer multiplies the agents. It fails quietly, because each hand-back is a summary of a summary.',
  },
];

/** Where a hidden agent waits: its place in the nested shape, the one that uses all seven. */
export const PARK: Spot[] = SHAPES[SHAPES.length - 1]!.agents as Spot[];

export const describe = (i: number) => SHAPES[i]!.says;
