// Fig. 13, one bug, three judges. The agent has "fixed" the holiday hours bug, but the fix compares
// dates written two different ways, so the page still shows the normal hours on 25 December.
// Three judges look at the same change. The drawing and the readout both read from this list.

export type JudgeId = 'summary' | 'review' | 'test';
/** What the judge's lamp shows: the summary's lamp is green because the agent says so. */
export type Verdict = 'pass' | 'fail';

export interface Judge {
  id: JudgeId;
  /** Text on the control button. */
  button: string;
  verdict: Verdict;
  says: string;
}

export const JUDGES: Judge[] = [
  {
    id: 'summary',
    button: 'Its own summary',
    verdict: 'pass',
    says:
      'The agent’s own summary: “Fixed. Public holidays now show Closed.” Its lamp is green because the agent says so. It cannot catch a mistake the agent does not know it made, and here the page still shows the normal hours on 25 December.',
  },
  {
    id: 'review',
    button: 'A second agent',
    verdict: 'fail',
    says:
      'A second agent with a fresh context reads the change and the holiday list. It spots that the list writes 25/12/2026 and the page looks for 2026-12-25, and flags it. A reviewer reads; it does not run anything, so it can miss what only shows up when the page runs.',
  },
  {
    id: 'test',
    button: 'A test',
    verdict: 'fail',
    says:
      'A test sets the date to 25 December and asks the page for its hours. It gets 07:00 to 18:00 instead of Closed, so it fails. A test runs the code, so it cannot be talked round. It catches what it checks and nothing else.',
  },
];

export const judgeIndex = (id: string) => Math.max(0, JUDGES.findIndex((j) => j.id === id));
