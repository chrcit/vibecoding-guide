// Fig. 1, three agents and one of you: a short session on the club list with three agent threads.
// Each moment says where your attention is, how far each agent has got, and who is waiting for you.
// The drawing and the readout both read from this list.

export type Agent = 0 | 1 | 2;

export interface Moment {
  /** The agent you are attending to. */
  you: Agent;
  /** Lines of work on each screen, 0 to LINES. */
  lines: [number, number, number];
  /** Agents that have finished and are waiting for you. */
  waiting: [boolean, boolean, boolean];
  says: string;
}

export const LINES = 4;

/** The three lanes of the one project. */
export const LANES = ['Sign-up form', 'Who has paid', 'Login'] as const;

export const MOMENTS: Moment[] = [
  {
    you: 0, lines: [1, 0, 0], waiting: [false, false, false],
    says: 'One project, the club list, split into three lanes. You brief the first agent on the sign-up form, and it starts.',
  },
  {
    you: 1, lines: [2, 1, 0], waiting: [false, false, false],
    says: 'You turn to the second agent and describe the list of who has paid. The first carries on without you.',
  },
  {
    you: 2, lines: [3, 2, 1], waiting: [false, false, false],
    says: 'You brief the third on the login. All three are working, and for a few minutes nobody needs you.',
  },
  {
    you: 0, lines: [4, 4, 2], waiting: [false, true, false],
    says: 'The form is done. You read it and send one correction. While you read, the second agent finishes and waits for you.',
  },
  {
    you: 1, lines: [1, 4, 4], waiting: [false, false, true],
    says: 'You check the paid list. The first agent is fixing the form on its own; the third has finished the login and waits.',
  },
  {
    you: 2, lines: [4, 1, 4], waiting: [true, false, false],
    says: 'While you were reading the login, the form fix came back. At every moment one agent has you and the others work or wait.',
  },
];

export function describe(m: Moment) {
  const working = m.lines.filter((n, i) => i !== m.you && !m.waiting[i] && n > 0).length;
  const waiting = m.waiting.filter(Boolean).length;
  const tally = `Working on their own: ${working}. Waiting for you: ${waiting}.`;
  return `${m.says} ${tally}`;
}
