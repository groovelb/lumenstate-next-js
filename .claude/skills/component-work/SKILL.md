---
name: component-work
description: ALWAYS invoke this skill when files under src/components/ are created, modified, or deleted. Do not edit component files directly — use this skill first. Also trigger for any story file (.stories.jsx) work. Manages component taxonomy, design tokens, and interactive patterns for MUI-based design system. 페이지 작업 시에도 이 스킬을 사용 — UI는 `src/components/templates/` 에 만들고 `app/`에는 얇은 라우트 파일만 추가하는 패턴.
when_to_use: ALWAYS invoke this skill when files under src/components/ are created, modified, deleted, or refactored. Do not edit component or story files directly — use this skill first. Also trigger when user mentions making, editing, removing components, stories, or pages (페이지 작업은 templates/ 카테고리로 처리).
---

# Component Work Skill

> 컴포넌트 생성, 수정, 삭제, 스토리 작업 시 활성화되는 워크플로우

## 활성화 조건

| 의도 | 트리거 예시 |
|------|-----------|
| 생성 | "만들어줘", "새로 필요해", "추가하고 싶어" |
| 수정 | "수정해줘", "추가해줘", "개선해줘", "변경해줘" |
| 삭제 | "삭제해줘", "제거해줘" |
| 스토리 | "스토리 수정", "argTypes 추가", "스토리 작성" |
| 페이지 | "About 페이지 만들어줘", "라우트 추가해줘", "새 페이지 필요해" |

---

## 워크플로우

### 의도 분기

```
├── 생성 → 생성 워크플로우
├── 수정 → 수정 워크플로우
├── 삭제 → 삭제 워크플로우
├── 스토리 → 스토리 워크플로우
└── 페이지 → 페이지 워크플로우 (templates/ + thin route)
```

### 생성 워크플로우

1. **의도 구체화**: 사용자가 원하는 컴포넌트 유형 파악
2. **텍소노미 참조**: `resources/taxonomy-index.md` Read → 해당 카테고리와 원형 후보 제시
   - "이 카테고리에 이런 원형들이 있습니다: ..."
   - 텍소노미는 절대 기준이 아닌 맥락 안내 도구
3. **기존 컴포넌트 확인**: `resources/components.md` Read
   - 기존 것으로 커버 가능하면 재활용, 아니면 신규 생성
4. **구현**:
   - `.claude/rules/directory-structure.md`에 따라 위치 결정
   - **Next.js 클라이언트 경계 체크 (CRITICAL)**:
     - MUI import / 훅(`useState`, `useEffect`, `useRef`) / 이벤트 핸들러 / 브라우저 API 사용 시 → 파일 최상단에 `'use client'` 필수
     - 스토리 파일(`.stories.jsx`)에는 `'use client'` 사용 금지
   - `resources/storybook-writing.md` Read → 스토리 작성
   - 인터랙티브 감지 시 → `resources/interactive-principles.md` Read
   - `resources/components.md` 업데이트 (MUST)
   - `src/data/ruleRelationships.js` 동기화 (해당 시)

### 수정 워크플로우

1. 대상 컴포넌트 파악 (`resources/components.md` Read)
2. 현재 동작/코드 확인
3. 수정 구현 (기존 동작 유지)
4. `resources/storybook-writing.md` Read → 스토리 동기화
5. `resources/components.md` 설명 업데이트 (기능 변경 시)

### 삭제 워크플로우

1. 의존성 확인 (해당 컴포넌트를 사용하는 곳)
2. 컴포넌트 파일 + 스토리 파일 삭제
3. `resources/components.md`에서 항목 제거

### 스토리 워크플로우

1. `resources/storybook-writing.md` Read → 규칙 확인
2. 스토리 수정/작성

### 페이지 워크플로우 (Thin Route + Template Component)

Next.js 페이지 추가 시 **UI 본체와 라우트 결선을 분리**한다.

1. **템플릿 컴포넌트 생성** — `src/components/templates/{PageName}Template.jsx`
   - 텍소노미 #18 Templates 카테고리
   - 생성 워크플로우의 4단계 그대로 따름 (`'use client'` 체크, 스토리 작성, `components.md` 업데이트)
   - UI 조립, MUI sx, 인터랙션 등 모든 클라이언트 로직은 여기에
