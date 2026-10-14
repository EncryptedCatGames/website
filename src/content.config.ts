import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';
const devlog = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/devlog' }),
  schema: z.object({
    title: z.string(),
    date: z.coerce.date(),
    game: z.enum(['episode-01', 'trick-or-treat']),
    description: z.string(),
    source: z.string().url(),
    image: z.string().optional(),
  }),
});
export const collections = { devlog };
