import type { Piece } from '../lib/showcase';

export const piece: Piece = {
  slug: 'club-list',
  title: 'The club list',
  category: 'apps',
  summary: 'A neighbourhood football club’s list of who has paid their subs this season, kept in the browser.',
  path: 'showcase/pieces/club-list/index.html',
  height: 780,
  built: '2026-11-18',
  builtWith: 'Claude Opus 5.5 in Claude Code',
  example: 'club list',
  order: 1,
  prompt: `A small web app with which a neighbourhood football club tracks which members have paid this season. Add, edit and remove members; mark a payment with its date and amount; filter by paid and unpaid and search by name; see at a glance how many have paid and how much is outstanding; export the list as a CSV file and import it again. Data lives in the browser's local storage and the page says so. It starts with a believable invented club and a dozen invented members so it is alive on first load, with a way to clear to empty. Empty, error and undo states are designed.

Self-contained: no network requests, no remote fonts, works at 390px wide, from the keyboard, with reduced motion, in light and dark. Fictional content only.`,
  story: [
    'The agent wrote the page, the stylesheet and the script in one pass: an invented club, Copper Lane Wanderers, with a dozen invented members in three squads. Each squad has a set fee, each member has at most one payment (an amount and a date), and a payment below the fee counts as part-paid. Removing a member, clearing the list and importing a file all show an undo toast. The harness refused the first attempt to drive the page with Playwright, because the rules in the agent\\\'s context still said it was banned, so the checks that followed used the preview browser built into the harness. The dev server also returned a 404 for the piece\\\'s folder, so the registered path points at index.html.',
    'Looking at it was more useful than the first draft. At 1280px in light mode the action buttons were different widths, so the status column wobbled from row to row, and a loud "Change payment" button sat on every paid row; the agent gave the buttons a fixed minimum width and made the paid-row button quiet. At 390px in dark mode the green masthead was too light against the page, so it was darkened. Scripted checks found a duplicate-name error that repeated the name as typed, in lower case, instead of the stored one, and focus falling to the page body after Undo, which now returns to the list. A screenshot of the payment dialog for a member who had not paid still showed "Remove payment", because the button\\\'s display rule overrode the hidden attribute; a global rule for hidden fixed it.',
    'The same scripts covered adding with an empty name or a bad fee, a payment with a bad amount or a future date, undo, search with and without a match, clearing to empty and bringing the sample club back. Import was tried with a semicolon-separated file, a file with no name column, one with several bad rows, an unclosed quote and an empty file; each was refused with a message and left the list unchanged, and an exported file imported back in. The page loaded only its own stylesheet and script, and at 390px it did not scroll sideways. Both runs of the site\\\'s judge passed and the piece was committed. Not done: the page was not looked at in dark mode at 1280px, reduced motion was not exercised in the browser (the stylesheet has the media query), and the keyboard check went no further than opening the payment dialog with Enter.',
  ],
};
