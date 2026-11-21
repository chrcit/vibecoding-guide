import type { Piece } from '../lib/showcase';

export const piece: Piece = {
  slug: 'contact-tidy',
  title: 'The contact tidy',
  category: 'automations',
  summary: 'Cleans a messy exported contact list in the browser and shows every change it made.',
  path: 'showcase/pieces/contact-tidy/index.html',
  height: 820,
  built: '2026-11-18',
  builtWith: 'Claude Opus 5.5 in Claude Code',
  example: 'contact tidy',
  order: 1,
  prompt: `A tool that cleans a messy exported contact spreadsheet in the browser. Paste CSV text or drop a file (nothing is uploaded; say so). It finds and merges duplicates, normalises mixed date formats to one, trims stray whitespace, fixes the capitalisation of names, normalises phone numbers to one format and flags rows it is unsure about instead of guessing. It shows a before-and-after with every change visible and explained, lets the visitor accept or reject kinds of change, and downloads the cleaned CSV. It ships with a messy invented sample that shows off every rule. Handles a few thousand rows without freezing, quoted fields, commas inside quotes and a wrong delimiter.

Self-contained: no network requests, no remote fonts, works at 390px wide, from the keyboard, with reduced motion, in light and dark. Fictional content only.`,
  story: [
    'The agent split the work in two: a file of cleaning rules with no page code in it, including its own CSV parser and a guess at the delimiter, and a second file for the page. There are six rules (stray spaces, name capitals, email case, phone format, date format and merging duplicates), each with a switch. Dates that could be read two ways, such as 03/04/1979, are flagged instead of converted, as are impossible ones like 31/02/1990 and two-digit years. The agent ran the rule functions in the browser console before building any of the page around them.',
    'The first run on the sample showed two problems. Two rows for the same person were flagged only because their notes differed, so free-text notes columns are now joined and only other columns raise a flag. The "Try 3,000 rows" generator was also wrong: its phone numbers repeated every 1,000 rows, so 3,000 rows merged into 1,000, and its repeated names made every row look like a duplicate. It was rewritten to use telephone numbers from ranges Ofcom reserves for drama and unique names. After that the preview browser timed 3,000 rows at about 60 ms, toggling a rule at about 90 ms and 20,000 rows at about 430 ms, so the agent did not add a worker. It also tried a forced wrong delimiter, tab-separated text, an unclosed quote, uneven rows, an empty box, a single line and an .xlsx file, and fixed the "Read 1 rows" wording.',
    'At 390px the page scrolled sideways to 1266px, because the visually hidden text in the table escaped the table\\\'s scroll box, and the table itself was unusable, with cells breaking mid-word. The agent fixed the overflow and changed the table to one card per contact below 600px, after which the flagged view measured 390px wide. It then began restructuring the table so that the explanation of each row sits in a full-width row under that contact instead of in a last column, and took a 1280px screenshot of the result.',
    'The session was cut off at that point. The screenshot had not been looked at, so the restructured table and the card layout at 390px were not rechecked afterwards. Nothing was committed, the site\\\'s judge was not run on this piece, and there was no keyboard-only pass, no reduced-motion check and no look at it inside the showcase page. Playwright was not used; the checks came from the preview browser.',
    'A later session loaded the sample and looked at the result at 1280px in light mode and at 390px in dark mode: the row of explanation under each contact reads as intended, the cards hold at 390px, and neither width scrolls sideways. A keyboard-only pass has still not been done.',
  ],
};
