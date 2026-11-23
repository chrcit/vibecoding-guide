// The explainers, in reading order. Shared wiring owned by the lead.
export const explainers = [
  { slug: 'plans-and-api', title: 'Plans against the API', blurb: 'Two ways to pay for the same models, and what a five-hour window is.' },
  { slug: 'context', title: 'Context', blurb: 'What the agent knows right now, and why that decides what it can do.' },
  { slug: 'verification', title: 'Verification', blurb: 'Who checks the work, and how to let the agent check itself.' },
  { slug: 'orchestration', title: 'Orchestration', blurb: 'Threads, helpers, teams of agents, and what they cost.' },
  { slug: 'skills', title: 'Skills', blurb: 'Written know-how an agent loads when the task calls for it.' },
  { slug: 'connectors', title: 'Connectors and MCP', blurb: 'Giving an agent a door to your other tools.' },
  { slug: 'voice', title: 'Voice', blurb: 'Talking to an agent gives it more to work with than typing does.' },
] as const;
