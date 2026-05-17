/**
 * Reference root layout — app/layout.jsx
 *
 * Replace the SITE_URL, brand strings, and locale before committing.
 * For TypeScript projects, change the import and add `: Metadata` to the export.
 *
 * Why this shape:
 * - `metadataBase` turns every relative image/url path into an absolute URL.
 *   Without it Kakao and Slack previews silently fail. Set it once here.
 * - `title.template` formats every child page's title as "Page | Brand".
 *   Child pages can just write `title: 'About'` and get the suffix for free.
 *   A page that wants to opt out can use `title: { absolute: 'Custom' }`.
 * - `openGraph.title` / `twitter.title` are set explicitly because the
 *   top-level `title` does NOT cascade into them. This is the single most
 *   common silent failure in Next.js OG setup.
 * - Images here act as the site-wide default and are overridden by any
 *   `opengraph-image.*` file in a route folder, or by a page that exports
 *   its own `openGraph.images`.
 */

import './globals.css';

const SITE_URL = 'https://example.com';
const BRAND = 'Brand';
const TAGLINE = 'One-sentence description of what this site is.';

export const metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${BRAND} — ${TAGLINE}`,
    template: `%s | ${BRAND}`,
  },
  description: TAGLINE,
  applicationName: BRAND,
  alternates: { canonical: '/' },
  robots: { index: true, follow: true },
  icons: { icon: '/favicon.svg' },
  openGraph: {
    type: 'website',
    siteName: BRAND,
    locale: 'en_US',
    url: SITE_URL,
    title: `${BRAND} — ${TAGLINE}`,
    description: TAGLINE,
    // Images intentionally omitted: a sibling `opengraph-image.{png,jpg,jsx}`
    // at app/ root takes precedence and is the easier maintenance path.
    // Add an explicit `images` array here only if you don't use the file convention.
  },
  twitter: {
    card: 'summary_large_image',
    title: `${BRAND} — ${TAGLINE}`,
    description: TAGLINE,
    // creator: '@your_handle',
    // site: '@your_handle',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
