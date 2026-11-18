// Fig. 5, steer or queue: the same correction, sent while an agent works on the holiday hours bug,
// either joins the running turn at its next step (steer) or waits for the turn to end (queue).
// The drawing and the readout both read from this module.

export type Mode = 'queue' | 'steer';

/** The steps of the agent's turn, in order. */
export const STEPS = [
  'read the opening-hours page',
  'find where the hours are set',
  'type the holiday dates into the page',
  'add a test for 25 December',
  'run the test',
  'write the summary',
] as const;

/** Your message arrives while this many steps are done. */
export const SENT_AFTER = 2;

export const MESSAGE = 'Use the holiday list in holidays.csv. Don’t type the dates in.';

export interface State {
  mode: Mode;
  /** Steps of turn 1 that were wasted and have to be done again. */
  thrownAway: number;
  /** Steps a second turn has to run. */
  redone: number;
}

export function stateOf(mode: Mode): State {
  const after = STEPS.length - SENT_AFTER;
  return mode === 'queue' ? { mode, thrownAway: after, redone: after } : { mode, thrownAway: 0, redone: 0 };
}

export function describe(s: State) {
  if (s.mode === 'queue')
    return `Queued. The agent finishes its turn with the dates typed in, tests them and reports success. Only then does it read your message. ${s.thrownAway} of its ${STEPS.length} steps go in the bin, and a second turn does them again.`;
  return `Steered. The message joins the running turn as soon as the step in progress ends, so from step ${SENT_AFTER + 1} the agent reads the dates from holidays.csv. Nothing is thrown away and there is no second turn.`;
}
