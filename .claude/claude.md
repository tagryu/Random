4. 알고리즘 개요
균등 분배 목표 인원 = floor(total / target) or ceil.
기존 조 정보로 맵핑 → greedy shuffle:
• prevGroup이 다른 멤버를 우선적으로 각 그룹에 round-robin.
인원 편차 ±1명 유지.
unassigned가 5명 이상이면 재귀 재배정 1회 수행.
5. 보안·성능
모든 연산은 Serverless 함수 1회 실행, 타임아웃 10초.
외부 저장소 없음 → 개인정보 브라우저 세션에만 존재.
HTTPS 강제, CSP 기본값.
6. 배포 파이프라인
GitHub push → Vercel 빌드 & 배포 → 생산 도메인.

7. 테스트
유닛: 파서, 알고리즘 1000명 입력 케이스 포함.
E2E: Playwright로 입력~결과 확인 흐름 자동화.

(4) 파일: `code_guideline.md`
코드 가이드라인
1. 공통
언어: TypeScript ES2022
Lint/Format: ESLint (airbnb-base) + Prettier
Commit: Conventional Commits
2. 폴더 구조
/src
  /app
    page.tsx
    layout.tsx
    /result
       [id]/page.tsx
  /components
  /lib
    allocate.ts
    parsePaste.ts
  /types
  /styles
3. naming
함수: camelCase, 명령형 (allocateMembers)
컴포넌트: PascalCase (PasteArea)
4. 테스트
Vitest + jsdom
Test 파일 위치: *.test.ts
5. 성능
알고리즘 O(n log n) 이하 목표
불필요한 re-render 방지: React.memo
6. 기타
클라이언트에서만 필요한 로직은 "use client" 파일 상단 명시

────────────────────────
