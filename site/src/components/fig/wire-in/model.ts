// Fig. 17, what you can wire in. An agent on a bench with four sockets; each connector is a cable to
// something outside the project. The drawing and the readout both come from this file.

export type ConnectorId = 'browser' | 'tracker' | 'database' | 'mail';

export interface Connector {
  id: ConnectorId;
  /** The button and label text. */
  name: string;
  /** What the agent can now do, in a running example. */
  reach: string;
  /** What it could go wrong with. */
  risk: string;
}

export const CONNECTORS: Connector[] = [
  {
    id: 'browser',
    name: 'Browser',
    reach: 'The agent can open the club list in a real browser, fill in the form and read what the page shows, so it can look at what it just built.',
    risk: 'Every page it opens is text someone else wrote, and a page can hide instructions aimed at the agent.',
  },
  {
    id: 'tracker',
    name: 'Issue tracker',
    reach: 'The agent can read the bakery’s bug report about holiday hours, with the steps to reproduce it, and add a comment once the fix is in.',
    risk: 'Anyone who can file an issue can now write to your agent, and a write tool can close or edit tickets.',
  },
  {
    id: 'database',
    name: 'Database',
    reach: 'The agent can check the live data: which club members are really marked as paid this season.',
    risk: 'With write access, one wrong query changes or deletes real members. Connect it read-only, or to a copy.',
  },
  {
    id: 'mail',
    name: 'Mail',
    reach: 'The agent can find the latest contact export in your inbox and start the contact tidy without you downloading anything.',
    risk: 'An agent that reads your mail can be told what to do by an email, and if it can also send, it can send your data out.',
  },
];

export interface WireInInputs {
  /** True when the harness loads tool definitions only when a tool is used (from src/data/connectors.ts). */
  deferred: boolean;
}

export interface WireInState {
  /** Connectors plugged in, in the order of CONNECTORS. */
  on: ConnectorId[];
  /** The connector the reader touched last, or null at the start. */
  last: ConnectorId | null;
}

export const START: WireInState = { on: [], last: null };

/** Plug a connector in, or pull it out if it is already in. */
export function toggle(s: WireInState, id: ConnectorId): WireInState {
  const isOn = s.on.includes(id);
  const on = CONNECTORS.map((c) => c.id).filter((c) => (c === id ? !isOn : s.on.includes(c)));
  return { on, last: id };
}

/** How full the drawn window is, 0 to 1: the conversation so far plus a band per connector. A picture, not a measurement. */
export const levelOf = (s: WireInState) => 0.28 + 0.13 * s.on.length;

const count = (s: WireInState, x: WireInInputs) => {
  const n = s.on.length;
  if (!n) return 'Nothing else is connected, so the window holds only your conversation and the files read so far.';
  const what = x.deferred
    ? 'Each one puts its tool names in the agent’s context window; full descriptions load only when a tool is used.'
    : 'Each one puts its tool descriptions in the agent’s context window, used or not.';
  return `${n} of ${CONNECTORS.length} connected. ${what}`;
};

export function describe(s: WireInState, x: WireInInputs): string {
  if (!s.last) return 'Nothing is plugged in. The agent can read and edit the files in your project and run commands there, and that is all it can reach.';
  const c = CONNECTORS.find((k) => k.id === s.last)!;
  if (!s.on.includes(c.id)) return `${c.name} pulled out. The agent can no longer reach it. ${count(s, x)}`;
  return `${c.name} plugged in. ${c.reach} What could go wrong: ${c.risk} ${count(s, x)}`;
}