2. **라우트 파일 추가** — `app/{route}/page.jsx`
   - **`'use client'` 사용 금지** (서버 컴포넌트 유지)
   - `metadata` 또는 `generateMetadata` export 필수
   - 템플릿 컴포넌트만 import해서 렌더 (얇게 유지)
3. **검증**
   - 페이지 SEO 메타데이터 확인
   - `next/image`로 이미지 사용 시 width/height 명시 (CLS 방지)

#### 패턴 예시

```jsx
// app/about/page.jsx — 얇은 라우트 (서버 컴포넌트)
import AboutPageTemplate from '@/components/templates/AboutPageTemplate';

export const metadata = {
  title: 'About',
  description: 'About page description',
};

export default function AboutPage() {
  return <AboutPageTemplate />;
}
```

```jsx
// src/components/templates/AboutPageTemplate.jsx — UI 본체
'use client';

import { Box } from '@mui/material';
// ... 섹션 조합, 인터랙션
```

#### 페이지 워크플로우 적용 범위

- ✅ 정적 페이지, 일반적인 마케팅/소개 페이지
- ✅ 컴포넌트 조합으로 표현 가능한 페이지
- ⚠️ 동적 라우트(`[id]`) + 서버 데이터 fetch, 라우트 그룹, route handlers, middleware 등 App Router 고급 패턴은 이 스킬 범위 밖

---

## Resources

| 파일 | 용도 | 언제 Read |
|------|------|----------|
| `components.md` | 기존 컴포넌트 목록 | 생성/수정/삭제 시 (중복 방지) |
| `mui-theme.md` | MUI 테마 설정 | 테마/스타일 수정 시 |
| `refactoring-guide.md` | 리팩토링 가이드 | 리팩토링 시 |
| `project-summary.md` | 프로젝트 개요/맥락 | 온보딩/맥락 파악 시 |
| `taxonomy-v0.4.md` | 전체 분류체계 상세 | 카테고리 상세 정보 필요 시 |
| `taxonomy-index.md` | 빠른 인덱스 | 생성 시 카테고리 후보 파악 (우선) |
| `storybook-writing.md` | 스토리 작성 규칙 | 스토리 작성/수정 시 |
| `interactive-principles.md` | 인터랙티브 원칙 | 아래 감지 조건 해당 시 |

---

## 텍소노미 활용 원칙

- 텍소노미는 100% 절대 기준이 아님
- "골라라"가 아니라 **"만들려는 게 이런 맥락이 맞나요?"**
- 사용자의 불확실한 목적을 체계적으로 구체화
- 텍소노미에 없는 패턴도 가장 가까운 카테고리에 배치 가능

## 인터랙티브 감지 조건

아래 중 하나라도 해당하면 `resources/interactive-principles.md` Read 필수:
- Framer Motion, GSAP 등 애니메이션 라이브러리 사용
- 스크롤 기반 인터랙션 구현
- 텍소노미 #11~#15 카테고리 작업
- CSS 애니메이션을 넘어서는 인터랙션

## `'use client'` 판단 체크리스트

컴포넌트 생성/수정 완료 전 확인:

- [ ] MUI import가 있는가? → `'use client'` 필수
- [ ] `useState`, `useEffect`, `useRef`, `useContext` 등 훅을 쓰는가? → `'use client'` 필수
- [ ] `onClick`, `onChange`, `onSubmit` 등 이벤트 핸들러가 있는가? → `'use client'` 필수
- [ ] `window`, `document`, `localStorage` 등 브라우저 API를 쓰는가? → `'use client'` 필수
- [ ] Framer Motion, GSAP, Three.js 등 클라이언트 전용 라이브러리를 쓰는가? → `'use client'` 필수
- [ ] 위 조건이 모두 없고 children만 받는 순수 레이아웃 컴포넌트인가? → 서버 컴포넌트 유지 가능
- [ ] 스토리 파일(`.stories.jsx`)인가? → `'use client'` 금지

> 자세한 원칙은 `.claude/rules/nextjs.md` 참조 (트리 끝단 leaf에만 `'use client'` 배치).
