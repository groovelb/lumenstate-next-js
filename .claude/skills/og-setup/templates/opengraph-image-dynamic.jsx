/**
 * Dynamic ImageResponse — app/[slug]/opengraph-image.jsx
 *
 * Use this when each detail page needs its own generated OG image (e.g.
 * blog posts, products). Drop the file next to the `page.jsx` that owns
 * the dynamic segment. Next.js auto-wires it; you do not need to reference
 * it from `generateMetadata`.
 *
 * This builds on the static template (see opengraph-image.jsx) — same
 * runtime, same loader helper, same flexbox + gradient pattern. The only
 * additions are:
 *
 * 1. The default export receives `{ params }` and awaits it (Next 15+).
 * 2. The data fetch is wrapped in try/catch so a missing record or a
 *    flaky upstream API never breaks the social card. The function falls
 *    back to the site's default branding.
 *
 * Performance note: by default, dynamic OG images are generated on demand
 * and cached by Next.js. If your data source is slow, consider exporting
 * `generateStaticParams` from the matching `page.jsx` — that will also
 * statically pre-render this image at build time.
 */

import { ImageResponse } from 'next/og';
import { readFileSync } from 'fs';
import path from 'path';
// import { cache } from 'react';
// import { getItem } from '@/lib/data';     // your data layer
// const loadItem = cache(getItem);

export const runtime = 'nodejs';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';
export const alt = 'Brand';

const FALLBACK = {
  title: 'Brand',
  subtitle: 'One-sentence tagline.',
  bg: '#0a0a0a',
  fg: '#ffffff',
};

function loadPublic(relativePath) {
  try {
    return readFileSync(path.join(process.cwd(), 'public', relativePath));
  } catch {
    return null;
  }
}

export default async function Image({ params }) {
  const { slug } = await params;

  let data = FALLBACK;
  try {
    // Replace with your actual fetch. Sharing the cached loader with
    // generateMetadata in page.jsx avoids a duplicate request.
    //
    // const item = await loadItem(slug);
    // if (item) data = { ...FALLBACK, title: item.title, subtitle: item.summary };
  } catch {
    // Keep FALLBACK — never let a 500 reach a social crawler.
  }

  const bgBuf = loadPublic('og/bg.jpg');
  const bgDataUrl = bgBuf
    ? `data:image/jpeg;base64,${bgBuf.toString('base64')}`
    : null;

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          position: 'relative',
          background: data.bg,
          color: data.fg,
        }}
      >
        {bgDataUrl && (
          <img
            src={bgDataUrl}
            width={1200}
            height={630}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              objectFit: 'cover',
            }}
          />
        )}

        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'flex-end',
            padding: 72,
            background:
              'linear-gradient(180deg, rgba(0,0,0,0.15) 40%, rgba(0,0,0,0.78) 100%)',
          }}
        >
          <div
            style={{
              display: 'flex',
              fontSize: 72,
              fontWeight: 700,
              letterSpacing: -1,
              lineHeight: 1.1,
            }}
          >
            {truncate(data.title, 60)}
          </div>
          <div
            style={{
              display: 'flex',
              fontSize: 32,
              marginTop: 16,
              lineHeight: 1.3,
              opacity: 0.85,
            }}
          >
            {truncate(data.subtitle, 120)}
          </div>
        </div>
      </div>
    ),
    { ...size },
  );
}

function truncate(s, n) {
  if (!s) return '';
  return s.length > n ? `${s.slice(0, n - 1)}…` : s;
}
