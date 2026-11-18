// Every external link the site uses more than once, with a label and the day
// it last answered, plus the people and projects the guide builds on.
// check-facts fails on a malformed URL here; `--online` checks they respond.
import type { Credit, Link } from './types.ts';

const C = '2026-11-18';

export const links = {
  // People and projects
  theo: { label: 'Theo on YouTube', url: 'https://www.youtube.com/@theo', checked: C, note: 'Creator of T3 Code. @t3dotgg on YouTube is an unrelated account; t3dotgg is his GitHub name.' },
  theoSite: { label: 't3.gg', url: 'https://t3.gg', checked: C },
  t3code: { label: 'T3 Code', url: 'https://t3.codes', checked: C },
  t3codeRepo: { label: 'T3 Code on GitHub', url: 'https://github.com/pingdotgg/t3code', checked: C },
  t3codeDocs: { label: 'T3 Code user docs', url: 'https://github.com/pingdotgg/t3code/tree/main/docs/user', checked: C },
  t3codeContributing: { label: 'T3 Code CONTRIBUTING', url: 'https://github.com/pingdotgg/t3code/blob/main/CONTRIBUTING.md', checked: C },
  tsRust: { label: 'ts-rust', url: 'https://github.com/pingdotgg/ts-rust', checked: C },
  emilyCampbellLayers: { label: 'The Layers of AI Experience, Emily Campbell (3 June 2026)', url: 'https://emilycampbell.co/writing/layers-of-ai-experience', checked: C },
  anatomy: { label: 'Anatomy, a skill for Claude Code', url: 'https://skills.wheresryan.sh/anatomy', checked: C },
  felixAmbitious: { label: 'How to be more ambitious, Felix Rieseberg', url: 'https://felixrieseberg.com/how-to-be-more-ambitious-a-tutorial-for-humans-with-models/', checked: C },
  mattPocockSkills: { label: "Matt Pocock's skills", url: 'https://github.com/mattpocock/skills', checked: C },
  humanizer: { label: 'Humanizer', url: 'https://github.com/blader/humanizer', checked: C },
  beAmbitiousSkill: { label: 'be-ambitious (robonuggets)', url: 'https://github.com/robonuggets/be-ambitious', checked: C },
  skillsCli: { label: 'skills CLI', url: 'https://github.com/vercel-labs/skills', checked: C },
  agentSkills: { label: 'Agent Skills standard', url: 'https://agentskills.io/', checked: C },

  // Measurement
  artificialAnalysis: { label: 'Artificial Analysis', url: 'https://artificialanalysis.ai', checked: C },
  aaLeaderboard: { label: 'Artificial Analysis leaderboard', url: 'https://artificialanalysis.ai/leaderboards/models', checked: C },
  aaMethodology: { label: 'Intelligence Index methodology', url: 'https://artificialanalysis.ai/methodology/intelligence-benchmarking', checked: C },
  aaOpus: { label: 'Artificial Analysis: Claude Opus 5.5', url: 'https://artificialanalysis.ai/models/claude-opus-5-5', checked: C },
  aaApi: { label: 'Artificial Analysis data API', url: 'https://artificialanalysis.ai/data-api/docs', checked: C },
  metr: { label: 'METR', url: 'https://metr.org', checked: C },
  metrHorizons: { label: 'METR time horizons', url: 'https://metr.org/time-horizons/', checked: C },
  metrResults: { label: 'METR results file', url: 'https://metr.org/assets/benchmark_results_1_1.yaml', checked: C },
  epoch: { label: 'Epoch AI: LLM inference price trends', url: 'https://epoch.ai/data-insights/llm-inference-price-trends', checked: C },
  a16z: { label: 'a16z: LLMflation', url: 'https://a16z.com/llmflation-llm-inference-cost/', checked: C },
  speechStudy: { label: 'Ruan et al., 2016', url: 'https://arxiv.org/abs/1608.07323', checked: C },

  // Standards
  mcp: { label: 'Model Context Protocol', url: 'https://modelcontextprotocol.io', checked: C },
  llmsTxt: { label: 'llms.txt', url: 'https://llmstxt.org', checked: C },

  // Anthropic
  claudePricing: { label: 'Claude plans', url: 'https://claude.com/pricing', checked: C },
  claudeApiPricing: { label: 'Claude API pricing', url: 'https://platform.claude.com/docs/en/about-claude/pricing', checked: C },
  claudeModels: { label: 'Claude models overview', url: 'https://platform.claude.com/docs/en/models/overview', checked: C, note: 'Moved from /docs/en/about-claude/models/overview.' },
  claudeThinking: { label: 'Claude thinking docs', url: 'https://platform.claude.com/docs/en/build-with-claude/thinking', checked: C },
  claudeLimits: { label: 'Claude usage limits', url: 'https://support.claude.com/en/articles/11647753', checked: C },
  claudeFablePlans: { label: 'Fable on Claude plans', url: 'https://support.claude.com/en/articles/15424964', checked: C },
  claudeApiCredits: { label: 'Monthly API credits for Max, Ultra and Team', url: 'https://support.claude.com/en/articles/17154008', checked: C },
  claudeDataRetention: { label: 'API and data retention', url: 'https://platform.claude.com/docs/en/manage-claude/api-and-data-retention', checked: C },
  claudeCodeDocs: { label: 'Claude Code docs', url: 'https://code.claude.com/docs/en/overview', checked: C },
  claudeCodeBestPractices: { label: 'Claude Code best practices', url: 'https://code.claude.com/docs/en/best-practices', checked: C },
  claudeCodeCosts: { label: 'Claude Code costs', url: 'https://code.claude.com/docs/en/costs', checked: C },
  claudeCodeSkills: { label: 'Claude Code skills', url: 'https://code.claude.com/docs/en/skills', checked: C },
  claudeCodeMemory: { label: 'Claude Code memory', url: 'https://code.claude.com/docs/en/memory', checked: C },
  claudeCodeDataUsage: { label: 'Claude Code data usage', url: 'https://code.claude.com/docs/en/data-usage', checked: C },
  aiForScience: { label: 'AI for Science', url: 'https://support.claude.com/en/articles/11199177', checked: C },
  teamForScientists: { label: 'Team plan for scientists', url: 'https://claude.com/programs/team-plan-for-scientists', checked: C },

  // OpenAI
  openaiApiPricing: { label: 'OpenAI API pricing', url: 'https://developers.openai.com/api/docs/pricing', checked: C },
  openaiYourData: { label: 'OpenAI: your data', url: 'https://developers.openai.com/api/docs/guides/your-data', checked: C },
  codexDocs: { label: 'Codex docs', url: 'https://learn.chatgpt.com/docs/', checked: C, note: 'developers.openai.com/codex/* redirects here.' },
  codexPricing: { label: 'Codex pricing', url: 'https://learn.chatgpt.com/docs/pricing', checked: C },
  codexModels: { label: 'Codex models', url: 'https://learn.chatgpt.com/docs/models', checked: C },
  codexSkills: { label: 'Codex skills', url: 'https://learn.chatgpt.com/docs/build-skills', checked: C },
  codexAgentsMd: { label: 'Codex AGENTS.md', url: 'https://learn.chatgpt.com/docs/agent-configuration/agents-md', checked: C },

  // Hosting
  githubPages: { label: 'GitHub Pages docs', url: 'https://docs.github.com/en/pages/getting-started-with-github-pages/creating-a-github-pages-site', checked: C },
  cloudflareAccessPin: { label: 'Cloudflare Access one-time PIN', url: 'https://developers.cloudflare.com/cloudflare-one/identity/one-time-pin/', checked: C },
  cloudflareWorkersPricing: { label: 'Cloudflare Workers pricing', url: 'https://developers.cloudflare.com/workers/platform/pricing/', checked: C },
  tailscaleServe: { label: 'tailscale serve', url: 'https://tailscale.com/kb/1312/serve', checked: C },

  // Skills (explain/skills)
  theoThreeSkills: { label: 'These 3 skills changed my life, Theo (26 October 2026)', url: 'https://www.youtube.com/watch?v=5Bmp9cz1JN8', checked: C },
  agentSkillsSpec: { label: 'Agent Skills specification', url: 'https://agentskills.io/specification', checked: C },
  t3codeComposer: { label: 'T3 Code composer docs', url: 'https://github.com/pingdotgg/t3code/blob/main/docs/user/composer.md', checked: C },
} satisfies Record<string, Link>;

