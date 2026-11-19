// Chapter 11: a second model. Scaffold: the standing arrangement only. The storyboard is in site/JOURNEY.md.
import type { Chapter, Ctx } from '../chapter';
import type { Script } from '../scene';
import { solo, lab } from '../presets';

const base = () => solo({ tools: true, project: true, gate: true, reviewer: true, labels: [lab('you', 'you', 'left'), lab('a0', 'builds', 'top'), lab('r0', 'reviews', 'top', 'wiki/review/'), lab('gate', 'check', 'right', 'wiki/verification/')] });

/** One short loop of this chapter, for the part-two overview. */
export async function demo(ctx: Ctx, h: Script) {
  h.set((s) => { Object.assign(s, base()); });
  await h.wait(1200);
}

export const review: Chapter = {
  steps: {
    first: { scene: () => base() },
  },
};
