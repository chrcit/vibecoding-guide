// Build-time payload for the models board and the model cards. Every number here is read from
// src/data/ through the fact registry, with the id of its fact so the page can link it to its
// source. A field the data does not have, or has but could not confirm, becomes a gap with the
// reason; it is never a zero.
import { anchor, formatValue } from '../../lib/facts.ts';
import { modelIds, getModel, fid, state, entry as _entry, indexScore, effortData, type ModelId } from './view';
import { benchmarks } from '../../data/benchmarks.ts';
import type { Cell, LabModel, MetricKey, Klass } from '../fig/model-lab/model';

export { anchor };

/** The source row of a fact on the sources page, as a site path (pass through url()). */
export const sourcePath = (id: string) => `sources/#${anchor(id)}`;

function cell(id: string, toNumber: (v: unknown) => number = Number): Cell {
  const s = state(id);
  if (s === 'missing') return { gap: 'not published' };
  if (s === 'unverified') return { gap: 'not confirmed' };
  const e = _entry(id)!;
  return { v: toNumber(e.value), id, text: formatValue(e) };
}

const day = (v: unknown) => Math.round(Date.parse(String(v)) / 864e5);

function outputPrice(id: ModelId) {
  const c = cell(fid(id, 'price.output'));
  return 'v' in c ? c.v : -1;
}

/** Place in its lab's current line-up, by price per output token; older models are 'older'. */
function klassOf(id: ModelId): Klass {
  const m = getModel(id);
  if (!m.current) return 'older';
  const peers = modelIds.filter((x) => getModel(x).current && getModel(x).lab === m.lab && outputPrice(x) >= 0)
    .sort((a, b) => outputPrice(b) - outputPrice(a));
  const i = peers.indexOf(id);
  if (i < 0) return 'middle';
  if (i === 0) return 'dearest';
  if (i === peers.length - 1) return 'cheapest';
  return 'middle';
}

const HARNESS_NAME = { claudeCode: 'Claude Code', codex: 'Codex' } as const;

/** One row per model in models.ts, for the lab, the compare tile and the cost lab. */
export function labModels(card: (id: string) => string): LabModel[] {
  return modelIds.map((id) => {
    const m = getModel(id);
    const score = indexScore(id);
    const cells: Record<MetricKey, Cell> = {
      score: score ? cell(score.factId) : { gap: 'not published' },
      input: cell(fid(id, 'price.input')),
      output: cell(fid(id, 'price.output')),
      cacheRead: cell(fid(id, 'price.cacheRead')),
      context: cell(fid(id, 'context')),
      maxOutput: cell(fid(id, 'maxOutput')),
      released: cell(fid(id, 'released'), day),
    };
    const lp = m.price?.longPrompt;
    return {
      id,
      name: m.name,
      lab: m.lab,
      klass: klassOf(id),
      card: card(id),
      cells,
      scoreEffort: score?.effort,
      text: {
        effortLevels: cell(fid(id, 'effort.levels')),
        apiDefault: cell(fid(id, 'effort.apiDefault')),
        harness: m.harness ? { text: HARNESS_NAME[m.harness], id: `harnesses.${m.harness}.models` } : undefined,
      },
      longPrompt: lp && state(fid(id, 'price.longPrompt.threshold')) === 'shown' ? { id: fid(id, 'price.longPrompt.threshold'), text: formatValue(_entry(fid(id, 'price.longPrompt.threshold'))!) } : undefined,
    };
  });
}

/** Every fact id the lab shows, for the "last verified" line. */
export function labFactIds(rows: LabModel[]) {
  const ids = new Set<string>();
  for (const r of rows) {
    for (const c of Object.values(r.cells)) if ('id' in c) ids.add(c.id);
    for (const c of [r.text.effortLevels, r.text.apiDefault]) if ('id' in c) ids.add(c.id);
    if (r.text.harness) ids.add(r.text.harness.id);
  }
  return [...ids];
}

/** Props for Fig. 61: every model with a shown input and output price. */
export function priceRows(rows: LabModel[]) {
  return rows.flatMap((r) => {
    const i = r.cells.input, o = r.cells.output, c = r.cells.cacheRead;
    if (!('v' in i) || !('v' in o)) return [];
    return [{ id: r.id, name: r.name, lab: r.lab, card: r.card, input: i.v, output: o.v, cacheRead: 'v' in c ? c.v : undefined, longPrompt: r.longPrompt?.text }];
  });
}

/** Output multiplier per effort level against `base`, from Opus 5.5's whole-run token totals. */
export function effortRatio(base: string) {
  const d = effortData();
  const at = d.levels.indexOf(base);
  const b = d.opusTokens[at];
  return {
    levels: d.levels,
    base,
    model: getModel('claude-opus-5-5').name,
    ratio: d.opusTokens.map((t) => (t != null && b != null ? Math.round((t / b) * 100) / 100 : null)),
  };
}

/** Release dates for Fig. 62: confirmed ones from models.ts, and METR's state-of-the-art models. */
export function releases(card: (id: string) => string, source: (id: string) => string) {
  const p50 = benchmarks.metr.p50 as Record<string, { name: string; released: string }>;
  const own = modelIds.flatMap((id) => {
    const c = cell(fid(id, 'released'), day);
    return 'v' in c ? [{ name: getModel(id).name, day: c.v, kind: 'current' as const, href: card(id) }] : [];
  });
  const metr = Object.entries(p50).flatMap(([k, p]) =>
    state(`benchmarks.metr.p50.${k}.minutes`) === 'shown' ? [{ name: p.name, day: day(p.released), kind: 'metr' as const, href: source(`benchmarks.metr.p50.${k}.minutes`) }] : []);
  const unconfirmed = modelIds.filter((id) => state(fid(id, 'released')) === 'unverified').map((id) => ({ name: getModel(id).name, href: card(id) }));
  return { list: [...metr, ...own], unconfirmed, ids: [...own.map((o) => fid(modelIds.find((id) => getModel(id).name === o.name)!, 'released')), ...Object.keys(p50).map((k) => `benchmarks.metr.p50.${k}.minutes`)].filter((i) => state(i) === 'shown') };
}

export const dayOf = day;
