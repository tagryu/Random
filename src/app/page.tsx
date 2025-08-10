"use client";

import { useState, useEffect } from 'react';
import Image from 'next/image';
import AllocationForm from '@/components/AllocationForm';
import ResultDisplay from '@/components/ResultDisplay';
import AllocationHistoryComponent from '@/components/AllocationHistory';
import { AllocationResult } from '@/types';
import { getLastAllocation, AllocationHistory } from '@/lib/storage';

export default function Home() {
  const [result, setResult] = useState<AllocationResult | null>(null);
  const [hasHistory, setHasHistory] = useState(false);

  useEffect(() => {
    // 페이지 로드 시 히스토리 확인
    const lastAllocation = getLastAllocation();
    if (lastAllocation) {
      setHasHistory(true);
    }
  }, []);

  const handleAllocationComplete = (newResult: AllocationResult) => {
    setResult(newResult);
  };

  const handleReAllocate = () => {
    setResult(null);
  };

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-2 py-8">
        <div className="text-center mb-12">
          <div className="bg-white rounded-2xl shadow-lg p-8 max-w-3xl mx-auto">
            <Image 
              src="/design_asset/title.png" 
              alt="랜덤 조 배정 서비스" 
              width={600} 
              height={120}
              className="mx-auto"
              priority
            />
          </div>
        </div>
        
        <div className="w-full">
          {!result ? (
            <div className="space-y-6">
              {hasHistory && (
                <AllocationHistoryComponent />
              )}
              <div className="bg-white rounded-2xl shadow-2xl p-8">
                <AllocationForm onAllocationComplete={handleAllocationComplete} />
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              <ResultDisplay result={result} onReAllocate={handleReAllocate} />
              <button
                onClick={() => setResult(null)}
                className="w-full py-4 px-6 bg-gray-900 text-white font-medium rounded-xl hover:bg-gray-800 transition-colors"
              >
                <svg className="inline-block w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                새로운 배정 시작
              </button>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}