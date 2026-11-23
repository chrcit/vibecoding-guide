/* What a screen of the staff app gets from the shell: the stage's features, the mount's UI state and a few actions. */
import type { Features, Tab } from './stages';
import type { Promoter } from './data';

export interface Person { name: string; /** 'Bea · Bar', 'Owner' */ label: string; /** How a tap is signed: 'Bea', 'You'. */ short: string; initials: string }

export interface UI {
  tab: Tab;
  query: string;
  barView: 'low' | 'stock';
  open: Set<Promoter>;
  rota: { mode: 'idle' | 'from' | 'to'; from: string | null; to: string | null; asOther: boolean };
  gate: { step: 'email' | 'code'; email: string; error: string };
}

export interface Toast { text: string; sub?: string; kind?: 'ok' | 'note' | 'bad'; action?: { label: string; run: () => void }; ms?: number }

export interface Ctx {
  f: Features;
  ui: UI;
  me: () => Person;
  root: HTMLElement;
  /** Re-render the current screen; `foot: false` keeps the dock (and a focused input) as it is. */
  paint(opts?: { foot?: boolean }): void;
  toast(t: Toast): void;
  announce(s: string): void;
}

export interface Screen {
  /** The scrolling body. */
  html(c: Ctx): string;
  /** The thumb zone above the tab bar: search, the main action. */
  foot?(c: Ctx): string;
  click?(c: Ctx, t: HTMLElement): boolean | void;
  input?(c: Ctx, t: HTMLInputElement): void;
  submit?(c: Ctx, form: HTMLFormElement): void;
  /** Header title. */
  title: string;
}

/** A lesson's marker: drawn over the app, never part of it. */
export const marker = (text: string) => `<span class="st-marker-label">${text}</span>`;

export const emptyState = (icon: string, title: string, sub: string) =>
  `<div class="st-empty"><span class="st-empty-icon">${icon}</span><p class="st-empty-title">${title}</p><p class="st-empty-sub">${sub}</p></div>`;
