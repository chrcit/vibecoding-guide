// Chapter 12: proof you can read. Scaffold: the standing arrangement only. The storyboard is in site/JOURNEY.md.
import type { Chapter, Ctx } from '../chapter';
import type { Script } from '../scene';
import { solo, lab } from '../presets';

const base = () => solo({ tools: true, project: true, gate: true, tray: [{ id: 'sum' }, { id: 'tests', b: 'tool', mark: 'ok' }, { id: 'shot', b: 'tool', mark: 'new' }], labels: [lab('you', 'you', 'left'), lab('tray', 'what came back', 'bottom')] });

/** One short loop of this chapter, for the part-two overview. */
export async function demo(ctx: Ctx, h: Script) {
  h.set((s) => { Object.assign(s, base()); });
  await h.wait(1200);
}

export const proof: Chapter = {
  steps: {
    first: { scene: () => base() },
  },
};
