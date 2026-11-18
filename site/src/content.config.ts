import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

// The reference section is the repo's own markdown: one source of truth.
const reference = defineCollection({
  loader: glob({ base: '..', pattern: ['guides/*.md', 'skills/*.md', 'skills-table.md'] }),
  schema: z.object({}).passthrough(),
});

export const collections = { reference };
