// The sourced numbers the part-three overview scripts read (ctx.data), built from site/src/data.
// Pages that draw lesson pictures outside their own lesson (the home page, the library, the
// overviews' strips) hand this to the picture so every script finds what it needs.
import { models, lineup } from '../data/models';
import { plans } from '../data/plans';
import { t3code } from '../data/t3code';

const short = (name: string) => name.replace(/^Claude /, '');

export function overviewData() {
  const priced = Object.fromEntries((['claude-opus-5-5', 'claude-fable-5-2', 'gpt-6-2-sol'] as const).map((id) => {
    const p = models[id].price as { input: { value: number }; output: { value: number }; cacheRead?: { value: number } };
    return [id, { name: short(models[id].name), input: p.input.value, output: p.output.value, cacheRead: p.cacheRead?.value }];
  }));
  const builder = models['claude-opus-5-5'];
  const reviewer = models['gpt-6-2-sol'];
  return {
    models: priced, cacheWrite: lineup.cacheWrite5m.value, proPrice: plans.claude.pro.price.value,
    builder: short(builder.name), reviewer: short(reviewer.name), builderLab: builder.lab, reviewerLab: reviewer.lab,
    handoffCap: t3code.handoffCap.value,
  };
}
