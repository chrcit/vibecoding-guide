// Overview of Part 3 (The working week): one short loop per chapter with level-aware mental-model notes.
import type { Chapter, Ctx } from '../chapter';
import type { Script } from '../scene';
import { rung } from '../rungs';
import { meter, demo as meterDemo } from './meter';
import { review, demo as reviewDemo } from './review';
import { proof, demo as proofDemo } from './proof';
import { turn, demo as turnDemo } from './turn';
import { jobsCh, demo as jobsDemo } from './jobs';
import { grow, demo as growDemo } from './grow';
import { people, demo as peopleDemo } from './people';
import { where, demo as whereDemo } from './where';

const again = (ctx: Ctx, fn: (ctx: Ctx, h: Script) => Promise<void>, pause = 1400) =>
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

export const week: Chapter = {
  steps: {
    meter: of('meter', meter, meterDemo),
    review: of('review', review, reviewDemo),
    proof: of('proof', proof, proofDemo),
    turn: of('turn', turn, turnDemo),
    jobs: of('jobs', jobsCh, jobsDemo),
    grow: of('grow', grow, growDemo),
    people: of('people', people, peopleDemo),
    where: of('where', where, whereDemo),
  },
};
