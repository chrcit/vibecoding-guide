// The overview of part two: the same floor, widened, one short loop per chapter.
import type { Chapter, Ctx } from '../chapter';
import type { Script } from '../scene';
import { meter, demo as meterDemo } from './meter';
import { review, demo as reviewDemo } from './review';
import { proof, demo as proofDemo } from './proof';
import { turn, demo as turnDemo } from './turn';
import { jobsCh, demo as jobsDemo } from './jobs';
import { grow, demo as growDemo } from './grow';
import { people, demo as peopleDemo } from './people';
import { where, demo as whereDemo } from './where';

const again = (ctx: Ctx, fn: (ctx: Ctx, h: Script) => Promise<void>, pause = 1400) => void ctx.scene.run(async (h) => { for (;;) { await fn(ctx, h); await h.wait(pause); } });
const of = (ch: Chapter, demo: (ctx: Ctx, h: Script) => Promise<void>) => ({
  scene: (ctx: Ctx) => Object.values(ch.steps)[0]!.scene(ctx),
  enter: (ctx: Ctx) => again(ctx, demo),
});

export const week: Chapter = {
  steps: {
    meter: of(meter, meterDemo),
    review: of(review, reviewDemo),
    proof: of(proof, proofDemo),
    turn: of(turn, turnDemo),
    jobs: of(jobsCh, jobsDemo),
    grow: of(grow, growDemo),
    people: of(people, peopleDemo),
    where: of(where, whereDemo),
  },
};
