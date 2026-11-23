// The flat fact registry. Every sourced value in src/data/ gets a stable
// dotted id from where it sits: `plans.claude.pro.price` is
// plans.claude.pro.price in plans.ts. Plain Node can import this file
// (scripts/check-facts.mjs does), so keep it free of Astro and Vite imports.
import { isFact, type Fact } from '../data/types.ts';
import { models, lineup } from '../data/models.ts';
import { plans } from '../data/plans.ts';
import { benchmarks } from '../data/benchmarks.ts';
import { t3code } from '../data/t3code.ts';
import { harnesses } from '../data/harnesses.ts';
import { skills, skillFacts } from '../data/skills.ts';
import { connectors } from '../data/connectors.ts';
import { observations } from '../data/observations.ts';
import { claims } from '../data/claims.ts';

export interface DataFile {
  /** The file in src/data/, without extension. */
  file: string;
  title: string;
  /** One line for the sources page. */
  about: string;
  /** Top-level names; each becomes the first part of the ids beneath it. */
  roots: Record<string, unknown>;
}

export const dataFiles: DataFile[] = [
  { file: 'models', title: 'Models', about: 'Release dates, context windows, API list prices and effort levels.', roots: { models, lineup } },
  { file: 'plans', title: 'Plans and limits', about: 'Subscription prices, what each includes, how limits work and what the API credit covers.', roots: { plans } },
  { file: 'benchmarks', title: 'Benchmarks', about: 'Artificial Analysis Intelligence Index and METR time horizons, each with the page it came from.', roots: { benchmarks } },
  { file: 't3code', title: 'T3 Code', about: 'What T3 Code does, from its README and user docs.', roots: { t3code } },
  { file: 'harnesses', title: 'Claude Code and Codex', about: 'Subagents, nesting, agent teams, MCP config, voice, skills and sandboxing in each harness.', roots: { harnesses } },
  { file: 'skills', title: 'Skills', about: 'Recommended skills with author, source and licence.', roots: { skills, skillFacts } },
  { file: 'connectors', title: 'MCP and connectors', about: 'How agents reach outside systems.', roots: { connectors } },
  { file: 'claims', title: 'Privacy, hosting and research', about: 'Privacy terms, hosting limits, price trends and studies the guides cite.', roots: { claims } },
  { file: 'observations', title: 'Observations and opinions', about: 'Attributed estimates and experience, and the owner\'s own dated opinions. Kept apart from the verified facts.', roots: { observations } },
];

export interface Entry extends Fact {
  id: string;
  /** Which data file it lives in. */
  file: string;
}

function walk(node: unknown, path: string, file: string, out: Entry[]) {
  if (isFact(node)) {
    out.push({ ...(node as Fact), id: path, file });
    return;
  }
  if (!node || typeof node !== 'object') return;
  for (const [k, v] of Object.entries(node)) walk(v, `${path}.${k}`, file, out);
}

/** Every fact, in file order. Duplicate ids are kept so the check can report them. */
export function allFacts(): Entry[] {
  const out: Entry[] = [];
  for (const f of dataFiles) for (const [name, root] of Object.entries(f.roots)) walk(root, name, f.file, out);
  return out;
}

let index: Map<string, Entry> | undefined;

/** One fact by id. Throws on an unknown id, so a typo fails the build. */
export function fact(id: string): Entry {
  index ??= new Map(allFacts().map((e) => [e.id, e]));
  const e = index.get(id);
  if (!e) throw new Error(`Unknown fact id "${id}". See src/data/ and the /sources/ page.`);
  return e;
}

/** The HTML id of a fact's row on the sources page. */
export const anchor = (id: string) => `f-${id.replace(/[^A-Za-z0-9_.-]/g, '-')}`;

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const MONTHS_LONG = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

/** 2026-11-18 → 18 Nov 2026 (or 18 November 2026 with `long`). */
export function formatDate(d: string, long = false): string {
  const [y, m, day] = d.split('-').map(Number);
  return `${day} ${(long ? MONTHS_LONG : MONTHS)[m - 1]} ${y}`;
}

const num = (n: number) => n.toLocaleString('en-GB', { maximumFractionDigits: 3 });

function usd(n: number): string {
  if (Number.isInteger(n)) return `$${num(n)}`;
  return `$${n.toLocaleString('en-GB', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

function tokens(n: number): string {
  if (n >= 1e6) return `${num(Math.round((n / 1e6) * 10) / 10)}M tokens`;
  if (n >= 1e3) return `${num(Math.round((n / 1e3) * 10) / 10)}K tokens`;
  return `${num(n)} tokens`;
}

function minutes(m: number): string {
  if (m < 1) return `${Math.round(m * 60)} seconds`;
  if (m < 90) return `${Math.round(m)} minutes`;
  return `${num(Math.round((m / 60) * 10) / 10)} hours`;
}

/** The value as a reader sees it: $4, 1M tokens, 22 Sep 2026, 5×. */
export function formatValue(f: Pick<Fact, 'value' | 'unit'>): string {
  const v = f.value;
  if (Array.isArray(v)) return v.map((x) => formatValue({ value: x, unit: f.unit })).join(', ');
  if (typeof v === 'boolean') return v ? 'yes' : 'no';
  if (typeof v === 'number') {
    switch (f.unit) {
      case 'usd': return usd(v);
      case 'tokens': return tokens(v);
      case 'minutes': return minutes(v);
      case 'days': return `${num(v)} days`;
      case 'multiplier': return `${num(v)}×`;
      case 'percent': return `${num(v)}%`;
      case 'wpm': return `${num(v)} words per minute`;
      default: return num(v);
    }
  }
  if (typeof v === 'string' && f.unit === 'date' && /^\d{4}-\d{2}-\d{2}$/.test(v)) return formatDate(v);
  return String(v);
}

/** The oldest `verified` date among some facts: the honest "last verified" for a page. */
export function oldestVerified(ids: string[]): string | undefined {
  return ids.map((id) => fact(id).verified).sort()[0];
}

/** The facts of one data file. */
export const factsIn = (file: string) => allFacts().filter((e) => e.file === file);
