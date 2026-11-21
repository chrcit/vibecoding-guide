// Overview of Part 1 (Foundations): one short interactive loop per foundational lesson.
import type { Chapter, Ctx } from '../chapter';
import type { Script } from '../scene';
import { rung } from '../rungs';
import { aiCh, demo as aiDemo } from './ai';
import { providersCh, demo as providersDemo } from './providers';
import { stackCh, demo as stackDemo } from './stack';
import { firstCh, demo as firstDemo } from './first';

const again = (ctx: Ctx, fn: (ctx: Ctx, h: Script) => Promise<void>, pause = 1600) =>
  void ctx.scene.run(async (h) => {
    for (;;) {
      await fn(ctx, h);
      await h.wait(pause);
    }
  });

const of = (id: string, ch: Chapter, demo: (ctx: Ctx, h: Script) => Promise<void>) => ({
  scene: (ctx: Ctx) => Object.values(ch.steps)[0]!.scene(ctx),
  enter: (ctx: Ctx) => {
    const r = rung(id);
    ctx.model(`${r.n}. ${r.title}.`, r.adds[ctx.level]);
    again(ctx, demo);
  },
});

export const foundations: Chapter = {
  steps: {
    ai: of('ai', aiCh, aiDemo),
    providers: of('providers', providersCh, providersDemo),
    stack: of('stack', stackCh, stackDemo),
    first: of('first', firstCh, firstDemo),
  },
};