/** People and projects whose work the guide uses. The sources page lists them. */
export const credits: Credit[] = [
  { name: 'Theo', url: 'https://t3.gg', for: 'T3 Code, and the public estimates of what a plan is worth', checked: C },
  { name: 'T3 Code', url: 'https://t3.codes', for: 'The workspace the guide is written around', checked: C },
  { name: 'Emily Campbell', url: 'https://emilycampbell.co/writing/layers-of-ai-experience', for: '"The Layers of AI Experience", the six-layer model of AI products', checked: C },
  { name: 'Felix Rieseberg', url: 'https://felixrieseberg.com/how-to-be-more-ambitious-a-tutorial-for-humans-with-models/', for: 'Altitude, depth and range: the Be Ambitious approach', checked: C },
  { name: 'Matt Pocock', url: 'https://github.com/mattpocock/skills', for: 'grill-me and grilling', checked: C },
  { name: 'blader', url: 'https://github.com/blader/humanizer', for: 'Humanizer', checked: C },
  { name: 'robonuggets', url: 'https://github.com/robonuggets/be-ambitious', for: 'The be-ambitious skill', checked: C },
  { name: 'Anatomy', url: 'https://skills.wheresryan.sh/anatomy', for: 'The Anatomy figure skill', checked: C },
  { name: 'Artificial Analysis', url: 'https://artificialanalysis.ai', for: 'Intelligence Index scores, token use and cost per task', checked: C },
  { name: 'METR', url: 'https://metr.org', for: 'Time-horizon measurements', checked: C },
  { name: 'Model Context Protocol', url: 'https://modelcontextprotocol.io', for: 'The standard for connecting agents to outside systems', checked: C },
  { name: 'llms.txt', url: 'https://llmstxt.org', for: 'The proposal for markdown twins of every page', checked: C },
  { name: 'Dan McAteer (DannyMac180)', url: 'https://github.com/DannyMac180/skills', for: 'The first be-ambitious skill', checked: C },
  { name: 'Cathryn Lavery', url: 'https://github.com/cathrynlavery/diagram-design', for: 'diagram-design', checked: C },
  { name: 'Emil Kowalski', url: 'https://github.com/emilkowalski/skills', for: 'Animation and design skills', checked: C },
  { name: 'Paul Bakaus', url: 'https://github.com/pbakaus/impeccable', for: 'Impeccable', checked: C },
];
