import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

// The reference section is the repo's own markdown: one source of truth.
const reference = defineCollection({
  loader: glob({ base: '..', pattern: ['guides/*.md', 'skills/*.md', 'skills-table.md'] }),
  schema: z.object({}).passthrough(),
});

// The wiki: one concept per file in ../wiki. Clusters, summaries and links are
// checked in src/lib/wiki.ts and src/lib/remark-wiki-links.mjs.
const wiki = defineCollection({
  loader: glob({ base: '../wiki', pattern: ['*.md', '!README.md'] }),
  schema: z.object({
    title: z.string(),
    summary: z.string(),
    cluster: z.string(),
    updated: z.coerce.date(),
    aliases: z.array(z.string()).optional(),
  }),
});

export const collections = { reference, wiki };
