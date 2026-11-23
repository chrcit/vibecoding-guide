// Fig. 11, the effort dial. Per-effort Intelligence Index scores for two models, and the output
// tokens one of them wrote over the whole index run at each level. Every value is a prop.

export interface EffortInputs {
  /** Effort levels in order, lowest first. */
  levels: string[];
  /** Score per level for each model; null where the source has none. */
  models: { name: string; scores: (number | null)[] }[];
  /** Output tokens over the whole index run, per level, for one model. */
  tokens: { name: string; values: (number | null)[] };
  /** The level the dial starts on. */
  start: string;
}

const millions = (v: number) => `${Math.round(v / 1e5) / 10}M`;

function compare(tok: number, base: number, baseLevel: string) {
  const r = tok / base;
  if (r >= 1.95) return `${Math.round(r * 10) / 10} times as many as at ${baseLevel}`;
  return `${Math.round(r * 100 - 100)}% more than at ${baseLevel}`;
}

export function describe(i: number, x: EffortInputs): string {
  const level = x.levels[i]!;
  const none = (name: string) => `Artificial Analysis lists no ${level}-effort score for ${name}.`;
  const out: string[] = [];
  const [first, ...rest] = x.models;
  const tok = x.tokens.values[i];
  const base = x.tokens.values[0];
  if (first) {
    const s = first.scores[i];
    if (s == null) out.push(none(first.name));
    else {
      let line = `At ${level} effort, ${first.name} scores ${s} on the Intelligence Index`;
      if (tok != null) {
        line += ` and wrote ${millions(tok)} output tokens over the whole test run`;
        if (i > 0 && base != null) line += `, ${compare(tok, base, x.levels[0]!)}`;
      }
      out.push(`${line}.`);
    }
  }
  for (const m of rest) {
    const s = m.scores[i];
    out.push(s == null ? none(m.name) : `${m.name} scores ${s}.`);
  }
  return out.join(' ');
}
