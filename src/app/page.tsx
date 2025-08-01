"use client";

import { useState } from 'react';
import AllocationForm from '@/components/AllocationForm';
import ResultDisplay from '@/components/ResultDisplay';
import { AllocationResult } from '@/types';

export default function Home() {
  const [result, setResult] = useState<AllocationResult | null>(null);

  const handleAllocationComplete = (newResult: AllocationResult) => {
    setResult(newResult);
  };

  const handleReAllocate = () => {
    setResult(null);
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 mb-4">
            랜덤 조 배정 서비스
          </h1>
          <p className="text-gray-600 text-lg">공정하고 균등한 조 배정을 원클릭으로!</p>
        </div>
        
        <div className="max-w-4xl mx-auto">
          {!result ? (
            <div className="bg-white rounded-2xl shadow-2xl p-8">
              <AllocationForm onAllocationComplete={handleAllocationComplete} />
            </div>
          ) : (
            <div className="space-y-6">
              <ResultDisplay result={result} onReAllocate={handleReAllocate} />
              <button
                onClick={() => setResult(null)}
                className="w-full py-4 px-6 bg-gradient-to-r from-gray-600 to-gray-700 text-white font-bold rounded-xl hover:from-gray-700 hover:to-gray-800 transition-all transform hover:scale-105 shadow-lg"
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