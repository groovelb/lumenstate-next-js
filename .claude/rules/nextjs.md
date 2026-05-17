---
paths:
  - "app/**/*"
---

# Next.js Rules (MUST)

## 핵심 원리

**"서버가 콘텐츠를 소유하고, 클라이언트가 움직임을 소유한다."**

## App Router 디렉토리 구조

```
app/
  layout.jsx                  # 루트 레이아웃 (서버 컴포넌트, metadata, 폰트)
  providers.jsx               # 'use client' ThemeRegistry (MUI + Emotion SSR)
  fonts.js                    # next/font 설정
  page.jsx                    # 홈페이지 (서버 컴포넌트)
  globals.css                 # 전역 CSS
  (pages)/                    # Route group (추가 페이지)
    [slug]/
      page.jsx
```

## app/ vs src/ 역할 구분

| 디렉토리 | 역할 | `'use client'` |
|----------|------|---------------|
| `app/` | 라우팅, 레이아웃, 메타데이터 | page.jsx에서 금지 |
| `app/providers.jsx` | ThemeRegistry | 필수 |
| `src/components/` | UI 컴포넌트 라이브러리 | MUI 사용 시 필수 |
| `src/stories/` | Storybook 문서 전용 | 불필요 |

## 서버/클라이언트 분리 규칙

### `'use client'` 배치

- `'use client'`는 트리 끝단(leaf)에만 배치
- page.jsx에는 **절대** `'use client'` 사용 금지
- layout.jsx는 서버 컴포넌트 유지 (ThemeRegistry는 별도 providers.jsx로 분리)

### MUI 컴포넌트

- MUI를 import하는 모든 컴포넌트 파일에 `'use client'` 필수
- `@mui/material-nextjs/v15-appRouter`의 `AppRouterCacheProvider`로 SSR 호환

### children 패턴

```jsx
// app/page.jsx (서버 컴포넌트)
<AnimatedSection>        {/* 'use client' — 움직임 담당 */}
  <h1>SEO 핵심 텍스트</h1> {/* 서버에서 렌더됨 */}
</AnimatedSection>
```

## 애니메이션 규칙

- **허용**: `transform`, `opacity`, `filter`
- **금지**: `width`, `height`, `margin`, `top`, `left` 애니메이션 (CLS 유발)
- 애니메이션 초기 상태에서 `opacity: 0` 사용 **금지** → `opacity: 0.01` 사용
- `prefers-reduced-motion` 필수 대응

## SEO 규칙

- 모든 page.jsx에 `metadata` 또는 `generateMetadata` export 필수
- `next/image` 사용 권장, width/height 명시 (CLS 방지)

## 3D/WebGL

- Three.js 등은 반드시 `next/dynamic({ ssr: false })` 사용

## 폰트 규칙

- `next/font/google` 또는 `next/font/local`로만 폰트 로딩
- CSS Custom Property(`--font-*`)로 참조
- Storybook에서는 기존 DOM 기반 로딩 유지

## 정적 자산 규칙

- 정적 자산은 `public/` 하위에 배치
- Vite 스타일 import 대신 공개 경로 사용 (`'/video/video.mp4'`)

## 새 페이지 추가 시

1. `app/` 하위에 폴더 생성 (라우트 세그먼트)
2. `page.jsx` 생성 (서버 컴포넌트)
3. `metadata` 또는 `generateMetadata` export
4. UI 컴포넌트는 `src/components/`에서 import
5. page.jsx에 `'use client'` 사용 금지
