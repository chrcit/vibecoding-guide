// Chapter 14: several jobs. Scaffold: the standing arrangement only. The storyboard is in site/JOURNEY.md.
import type { Chapter, Ctx } from '../chapter';
import type { Script } from '../scene';
import { jobs, lab } from '../presets';

const base = () => jobs(3, { labels: [lab('you', 'you', 'left'), lab('tray', 'the board', 'bottom'), lab('main', 'main', 'bottom', 'wiki/branch/')] });

/** One short loop of this chapter, for the part-two overview. */
export async function demo(ctx: Ctx, h: Script) {
  h.set((s) => { Object.assign(s, base()); });
  await h.wait(1200);
}

export const jobsCh: Chapter = {
  steps: {
    first: { scene: () => base() },
  },
};
