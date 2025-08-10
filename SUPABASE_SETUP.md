# Supabase 설정 가이드

이 프로젝트는 조 배정 결과를 저장하고 공유하기 위해 Supabase를 사용합니다.

## 1. Supabase 프로젝트 생성

1. [Supabase](https://supabase.com)에 가입하고 새 프로젝트를 생성합니다.
2. 프로젝트 설정에서 다음 정보를 확인합니다:
   - Project URL
   - Anon/Public Key

## 2. 환경 변수 설정

`.env.local` 파일에 다음 환경 변수를 추가합니다:

```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## 3. 데이터베이스 테이블 생성

Supabase 대시보드의 SQL Editor에서 다음 SQL을 실행합니다:

```sql
-- 배정 결과를 저장할 테이블
CREATE TABLE IF NOT EXISTS allocations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  short_id VARCHAR(10) UNIQUE NOT NULL,
  result JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  expires_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() + INTERVAL '30 days'
);

-- short_id 인덱스 추가 (빠른 조회를 위해)
CREATE INDEX IF NOT EXISTS idx_allocations_short_id ON allocations(short_id);
```

## 4. RLS (Row Level Security) 설정

보안을 위해 RLS를 활성화하고 정책을 추가합니다:

```sql
-- RLS 활성화
ALTER TABLE allocations ENABLE ROW LEVEL SECURITY;

-- 모든 사용자가 읽기 가능
CREATE POLICY "Anyone can read allocations" ON allocations
FOR SELECT USING (true);

-- 모든 사용자가 쓰기 가능 (필요시 제한 가능)
CREATE POLICY "Anyone can create allocations" ON allocations
FOR INSERT WITH CHECK (true);
```

## 5. 문제 해결

### QR 코드로 접속했을 때 데이터가 안 보이는 경우:

1. **브라우저 콘솔 확인**: F12를 눌러 개발자 도구를 열고 Console 탭에서 에러를 확인합니다.

2. **Supabase 연결 확인**:
   - 환경 변수가 올바르게 설정되었는지 확인
   - Supabase 대시보드에서 테이블이 생성되었는지 확인
   - RLS 정책이 올바르게 설정되었는지 확인

3. **네트워크 확인**:
   - 모바일 기기가 인터넷에 연결되어 있는지 확인
   - Supabase API 호출이 성공하는지 Network 탭에서 확인

4. **데이터 저장 확인**:
   - Supabase 대시보드의 Table Editor에서 `allocations` 테이블을 확인
   - 데이터가 실제로 저장되었는지 확인

### 로컬 개발 환경에서 모바일 접속:

- 컴퓨터와 모바일 기기가 같은 Wi-Fi 네트워크에 연결되어 있어야 합니다
- QR 코드의 URL이 `http://192.168.x.x:3000` 형식이어야 합니다
- 컴퓨터의 방화벽이 3000 포트를 차단하지 않아야 합니다