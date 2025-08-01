"use client";

import { AllocationResult } from '@/types';
import { useState } from 'react';

interface ResultDisplayProps {
  result: AllocationResult;
  onReAllocate?: () => void;
}

export default function ResultDisplay({ result, onReAllocate }: ResultDisplayProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [showCopySuccess, setShowCopySuccess] = useState(false);
  
  const handleShare = () => {
    const data = btoa(JSON.stringify(result));
    const url = `${window.location.origin}/result/${data}`;
    navigator.clipboard.writeText(url);
    setShowCopySuccess(true);
    setTimeout(() => setShowCopySuccess(false), 3000);
  };

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
      <div className="bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl p-6 text-white shadow-lg">
        <h2 className="text-2xl font-bold mb-4 flex items-center">
          <svg className="w-8 h-8 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          배정 완료!
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4">
            <div className="text-3xl font-bold mb-1">{result.stats.totalMembers}명</div>
            <div className="text-sm opacity-90">총 인원</div>
          </div>
          <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4">
            <div className="text-3xl font-bold mb-1">{result.stats.avgPerGroup.toFixed(1)}명</div>
            <div className="text-sm opacity-90">평균 인원/조</div>
          </div>
          <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4">
            <div className="text-3xl font-bold mb-1">{result.stats.duplicateRate.toFixed(1)}%</div>
            <div className="text-sm opacity-90">기존 조 중복률</div>
          </div>
        </div>
      </div>

      {result.unassigned.length > 0 && (
        <div className="bg-gradient-to-r from-red-500 to-pink-600 rounded-xl p-6 text-white shadow-lg">
          <h3 className="text-xl font-bold mb-3 flex items-center">
            <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            미배정 인원 ({result.unassigned.length}명)
          </h3>
          <div className="bg-white/20 backdrop-blur-sm rounded-lg p-3 mb-4">
            {result.unassigned.map(m => m.name).join(', ')}
          </div>
          {result.unassigned.length >= 5 && onReAllocate && (
            <button
              onClick={onReAllocate}
              className="px-6 py-3 bg-white text-red-600 font-semibold rounded-lg hover:bg-gray-100 transition-all transform hover:scale-105 shadow-md"
            >
              재배정 실행
            </button>
          )}
        </div>
      )}

      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <input
            type="text"
            placeholder="이름으로 검색..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-3 pl-12 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
          />
          <svg className="absolute left-4 top-3.5 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        <button
          onClick={handleShare}
          className="relative px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all transform hover:scale-105 shadow-lg flex items-center justify-center"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m9.632 8.048c.5.5.866 1.154.894 1.852A8.32 8.32 0 0112 21c-1.18 0-2.304-.24-3.308-.672a.75.75 0 01-.364-1.118l1.967-3.935a.75.75 0 011.108-.316l1.337.67a1.5 1.5 0 001.591-.138l4.27-3.566a.75.75 0 011.116.126z" />
          </svg>
          공유 링크 복사
          {showCopySuccess && (
            <span className="absolute -top-12 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white px-3 py-1 rounded-lg text-sm whitespace-nowrap">
              복사되었습니다!
              <span className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2 rotate-45 w-2 h-2 bg-gray-800"></span>
            </span>
          )}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Object.entries(filteredGroups).map(([groupName, members], groupIndex) => {
          const bgColors = [
            'bg-gradient-to-br from-blue-50 to-indigo-100 border-blue-200',
            'bg-gradient-to-br from-green-50 to-emerald-100 border-green-200',
            'bg-gradient-to-br from-purple-50 to-pink-100 border-purple-200',
            'bg-gradient-to-br from-yellow-50 to-orange-100 border-yellow-200',
            'bg-gradient-to-br from-red-50 to-rose-100 border-red-200',
            'bg-gradient-to-br from-cyan-50 to-teal-100 border-cyan-200',
          ];
          const colorClass = bgColors[groupIndex % bgColors.length];
          
          return (
            <div key={groupName} className={`${colorClass} border-2 rounded-2xl p-6 shadow-md hover:shadow-xl transition-all transform hover:-translate-y-1`}>
              <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center justify-between">
                <span>{groupName}</span>
                <span className="bg-white/80 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-semibold">
                  {members.length}명
                </span>
              </h3>
              <ul className="space-y-2">
                {members.map((member, index) => (
                  <li key={index} className="bg-white/60 backdrop-blur-sm rounded-lg px-3 py-2 flex items-center justify-between">
                    <span className="font-medium text-gray-800">{member.name}</span>
                    {member.prevGroup && (
                      <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                        기존: {member.prevGroup}
                      </span>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
      </div>
    </div>
  );
}