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

-- 만료된 데이터 자동 삭제를 위한 정책 (선택사항)
CREATE OR REPLACE FUNCTION delete_expired_allocations()
RETURNS void AS $$
BEGIN
  DELETE FROM allocations WHERE expires_at < NOW();
END;
$$ LANGUAGE plpgsql;

-- 매일 실행되는 크론 작업 (pg_cron 익스텐션이 필요)
-- SELECT cron.schedule('delete-expired-allocations', '0 0 * * *', 'SELECT delete_expired_allocations();');