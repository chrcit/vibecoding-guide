// Fig. 15, the summary and the diff. The agent's summary of its holiday hours fix next to what the
// change really contains. The diff holds one change the summary leaves out: Boxing Day deleted from
// the holiday list. Plain readers get the changes in words; technical readers get files and lines.

export type View = 'summary' | 'diff';
export type Reader = 'plain' | 'technical' | 'engineer';

export const SUMMARY =
  'The summary says: “Fixed the holiday hours. The page now reads holiday dates correctly, and I added a test for 25 December. All tests pass.” Two changes, both asked for.';

const DIFF_PLAIN =
  'The diff holds three changes. Two match the summary: the holiday check now reads dates written either way, and there is a new test for 25 December. The third is not in the summary: Boxing Day was deleted from the list of holidays, so on 26 December the page will show the normal hours.';

const DIFF_CODE =
  'The diff touches three files. src/hours.ts: isHoliday() now parses 25/12/2026 and 2026-12-25 alike. src/hours.test.ts: one new test, for 25 December. data/holidays.json: the 26/12 entry is deleted, which the summary never mentions; no test covers Boxing Day, so “all tests pass” stays true.';

export function describe(view: View, reader: Reader) {
  if (view === 'summary') return SUMMARY;
  return reader === 'plain' ? DIFF_PLAIN : DIFF_CODE;
}
