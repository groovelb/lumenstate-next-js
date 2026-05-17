---
name: og-setup
description: Set up or upgrade Open Graph / Twitter / social-share metadata, OG image preparation, and dynamic OG image generation in any Next.js App Router project (13.4+, including 15 and 16). Use whenever the user mentions OG, Open Graph, og:image, opengraph-image, social preview, share preview, link preview, Kakao thumbnail, 카카오톡 썸네일, 공유 미리보기, metadataBase, generateMetadata, OG image compression, OG 압축본, OG 자산 준비, or asks why a shared link shows no image/title. Also invoke proactively when the user is adding or editing app/layout.{js,jsx,ts,tsx}, app/**/page.{js,jsx,ts,tsx}, or any opengraph-image.* file, and when product/hero images are about to be reused directly as OG (which silently fails on Kakao because of the 500KB cap). If the project already has OG metadata, detect what is missing or fragile and propose a replacement; do not blindly overwrite. MUST be used for any work that touches ImageResponse from next/og or that wires up an OG image preparation pipeline.
---

# og-setup — Next.js OG Metadata & Image Skill

A drop-in skill for setting up social-share metadata (Open Graph, Twitter Card) and OG image generation in any Next.js App Router project. Designed to work on a zero-base Next.js install, and to safely upgrade projects that already have partial OG configured.

## Why this skill exists

OG looks simple, but four silent failures bite almost every project:

1. **`'use client'` files cannot export metadata.** Next.js ignores it silently — no error, no warning. The page ships with zero OG tags.
2. **`openGraph` and `twitter` are NOT deep-merged across layout → page.** If a child page exports `openGraph: { title, description }`, the parent's `openGraph.images` is **completely replaced**, not extended. Same for `twitter.card` — set it once in layout and then the child overrides the whole `twitter` object and the card type drops back to the default `summary`. Every page that declares its own `openGraph` or `twitter` must re-declare `images` (and `twitter.card`) if it wants them. The top-level `title` likewise does not inherit into `openGraph.title` / `twitter.title`.
3. **Missing `metadataBase` breaks Kakao and Slack previews.** Relative image URLs (`/og/foo.png`) never get serialized into absolute URLs, and several crawlers (notably KakaoTalk) refuse to fetch them.
4. **Reusing product/hero images directly as OG breaks Kakao.** Source images are usually PNG, square or 4:3, and well over 500KB. KakaoTalk drops anything over ~500KB without telling anyone, so the share preview just shows nothing. Source images also crop awkwardly into 1.91:1.

This skill encodes the fixes for all four: metadata patterns, a build-time image compression pipeline (`templates/build-og.mjs`), and a reusable `ImageResponse` template for when dynamic per-page composition is actually needed.

## Workflow

When invoked, follow these four phases. Skip phases that don't apply to the user's specific request (e.g. if they only ask to add a dynamic OG image, jump straight to phase 3 with the relevant template).

### 1. Detect

Quickly map the project's current OG state. Run these in parallel:

- Read `app/layout.{js,jsx,ts,tsx}` — note whether `metadataBase`, `title.template`, `openGraph`, `twitter` are present.
- `grep -rL "generateMetadata\|export const metadata" app` over `page.*` files — list pages missing metadata.
- `grep -rl "^['\"]use client['\"]" app` and intersect with `page.*` / `layout.*` files — these are the silent-fail risks.
- List existing `opengraph-image.*` files and `public/og/*` assets if any.

Report findings concisely: what is present, what is missing, what is risky.

### 2. Propose

Tell the user what you will change before changing it. Always show a short diff or summary, especially for files that already have OG metadata. Ask which target site URL / brand name / locale to use if not obvious from the codebase or existing config. Default to `'ko_KR'` only if the project clearly targets Korea; otherwise ask.

### 3. Apply

First decide the **image strategy** (see "Image strategy" section below). Then copy the relevant templates from `templates/` into the project and substitute the project specifics (domain, brand name, locale, colors).

- **`templates/root-layout.jsx`** — patch or replace `app/layout.{js,jsx,ts,tsx}`. This is the single most important file: it sets `metadataBase`, `title.template`, OG/Twitter defaults that every page inherits.
- **`templates/page-metadata.jsx`** — drop into any `app/**/page.{js,jsx,ts,tsx}`. The same file shows both the static `metadata` object and the dynamic `generateMetadata` function with `cache()` — pick the variant that matches the page and delete the other.
- **`templates/build-og.mjs`** — copy to `scripts/build-og.mjs` when the project will reuse existing product/hero images as OG (most common case). Wire it into `package.json` as `"prebuild"` and `"og:build"`. Install with `npm i -D sharp`.
- **`templates/opengraph-image.jsx`** — drop at `app/opengraph-image.jsx` (site-wide default) or inside any route folder, **only when dynamic text composition is genuinely needed**. This is the reference `ImageResponse` implementation; it gracefully degrades if fonts or background images are missing.
- **`templates/opengraph-image-dynamic.jsx`** — drop at `app/[slug]/opengraph-image.jsx` for per-slug generated images. Same caveat — prefer static compressed variants from `build-og.mjs` first.

Match the user's existing file extension (`.js`/`.jsx`/`.ts`/`.tsx`) and quote style. TypeScript projects need `import type { Metadata } from 'next'` and explicit return types on `generateMetadata`.

### 4. Verify

After applying, give the user a copy-pastable verification block:

```bash
# Pages without metadata (should be empty for indexable routes)
grep -rL "generateMetadata\|export const metadata" app --include="page.*"

# 'use client' on a page/layout — these silently lose metadata
grep -rl "^['\"]use client['\"]" app | xargs grep -l "page\.\|layout\." 2>/dev/null

# Build and inspect rendered <head>
npm run build && npx next start
# then open the page and view-source — every og:* tag should be an absolute URL
```

