// Complete inventory of legacy / rest-of-site content sorted into two explicit editorial buckets:
// 1. 'integrate' — valuable material worth folding deeper into the 21-lesson interactive guide.
// 2. 'discard'   — superseded, redundant, or legacy-structure pages kept live only for archive/links.

export type Disposition = 'integrate' | 'discard';

export type ArchiveGroup =
  | 'Original vibecoding-guide'
  | 'Interactive Explainers'
  | 'Essays & Mental Models'
  | 'Start & T3 Code'
  | 'Showcase & Misc';

export interface ArchiveEntry {
  title: string;
  href: string;
  group: ArchiveGroup;
  disposition: Disposition;
  /** Target chapter or library home where this belongs (integrate) or which lesson replaces it (discard). */
  targetLabel: string;
  targetHref: string;
  /** Short, concrete editorial note on what to fold in or why it is superseded. */
  note: string;
}

export const archiveEntries: ArchiveEntry[] = [
  // ---------- INTEGRATE INTO THE NEW GUIDE ----------
  {
    title: 'Web Concepts (original guide)',
    href: 'guide/guides/web-concepts/',
    group: 'Original vibecoding-guide',
    disposition: 'integrate',
    targetLabel: 'Step 3 · Git, GitHub & cloud hosting',
    targetHref: 'journey/stack/#hosting',
    note: 'Core browser/server/HTTP/URL/API intuition is already folded into Step 3’s web-app drawer; bring over its concrete HTTP status-code & DNS worked examples as expandable cards.',
  },
  {
    title: 'Full-Stack Apps (original guide)',
    href: 'guide/guides/fullstack-apps/',
    group: 'Original vibecoding-guide',
    disposition: 'integrate',
    targetLabel: 'Step 3 · Git, GitHub & cloud hosting',
    targetHref: 'journey/stack/#hosting',
    note: 'Fold its clear request-flow diagram (browser → API route → database → response) and concrete database choice matrix into Step 3’s dynamic-hosting interactive step.',
  },
  {
    title: 'Authentication (original guide)',
    href: 'guide/guides/authentication/',
    group: 'Original vibecoding-guide',
    disposition: 'integrate',
    targetLabel: 'Step 3 · Git, GitHub & cloud hosting',
    targetHref: 'journey/stack/#hosting',
    note: 'Keep its practical sessions vs JWT vs OAuth rules and “never check permissions only in the browser” checklist as a dedicated sub-drawer in Step 3 and Step 15 (Review).',
  },
  {
    title: 'Web Rules — Security, Accessibility & Performance',
    href: 'guide/guides/web-rules/',
    group: 'Original vibecoding-guide',
    disposition: 'integrate',
    targetLabel: 'Step 9 · The check & Step 15 · Second opinion',
    targetHref: 'journey/check/',
    note: 'Turn its pre-launch checklists (secrets hygiene, input validation, keyboard/contrast accessibility, image/bundle budgets) into copyable verification prompts and AGENTS.md snippets.',
  },
  {
    title: 'Cloud Infrastructure (original guide)',
    href: 'guide/guides/cloud-infrastructure/',
    group: 'Original vibecoding-guide',
    disposition: 'integrate',
    targetLabel: 'Step 3 · Git, GitHub & cloud hosting',
    targetHref: 'journey/stack/#specs',
    note: 'Bring its concrete deployment steps (DNS records, custom domains, Cloudflare Pages vs Workers vs VPS, env variables) into Step 3’s server-specs & hosting details.',
  },
  {
    title: 'Starter Skills (vibe-coder-base, ui-builder, project-audit, web-fundamentals)',
    href: 'guide/skills-table/',
    group: 'Original vibecoding-guide',
    disposition: 'integrate',
    targetLabel: 'Library · Starter Skills',
    targetHref: 'library/#skills',
    note: 'Already surfaced directly in the new Concept & Lesson Library; next step is one-click copy buttons and wiring each skill into Step 8 (AGENTS.md & skills).',
  },
  {
    title: 'Voice explainer',
    href: 'explain/voice/',
    group: 'Interactive Explainers',
    disposition: 'integrate',
    targetLabel: 'What an AI model does · Talk to it, show it, ask it to choose',
    targetHref: 'journey/ai/#inputs',
    note: 'Voice dictation is one of the highest-leverage everyday habits; fold its concrete dictation workflow & mic tips into Step 1’s multimodal step and Step 17 (Your turn).',
  },
  {
    title: 'Connectors & MCP explainer',
    href: 'explain/connectors/',
    group: 'Interactive Explainers',
    disposition: 'integrate',
    targetLabel: 'Step 6 · The loop & Step 8 · Memory',
    targetHref: 'journey/loop/',
    note: 'Fold MCP / external tool connections (browser inspection, GitHub, database read-only queries) into Step 6’s tool surface and Step 16 (Proof).',
  },
  {
    title: 'Skills explainer',
    href: 'explain/skills/',
    group: 'Interactive Explainers',
    disposition: 'integrate',
    targetLabel: 'Step 8 · Memory & AGENTS.md',
    targetHref: 'journey/memory/',
    note: 'Integrate its on-demand skill loading mechanics (avoiding context bloat by loading specialist instructions only when relevant) right alongside AGENTS.md in Step 8.',
  },
  {
    title: 'T3 Code walkthrough',
    href: 't3-code/',
    group: 'Start & T3 Code',
    disposition: 'integrate',
    targetLabel: 'Step 4 · Your first loop & Step 18 · Several jobs',
    targetHref: 'journey/first/',
    note: 'Fold its concrete harness setup screenshots, worktree controls, and cross-model handoff tips into collapsible “How, in T3 Code” panels across Steps 4, 15, 18 and 21.',
  },
  {
    title: 'Essay · Don’t be the meat proxy',
    href: 'essays/dont-be-the-meat-proxy/',
    group: 'Essays & Mental Models',
    disposition: 'integrate',
    targetLabel: 'Step 6 · The loop',
    targetHref: 'journey/loop/#norun',
    note: 'Sharpest framing for why giving the agent a real run/test tool beats copy-pasting errors back and forth; weave its punchline into Step 6.',
  },
  {
    title: 'Essay · Your job is to disprove it',
    href: 'essays/your-job-is-to-disprove-it/',
    group: 'Essays & Mental Models',
    disposition: 'integrate',
    targetLabel: 'Step 15 · Second opinion & Step 16 · Proof',
    targetHref: 'journey/review/#attack',
    note: 'Strong mental model for adversarial verification; integrate its concrete red-team questions into Step 15 and Step 16.',
  },
  {
    title: 'Essay · Spend intelligence where it matters',
    href: 'essays/spend-intelligence-where-it-matters/',
    group: 'Essays & Mental Models',
    disposition: 'integrate',
    targetLabel: 'Step 14 · What it costs',
    targetHref: 'journey/meter/#api',
    note: 'Practical model-routing heuristic (strong reasoning for planning/review, fast cheap models for boilerplate); integrate into Step 14’s model-mix toggle.',
  },
  {
    title: 'Essay · Throwaway tools for thinking',
    href: 'essays/throwaway-tools-for-thinking/',
    group: 'Essays & Mental Models',
    disposition: 'integrate',
    targetLabel: 'Step 17 · Your turn',
    targetHref: 'journey/turn/#build',
    note: 'Concrete examples of building 5-minute review pages, fixture galleries and visual diff harnesses; integrate directly into Step 17’s “Build your own loop” step.',
  },
  {
    title: 'Essay · Notice the tics',
    href: 'essays/notice-the-tics/',
    group: 'Essays & Mental Models',
    disposition: 'integrate',
    targetLabel: 'Step 19 · A growing project',
    targetHref: 'journey/grow/#junk',
    note: 'Catalogues recurring AI code smells (defensive bloat, dead wrappers, fake fallbacks); fold into Step 19’s clean-up checklist.',
  },
  {
    title: 'Essay · Scores are not judgement',
    href: 'essays/scores-are-not-judgement/',
    group: 'Essays & Mental Models',
    disposition: 'integrate',
    targetLabel: 'Step 2 · Providers & where AI runs',
    targetHref: 'journey/providers/',
    note: 'Useful antidote to benchmark hype when picking models; fold into Step 2 and the Models comparison page.',
  },
  {
    title: 'Web Builders — v0, Lovable, Bolt, Replit (original guide)',
    href: 'guide/guides/vibe-coding-web/',
    group: 'Original vibecoding-guide',
    disposition: 'integrate',
    targetLabel: 'Your first real loop · Start on what is in front of you (the side road)',
    targetHref: 'journey/first/#device',
    note: 'Already repositioned as a collapsible Side Story in Step 4: easiest zero-setup entry point for day one, with a clear graduation path to Git + real local/cloud coding agents.',
  },
  {
    title: 'Sources & Fact-Check',
    href: 'sources/',
    group: 'Showcase & Misc',
    disposition: 'integrate',
    targetLabel: 'Models & Footer · Sources',
    targetHref: 'models/',
    note: 'Keep live as the grounded citation ledger backing every model price, context window, and harness capability claim across the guide.',
  },

  // ---------- DISCARD / SUPERSEDED ----------
  {
    title: 'Old Start page (“Build something in an hour”)',
    href: 'start/',
    group: 'Start & T3 Code',
    disposition: 'discard',
    targetLabel: 'Replaced by Part 1 · Steps 1–4',
    targetHref: 'journey/foundations/',
    note: 'The old cold-start jumped straight into tools without explaining what AI is, Chat vs Work vs Agent, Git or cloud hosting. Superseded by Steps 1–4.',
  },
  {
    title: 'Explainers index',
    href: 'explain/',
    group: 'Interactive Explainers',
    disposition: 'discard',
    targetLabel: 'Replaced by Guide Overviews & Library',
    targetHref: 'library/',
    note: 'Separate mini-explainers fragmented the mental model across disconnected pages; replaced by the unified 21-lesson Guide + Concept Library.',
  },
  {
    title: 'Context explainer (interactive & read)',
    href: 'explain/context/',
    group: 'Interactive Explainers',
    disposition: 'discard',
    targetLabel: 'Replaced by Step 7 · The window (with Context Rot)',
    targetHref: 'journey/window/#rot',
    note: 'Fully superseded by Step 7, which now covers window fill, attention dilution / context rot inside 1M windows, and compaction in the shared visual language.',
  },
  {
    title: 'Orchestration explainer (interactive & read)',
    href: 'explain/orchestration/',
    group: 'Interactive Explainers',
    disposition: 'discard',
    targetLabel: 'Replaced by Steps 10–13 (Helper, Side by side, Lead, Fleet)',
    targetHref: 'journey/lead/',
    note: 'Superseded by the four dedicated interactive chapters in Part 2 covering subagents, worktrees, orchestrator topologies and merge gates.',
  },
  {
    title: 'Plans & API explainer (interactive & read)',
    href: 'explain/plans-and-api/',
    group: 'Interactive Explainers',
    disposition: 'discard',
    targetLabel: 'Replaced by Step 14 · What it costs & /models/',
    targetHref: 'journey/meter/',
    note: 'Superseded by Step 14’s interactive token meter, prompt-cache simulator, API vs subscription comparison and live /models/ table.',
  },
  {
    title: 'Verification explainer',
    href: 'explain/verification/',
    group: 'Interactive Explainers',
    disposition: 'discard',
    targetLabel: 'Replaced by Step 9 · The check & Step 16 · Proof',
    targetHref: 'journey/check/',
    note: 'Superseded by Step 9 (automated checks / typechecking / unit tests) and Step 16 (readable proof cards).',
  },
  {
    title: 'Reference index & legacy Markdown Guides',
    href: 'guide/',
    group: 'Original vibecoding-guide',
    disposition: 'discard',
    targetLabel: 'Replaced by /library/ & Steps 1–21',
    targetHref: 'library/',
    note: 'Duplicate prose index (`ways-of-working`, `agentic-coding`, `agentic-coding-web`, `version-control`, `models-and-costs`, `t3-code`). Core material is now interactive across Steps 1–21.',
  },
  {
    title: 'Essays index & remaining standalone essays',
    href: 'essays/',
    group: 'Essays & Mental Models',
    disposition: 'discard',
    targetLabel: 'Replaced by per-step mental-model notes',
    targetHref: 'journey/agents/',
    note: 'Standalone op-ed essays (`a-ten-minute-run-is-a-short-one`, `a-year-ago-is-not-now`, `ask-for-a-bigger-problem`, `building-is-cheap-now`, `change-is-free`, `give-it-a-way-to-check-itself`, `nothing-else-to-know`, `size-of-the-job`, `talk-to-it`, `the-triangle`) overlap heavily with the interactive steps; drop the separate Essays section.',
  },
  {
    title: 'Showcase gallery & Terrain Table demo',
    href: 'showcase/',
    group: 'Showcase & Misc',
    disposition: 'discard',
    targetLabel: 'Out of scope for the focused Guide',
    targetHref: '',
    note: 'Demo gallery (`showcase/`, `showcase/play/terrain-table/`) distracts from the interactive curriculum; archive/remove from primary navigation.',
  },
  {
    title: 'Layers prototype page',
    href: 'layers/',
    group: 'Showcase & Misc',
    disposition: 'discard',
    targetLabel: 'Replaced by the 3-level switcher in the header',
    targetHref: '',
    note: 'Early design experiment superseded by the live Vibe coding / Technical / Engineer reader-level switcher across every chapter.',
  },
  {
    title: 'Single-page Read dump',
    href: 'read/',
    group: 'Showcase & Misc',
    disposition: 'discard',
    targetLabel: 'Replaced by /library/ & interactive lessons',
    targetHref: 'library/',
    note: 'Legacy flat prose export from the pre-interactive version; keep archived rather than linked in primary nav.',
  },
  {
    title: 'Standalone Wiki board',
    href: 'wiki/',
    group: 'Showcase & Misc',
    disposition: 'discard',
    targetLabel: 'Folded into /library/ (with side-drawer & graph)',
    targetHref: 'library/#concepts',
    note: 'All 63 wiki articles remain live (backing every `data-side` concept link and `/wiki/graph/`), now browsed fluidly inside the unified Concept & Lesson Library.',
  },
];
