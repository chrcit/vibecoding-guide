// Recommended skills, with author credit, source and licence, plus the facts
// about the skill format itself.
import { fact, type Fact } from './types.ts';

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
      'is the interview routine the agent can call',
      'grilling is the model-invoked interview routine behind grill-me and several other skills in the same collection: the agent can reach for it on its own.',
      'https://github.com/mattpocock/skills',
    ),
  },
  'be-ambitious': {
    name: 'Be Ambitious',
    author: 'robonuggets',
    authorUrl: 'https://github.com/robonuggets',
    url: 'https://github.com/robonuggets/be-ambitious',
    install: 'git clone https://github.com/robonuggets/be-ambitious ~/.claude/skills/be-ambitious',
    licence: fact('MIT', 'The robonuggets be-ambitious skill is MIT-licensed.', 'https://github.com/robonuggets/be-ambitious'),
    what: fact(
      'turns the article into steps',
      "robonuggets/be-ambitious turns Felix Rieseberg's article into steps the agent follows (altitude, depth and range) and credits him for the ideas.",
      'https://github.com/robonuggets/be-ambitious',
    ),
  },
  anatomy: {
    name: 'Anatomy',
    author: 'Ryan (@wheresryan22)',
    authorUrl: 'https://x.com/wheresryan22',
    url: 'https://github.com/wheresryan22/anatomy',
    install: 'npx skills add wheresryan22/anatomy -g',
    licence: fact('MIT', 'Anatomy is MIT-licensed, the skill and the figures it ships.', 'https://github.com/wheresryan22/anatomy'),
    what: fact(
      'draws an idea as an interactive isometric machine',
      'Anatomy turns an idea named in one line into a live, interactive isometric drawing of a machine that performs it.',
      'https://skills.wheresryan.sh/anatomy',
    ),
  },
  'diagram-design': {
    name: 'diagram-design',
    author: 'Cathryn Lavery',
    authorUrl: 'https://github.com/cathrynlavery',
    url: 'https://github.com/cathrynlavery/diagram-design',
    install: 'npx skills add cathrynlavery/diagram-design',
    licence: fact('MIT', 'diagram-design is MIT-licensed.', 'https://github.com/cathrynlavery/diagram-design'),
    what: fact(
      'draws diagrams as one self-contained HTML and SVG file',
      'diagram-design is "an agent skill that draws diagrams as one self-contained HTML + SVG file, in your brand".',
      'https://github.com/cathrynlavery/diagram-design',
    ),
  },
  'emil-skills': {
    name: "Emil Kowalski's animation and design skills",
    author: 'Emil Kowalski',
    authorUrl: 'https://emilkowal.ski',
    url: 'https://github.com/emilkowalski/skills',
    install: 'npx skills@latest add emilkowalski/skills',
    licence: fact('MIT', "Emil Kowalski's skills collection is MIT-licensed.", 'https://github.com/emilkowalski/skills'),
    what: fact(
      'is a set of skills to build, review and remove interface animation',
      'emilkowalski/skills holds animate, review-animations, improve-animations, remove-animations, choreograph, gestures and other skills for interface motion and design.',
      'https://github.com/emilkowalski/skills',
    ),
  },
  impeccable: {
    name: 'Impeccable',
    author: 'Paul Bakaus',
    authorUrl: 'https://paulbakaus.com',
    url: 'https://github.com/pbakaus/impeccable',
    install: 'npx impeccable install',
    licence: fact('Apache-2.0', "Impeccable is licensed Apache-2.0 and started from Anthropic's frontend-design skill.", 'https://github.com/pbakaus/impeccable'),
    what: fact(
      'steers and reviews interface design',
      'Impeccable calls itself "the design vocabulary for your coding agent": it helps an agent steer, review and check UI design.',
      'https://github.com/pbakaus/impeccable',
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
  beAmbitiousDannyMac180: fact(
    'MIT skill',
    'Dan McAteer (DannyMac180) publishes a be-ambitious skill in his MIT-licensed skills repository, "adapted from a prompt shared by Felix Rieseberg". The robonuggets skill credits it as the earlier, prompt-only version.',
    'https://github.com/DannyMac180/skills/tree/main/be-ambitious',
  ),
  // How skills load and where they live, per harness and in the open standard.
  specName: fact(64, 'In the Agent Skills standard a skill name is at most 64 characters: lowercase letters, numbers and hyphens, matching its folder name.', 'https://agentskills.io/specification'),
  specDescription: fact(1024, 'In the Agent Skills standard a description is at most 1,024 characters and should say both what the skill does and when to use it.', 'https://agentskills.io/specification'),
  specOptional: fact(
    ['license', 'compatibility', 'metadata', 'allowed-tools'],
    'Besides name and description, the Agent Skills standard defines optional license, compatibility, metadata and allowed-tools (experimental) fields, and optional scripts/, references/ and assets/ folders.',
    'https://agentskills.io/specification',
  ),
  specMetadataTokens: fact(100, 'The Agent Skills standard puts the name and description of every skill at startup at about 100 tokens each.', 'https://agentskills.io/specification', { unit: 'tokens' }),
  specBodyTokens: fact(5000, 'The Agent Skills standard recommends keeping the SKILL.md body under 5,000 tokens and 500 lines, and moving detail into referenced files loaded only when needed.', 'https://agentskills.io/specification', { unit: 'tokens' }),
  claudeCodeListing: fact(
    1,
    "Claude Code's skill listing budget scales at 1% of the model's context window. When it overflows, the descriptions of the skills you invoke least are dropped first; every name stays.",
    'https://code.claude.com/docs/en/skills',
    { unit: 'percent' },
  ),
  claudeCodeDescCap: fact(1536, "Claude Code caps each skill's description and when_to_use text at 1,536 characters in the listing.", 'https://code.claude.com/docs/en/skills'),
  claudeCodeInvocation: fact(
    ['disable-model-invocation', 'user-invocable'],
    'In Claude Code, disable-model-invocation: true stops Claude loading a skill on its own; user-invocable: false hides it from the / menu so only Claude can use it.',
    'https://code.claude.com/docs/en/skills',
  ),
  claudeCodeLive: fact(
    'no restart',
    'Claude Code watches the personal and project skill folders and picks up a changed skill within the current session, without a restart.',
    'https://code.claude.com/docs/en/skills',
  ),
  claudeCodeCompaction: fact(
    5000,
    'After compaction Claude Code keeps the first 5,000 tokens of each invoked skill, within a combined budget of 25,000 tokens, so the most important instructions belong near the top.',
    'https://code.claude.com/docs/en/skills',
    { unit: 'tokens' },
  ),
  claudeCodeHooks: fact(
    'hook',
    'Claude Code\'s docs say a rule that must hold every time belongs in a hook, which runs on every matching event whether or not Claude is following the skill.',
    'https://code.claude.com/docs/en/skills',
  ),
  claudeCodeFork: fact(
    'context: fork',
    'A Claude Code skill with context: fork runs in a new subagent that gets the skill as its prompt and does not see the conversation.',
    'https://code.claude.com/docs/en/skills',
  ),
  claudeCodeAllowedTools: fact(
    'review allowed-tools',
    "Claude Code applies a project skill's allowed-tools even in a folder you have never trusted, so its docs say to review the allowed-tools of skills checked into a repository before running Claude Code there.",
    'https://code.claude.com/docs/en/skills',
  ),
  codexInvoke: fact(
    ['$name', '/skills'],
    'In the Codex CLI and IDE extension you pick a skill with /skills or by typing $ and its name; Codex can also choose one when the task matches its description.',
    'https://learn.chatgpt.com/docs/build-skills',
  ),
  codexListing: fact(
    2,
    "Codex caps its initial skill list at 2% of the model's context window, or 8,000 characters when the window size is unknown, shortening descriptions first when there are many skills.",
    'https://learn.chatgpt.com/docs/build-skills',
    { unit: 'percent' },
  ),
  codexInstaller: fact('$skill-installer', 'Codex ships a $skill-installer skill that installs skills, for example $skill-installer linear.', 'https://learn.chatgpt.com/docs/build-skills'),
  codexImplicit: fact(
    'allow_implicit_invocation: false',
    'In Codex, allow_implicit_invocation: false in a skill\'s agents/openai.yaml stops implicit use; $name still works.',
    'https://learn.chatgpt.com/docs/build-skills',
  ),
  t3codeInvoke: fact(
    ['$', '/'],
    'In the T3 Code composer, type $ to add a skill from the selected provider, or find it in the / menu; only skills enabled for that provider are listed. After adding or changing skills, use Restart agent session.',
    'https://github.com/pingdotgg/t3code/blob/main/docs/user/composer.md',
  ),
  installerScope: fact(
    ['-g', '-a'],
    'npx skills add installs into the current project by default; -g installs for every project and -a picks the agent, such as -a claude-code. A skills-lock.json records a content hash for each installed skill.',
    'https://github.com/vercel-labs/skills',
  ),
  descriptionIsTrigger: {
    value: 'a description is a trigger',
    claim: 'Theo: a skill description should not describe what the skill is; it tells the model when to use it, so his are written as triggers.',
    source: 'https://www.youtube.com/watch?v=5Bmp9cz1JN8&t=245s',
    verified: '2026-11-18',
    status: 'observation',
    note: 'Theo, "These 3 skills changed my life", 26 October 2026, at 4:05.',
  } satisfies Fact<string>,
  claudeCodePrecedence: fact(
    'enterprise, personal, project',
    'When two Claude Code skills share a name, enterprise wins over personal and personal over project.',
    'https://code.claude.com/docs/en/skills',
  ),
  codexDuplicates: fact('not merged', 'If two Codex skills share a name, Codex does not merge them, and both can appear in skill selectors.', 'https://learn.chatgpt.com/docs/build-skills'),
  claudeCodeShellPolicy: fact(
    'disableSkillShellExecution',
    'Setting disableSkillShellExecution to true in Claude Code replaces the shell commands a skill injects with a notice; it is most useful in managed settings, where users cannot override it.',
    'https://code.claude.com/docs/en/skills',
  ),
} as const;
