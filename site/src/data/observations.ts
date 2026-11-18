// Observations: dated, attributed estimates and experience, kept apart from
// the verified facts. A page shows these in an <Estimate> or <Opinion> box,
// never as the guide's own claim.
import { CHECKED, type Fact } from './types.ts';

export interface Estimate {
  person: string;
  personUrl: string;
  /** The video or post, cited by URL. */
  url: string;
  /** When the video or post was published. */
  published: string;
  /** Where in the video, if it is one. */
  at?: string;
  fact: Fact<string>;
}

const THEO = 'https://www.youtube.com/@theo';

const theo = (id: string, published: string, at: string, value: string, claim: string): Estimate => {
  const url = `https://www.youtube.com/watch?v=${id}`;
  return {
    person: 'Theo',
    personUrl: THEO,
    url,
    published,
    at,
    fact: { value, claim, source: url, verified: CHECKED, status: 'observation', note: `Theo's own estimate, at ${at} in the video of ${published}.` },
  };
};

/** What a subscription is worth in API dollars, according to people who measure it in public. */
export const estimates = {
  'theo-2026-10-02-claude-200': theo(
    'D8PikZ1KhUo',
    '2026-10-02',
    '6:09',
    '$8,000 a month',
    'A $200 Claude plan gets you around $8,000 of tokens a month at API prices, of which only $4,000 can be Fable because of the separate Fable limit.',
  ),
  'theo-2026-11-02-ultra': theo(
    'y5TEATUDDfc',
    '2026-11-02',
    '5:05',
    '$12,000 a month',
    'The $200 Claude subscription is "$200 in, $12,000 out": about $12,000 of API-priced tokens a month.',
  ),
  'theo-2026-11-03-compare-200': theo(
    'Hq2c7pww1Ds',
    '2026-11-03',
    '4:06',
    '$6,000 vs $4,300',
    'With the 50% Fable cap, the $200 Claude plan gets about $6,000 of usage a month and the $200 OpenAI plan about $4,300.',
  ),
  'theo-2026-11-10-multiplier': theo(
    'yh5IAUow4Hc',
    '2026-11-10',
    '26:27',
    '73×',
    'Using only Opus 5.5, the $200 Claude plan returns about 73 times its price in API-priced usage; using only Fable it drops to about 15 times.',
  ),
  'theo-2026-11-13-claude-100': theo(
    'XtykeVoSmP8',
    '2026-11-13',
    '3:03',
    '$3,000–5,000',
    'A $100 Claude subscription gets "like three to five grand" of API-priced usage.',
  ),
} satisfies Record<string, Estimate>;

/** Other attributed experience: public cases and the first version's own readings. */
export const experience = {
  tsRustWeeks: {
    value: '$2,500 a week',
    claim: 'In the ts-rust write-up, about $24,000 of API-priced usage came to roughly 9.5 weeks of a $200 plan\'s limit: about $2,500 a week at list price.',
    source: 'https://github.com/pingdotgg/ts-rust',
    verified: CHECKED,
    status: 'observation',
    note: 'One project, the author\'s own numbers.',
  },
  tsRust: {
    value: '$24,000 on Opus 5.5 after $400,000 stalled',
    claim: 'A Rust port of the TypeScript 7 compiler: over $400,000 of API-priced tokens with GPT-5.6 Sol and GPT-6 Astra stalled near 84% compatibility; Opus 5.5 restarted, had a working version in 10 hours and finished over two weeks for about $24,000. One author\'s project and numbers.',
    source: 'https://github.com/pingdotgg/ts-rust',
    verified: CHECKED,
    status: 'observation',
  },
  oneAfternoon: {
    value: '$30 / $150 per five hours',
    claim: 'One account on one afternoon: the usage meter suggested roughly $30 of API-priced usage per five-hour window on Claude Pro and roughly $150 on Max.',
    source: 'https://support.claude.com/en/articles/11647753',
    verified: CHECKED,
    status: 'observation',
    note: 'The source is the limits page, which publishes no such figure; the reading is the first version\'s own.',
  },
  runLength: {
    value: '30 to 60 minutes',
    claim: 'In the guide\'s own use, runs of 30 to 60 minutes without input are routine, and longer ones work when the agent can check itself.',
    source: 'https://code.claude.com/docs/en/best-practices',
    verified: CHECKED,
    status: 'observation',
    note: 'Working experience, not a measurement.',
  },
  parallelThreads: {
    value: 'three to five',
    claim: 'In the guide\'s own use, past three to five parallel threads the agents start waiting on you and review quality drops.',
    source: 'https://code.claude.com/docs/en/best-practices',
    verified: CHECKED,
    status: 'observation',
    note: 'Working experience, not a measurement.',
  },
  linuxFaster: {
    value: 'felt faster',
    claim: 'Linux has felt faster for agentic work in the guide\'s own use. No controlled benchmark was found.',
    source: 'https://github.com/chrcit/vibecoding-guide',
    verified: CHECKED,
    status: 'observation',
    note: 'The solid argument for a Linux box is that it stays on.',
  },
} satisfies Record<string, Fact<string>>;

/**
 * The owner's own opinions, the only opinions the guide carries. Shown in an
 * <Opinion> box with the date. Add one only when the owner gives it.
 */
export const opinions = {
  design: {
    value: 'Claude is better at design work.',
    claim: "The guide owner's opinion (18 November 2026): Claude is better at design work.",
    source: 'https://github.com/chrcit/vibecoding-guide',
    verified: '2026-11-18',
    status: 'observation',
    note: 'Opinion of the guide owner.',
  },
  decisions: {
    value: 'The current class of Fable 5.2 and Opus 5.5 is better at high-level decision making.',
    claim: "The guide owner's opinion (18 November 2026): the current class of Fable 5.2 and Opus 5.5 is better at high-level decision making.",
    source: 'https://github.com/chrcit/vibecoding-guide',
    verified: '2026-11-18',
    status: 'observation',
    note: 'Opinion of the guide owner.',
  },
} satisfies Record<string, Fact<string>>;

export const observations = { estimates, experience, opinions };
