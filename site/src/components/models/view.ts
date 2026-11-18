// Read-only views over src/data/ for the model pages: which facts exist for a model, which can be
// shown (verified or observation), and the numbers the two figures need. Nothing here holds a value
// of its own; every number comes from the data files, so a new entry in models.ts gets a card and a
// row in the index with no page edits.
import { models, type Model } from '../../data/models.ts';
import { benchmarks } from '../../data/benchmarks.ts';
import { allFacts, type Entry } from '../../lib/facts.ts';

export type ModelId = keyof typeof models;
export const modelIds = Object.keys(models) as ModelId[];
export const getModel = (id: ModelId): Model => models[id] as Model;

let index: Map<string, Entry> | undefined;
const entries = () => (index ??= new Map(allFacts().map((e) => [e.id, e])));

/** 'shown' when a fact can go on a page, 'unverified' when it exists but could not be confirmed, 'missing' when there is none. */
export function state(id: string): 'shown' | 'unverified' | 'missing' {
  const e = entries().get(id);
  if (!e) return 'missing';
  return e.status === 'unverified' ? 'unverified' : 'shown';
}
export const shown = (id: string) => state(id) === 'shown';
export const entry = (id: string) => entries().get(id);

/** The fact id of a field on a model: fid('claude-opus-5-5', 'price.input'). */
export const fid = (m: string, path: string) => `models.${m}.${path}`;

export const labOrder = ['Anthropic', 'OpenAI', 'Google'] as const;

/** Models in the current line-up, grouped by lab, most expensive (per output token) first. */
export function currentByLab() {
  const current = modelIds.filter((id) => getModel(id).current);
  return labOrder
    .map((lab) => ({
      lab,
      ids: current.filter((id) => getModel(id).lab === lab).sort((a, b) => outputPrice(b) - outputPrice(a)),
    }))
    .filter((g) => g.ids.length);
}

/** Models kept in the data for older price comparisons. */
export const olderIds = () => modelIds.filter((id) => !getModel(id).current);

function outputPrice(id: ModelId) {
  const p = getModel(id).price;
  return p && shown(fid(id, 'price.output')) ? p.output.value : -1;
}

/** Where a model sits in its lab's current line-up, by price per output token (1 = the most expensive). */
export function familyPosition(id: ModelId) {
  const m = getModel(id);
  const group = currentByLab().find((g) => g.lab === m.lab);
  if (!m.current || !group || outputPrice(id) < 0) return undefined;
  const priced = group.ids.filter((x) => outputPrice(x) >= 0);
  return { rank: priced.indexOf(id) + 1, of: priced.length, lab: m.lab };
}

export const ordinal = (n: number) => ['first', 'second', 'third', 'fourth', 'fifth', 'sixth'][n - 1] ?? `${n}th`;
export const countWord = (n: number) => ['none', 'one', 'two', 'three', 'four', 'five', 'six'][n] ?? String(n);

type AaIndex = Record<string, { value: number; claim: string }>;
const aaIndex = benchmarks.aa.index as unknown as AaIndex;

/** The Artificial Analysis index score for a model, if the data has a shown one, with the effort it was measured at. */
export function indexScore(id: string) {
  const factId = `benchmarks.aa.index.${id}`;
  if (!shown(factId)) return undefined;
  const f = aaIndex[id]!;
  const effort = /at (\w+) effort/.exec(f.claim)?.[1];
  return { factId, value: f.value, effort };
}

/** Per-effort index scores and token totals, where the data has them. */
export function effortData() {
  const aa = benchmarks.aa as unknown as {
    opusByEffort: Record<string, { score: { value: number }; totalTokens: { value: number } }>;
    fableByEffort: Record<string, { value: number }>;
  };
  const levels = ['low', 'medium', 'high', 'xhigh', 'max'];
  const pick = (base: string, l: string, v: () => number) => (shown(`${base}.${l}`) ? v() : null);
  return {
    levels,
    opus: levels.map((l) => pick('benchmarks.aa.opusByEffort', `${l}.score`, () => aa.opusByEffort[l]!.score.value)),
    opusTokens: levels.map((l) => pick('benchmarks.aa.opusByEffort', `${l}.totalTokens`, () => aa.opusByEffort[l]!.totalTokens.value)),
    fable: levels.map((l) => (aa.fableByEffort[l] ? pick('benchmarks.aa.fableByEffort', l, () => aa.fableByEffort[l]!.value) : null)),
    ids: [
      ...levels.flatMap((l) => [`benchmarks.aa.opusByEffort.${l}.score`, `benchmarks.aa.opusByEffort.${l}.totalTokens`]),
      ...levels.filter((l) => aa.fableByEffort[l]).map((l) => `benchmarks.aa.fableByEffort.${l}`),
    ].filter(shown),
  };
}

/** Every shown fact id that belongs to one model: its own fields plus its benchmark score. */
export function modelFactIds(id: ModelId) {
  const own = allFacts().filter((e) => e.id.startsWith(`models.${id}.`) && e.status !== 'unverified').map((e) => e.id);
  const s = indexScore(id);
  return s ? [...own, s.factId] : own;
}

/** Props for Fig. 10: every model with a shown index score and shown prices. */
export function scorePoints(href: (id: string) => string) {
  return modelIds.flatMap((id) => {
    const m = getModel(id);
    const s = indexScore(id);
    if (!s || !m.price || !shown(fid(id, 'price.input')) || !shown(fid(id, 'price.output'))) return [];
    return [{ id, name: m.name, lab: m.lab, score: s.value, effort: s.effort, input: m.price.input.value, output: m.price.output.value, href: href(id) }];
  });
}

/** Fact ids behind Fig. 10, for a "last verified" line. */
export const scorePointIds = () =>
  modelIds.flatMap((id) => {
    const s = indexScore(id);
    return s ? [s.factId, fid(id, 'price.input'), fid(id, 'price.output')] : [];
  }).filter(shown);

/** Props for Fig. 11. The start is the API default effort of the model whose tokens are shown. */
export function effortInputs() {
  const d = effortData();
  const opus = getModel('claude-opus-5-5');
  return {
    levels: d.levels,
    models: [
      { name: opus.name, scores: d.opus },
      { name: getModel('claude-fable-5-2').name, scores: d.fable },
    ],
    tokens: { name: opus.name, values: d.opusTokens },
    start: opus.effort?.apiDefault?.value ?? d.levels[1]!,
  };
}
