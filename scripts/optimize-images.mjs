/**
 * Generiše optimizovane WebP verzije slika u public/.
 * Pokretanje: npm run optimize-images
 */
import sharp from 'sharp';
import { statSync } from 'fs';
import { join } from 'path';

const root = new URL('..', import.meta.url).pathname;
const publicDir = join(root, 'public');

const jobs = [
  {
    in: join(root, 'src/assets/bg-flare.jpg'),
    out: join(publicDir, 'bg-flare.webp'),
    resize: { width: 1920 },
    webp: { quality: 78 },
  },
  {
    in: join(root, 'src/assets/medical-logo.jpg'),
    out: join(publicDir, 'medical-logo.webp'),
    resize: { width: 512, height: 512, fit: 'inside' },
    webp: { quality: 82 },
  },
  {
    in: join(root, 'src/assets/zdravko1.webp'),
    out: join(publicDir, 'zdravko1.webp'),
    resize: { width: 512 },
    webp: { quality: 85 },
  },
];

for (const job of jobs) {
  let pipeline = sharp(job.in);
  if (job.resize) {
    pipeline = pipeline.resize(job.resize.width, job.resize.height, {
      fit: job.resize.fit || 'inside',
      withoutEnlargement: true,
    });
  }
  await pipeline.webp(job.webp).toFile(job.out);
  const kb = (statSync(job.out).size / 1024).toFixed(1);
  console.log(`${job.out.replace(root, '.')}: ${kb} KB`);
}
