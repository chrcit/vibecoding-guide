// Overview of Part 1 (Foundations): one short interactive loop per foundational lesson.
import type { Chapter, Ctx } from '../chapter';
import type { Script } from '../scene';
import { rung } from '../rungs';
import { aiCh, demo as aiDemo } from './ai';
import { providersCh, demo as providersDemo } from './providers';
import { stackCh, demo as stackDemo } from './stack';
import { firstCh, demo as firstDemo } from './first';

// The lesson's short run, played once and then held at its end: a loop set the counter back to 0
// every few seconds while the reader was still reading, which looked like a bug. Back and Next, or
// coming back to the step, play it again.
const once = (ctx: Ctx, fn: (ctx: Ctx, h: Script) => Promise<void>) => void ctx.scene.run((h) => fn(ctx, h));

// `step` is the lesson step the demo plays, so the chip shows that step's number.
const of = (id: string, ch: Chapter, demo: (ctx: Ctx, h: Script) => Promise<void>, step?: string) => ({
  scene: (ctx: Ctx) => Object.values(ch.steps)[0]!.scene(ctx),
  counter: (step && ch.steps[step]?.counter) || ch.counter,
  speakers: ch.speakers,
  enter: (ctx: Ctx) => {
    const r = rung(id);
    ctx.model(`${r.n}. ${r.title}.`, r.adds[ctx.level]);
    once(ctx, demo);
  },
});

export const foundations: Chapter = {
  steps: {
    ai: of('ai', aiCh, aiDemo),
    providers: of('providers', providersCh, providersDemo, 'where'),
    stack: of('stack', stackCh, stackDemo),
    first: of('first', firstCh, firstDemo),
  },
};
