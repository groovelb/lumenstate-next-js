/**
 * scripts/build-og.mjs
 *
 * Generate compressed OG variants (1200×630, JPEG, target ≤500KB) from
 * source images at build time. Run automatically via the `prebuild` hook
 * in package.json:
 *
 *   "scripts": {
 *     "prebuild": "node scripts/build-og.mjs",
 *     "og:build": "node scripts/build-og.mjs"
 *   }
 *
 * Why this exists:
 *
 * Product photos and hero images are typically large PNGs at the wrong
 * aspect ratio for OG (which wants 1200×630, 1.91:1). Using them directly:
 *   - KakaoTalk silently rejects images over ~500KB
 *   - 4:3 or square crops appear awkwardly cropped in the preview
 *   - PNG decode is slower than JPEG on crawler servers
 *
 * This script handles all three: cover-crops to 1200×630, encodes as
 * mozjpeg quality 82, warns on anything over 500KB. Output lives under
 * `public/og/` so it can be linked as `/og/...` from page metadata.
 *
 * Caching: jobs are skipped when the output exists and is newer than the
 * source. The first build creates everything; subsequent builds touch
 * nothing unless a source image changed.
 *
 * Setup:  npm i -D sharp
 */

import { statSync, mkdirSync, existsSync } from 'fs';
import path from 'path';
import sharp from 'sharp';

// =============================================================================
// Configure: list every (source → output) pair the project needs.
// Edit this section for your project. Sources are relative to `public/`.
// =============================================================================

const PUBLIC_DIR = path.join(process.cwd(), 'public');

const JOBS = [
  // Site-wide default / landing
  { src: 'images/og/landing-bg.jpg', out: 'og/landing.jpg' },
];

// One OG per product: uncomment and adapt to your data source.
//
// import { products } from '../src/data/products.js';
// for (const p of products) {
//   const source = p.images?.[0];
//   if (!source) continue;
//   JOBS.push({
//     src: source.replace(/^\//, ''),
//     out: `og/product/${p.id}.jpg`,
//   });
// }

// =============================================================================
// Tuning (rarely needs changing)
// =============================================================================

const SIZE = { width: 1200, height: 630 };
const QUALITY = 82;                   // JPEG quality — 82 is a tested sweet spot
const MAX_BYTES = 500 * 1024;         // Kakao's hard cutoff

// =============================================================================
// Pipeline — no edits needed below
// =============================================================================

function isStale(srcPath, outPath) {
  if (!existsSync(outPath)) return true;
  try {
    return statSync(srcPath).mtimeMs > statSync(outPath).mtimeMs;
  } catch {
    return true;
  }
}

async function processOne({ src, out }) {
  const srcPath = path.join(PUBLIC_DIR, src);
  const outPath = path.join(PUBLIC_DIR, out);

  if (!existsSync(srcPath)) {
    console.warn(`  ⚠ skip — source missing: ${src}`);
    return { status: 'missing' };
  }

  if (!isStale(srcPath, outPath)) {
    return { status: 'cached' };
  }

  mkdirSync(path.dirname(outPath), { recursive: true });

  await sharp(srcPath)
    .resize(SIZE.width, SIZE.height, { fit: 'cover', position: 'center' })
    .jpeg({ quality: QUALITY, mozjpeg: true })
    .toFile(outPath);

  const bytes = statSync(outPath).size;
  const oversized = bytes > MAX_BYTES;
  const kb = (bytes / 1024).toFixed(0);
  console.log(`  ${oversized ? '⚠' : '✓'} ${out} — ${kb}KB${oversized ? ' (exceeds Kakao 500KB)' : ''}`);
  return { status: oversized ? 'oversized' : 'ok', bytes };
}

async function main() {
  console.log(`[build-og] ${JOBS.length} job(s)`);
  const results = await Promise.all(JOBS.map(processOne));
  const counts = results.reduce((acc, r) => ({ ...acc, [r.status]: (acc[r.status] || 0) + 1 }), {});
  console.log(
    `[build-og] done — ${counts.ok || 0} built, ${counts.cached || 0} cached, ` +
    `${counts.oversized || 0} oversized, ${counts.missing || 0} missing`,
  );
  if (counts.oversized) {
    console.warn('[build-og] for oversized files, lower QUALITY or crop more tightly');
  }
}

main().catch((err) => {
  console.error('[build-og] failed:', err);
  process.exit(1);
});
