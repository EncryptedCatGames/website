import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';
import { subjectSlugs } from './data/subjects';
const devlog = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/devlog' }),
  schema: z.object({
    title: z.string(),
    date: z.coerce.date(),
    // A game or a side project (data/subjects.ts).
    game: z.enum(subjectSlugs),
    description: z.string(),
    // Where it first appeared (the imported itch.io posts); none for posts
    // written here.
    source: z.string().url().optional(),
    image: z.string().optional(),
  }),
});
export const collections = { devlog };
