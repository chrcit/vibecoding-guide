export const url = (p: string) => {
  const base = import.meta.env.BASE_URL.endsWith('/') ? import.meta.env.BASE_URL : import.meta.env.BASE_URL + '/';
  return base + p.replace(/^\//, '');
};

// Top-level sections. Shared wiring owned by the lead: a section appears in the
// header only once its landing page exists, so flip `ready` when it ships.
export const sections = [
  { id: 'guide', label: 'Guide', path: '', ready: true },
  { id: 'start', label: 'Start', path: 'start/', ready: true },
  { id: 'explain', label: 'Explainers', path: 'explain/', ready: true },
  { id: 'models', label: 'Models', path: 'models/', ready: true },
  { id: 't3-code', label: 'T3 Code', path: 't3-code/', ready: true },
  { id: 'wiki', label: 'Wiki', path: 'wiki/', ready: false },
  { id: 'essays', label: 'Essays', path: 'essays/', ready: true },
  { id: 'showcase', label: 'Showcase', path: 'showcase/', ready: false },
  { id: 'reference', label: 'Reference', path: 'guide/', ready: true },
] as const;
export type SectionId = (typeof sections)[number]['id'];

export type RefItem = { id: string; title: string; blurb: string };
export type RefGroup = { name: string; items: RefItem[] };

export const groups: RefGroup[] = [
  {
    name: 'Start here',
    items: [
      { id: 'guides/ways-of-working', title: 'Ways of Working', blurb: 'Voice, context, parallel work, self-verification, orchestration, ambition' },
      { id: 'guides/t3-code', title: 'T3 Code', blurb: 'The agentic development environment: what it can do and where it hits walls' },
      { id: 'guides/models-and-costs', title: 'Models and Costs', blurb: 'Which model for what, thinking levels, plans, hardware' },
      { id: 'skills-table', title: 'Skills', blurb: 'Reusable instructions for your agents' },
      { id: 'guides/fact-check', title: 'Sources and Fact-Check', blurb: 'Every number and tool claim, with its source' },
    ],
  },
  {
    name: 'Agentic coding basics',
    items: [
      { id: 'guides/agentic-coding', title: 'Agentic Coding', blurb: 'The agent loop, context files, prompts, reviews' },
      { id: 'guides/agentic-coding-web', title: 'Codex & Claude on the Web', blurb: 'Cloud agents that work on your GitHub repos' },
      { id: 'guides/vibe-coding-web', title: 'Web Builders', blurb: 'v0, Lovable, Bolt, Replit as a no-setup start' },
    ],
  },
  {
    name: 'Web foundations',
    items: [
      { id: 'guides/web-concepts', title: 'Web Concepts', blurb: 'How the web works, frontend vs backend, URLs, APIs' },
      { id: 'guides/fullstack-apps', title: 'Full-Stack Apps', blurb: 'Server, client, database and how they connect' },
      { id: 'guides/authentication', title: 'Authentication', blurb: 'Login, permissions, keeping users safe' },
    ],
  },
  {
    name: 'Shipping',
    items: [
      { id: 'guides/version-control', title: 'GitHub & Version Control', blurb: 'Save work, undo mistakes, collaborate' },
      { id: 'guides/cloud-infrastructure', title: 'Cloud Infrastructure', blurb: 'Deploying, domains, Cloudflare, GitHub Pages' },
      { id: 'guides/web-rules', title: 'Web Rules', blurb: 'Security, accessibility, performance checklists' },
    ],
  },
  {
    name: 'Prompts you can use as skills',
    items: [
      { id: 'skills/vibe-coder-base', title: 'Base Prompt', blurb: 'Foundation for people new to code' },
      { id: 'skills/ui-builder', title: 'UI Builder', blurb: 'Design, layout and interaction polish' },
      { id: 'skills/project-audit', title: 'Project Audit', blurb: 'Pre-launch security and quality checks' },
      { id: 'skills/web-fundamentals', title: 'Web Fundamentals', blurb: 'Learn while you build' },
    ],
  },
];

export const allItems = groups.flatMap((g) => g.items);
