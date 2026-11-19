// What a chapter of the journey is made of. A chapter is data and small scripts: the engine and
// the picture stay the same from the first chapter to the last.
import type { Scene } from './scene';
import type { SceneState } from './picture';
import type { Level } from '../lib/levels';

export type { Level };

/** Pick a value for the current reader level (plain = Vibe coding, technical, engineer). */
export function byLevel<T>(level: Level, variants: Record<Level, T>): T {
  return variants[level];
}

export interface Ctx {
  scene: Scene;
  /** Current reader level: 'plain' (Vibe coding), 'technical', or 'engineer'. */
  level: Level;
  /** One line under the drawing: who spoke and what they said. Pass null for a plain note. */
  say(who: string | null, text: string): void;
  /** Persistent note under the drawing explaining how this guide element joins the mental model. */
  model(part: string, text: string): void;
  /** The readout under the drawing: [name, value] or [name, value, tag]. See StatPair. */
  stat(pairs: StatPair[]): void;
  /** The chapter's own state. Emptied when the reader moves to another step. */
  mem: Record<string, any>;
  /** State that lasts for the whole chapter. */
  keep: Record<string, any>;
  /** Sourced numbers handed over by the page (built from site/src/data). */
  data: Record<string, any>;
}
/**
 * One number in the readout.
 * - name says what is counted and over what: "tasks on main, this run", "tokens read, all turns",
 *   "agents waiting for you, this hour". A gauge says what it measures: "the lead's window".
 * - value: a count towards its total ("4 of 6"), a window as "22% full", money with its unit.
 *   A counter only goes up within a run. When a control restarts the run, set it back to 0: the
 *   readout flashes, so the reader sees the restart (a value with % is a gauge and does not flash).
 * - tag, optional: the assumption behind the number, a word or two: 'made-up', 'cache on',
 *   'Opus 5.5 prices'. Shown small beside the value. Say "made-up" once per readout, on the first
 *   number it applies to.
 */
export type StatPair = [name: string, value: string | number, tag?: string];

export interface StepDef {
  scene(ctx: Ctx): SceneState;
  /** Runs when the step comes into view, after its scene is set. */
  enter?(ctx: Ctx): void;
}
export interface Chapter {
  steps: Record<string, StepDef>;
  /** Buttons: <button data-do="name" data-val="…">. */
  actions?: Record<string, (ctx: Ctx, val: string, el: HTMLElement) => void>;
  /** Sliders and selects: <input data-bind="name">. */
  inputs?: Record<string, (ctx: Ctx, val: string, el: HTMLElement) => void>;
}
