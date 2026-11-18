// Reader levels: the ids, the words the reader sees, and a small helper API.
// The contract is in site/AGENTS.md ("Reader levels").
//
// Three things repeat a few of these values because they cannot import this
// file: the inline boot script (LevelBoot.astro), the markdown plugin
// (remark-levels.mjs, loaded by the Astro config) and levels.css. Change them
// together.

export const LEVELS = ['plain', 'technical', 'engineer'] as const;
export type Level = (typeof LEVELS)[number];
/** The levels a deeper block can be tagged with. */
export type DeeperLevel = Exclude<Level, 'plain'>;

export const DEFAULT_LEVEL: Level = 'plain';
/** localStorage key holding the reader's level. */
export const STORAGE_KEY = 'acg-level';
/** localStorage key set once the first-visit offer has been shown. */
export const OFFER_KEY = 'acg-level-offer';
/** CustomEvent fired on `document` when the level changes; `detail` is the level. */
export const LEVEL_EVENT = 'acg:level';

export interface LevelInfo {
  id: Level;
  /** Short name, used in the picker button and on deeper blocks. */
  label: string;
  /** The reader's own words, from the owner. */
  description: string;
  /** Title for a deeper block that has none. */
  defaultTitle: string;
}

export const levelInfo: Record<Level, LevelInfo> = {
  plain: {
    id: 'plain',
    label: 'Vibe coding',
    description: "I have no idea what I'm doing.",
    defaultTitle: 'The simple version',
  },
  technical: {
    id: 'technical',
    label: 'Technical',
    description: 'Some technical background. I use a terminal, know Git and basic deployment.',
    defaultTitle: 'More detail',
  },
  engineer: {
    id: 'engineer',
    label: 'Engineer',
    description: 'Serious engineer. Give me the full weight.',
    defaultTitle: 'The full detail',
  },
};

export function isLevel(value: unknown): value is Level {
  return typeof value === 'string' && (LEVELS as readonly string[]).includes(value);
}

/** 0 for plain, 1 for technical, 2 for engineer. */
export function rank(level: Level): number {
  return LEVELS.indexOf(level);
}

/** True when a reader at `reader` level gets material written for `block` open. */
export function covers(reader: Level, block: Level): boolean {
  return rank(reader) >= rank(block);
}

/** Lower-case, hyphenated id fragment. */
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 60);
}

/** Plain text from rendered HTML, for the two-line extract of a collapsed block. */
export function extractText(html: string, max = 320): string {
  const text = html
    .replace(/<(script|style|svg|button)[\s\S]*?<\/\1>/gi, ' ')
    .replace(/<\/(p|li|h[1-6]|tr|td|th|pre|div)>/gi, ' ')
    .replace(/<[^>]+>/g, '')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#(x?)([0-9a-f]+);/gi, (_, hex, n) => String.fromCodePoint(parseInt(n, hex ? 16 : 10)))
    .replace(/\s+/g, ' ')
    .trim();
  return text.length > max ? text.slice(0, max).replace(/\s+\S*$/, '') + '…' : text;
}

// ---------------------------------------------------------------------------
// Client side. These touch `document` and `localStorage`; call them in the browser only.

/** The level the page is showing now. */
export function getLevel(): Level {
  const value = document.documentElement.dataset.level;
  return isLevel(value) ? value : DEFAULT_LEVEL;
}

/** The level saved in this browser, or null when none is saved or storage is blocked. */
export function getSavedLevel(): Level | null {
  try {
    const value = localStorage.getItem(STORAGE_KEY);
    return isLevel(value) ? value : null;
  } catch {
    return null;
  }
}

interface Anchor {
  el: Element;
  top: number;
}

function visible(el: Element): boolean {
  if ('checkVisibility' in el) return (el as HTMLElement).checkVisibility({ contentVisibilityAuto: true });
  return !el.closest('[hidden]') && el.getClientRects().length > 0;
}

function headerBottom(): number {
  const bar = document.querySelector('header');
  const bottom = bar ? bar.getBoundingClientRect().bottom : 0;
  return Math.max(0, bottom);
}

const ANCHOR_CANDIDATES = 'h1, h2, h3, h4, h5, h6, p, li, pre, table, figure, blockquote, dt, dd, .deeper-toggle, .deeper-mark';

/** The first visible block the reader is looking at, just under the sticky header. */
function readingAnchor(): Anchor | null {
  const main = document.querySelector('main') ?? document.body;
  const line = headerBottom() + 4;
  // Prefer the first element that starts in view; a sliver of a paragraph
  // tucked under the header is a poor thing to hold still.
  let partial: Anchor | null = null;
  for (const el of main.querySelectorAll(ANCHOR_CANDIDATES)) {
    const rect = el.getBoundingClientRect();
    if (rect.bottom <= line || rect.height === 0) continue;
    if (rect.top > innerHeight) break;
    if (!visible(el)) continue;
    if (rect.top >= line - 8) return { el, top: rect.top };
    partial ??= { el, top: rect.top };
  }
  return partial;
}

/** After the level changed, scroll so the anchor (or the block that now hides it) sits where it was. */
function restoreAnchor(anchor: Anchor): void {
  let el: Element | null = anchor.el;
  while (el && !visible(el)) el = el.parentElement?.closest('.deeper') ?? null;
  if (!el) return;
  const delta = el.getBoundingClientRect().top - anchor.top;
  if (Math.abs(delta) > 1) window.scrollBy({ top: delta, behavior: 'instant' });
}

export interface SetLevelOptions {
  /** Save the level in this browser. Default true. */
  save?: boolean;
  /** Keep what the reader was looking at in place. Default true. */
  anchor?: boolean;
}

/**
 * Switch the page to `level`: updates `data-level` on <html>, saves it, fires
 * `acg:level` on `document`, and keeps the reader's place.
 */
export function setLevel(level: Level, { save = true, anchor = true }: SetLevelOptions = {}): void {
  if (!isLevel(level)) throw new Error(`Unknown reader level: ${String(level)}`);
  const root = document.documentElement;
  if (save) {
    try {
      localStorage.setItem(STORAGE_KEY, level);
    } catch {
      // Storage blocked: the level holds for this page view only.
    }
  }
  if (root.dataset.level === level) return;
  const place = anchor ? readingAnchor() : null;
  root.dataset.level = level;
  delete root.dataset.levelOverride;
  // Listeners (the deeper blocks, the picker, figures) run synchronously here.
  document.dispatchEvent(new CustomEvent<Level>(LEVEL_EVENT, { detail: level }));
  if (place) restoreAnchor(place);
}

/** Run `callback` whenever the level changes. Returns a function that stops listening. */
export function onLevel(callback: (level: Level) => void): () => void {
  const listener = (event: Event) => callback((event as CustomEvent<Level>).detail);
  document.addEventListener(LEVEL_EVENT, listener);
  return () => document.removeEventListener(LEVEL_EVENT, listener);
}

export interface AcgLevelApi {
  get(): Level;
  set(level: Level): void;
  levels: readonly Level[];
}

declare global {
  interface Window {
    acgLevel: AcgLevelApi;
  }
}

/** Expose `window.acgLevel.get()` and `.set(level)`. */
export function installGlobal(): void {
  window.acgLevel = { get: getLevel, set: (level) => setLevel(level), levels: LEVELS };
}
