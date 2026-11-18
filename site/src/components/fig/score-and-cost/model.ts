// Fig. 10, score against cost. One point per model: an Artificial Analysis Intelligence Index score
// against the list price per million output tokens. Every value arrives as a prop from src/data/.

export interface ScorePoint {
  id: string;
  name: string;
  lab: string;
  score: number;
  /** The effort level the score was measured at, if the source says. */
  effort?: string;
  /** List price per million input and output tokens, in dollars. */
  input: number;
  output: number;
  /** The model's card. */
  href: string;
}

const usd = (n: number) => (Number.isInteger(n) ? `$${n}` : `$${n.toFixed(2)}`);

/** The readout for one selected point, in full sentences. */
export function describe(p: ScorePoint, all: ScorePoint[]): string {
  const at = p.effort ? `, measured at ${p.effort} effort` : '';
  const same = all.filter((o) => o !== p && o.output === p.output).map((o) => o.name);
  const twin = same.length ? ` ${same.join(' and ')} ${same.length > 1 ? 'have' : 'has'} the same output price.` : '';
  return `${p.name}, from ${p.lab}, scores ${p.score} on the Intelligence Index${at}. Through the API it costs ${usd(p.input)} per million input tokens and ${usd(p.output)} per million output tokens.${twin}`;
}

/** Order the points for the Previous and Next buttons: by lab, then from cheapest to dearest. */
export function order(points: ScorePoint[]): ScorePoint[] {
  const labs = [...new Set(points.map((p) => p.lab))];
  return [...points].sort((a, b) => labs.indexOf(a.lab) - labs.indexOf(b.lab) || a.output - b.output || a.score - b.score);
}
