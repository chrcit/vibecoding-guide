// Fig. 2, the loop: one task (the holiday hours bug) going round read, act, check until the check passes.
// The drawing and the readout both come from this list, so they cannot disagree.

export type Station = 'in' | 'read' | 'act' | 'check' | 'done';
export type Lamp = 'off' | 'fail' | 'pass';

export interface Step {
  at: Station;
  /** Laps completed before this step; the puck's angle is the station's plus 360° per lap. */
  lap: number;
  lamp: Lamp;
  says: string;
}

export const STEPS: Step[] = [
  { at: 'in', lap: 0, lamp: 'off', says: 'The task: the bakery’s website shows its normal opening hours on 25 December. The agent has the request and nothing else yet.' },
  { at: 'read', lap: 0, lamp: 'off', says: 'Round 1, read. The model asks to read the hours page and the holiday list. Christmas is in the list, but the page never looks at it.' },
  { at: 'act', lap: 0, lamp: 'off', says: 'Round 1, act. It edits the page to check today’s date against the holiday list.' },
  { at: 'check', lap: 0, lamp: 'fail', says: 'Round 1, check. It runs the test for 25 December, and the page still shows the normal hours. The check failed, so the task goes round again.' },
  { at: 'read', lap: 1, lamp: 'off', says: 'Round 2, read. It reads the failure: the list writes the date as 25/12/2026, the page looks for 2026-12-25.' },
  { at: 'act', lap: 1, lamp: 'off', says: 'Round 2, act. It makes the page read both dates the same way.' },
  { at: 'check', lap: 1, lamp: 'pass', says: 'Round 2, check. The test passes: 25 December shows Closed, and an ordinary Tuesday still shows the usual hours.' },
  { at: 'done', lap: 2, lamp: 'pass', says: 'Done. The loop stopped because a check passed. Without that test, the agent would have stopped after round 1 and reported the bug fixed.' },
];

/** World angle of each station on the track, in degrees. Angles grow clockwise on screen. */
export const ANGLE: Record<Exclude<Station, 'done'>, number> = { in: 90, read: 135, act: 225, check: 315 };
/** Where the spur to the done tray leaves the track. */
export const EXIT = 405;

export const angleOf = (s: Step) => (s.at === 'done' ? EXIT + 360 * (s.lap - 1) : ANGLE[s.at] + 360 * s.lap);
