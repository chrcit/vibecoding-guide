import type { Piece } from '../lib/showcase';

export const piece: Piece = {
  slug: 'bakery-page',
  title: 'The bakery page',
  category: 'pages',
  summary: 'A one-page site for a made-up bakery that knows whether it is open, including on holidays, after midnight and from another time zone.',
  path: 'showcase/pieces/bakery-page/index.html',
  height: 760,
  built: '2026-11-18',
  builtWith: 'Claude Opus 5.5 in Claude Code',
  prompt: `A one-page website for an invented neighbourhood bakery: what they bake, where they are, and above all when they are open. The opening hours are the point: the page shows whether the bakery is open right now and when it next opens or closes, a week view, and correct special hours on public holidays, from a small table of hours and holidays kept in one place in the code (a fixed set of invented special days plus fixed-date holidays). It must be right across midnight, at the end of the year and when the visitor's clock is in another time zone (the bakery has one stated time zone). Include a small "check a date" control so a visitor can see what the page says on any day. A real designed page with its own identity, illustration done in CSS or inline SVG.

Self-contained: no network requests, no remote fonts, works at 390px wide, from the keyboard, with reduced motion, in light and dark. Fictional content only.`,
  story: [
    'The agent started with the hours, not the page. Everything lives in one small file: the regular week, three fixed-date holidays and five invented special days at the top, the logic underneath. To make the hard cases real rather than theoretical, it gave the bakery a night hatch on Fridays and Saturdays from 22:00 to 01:00, and a New Year\'s Eve hatch that runs to 02:00 on New Year\'s Day, when the shop is otherwise shut. It wrote fourteen tests for that file before building any of the page, including both clock changes (one hatch closes at 01:00 on the night that hour does not exist). They passed on the first run, and again with the test machine set to four other time zones.',
    'The first look at the page in a browser was less tidy. On a desktop the opening times in the week view wrapped onto two lines, and the marker for the chosen day wrapped under the day name. On a phone the shopfront drawing sat above the open-or-closed status and pushed it below the fold, which defeats the point of the page; the status now comes first. The browser used for checking happened to be set to Central European time, so the line that says what time it is where you are got a real test.',
    'Driving the "check a date" form with a script found three wording bugs: it said "opens again today" at 02:30 when nothing had opened yet that day, it gave waits like "43 h", and on New Year\'s Day it read "last night\'s night hatch is still open". Each was fixed. The loaf illustration started as a CSS gradient that came out clipped and was redrawn as inline SVG.',
    'Still to improve: holidays that move, such as Easter, are not modelled, because the brief asked for fixed dates. The plan was to check the page with Playwright in several time zones and with a frozen clock; this session\'s permissions refused it, so the visual checks used a different browser tool and the other time zones rest on the unit tests.',
  ],
  example: 'holiday hours bug',
  order: 1,
};
