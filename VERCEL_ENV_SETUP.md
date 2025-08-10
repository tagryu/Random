# Vercel 환경 변수 설정 가이드

## 1. Vercel 대시보드에서 환경 변수 추가하기

1. [Vercel 대시보드](https://vercel.com/dashboard)에 로그인
2. 프로젝트 선택 (random-team-allocation 또는 해당 프로젝트명)
3. 상단 메뉴에서 **Settings** 클릭
4. 왼쪽 사이드바에서 **Environment Variables** 클릭

## 2. 다음 환경 변수 추가

### NEXT_PUBLIC_SUPABASE_URL
- **Key**: `NEXT_PUBLIC_SUPABASE_URL`
- **Value**: `https://gaslbmqzonjfenvfxuno.supabase.co`
- **Environment**: Production, Preview, Development 모두 체크

### NEXT_PUBLIC_SUPABASE_ANON_KEY
- **Key**: `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- **Value**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imdhc2xibXF6b25qZmVudmZ4dW5vIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ2NjM1OTAsImV4cCI6MjA3MDIzOTU5MH0.RirI2VFz1AISj4TVLM2Ez7FoF0fepUFaFohpnDi1DSM`
- **Environment**: Production, Preview, Development 모두 체크

## 3. 저장 및 재배포

1. 각 환경 변수 입력 후 **Save** 버튼 클릭
2. 모든 환경 변수 추가 완료 후, 재배포가 필요할 수 있습니다:
   - Deployments 탭으로 이동
   - 최신 배포의 점 3개 메뉴 클릭
   - **Redeploy** 선택

## 4. 확인사항

- 환경 변수가 제대로 설정되었는지 확인
- 배포 후 브라우저 콘솔에서 Supabase 연결 에러가 없는지 확인
- QR 코드로 공유한 링크가 정상 작동하는지 테스트

## 보안 참고사항

- `NEXT_PUBLIC_` 접두사가 붙은 환경 변수는 클라이언트에서 접근 가능합니다
- Supabase Anon Key는 공개되어도 RLS(Row Level Security) 정책으로 보호됩니다
- 민감한 정보는 서버 사이드 환경 변수로 설정하세요