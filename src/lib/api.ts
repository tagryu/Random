import { supabase } from './supabase';
import { AllocationResult } from '@/types';

// 랜덤 short ID 생성 (6자리)
function generateShortId(): string {
  const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < 6; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

// 배정 결과 저장
export async function saveAllocation(result: AllocationResult): Promise<string | null> {
  try {
    let shortId = generateShortId();
    let attempts = 0;
    
    console.log('Saving allocation with shortId:', shortId);
    console.log('Supabase URL:', process.env.NEXT_PUBLIC_SUPABASE_URL);
    
    // 중복되지 않는 ID 찾기 (최대 5번 시도)
    while (attempts < 5) {
      const { data, error } = await supabase
        .from('allocations')
        .insert({
          short_id: shortId,
          result: result
        })
        .select()
        .single();
      
      if (!error) {
        console.log('Successfully saved allocation:', data);
        return shortId;
      }
      
      // 중복 에러가 아니면 실패
      if (error.code !== '23505') {
        console.error('Failed to save allocation:', error);
        console.error('Error details:', error.message, error.details);
        return null;
      }
      
      // 새로운 ID로 재시도
      shortId = generateShortId();
      attempts++;
    }
    
    return null;
  } catch (error) {
    console.error('Error saving allocation:', error);
    return null;
  }
}

// 배정 결과 조회
export async function getAllocation(shortId: string): Promise<AllocationResult | null> {
  try {
    console.log('Fetching allocation for shortId:', shortId);
    
    const { data, error } = await supabase
      .from('allocations')
      .select('result')
      .eq('short_id', shortId)
      .single();
    
    if (error) {
      console.error('Failed to get allocation:', error);
      return null;
    }
    
    console.log('Fetched data:', data);
    return data?.result as AllocationResult;
  } catch (error) {
    console.error('Error getting allocation:', error);
    return null;
  }
}