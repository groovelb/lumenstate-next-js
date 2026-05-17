/**
 * scripts/build-og.mjs
 *
 * Build-time OG image generator for Lumenstate.
 *
 * Sources live in `src/assets/` as static imports (no public/ copies).
 * This script reads them directly and emits 1200×630 JPEGs (≤500KB) to:
 *
 *   public/og/landing.jpg              ← hero (arc-lamp-living)
 *   public/og/product/{id}.jpg         ← one per product (id 1..N)
 *
 * Run via `prebuild` (auto) or `npm run og:build` (manual).
 * Requires: `npm i -D sharp`
 */

import { statSync, mkdirSync, existsSync } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import sharp from 'sharp';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const SRC_ASSETS = path.join(ROOT, 'src', 'assets');
const PUBLIC_DIR = path.join(ROOT, 'public');

// =============================================================================
// Jobs — (source absolute path → output path relative to public/)
// =============================================================================

const JOBS = [
  // Landing — brand hero (Day variant of arc-lamp-living)
  {
    src: path.join(SRC_ASSETS, 'brand-mood', 'arc-lamp-living.png'),
    out: 'og/landing.jpg',
  },
];

// One OG per product (id 1..20). Uses the primary image at src/assets/product/{id}.png.
const PRODUCT_COUNT = 20;
for (let id = 1; id <= PRODUCT_COUNT; id += 1) {
  JOBS.push({
    src: path.join(SRC_ASSETS, 'product', `${id}.png`),
    out: `og/product/${id}.jpg`,
  });
}

// =============================================================================
// Tuning
// =============================================================================

const SIZE = { width: 1200, height: 630 };
const QUALITY = 82;
const MAX_BYTES = 500 * 1024;

// =============================================================================
// Pipeline
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
  const outPath = path.join(PUBLIC_DIR, out);

  if (!existsSync(src)) {
    console.warn(`  ⚠ skip — source missing: ${path.relative(ROOT, src)}`);
    return { status: 'missing' };
  }

  if (!isStale(src, outPath)) {
    return { status: 'cached' };
  }

  mkdirSync(path.dirname(outPath), { recursive: true });

  await sharp(src)
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
  const counts = results.reduce(
    (acc, r) => ({ ...acc, [r.status]: (acc[r.status] || 0) + 1 }),
    {},
  );
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
