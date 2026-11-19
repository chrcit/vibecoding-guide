// Fig. 66, the loop on three tasks. Each running example goes round read, act and check until a
// check passes. The drawing and the sentence both read from these lists. No numbers: the rounds
// are what happened in the story, not a measurement.

export type Station = 'in' | 'read' | 'act' | 'check' | 'done';
export type Lamp = 'off' | 'fail' | 'pass';
export type Example = 'club' | 'bakery' | 'contacts';

export interface Step { at: Station; lap: number; lamp: Lamp; says: string }

export const EXAMPLES: { id: Example; name: string }[] = [
  { id: 'club', name: 'Club list' },
  { id: 'bakery', name: 'Holiday hours' },
  { id: 'contacts', name: 'Contact tidy' },
];

const s = (at: Station, lap: number, lamp: Lamp, says: string): Step => ({ at, lap, lamp, says });

export const STEPS: Record<Example, Step[]> = {
  club: [
    s('in', 0, 'off', 'Build a page where the football club marks who has paid this season.'),
    s('read', 0, 'off', 'Read: an empty folder and your description. Nothing to go on but your words.'),
    s('act', 0, 'off', 'Act: it writes the form, the list and a small database.'),
    s('check', 0, 'fail', 'Check: it opens the page and ticks a member as paid. After a reload the tick is gone.'),
    s('read', 1, 'off', 'Read: the save goes to the page’s memory, never to the database.'),
    s('act', 1, 'off', 'Act: it writes each tick to the database.'),
    s('check', 1, 'pass', 'Check: tick, reload, still ticked.'),
    s('done', 2, 'pass', 'Done, because a check passed that a member of the club would have tried first.'),
  ],
  bakery: [
    s('in', 0, 'off', 'The bakery’s site shows its normal hours on 25 December. Fix it.'),
    s('read', 0, 'off', 'Read: the hours page and the holiday list. Christmas is in the list; the page never looks.'),
    s('act', 0, 'off', 'Act: it makes the page check today against the list.'),
    s('check', 0, 'fail', 'Check: the test for 25 December still shows the usual hours.'),
    s('read', 1, 'off', 'Read: the list writes 25/12/2026, the page looks for 2026-12-25.'),
    s('act', 1, 'off', 'Act: it reads both dates the same way.'),
    s('check', 1, 'pass', 'Check: Closed on 25 December, the usual hours on a Tuesday.'),
    s('done', 2, 'pass', 'Done. Without the test it would have stopped after the first round and called it fixed.'),
  ],
  contacts: [
    s('in', 0, 'off', 'Clean the exported contacts: duplicates, mixed dates, stray spaces.'),
    s('read', 0, 'off', 'Read: the spreadsheet’s columns and twenty sample rows.'),
    s('act', 0, 'off', 'Act: a script that merges rows with the same name.'),
    s('check', 0, 'fail', 'Check: two different people called Sam Lee became one.'),
    s('read', 1, 'off', 'Read: the merged rows. Their emails differ.'),
    s('act', 1, 'off', 'Act: merge only when name and email match.'),
    s('check', 1, 'fail', 'Check: one person with two emails is now two people.'),
    s('read', 2, 'off', 'Read: those rows share a phone number.'),
    s('act', 2, 'off', 'Act: it asks you which rows count as one person, and writes your rule down.'),
    s('check', 2, 'pass', 'Check: every sample row comes out the way you said it should.'),
    s('done', 3, 'pass', 'Done after three rounds. The rule came from you; the loop found where it was needed.'),
  ],
};

/** World angle of each station on the track, in degrees. */
export const ANGLE: Record<Exclude<Station, 'done'>, number> = { in: 90, read: 150, act: 270, check: 30 };
/** Where the spur to the done tray leaves the track. */
export const EXIT = 60;

/** Angle along the track, always increasing, so the puck only goes forward. */
export function angleOf(st: Step): number {
  if (st.at === 'done') return EXIT + 360 * st.lap;
  const a = ANGLE[st.at];
  // check (30°) comes after act (270°) on the same lap
  return (st.at === 'check' ? a + 360 : a) + 360 * st.lap;
}
