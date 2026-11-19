// Chapter 13: your turn. Scaffold: the standing arrangement only. The storyboard is in site/JOURNEY.md.
import type { Chapter, Ctx } from '../chapter';
import type { Script } from '../scene';
import { solo, lab } from '../presets';

const base = () => solo({ tools: true, project: true, gate: 'wait', tray: [{ id: 'ask', mark: 'wait' }], labels: [lab('you', 'you', 'left'), lab('gate', 'a plan, waiting', 'right', 'wiki/plan-mode/'), lab('card:ask', 'a question', 'top')] });

/** One short loop of this chapter, for the part-two overview. */
export async function demo(ctx: Ctx, h: Script) {
  h.set((s) => { Object.assign(s, base()); });
  await h.wait(1200);
}

export const turn: Chapter = {
  steps: {
    first: { scene: () => base() },
  },
};
