# Project Rules

## META INSTRUCTION

IMPORTANT: 이 문서와 참조된 모든 규칙은 프로젝트 법률이다.
YOU MUST 코드 작업 전 관련 규칙을 확인하고, 위반 가능성이 있으면 먼저 사용자에게 알려라.
YOU MUST NOT 명시적 허용 없이 규칙을 위반하는 코드를 작성하지 마라.

## Rules (자동 로드)

### CRITICAL (절대 위반 불가)
@.claude/rules/project-summary.md
@.claude/rules/mui-grid-usage.md

### MUST (반드시 준수)
@.claude/rules/code-convention.md
@.claude/rules/design-system.md
@.claude/rules/directory-structure.md
@.claude/rules/nextjs.md

## Workflow
- 디자인 관련 작업 → `/frontend-design` Skill 사용
- 컴포넌트 작업 → `component-work` Skill이 워크플로우 담당
- 리팩토링 → `component-work` Skill 내 `resources/refactoring-guide.md` 참조
- 룰 수정 먼저 제안 → `src/data/ruleRelationships.js` 동기화 필수