Then list the four external validators they should hit:

- Meta Sharing Debugger — https://developers.facebook.com/tools/debug/
- LinkedIn Post Inspector — https://www.linkedin.com/post-inspector/
- Kakao 공유 디버거 (cache busting) — https://developers.kakao.com/tool/clear/og
- Unified preview — https://www.opengraph.xyz/

## Image strategy

Most projects fall into one of three strategies. Pick before touching code.

| Strategy | When to use | What to set up |
|---|---|---|
| **A. Compressed static variants** (recommended default) | Site has product/hero images that can be reused as OG | `templates/build-og.mjs` + `prebuild` hook. Point page metadata at `/og/...` paths. |
| **B. Hand-designed OG per page** | Marketing-led site with budget for design | Designer drops 1200×630 JPGs into `public/og/`. No script needed. |
| **C. Dynamic ImageResponse composition** | Content scales to many pages and per-page text overlay matters (blog posts, generated reports) | `templates/opengraph-image.jsx` or `opengraph-image-dynamic.jsx`. |

**Never** reuse a source PNG (>500KB, non-1.91:1) directly as the OG URL. KakaoTalk drops it, and the crop will be wrong everywhere else.

### Directory convention (strategy A and B)

```
public/
├── images/product/1.png      ← source, used by the actual product page
└── og/
    ├── landing.jpg            ← site-wide default (hand-made or generated)
    └── product/
        ├── 1.jpg              ← generated by build-og.mjs, 1200×630, ≤500KB
        └── 2.jpg
```

Keeping generated OG output under its own `public/og/` tree (rather than co-located with sources as `1-og.jpg`) makes it trivial to clean, regenerate, or `.gitignore`.

### Git policy

- **≤ ~50 OG images, infrequent changes** → commit them. Predictable, no build-time dependency on sharp, no Vercel surprises.
- **Hundreds of pages or frequent regeneration** → gitignore `public/og/` and rely on the `prebuild` hook to generate on Vercel.

### Metadata wiring

Once `/og/product/{id}.jpg` exists, page metadata stays simple:

```js
openGraph: { images: [{ url: `/og/product/${id}.jpg`, width: 1200, height: 630 }] }
```

No `existsSync` fallback needed — if the build-og script ran, the file is there. If it didn't, the page falls back to the root layout's site-wide OG image, which is the desired behavior.

## Critical gotchas (always check)

These are non-obvious failures. Mention them whenever you touch a related file:

| Symptom | Root cause | Fix |
|---|---|---|
| Page has no OG tags despite metadata export | `'use client'` is on the file | Move UI into a child component; keep `page.jsx` server-only |
| Social card title is blank but page title works | `openGraph.title` / `twitter.title` not set | These don't inherit — set explicitly |
| Page metadata renders og:title but no og:image | Child page declared `openGraph` without `images`, replacing the parent's | Re-declare `images` on every page that overrides `openGraph` |
| Card downgrades to small `summary` on a page that has it large elsewhere | Child page declared `twitter` without `card: 'summary_large_image'` | Re-declare `card` on every page that overrides `twitter` |
| OG image works on Twitter but Kakao/Slack show nothing | `metadataBase` missing → relative URL not serialized | Set `metadataBase: new URL(...)` in root layout |
| OG image works everywhere except Kakao | Source PNG is over Kakao's ~500KB cap | Use `templates/build-og.mjs` to emit a ≤500KB JPEG variant |
| OG image crop looks awkward in previews | Source isn't 1.91:1 (square product shots, 4:3 hero) | `build-og.mjs` cover-crops to 1200×630 |
| OG image updated but old image still shows | Platform cache (Kakao caches for days) | Use cache-busting suffix (`?v=2`) or hit each platform's debugger |
| ImageResponse renders empty boxes for Korean text | No CJK font registered | Pass a CJK font via the `fonts` option (see template) |
| `ImageResponse` build error about `display` | Satori requires `display: 'flex'` on every container with children | Add it explicitly; Satori does not assume defaults |

## Platform specs (one-line reference)

- **Universal**: 1200×630 PNG or JPG, 1.91:1, keep critical content within center 1080×565.
- **Kakao**: ≤ 500KB, absolute URL required, cache lives for days.
- **Twitter/X**: `twitter.card: 'summary_large_image'` to get the big card, else fallback to small thumbnail.
- **WhatsApp**: ≤ 300KB recommended, but treat as optional — most projects prioritize visual quality.

## What this skill deliberately does NOT do

To stay portable and lean, this skill avoids:

- **Sitemap, robots, manifest, JSON-LD** — separate concerns, separate skills.
- **Auto-injecting environment variable branching** — added only when the user explicitly has multiple environments.
- **Choosing between Node and Edge runtime for ImageResponse** — the templates default to Node runtime because `fs`-based font loading is dramatically simpler and works in 9/10 cases. Switch to Edge only if the user explicitly needs it.
- **Tailwind/MUI/styled-components specific patterns** — `ImageResponse` uses Satori which only supports inline `style` props, regardless of the host project's styling system.
- **Content-hash filenames or query-string cache busting on OG images** — KakaoTalk's debugger has a manual cache-clear button; that is sufficient. Hash filenames add debugging cost without solving the underlying long-cache reality.
- **WebP / AVIF for OG output** — slightly smaller, but a non-trivial portion of crawlers (older Slack, some link unfurlers) still mishandle them. JPEG quality 82 is the boring-correct default.
