/*
 * The Lantern's app before launch: every page, the helper that checked it, and what the helper
 * changed. Twelve helpers take two pages each and check each page three ways: on a phone in light
 * mode, on a phone in dark mode, and with the keyboard alone. All made up.
 */
export type Check = 'light' | 'dark' | 'keys';
export const CHECKS: Check[] = ['light', 'dark', 'keys'];
export const CHECK_LABEL: Record<Check, string> = { light: 'Phone · light', dark: 'Phone · dark', keys: 'Keyboard only' };

/** How a page is laid out, for its schematic thumbnail. */
export type Layout = 'list' | 'form' | 'scan' | 'dash' | 'ticket' | 'profile' | 'grid' | 'empty' | 'invite';
/** What a fix looked like, for the before/after schematic. */
export type FixKind = 'contrast' | 'focus' | 'clip' | 'overlap' | 'label' | 'border' | 'tag';

export interface Fix { check: Check; what: string; kind: FixKind }

export interface Page {
  path: string;
  title: string;
  /** Helper number, 1–12. */
  helper: number;
  /** The door and bar pages are dark in both modes: they are used in a dark room. */
  theme: 'light' | 'dark';
  layout: Layout;
  fixes?: Fix[];
  /** Changed the most: the reader should look at it themselves. */
  look?: boolean;
}

export const DOOR = '/door';

export const PAGES: Page[] = [
  { path: '/door', title: 'Door · search and check in', helper: 3, theme: 'dark', layout: 'list', look: true,
    fixes: [{ check: 'dark', what: 'Contrast raised on the list tags', kind: 'tag' }] },
  { path: '/door/late', title: 'Door · after 02:00', helper: 3, theme: 'dark', layout: 'list',
    fixes: [{ check: 'keys', what: 'Focus ring added to Check in', kind: 'focus' }] },
  { path: '/door/scan', title: 'Door · scan a ticket', helper: 4, theme: 'dark', layout: 'scan' },
  { path: '/door/close', title: 'Door · close the night', helper: 4, theme: 'dark', layout: 'dash' },
  { path: '/tickets', title: 'Tickets · Friday 28 November', helper: 1, theme: 'light', layout: 'ticket', look: true,
    fixes: [
      { check: 'light', what: 'Contrast on the Buy button raised', kind: 'contrast' },
      { check: 'keys', what: 'Quantity stepper reachable with Tab', kind: 'focus' },
    ] },
  { path: '/tickets/mine', title: 'My tickets', helper: 1, theme: 'light', layout: 'profile' },
  { path: '/sales', title: 'Sales tonight', helper: 2, theme: 'light', layout: 'dash',
    fixes: [{ check: 'dark', what: 'Chart lines no longer fade into the dark background', kind: 'contrast' }] },
  { path: '/bar', title: 'Bar · open tabs', helper: 5, theme: 'dark', layout: 'list' },
  { path: '/bar/order', title: 'Bar · new order', helper: 5, theme: 'dark', layout: 'form', look: true,
    fixes: [{ check: 'light', what: 'Total no longer hidden under the keypad at phone size', kind: 'overlap' }] },
  { path: '/rota', title: 'Rota · this week', helper: 6, theme: 'light', layout: 'grid' },
  { path: '/promoters', title: 'Promoters', helper: 7, theme: 'light', layout: 'list' },
  { path: '/p/kai', title: 'Kai’s list', helper: 7, theme: 'light', layout: 'list', look: true,
    fixes: [{ check: 'light', what: 'Long names wrap instead of being cut off', kind: 'clip' }] },
  { path: '/p/noor', title: 'Noor’s list', helper: 8, theme: 'light', layout: 'list' },
  { path: '/i/ana', title: 'Invite · Ana Lopez', helper: 8, theme: 'light', layout: 'invite', look: true,
    fixes: [{ check: 'dark', what: 'QR code given a white border so it scans in dark mode', kind: 'border' }] },
  { path: '/i/lea', title: 'Invite · Lea Brandt', helper: 9, theme: 'light', layout: 'invite' },
  { path: '/guests', title: 'Guest list', helper: 9, theme: 'light', layout: 'list' },
  { path: '/guests/import', title: 'Import guests', helper: 10, theme: 'light', layout: 'form', look: true,
    fixes: [
      { check: 'keys', what: 'Choose file reachable with Tab and Enter', kind: 'focus' },
      { check: 'dark', what: 'Drop zone border visible in dark mode', kind: 'contrast' },
    ] },
  { path: '/guests/blocked', title: 'Do-not-admit list', helper: 10, theme: 'light', layout: 'list' },
  { path: '/night', title: 'The Lantern’s birthday', helper: 2, theme: 'light', layout: 'ticket' },
  { path: '/night/edit', title: 'Edit the night', helper: 11, theme: 'light', layout: 'form',
    fixes: [{ check: 'keys', what: 'Doors-open field given a label screen readers announce', kind: 'label' }] },
  { path: '/staff', title: 'Staff', helper: 6, theme: 'light', layout: 'profile' },
  { path: '/settings', title: 'Settings', helper: 11, theme: 'light', layout: 'form' },
  { path: '/login', title: 'Sign in', helper: 12, theme: 'light', layout: 'form' },
  { path: '/404', title: 'Not found', helper: 12, theme: 'light', layout: 'empty' },
];

/** What a passing check looked at, so a pass says something. */
export const PASS_NOTE: Record<Check, string> = {
  light: 'Text readable, nothing cut off at 390 px',
  dark: 'Colours hold up, nothing disappears',
  keys: 'Every control reachable in order, focus visible',
};

/**
 * Stage 'running': how many of its six checks (two pages × three) each helper has finished.
 * Index 0 is H1. A helper works through its first page, then its second.
 */
export const RUN_PROGRESS = [4, 3, 2, 5, 3, 4, 1, 3, 6, 2, 3, 4];
