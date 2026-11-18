// Claims that fit no other file: privacy terms, hosting limits, price trends
// and research the guides cite.
import { fact, unverified } from './types.ts';

export const claims = {
  privacy: {
    claudeConsumer: fact(
      'your choice',
      'On Claude consumer plans (Free, Pro, Max, Ultra), training on your chats and code is a setting you choose. On: kept up to 5 years. Off: 30 days.',
      'https://code.claude.com/docs/en/data-usage',
    ),
    claudeBusiness: fact(
      'no training',
      'Claude Team, Enterprise and the API: no training unless the customer opts in.',
      'https://platform.claude.com/docs/en/manage-claude/api-and-data-retention',
    ),
    claudeZdr: fact(
      'separate agreement',
      'Zero data retention is a separate agreement for API and qualified Enterprise customers. It is not available on consumer plans, and not for Fable without Anthropic\'s approval.',
      'https://platform.claude.com/docs/en/manage-claude/api-and-data-retention',
    ),
    openaiApi: fact(
      'no training by default',
      'OpenAI API data is not used for training unless you opt in; abuse-monitoring logs are kept up to 30 days; zero data retention needs approval. Business plans: no training by default.',
      'https://developers.openai.com/api/docs/guides/your-data',
    ),
    chatgptConsumer: unverified(
      'trains by default, opt-out in Data Controls',
      'ChatGPT consumer plans train on your content by default, with an opt-out under Data Controls.',
      'https://privacy.openai.com/',
      "OpenAI's help pages blocked automated access. Check the setting yourself.",
    ),
  },
  hosting: {
    githubPagesPublic: fact(
      'public',
      'A GitHub Pages site is public even when its repository is private. Publishing from a private repository needs a paid plan; a private site needs GitHub Enterprise Cloud.',
      'https://docs.github.com/en/pages/getting-started-with-github-pages/creating-a-github-pages-site',
    ),
    cloudflareStatic: fact('free', 'Requests to static assets are free and unlimited on Cloudflare Workers and Pages.', 'https://developers.cloudflare.com/workers/platform/pricing/'),
    cloudflarePaid: fact(5, 'The paid Cloudflare Workers plan starts at $5 a month.', 'https://developers.cloudflare.com/workers/platform/pricing/', { unit: 'usd' }),
    cloudflareAccess: fact(50, 'Cloudflare Access is free for up to 50 users and can put an email one-time code in front of a site.', 'https://www.cloudflare.com/sase/products/access/'),
    tailscalePersonal: fact(6, "Tailscale's Personal plan is free for up to 6 users.", 'https://tailscale.com/pricing'),
    tailscaleServe: fact('your devices only', 'tailscale serve shares a local port with your own devices only.', 'https://tailscale.com/kb/1312/serve'),
    railwayCredit: unverified(5, 'Railway gives a $5 monthly credit.', 'https://railway.com/pricing', 'Never sourced; not re-checked.', { unit: 'usd' }),
    domainCost: unverified('$10–15 a year', 'A .com domain typically costs $10 to $15 a year.', 'https://www.cloudflare.com/products/registrar/', 'Never sourced; not re-checked.'),
  },
  trends: {
    a16z: fact(10, 'a16z estimates the price of a fixed level of capability falls about 10× per year.', 'https://a16z.com/llmflation-llm-inference-cost/', { unit: 'multiplier' }),
    epoch: fact(
      '9× to 900× per year',
      'Epoch AI finds prices fall 9× to 900× per year depending on the capability level, and 40× per year for GPT-4-level performance on science questions.',
      'https://epoch.ai/data-insights/llm-inference-price-trends',
    ),
  },
  research: {
    speechFaster: fact(
      2.93,
      'Speech input was about three times faster than typing on a phone keyboard in a Stanford study: 153 against 52 words per minute for English.',
      'https://arxiv.org/abs/1608.07323',
      { unit: 'multiplier' },
    ),
    judgeBiases: fact(
      'position, verbosity, self-enhancement',
      'Zheng et al. (2023) found that models used as judges show position bias, verbosity bias and self-enhancement bias, while a strong judge still agreed with human preferences over 80% of the time.',
      'https://arxiv.org/abs/2306.05685',
    ),
    selfPreference: fact(
      'self-preference',
      'Panickssery et al. (2024) found that a model used as an evaluator scores its own outputs higher than others\' that human annotators judge equal, and the better it recognises its own text the stronger the bias.',
      'https://arxiv.org/abs/2404.13076',
    ),
    sycophancy: fact(
      'sycophancy',
      'Sharma et al. (2023) found sycophancy in five leading AI assistants across four kinds of task, and that people and preference models sometimes prefer a convincing sycophantic answer over a correct one.',
      'https://arxiv.org/abs/2310.13548',
    ),
    selfCorrection: fact(
      'needs external feedback',
      'Huang et al. (2023) found that models struggle to correct their own reasoning without external feedback, and sometimes do worse after trying.',
      'https://arxiv.org/abs/2310.01798',
    ),
    selfConsistency: fact(
      'sample several, take the most consistent',
      'Wang et al. (2022) showed that sampling several reasoning paths and taking the answer most of them agree on (self-consistency) improves accuracy over a single greedy answer.',
      'https://arxiv.org/abs/2203.11171',
    ),
    contextRot: fact(
      'context rot',
      'Anthropic (29 September 2025): as the number of tokens in the context window grows, a model\'s ability to recall information from it declines, which they call context rot. Context is a finite resource with diminishing returns.',
      'https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents',
    ),
  },
  hardware: {
    unifiedMemory: fact(
      'shared memory',
      'Apple-silicon Macs share one pool of memory between CPU and GPU, which lets them run larger local models.',
      'https://www.apple.com/newsroom/2025/10/apple-unleashes-m5-the-next-big-leap-in-ai-performance-for-apple-silicon/',
    ),
  },
} as const;
