// Chapter 15: the project grows. Scaffold: the standing arrangement only. The storyboard is in site/JOURNEY.md.
import type { Chapter, Ctx } from '../chapter';
import type { Script } from '../scene';
import { solo, lab } from '../presets';

const base = () => solo({ tools: true, project: { rules: 'plain', stacks: [3, 1, 4, 2, 5, 1], junk: [1, 0, 2, 0, 3, 0] }, gate: true, labels: [lab('you', 'you', 'left'), lab('project', 'your project')] });

/** One short loop of this chapter, for the part-two overview. */
export async function demo(ctx: Ctx, h: Script) {
  h.set((s) => { Object.assign(s, base()); });
  await h.wait(1200);
}

export const grow: Chapter = {
  steps: {
    first: { scene: () => base() },
  },
};
