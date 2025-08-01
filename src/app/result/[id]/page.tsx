"use client";

import { useParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import ResultDisplay from '@/components/ResultDisplay';
import { AllocationResult } from '@/types';

export default function ResultPage() {
  const params = useParams();
  const [result, setResult] = useState<AllocationResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    try {
      const id = params.id as string;
      const decodedData = atob(id);
      const parsedResult = JSON.parse(decodedData) as AllocationResult;
      setResult(parsedResult);
    } catch (err) {
      setError('잘못된 공유 링크입니다.');
    }
  }, [params.id]);

  if (error) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-red-50 via-white to-pink-50 flex items-center justify-center">
        <div className="text-center bg-white rounded-2xl shadow-2xl p-8 max-w-md">
          <svg className="w-20 h-20 text-red-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h1 className="text-3xl font-bold text-gray-800 mb-4">오류 발생</h1>
          <p className="text-gray-600 mb-6">{error}</p>
          <Link
            href="/"
            className="inline-block px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all transform hover:scale-105 shadow-lg"
          >
            홈으로 돌아가기
          </Link>
        </div>
      </main>
    );
  }

  if (!result) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="relative">
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-600 mx-auto"></div>
            <div className="animate-ping absolute top-0 left-0 right-0 rounded-full h-16 w-16 border-4 border-blue-400 opacity-20"></div>
          </div>
          <p className="text-gray-600 mt-6 text-lg font-medium">결과를 불러오는 중...</p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 mb-4">
            조 배정 결과
          </h1>
          <p className="text-gray-600 text-lg">공유된 조 배정 결과를 확인하세요</p>
        </div>
        
        <div className="max-w-4xl mx-auto space-y-6">
          <ResultDisplay result={result} />
          <Link
            href="/"
            className="block w-full py-4 px-6 bg-gradient-to-r from-gray-600 to-gray-700 text-white font-bold rounded-xl hover:from-gray-700 hover:to-gray-800 transition-all transform hover:scale-105 shadow-lg text-center"
          >
            <svg className="inline-block w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            새로운 배정 시작
          </Link>
        </div>
      </div>
    </main>
  );
}