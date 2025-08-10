"use client";

import { AllocationResult } from '@/types';
import { useState, useEffect } from 'react';
import { saveAllocation } from '@/lib/api';
import { addToHistory } from '@/lib/storage';
import QRCode from 'react-qr-code';

interface ResultDisplayProps {
  result: AllocationResult;
  onReAllocate?: () => void;
  skipSave?: boolean;
  existingShortId?: string;
}

export default function ResultDisplay({ result, onReAllocate, skipSave = false, existingShortId }: ResultDisplayProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [isSaved, setIsSaved] = useState(false);
  const [shareUrl, setShareUrl] = useState<string | null>(null);
  const [showQRModal, setShowQRModal] = useState(false);
  
  useEffect(() => {
    // 기존 shortId가 있으면 그것을 사용
    if (existingShortId) {
      const url = `${window.location.origin}/result/${existingShortId}`;
      setShareUrl(url);
      return;
    }
    
    // skipSave가 false이고 아직 저장하지 않았을 때만 저장
    if (!skipSave && !isSaved) {
      const saveResult = async () => {
        const shortId = await saveAllocation(result);
        if (shortId) {
          // LocalStorage에도 저장
          addToHistory(shortId, result);
          setIsSaved(true);
          const url = `${window.location.origin}/result/${shortId}`;
          setShareUrl(url);
        } else {
          console.error('Failed to save to Supabase, using fallback');
          // Supabase 저장 실패 시 base64 인코딩 방식 사용
          const encodedData = btoa(encodeURIComponent(JSON.stringify(result)));
          const url = `${window.location.origin}/result/${encodedData}`;
          setShareUrl(url);
          // 로컬 히스토리에는 짧은 ID로 저장
          const shortId = encodedData.slice(0, 8);
          addToHistory(shortId, result);
          setIsSaved(true);
        }
      };
      saveResult();
    } else if (skipSave && !existingShortId) {
      // 결과 페이지에서는 현재 URL을 사용
      setShareUrl(window.location.href);
    }
  }, [result, isSaved, skipSave, existingShortId]);


  const filteredGroups = Object.entries(result.groups).reduce((acc, [groupName, members]) => {
    if (searchTerm) {
      const filteredMembers = members.filter(member => 
        member.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
      if (filteredMembers.length > 0) {
        acc[groupName] = filteredMembers;
      }
    } else {
      acc[groupName] = members;
    }
    return acc;
  }, {} as Record<string, typeof result.groups[string]>);

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
        <div className="flex items-start justify-between mb-5">
          <div>
            <h2 className="text-xl font-bold text-gray-900 flex items-center">
              <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center mr-3">
                <svg className="w-6 h-6 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              배정 완료
            </h2>
            {result.name && (
              <p className="text-lg text-gray-700 mt-2 ml-13 font-medium">{result.name}</p>
            )}
          </div>
          {shareUrl && (
            <div className="flex items-center gap-3">
              <div className="bg-gray-50 p-3 rounded-xl cursor-pointer hover:bg-gray-100 transition-colors" onClick={() => setShowQRModal(true)}>
                <QRCode value={shareUrl} size={128} level="M" />
                <p className="text-xs text-gray-600 text-center mt-2">클릭하여 크게보기</p>
              </div>
            </div>
          )}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-gray-50 rounded-xl p-5">
            <div className="text-sm text-gray-600 mb-1">총 인원</div>
            <div className="text-2xl font-bold text-gray-900">{result.stats.totalMembers}명</div>
          </div>
          <div className="bg-gray-50 rounded-xl p-5">
            <div className="text-sm text-gray-600 mb-1">평균 인원/조</div>
            <div className="text-2xl font-bold text-gray-900">{result.stats.avgPerGroup.toFixed(1)}명</div>
          </div>
          <div className="bg-gray-50 rounded-xl p-5">
            <div className="text-sm text-gray-600 mb-1">기존 조 중복률</div>
            <div className="text-2xl font-bold text-gray-900">{result.stats.duplicateRate.toFixed(1)}%</div>
          </div>
        </div>
      </div>

      {result.unassigned.length > 0 && (
        <div className="bg-orange-50 border border-orange-200 rounded-2xl p-6">
          <h3 className="text-lg font-bold mb-3 text-gray-900 flex items-center">
            <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center mr-2">
              <svg className="w-5 h-5 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            미배정 인원 ({result.unassigned.length}명)
          </h3>
          <div className="bg-white rounded-xl p-4 mb-4 text-gray-700">
            {result.unassigned.map(m => m.name).join(', ')}
          </div>
          {result.unassigned.length >= 5 && onReAllocate && (
            <button
              onClick={onReAllocate}
              className="px-5 py-2.5 bg-orange-500 text-white font-medium rounded-xl hover:bg-orange-600 transition-colors"
            >
              재배정 실행
            </button>
          )}
        </div>
      )}

      <div className="relative mb-6">
        <input
          type="text"
          placeholder="이름으로 검색"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-4 py-3.5 pl-12 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-gray-900 placeholder-gray-500"
        />
        <svg className="absolute left-4 top-4 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 xl:grid-cols-10 2xl:grid-cols-12 gap-2">
        {Object.entries(filteredGroups).map(([groupName, members], groupIndex) => {
          const colors = [
            { bg: 'bg-blue-50', border: 'border-blue-200', text: 'text-blue-700', header: 'text-blue-600' },
            { bg: 'bg-green-50', border: 'border-green-200', text: 'text-green-700', header: 'text-green-600' },
            { bg: 'bg-purple-50', border: 'border-purple-200', text: 'text-purple-700', header: 'text-purple-600' },
            { bg: 'bg-orange-50', border: 'border-orange-200', text: 'text-orange-700', header: 'text-orange-600' },
            { bg: 'bg-pink-50', border: 'border-pink-200', text: 'text-pink-700', header: 'text-pink-600' },
            { bg: 'bg-indigo-50', border: 'border-indigo-200', text: 'text-indigo-700', header: 'text-indigo-600' },
            { bg: 'bg-yellow-50', border: 'border-yellow-200', text: 'text-yellow-700', header: 'text-yellow-600' },
            { bg: 'bg-teal-50', border: 'border-teal-200', text: 'text-teal-700', header: 'text-teal-600' },
          ];
          const color = colors[groupIndex % colors.length];
          
          return (
            <div key={groupName} className={`${color.bg} ${color.border} border rounded-2xl p-3 hover:shadow-sm transition-all`}>
              <div className="text-center mb-2">
                <h3 className={`text-sm font-bold ${color.header}`}>
                  {groupName}
                </h3>
                <span className="text-xs text-gray-600">
                  {members.length}명
                </span>
              </div>
              <ul className="space-y-1">
                {members.map((member, index) => (
                  <li key={index} className={`text-xs ${color.text} font-medium truncate`} title={member.name}>
                    {member.name}
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
      </div>
      {showQRModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" onClick={() => setShowQRModal(false)}>
          <div className="bg-white rounded-2xl p-8 max-w-2xl w-full" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-start mb-6">
              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">QR 코드로 공유하기</h3>
                <p className="text-gray-600">스마트폰으로 QR 코드를 스캔하여 결과를 확인하세요</p>
              </div>
              <button
                onClick={() => setShowQRModal(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <svg className="w-6 h-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="flex flex-col items-center">
              <div className="mb-6">
                <QRCode value={shareUrl || ''} size={400} level="M" />
              </div>
              {shareUrl && (
                <div className="w-full">
                  <p className="text-sm text-gray-500 mb-2">공유 링크:</p>
                  <div className="bg-gray-50 p-3 rounded-lg break-all text-sm text-gray-700">
                    {shareUrl}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}