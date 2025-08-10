import { AllocationResult } from '@/types';

export interface AllocationHistory {
  id: string;
  shortId: string;
  result: AllocationResult;
  createdAt: string;
  title?: string;
}

const STORAGE_KEY = 'allocation_history';
const MAX_HISTORY = 10;

// UUID 생성 함수 (crypto.randomUUID가 없는 환경을 위한 폴백)
function generateUUID(): string {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  // 폴백: 간단한 UUID 생성
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

// 히스토리 가져오기
export function getHistory(): AllocationHistory[] {
  if (typeof window === 'undefined') return [];
  
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('Failed to get history:', error);
    return [];
  }
}

// 히스토리에 추가
export function addToHistory(shortId: string, result: AllocationResult): void {
  if (typeof window === 'undefined') return;
  
  try {
    const history = getHistory();
    
    // 이미 같은 shortId가 존재하면 추가하지 않음
    if (history.some(h => h.shortId === shortId)) {
      return;
    }
    
    const newItem: AllocationHistory = {
      id: generateUUID(),
      shortId,
      result,
      createdAt: new Date().toISOString(),
      title: `${result.stats.totalMembers}명 → ${Object.keys(result.groups).length}개 조`
    };
    
    // 최신 항목을 앞에 추가
    const updated = [newItem, ...history].slice(0, MAX_HISTORY);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch (error) {
    console.error('Failed to save history:', error);
  }
}

// 특정 항목 삭제
export function removeFromHistory(id: string): void {
  if (typeof window === 'undefined') return;
  
  try {
    const history = getHistory();
    const updated = history.filter(h => h.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch (error) {
    console.error('Failed to remove history:', error);
  }
}

// 전체 히스토리 삭제
export function clearHistory(): void {
  if (typeof window === 'undefined') return;
  
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error('Failed to clear history:', error);
  }
}

// 최근 배정 가져오기
export function getLastAllocation(): AllocationHistory | null {
  const history = getHistory();
  return history.length > 0 ? history[0] : null;
}