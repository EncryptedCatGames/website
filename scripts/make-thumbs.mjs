// Small copies of devlog images and game covers for list thumbnails (2x a 160px slot).
import sharp from 'sharp';
import { mkdir, readdir } from 'node:fs/promises';
import { basename } from 'node:path';
const out = 'public/images/thumbs';
await mkdir(out, { recursive: true });
const sources = [
  ...(await readdir('public/images/devlog')).map(
    (f) => `public/images/devlog/${f}`,
  ),
  ...(await readdir('public/images'))
    .filter((f) => f.endsWith('-cover.webp'))
    .map((f) => `public/images/${f}`),
].filter((f) => f.endsWith('.webp'));
for (const file of sources)
  await sharp(file)
    .resize({ width: 320, withoutEnlargement: true })
    .webp({ quality: 78 })
    .toFile(`${out}/${basename(file)}`);
console.log(`Wrote ${sources.length} thumbnails to ${out}`);
