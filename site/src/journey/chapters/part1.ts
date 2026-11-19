// Small helpers shared by the four lessons of part one (ai, providers, stack, first).
import type { Ctx, StatPair } from '../chapter';
import { STEP_NOTES } from '../notes';

/** Show the step's note from notes.ts under the picture, at the reader's level. */
export function note(ctx: Ctx, chapter: string, step: string) {
  const n = STEP_NOTES[chapter]?.[step];
  if (n) ctx.model(n.part, n.text[ctx.level]);
  else ctx.model('', '');
}

/** One readout per lesson: the same names in the same order on every step. */
export const readout = (names: readonly string[]) => (ctx: Ctx, values: (string | number | [string | number, string])[]) =>
  ctx.stat(names.map((n, i) => {
    const v = values[i] ?? '–';
    return (Array.isArray(v) ? [n, v[0], v[1]] : [n, v]) as StatPair;
  }));

/** Pick by level, with technical and engineer falling back to plain. */
export const lv = (ctx: Ctx, plain: string, technical?: string, engineer?: string) =>
  ctx.level === 'engineer' ? (engineer ?? technical ?? plain) : ctx.level === 'technical' ? (technical ?? plain) : plain;
