/**
 * Reference ImageResponse — app/opengraph-image.jsx
 *
 * Drop this at the root of `app/` for a site-wide OG image, or inside any
 * route folder (e.g. `app/about/opengraph-image.jsx`) for a section-specific
 * one. The deepest matching file wins.
 *
 * Design choices and why:
 *
 * - `runtime = 'nodejs'` (not 'edge'). Node lets us load fonts and background
 *   images with `fs.readFileSync` from `public/`. Edge runtime requires
 *   fetching every asset over HTTP at render time, which is slower, fragile
 *   in development, and adds latency for no real benefit on most projects.
 *
 * - `loadPublic()` returns `null` instead of throwing when an asset is
 *   missing. ImageResponse will still render a usable image (text on a
 *   solid background) instead of returning a 500 to the social crawler.
 *
 * - The `fonts` option only registers fonts that actually loaded. If you
 *   don't drop font files into `public/fonts/`, the renderer falls back
 *   to the system sans-serif and the image still ships. This makes the
 *   template safe to use on a zero-base project.
 *
 * - A linear gradient overlay sits on top of the background image so the
 *   text remains readable regardless of which photo you put behind it.
 *
 * - Every element with children has `display: 'flex'`. Satori (the
 *   renderer behind ImageResponse) does not default to flex and will
 *   throw at build time if you forget.
 *
 * For Korean / CJK text: uncomment the Pretendard block (or substitute
 * Noto Sans KR). Without an explicit CJK font, ImageResponse renders
 * empty rectangles for Korean glyphs.
 */

import { ImageResponse } from 'next/og';
import { readFileSync } from 'fs';
import path from 'path';

export const runtime = 'nodejs';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';
export const alt = 'Brand — Tagline';

const BRAND = {
  title: 'Brand',
  subtitle: 'One-sentence tagline that describes what this site is.',
  bg: '#0a0a0a',
  fg: '#ffffff',
  accent: '#888888',
};

function loadPublic(relativePath) {
  try {
    return readFileSync(path.join(process.cwd(), 'public', relativePath));
  } catch {
    return null;
  }
}

export default async function Image() {
  // Drop a background photo at public/og/bg.jpg (optional).
  const bgBuf = loadPublic('og/bg.jpg');
  const bgDataUrl = bgBuf
    ? `data:image/jpeg;base64,${bgBuf.toString('base64')}`
    : null;

  // CJK font registration — uncomment if your text includes Korean / Japanese / Chinese.
  // Place the .otf or .ttf files at public/fonts/ first.
  //
  // const fontRegular = loadPublic('fonts/Pretendard-Regular.otf');
  // const fontBold    = loadPublic('fonts/Pretendard-Bold.otf');

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          position: 'relative',
          background: BRAND.bg,
          color: BRAND.fg,
          // fontFamily: 'Pretendard',  // uncomment together with the font block below
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
            {BRAND.title}
          </div>
          <div
            style={{
              display: 'flex',
              fontSize: 32,
              fontWeight: 400,
              marginTop: 16,
              lineHeight: 1.3,
              color: BRAND.fg,
              opacity: 0.85,
            }}
          >
            {BRAND.subtitle}
          </div>
        </div>
      </div>
    ),
    {
      ...size,
      // fonts: [
      //   fontRegular && { name: 'Pretendard', data: fontRegular, weight: 400, style: 'normal' },
      //   fontBold    && { name: 'Pretendard', data: fontBold,    weight: 700, style: 'normal' },
      // ].filter(Boolean),
    },
  );
}
