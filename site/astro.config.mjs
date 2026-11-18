import { defineConfig } from 'astro/config';
import { remarkGuideLinks } from './src/lib/remark-guide-links.mjs';
import { remarkLevels } from './src/lib/remark-levels.mjs';
import comments from './integrations/comments/index.mjs';
import devPages from './integrations/dev-pages.mjs';

// BASE_PATH lets the site build under a sub-path (e.g. "/agentic-coding-guide/").
const base = process.env.BASE_PATH || '/';

export default defineConfig({
  site: process.env.SITE_URL || 'https://chrcit.github.io',
  base,
  trailingSlash: 'always',
  // Portless (and similar proxies) assign the port via PORT/HOST.
  server: { port: Number(process.env.PORT) || 4321, host: process.env.HOST || false },
  integrations: [comments(), devPages()],
  markdown: {
    remarkPlugins: [[remarkGuideLinks, { base }], remarkLevels],
    shikiConfig: { themes: { light: 'github-light', dark: 'github-dark' } },
  },
  vite: {
    // Extra dev hosts (e.g. a private Tailscale name) come from the environment,
    // comma-separated, so machine names stay out of the repo.
    server: { allowedHosts: ['.localhost', ...(process.env.DEV_ALLOWED_HOSTS || '').split(',').filter(Boolean)] },
  },
});
