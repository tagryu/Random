# TRD – 기술 요구 사양서

## 1. 아키텍처 개요
Next.js 14 (App Router, TypeScript)  
• 프론트 + API Route(Serverless Function) 일체형 구조  
• 배포: Vercel (자동 CI/CD)

## 2. 주요 모듈
| 모듈 | 설명 |
| --- | --- |
| UI 입력 폼 | 인원/조 수, 붙여넣기 텍스트 영역 |
| Paste Parser | TSV 데이터 → JSON 배열 변환 (클라이언트) |
| Allocation Engine | 인원 균등 분배 + 기존 조 중복 최소화 알고리즘 (서버리스 함수) |
| Validation | 미배정 인원, 균등 여부 검사 |
| Result Viewer | 조별 표 + 요약 통계 렌더링 |
| Share Link | 동적 Route (`/result/[id]`)로 결과 표시, id는 base64-encoded payload |

## 3. 데이터 구조
```ts
interface Member {
  name: string;
  prevGroup: string;
}

interface InputPayload {
  members: Member[];
  targetGroups: number;
}

interface AllocationResult {
  groups: Record<string, Member[]>; // key: 그룹명
  unassigned: Member[];             // 미배정