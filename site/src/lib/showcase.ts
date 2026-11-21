// The showcase: things built by an agent for this guide. Shared wiring owned by the lead.
// Each piece lives in src/showcase/<slug>.ts and exports `piece`.
export const categories = [
  { id: '3d', title: '3D playgrounds', blurb: 'Scenes you can turn, poke and change.' },
  { id: 'apps', title: 'Mini apps', blurb: 'Small working software for one job.' },
  { id: 'pages', title: 'Web pages', blurb: 'A designed page, built from a description.' },
  { id: 'automations', title: 'Automations and tools', blurb: 'A chore turned into a button.' },
] as const;
export type CategoryId = (typeof categories)[number]['id'];

export interface Piece {
  slug: string;
  title: string;
  category: CategoryId;
  /** One plain sentence. */
  summary: string;
  /** Where the piece runs, relative to the site root. An iframe shows it on the category page. */
  path: string;
  /** Height of the embed in px on wide screens. */
  height?: number;
  /** ISO date it was built. */
  built: string;
  /** What built it: model and harness, exactly as it happened. */
  builtWith: string;
  /** The prompt that started it, as given (private details removed). */
  prompt: string;
  /** How it went, in two to five short plain paragraphs: what was asked, what came back, what had to be corrected. Only what really happened. */
  story: string[];
  /** Running example it comes from, if any. */
  example?: 'club list' | 'holiday hours bug' | 'contact tidy';
  order?: number;
}

const mods = import.meta.glob<{ piece: Piece }>('../showcase/*.ts', { eager: true });
export const pieces: Piece[] = Object.values(mods)
  .map((m) => m.piece)
  .filter(Boolean)
  .sort((a, b) => (a.order ?? 99) - (b.order ?? 99) || a.title.localeCompare(b.title));
export const piecesIn = (c: CategoryId) => pieces.filter((p) => p.category === c);
