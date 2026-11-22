// What a chapter of the journey is made of. A chapter is data and small scripts: the engine and
// the picture stay the same from the first chapter to the last.
import type { Scene } from './scene';
import type { SceneState } from './picture';
import type { Level } from '../lib/levels';
import type { ScreenApi } from './screen';

export type { Level };

/** Pick a value for the current reader level (plain = Vibe coding, technical, engineer). */
export function byLevel<T>(level: Level, variants: Record<Level, T>): T {
  return variants[level];
}

export interface Ctx {
  scene: Scene;
  /** Current reader level: 'plain' (Vibe coding), 'technical', or 'engineer'. */
  level: Level;
  /**
   * A line someone said, or (who = null) the guide's own line about the picture. A speaker with a
   * part on the picture (you, the model or a named model, the check, a tool, a helper, a colleague…)
   * gets a speech bubble at that part, which replaces the line before (overlay.ts). An empty
   * line with a speaker clears the bubble. Narration and speakers with no part on the picture
   * go in the narration line. Keep bubble text short: the bubble shows two lines.
   */
  say(who: string | null, text: string): void;
  /** Gone: the chat screen was removed. Every call does nothing until the chapters drop them. */
  screen: ScreenApi;
  /** Persistent note under the drawing explaining how this guide element joins the mental model. */
  model(part: string, text: string): void;
  /** The readout, in the step text, as a small table: [name, value] or [name, value, tag]. Its
   *  main number is also the counter chip on the picture (see CounterPin). See StatPair. */
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
 * - tag, optional: the assumption behind the number, a word or two: 'example', 'example hour',
 *   'cache on', 'Opus 5.5 prices'. Shown small beside the value. Put 'example' once per readout,
 *   on the first number that comes from a made-up job, and say in the line under the picture (or
 *   the step) that the job is made up. Readers took a "made-up" pill for placeholder data, so the
 *   pill never says "made-up" (run.ts turns an old 'made-up' tag into 'example').
 */
export type StatPair = [name: string, value: string | number, tag?: string];

/**
 * Which readout number the counter chip on the picture shows. A readout name, or its start
 * ('beat' pins "beat, this round"); the chip then reads the name up to its first comma and the
 * value: "beat round 1 · you ask". Or a function that writes the chip's words itself (null or ''
 * hides the chip). Without a pin the chip shows the first pair.
 */
export type CounterPin = string | ((pairs: StatPair[], ctx: Ctx) => string | null);

/**
 * Where a speaker stands on the picture, keyed by the speaker as the script names it in
 * ctx.say (any case): the anchor name a label takes ('you', 'a0', 'gate', 'r0', 'tool:run',
 * 'card:<id>', 'peer', 'client', 'user0', 'gear:<id>', …), or null for the narration line.
 * Adds to the shared map in overlay.ts (SPEAKERS); needed only for speakers it does not know.
 */
export type Speakers = Record<string, string | null>;

export interface StepDef {
  scene(ctx: Ctx): SceneState;
  /** Runs when the step comes into view, after its scene is set. */
  enter?(ctx: Ctx): void;
  /** This step's counter, when it differs from the chapter's. */
  counter?: CounterPin;
  /** This step's speakers, on top of the chapter's. */
  speakers?: Speakers;
}
export interface Chapter {
  steps: Record<string, StepDef>;
  /** The readout number the counter chip shows on every step. Default: the first pair. */
  counter?: CounterPin;
  /** Speakers the shared map does not place. */
  speakers?: Speakers;
  /** Buttons: <button data-do="name" data-val="…">. */
  actions?: Record<string, (ctx: Ctx, val: string, el: HTMLElement) => void>;
  /** Sliders and selects: <input data-bind="name">. */
  inputs?: Record<string, (ctx: Ctx, val: string, el: HTMLElement) => void>;
}
