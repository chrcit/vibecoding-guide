// Chapter 16: other people. Scaffold: the standing arrangement only. The storyboard is in site/JOURNEY.md.
import type { Chapter, Ctx } from '../chapter';
import type { Script } from '../scene';
import { ship, lab } from '../presets';

const base = () => ship(1, { trees: true, people: ['peer', 'client', 'users'], labels: [lab('you', 'you', 'left'), lab('peer', 'a colleague', 'top'), lab('client', 'a client', 'bottom'), lab('user1', 'users', 'right'), lab('mgate', 'pull request', 'top', 'wiki/pull-request/'), lab('main', 'main', 'bottom', 'wiki/branch/')] });

/** One short loop of this chapter, for the part-two overview. */
export async function demo(ctx: Ctx, h: Script) {
  h.set((s) => { Object.assign(s, base()); });
  await h.wait(1200);
}

export const people: Chapter = {
  steps: {
    first: { scene: () => base() },
  },
};
