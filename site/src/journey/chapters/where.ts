// Chapter 17: other machines. Scaffold: the standing arrangement only. The storyboard is in site/JOURNEY.md.
import type { Chapter, Ctx } from '../chapter';
import type { Script } from '../scene';
import { jobs, lab } from '../presets';

const base = () => jobs(3, { gap: 100, machines: ['laptop', 'box', 'cloud'], labels: [lab('you', 'you', 'left'), lab('zone:0', 'your laptop', 'bottom'), lab('zone:1', 'a computer that stays on', 'bottom', 'wiki/always-on-machine/'), lab('zone:2', 'the cloud', 'bottom')] });

/** One short loop of this chapter, for the part-two overview. */
export async function demo(ctx: Ctx, h: Script) {
  h.set((s) => { Object.assign(s, base()); });
  await h.wait(1200);
}

export const where: Chapter = {
  steps: {
    first: { scene: () => base() },
  },
};
