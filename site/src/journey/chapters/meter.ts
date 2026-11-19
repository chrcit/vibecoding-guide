// Chapter 10: what it draws from. Scaffold: the standing arrangement only. The storyboard is in site/JOURNEY.md.
import type { Chapter, Ctx } from '../chapter';
import type { Script } from '../scene';
import { solo, lab } from '../presets';

const base = () => solo({ tools: true, project: true, meter: 'plan', labels: [lab('you', 'you', 'left'), lab('a0', 'the model', 'top', 'wiki/model/'), lab('meter:m0', 'a plan', 'top', 'wiki/subscription-plan/')] });

/** One short loop of this chapter, for the part-two overview. */
export async function demo(ctx: Ctx, h: Script) {
  h.set((s) => { Object.assign(s, base()); });
  await h.wait(1200);
}

export const meter: Chapter = {
  steps: {
    first: { scene: () => base() },
  },
};
