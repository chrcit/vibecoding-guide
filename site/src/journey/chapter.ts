// What a chapter of the journey is made of. A chapter is data and small scripts: the engine and
// the picture stay the same from the first chapter to the last.
import type { Scene } from './scene';
import type { SceneState } from './picture';

export interface Ctx {
  scene: Scene;
  /** One line under the drawing: who spoke and what they said. Pass null for a plain note. */
  say(who: string | null, text: string): void;
  /** The numbers under the drawing, as name and value pairs. */
  stat(pairs: [string, string | number][]): void;
  /** The chapter's own state. Emptied when the reader moves to another step. */
  mem: Record<string, any>;
  /** State that lasts for the whole chapter. */
  keep: Record<string, any>;
  /** Sourced numbers handed over by the page (built from site/src/data). */
  data: Record<string, any>;
}
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
