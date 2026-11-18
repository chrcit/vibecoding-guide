// Recommended skills, with author credit, source and licence, plus the facts
// about the skill format itself.
import { fact, unverified, type Fact } from './types.ts';

export interface Skill {
  name: string;
  author: string;
  authorUrl: string;
  url: string;
  licence: Fact<string>;
  install?: string;
  what: Fact<string>;
}

export const skills = {
  humanizer: {
    name: 'Humanizer',
    author: 'blader',
    authorUrl: 'https://github.com/blader',
    url: 'https://github.com/blader/humanizer',
    install: 'npx skills add blader/humanizer',
    licence: fact('MIT', 'Humanizer is MIT-licensed.', 'https://github.com/blader/humanizer'),
    what: fact('rewrites AI-sounding text', 'Humanizer rewrites AI-sounding text, built on Wikipedia\'s "Signs of AI writing".', 'https://github.com/blader/humanizer'),
  },
  'grill-me': {
    name: 'Grill Me',
    author: 'Matt Pocock',
    authorUrl: 'https://github.com/mattpocock',
    url: 'https://github.com/mattpocock/skills',
    install: 'npx skills add mattpocock/skills',
    licence: fact('MIT', "Matt Pocock's skills collection is MIT-licensed.", 'https://github.com/mattpocock/skills'),
    what: fact(
      'interviews you about a plan',
      'grill-me: "Get relentlessly interviewed about a plan or design until every branch of the design tree is resolved." You invoke it yourself.',
      'https://github.com/mattpocock/skills',
    ),
  },
  grilling: {
    name: 'Grilling',
    author: 'Matt Pocock',
    authorUrl: 'https://github.com/mattpocock',
    url: 'https://github.com/mattpocock/skills',
    install: 'npx skills add mattpocock/skills',
    licence: fact('MIT', "grilling is in the same MIT-licensed collection as grill-me.", 'https://github.com/mattpocock/skills'),
    what: fact(
      'the interview routine the agent can call',
      'grilling is the model-invoked interview routine behind grill-me and several other skills in the same collection: the agent can reach for it on its own.',
      'https://github.com/mattpocock/skills',
    ),
  },
  'be-ambitious': {
    name: 'Be Ambitious',
    author: 'robonuggets',
    authorUrl: 'https://github.com/robonuggets',
    url: 'https://github.com/robonuggets/be-ambitious',
    licence: fact('MIT', 'The robonuggets be-ambitious skill is MIT-licensed.', 'https://github.com/robonuggets/be-ambitious'),
    what: fact(
      'turns the article into steps',
      "robonuggets/be-ambitious turns Felix Rieseberg's article into steps the agent follows (altitude, depth and range) and credits him for the ideas.",
      'https://github.com/robonuggets/be-ambitious',
    ),
  },
} satisfies Record<string, Skill>;

export const skillFacts = {
  format: fact(
    'SKILL.md',
    'A skill is a folder with a SKILL.md file: YAML frontmatter with a name and a description, then instructions. The format is an open standard.',
    'https://agentskills.io/',
  ),
  installer: fact('npx skills add <owner/repo>', 'npx skills add <owner/repo> installs a skill for most agents.', 'https://github.com/vercel-labs/skills'),
  beAmbitiousOrigin: fact(
    '2026-10-13',
    'Be Ambitious comes from Felix Rieseberg\'s article "How to be more ambitious: a tutorial for humans with models" (13 October 2026), which publishes example prompts and a prompt template, not a skill.',
    'https://felixrieseberg.com/how-to-be-more-ambitious-a-tutorial-for-humans-with-models/',
    { unit: 'date' },
  ),
  beAmbitiousDannyMac180: unverified(
    'MIT skill',
    'DannyMac180 publishes an MIT-licensed Be Ambitious skill.',
    'https://github.com/robonuggets/be-ambitious',
    'The robonuggets README credits DannyMac180 for an earlier prompt-only version. No DannyMac180 repository could be found to confirm a skill or its licence.',
  ),
} as const;
