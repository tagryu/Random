"use client";

import { useState } from 'react';
import { Member, AllocationResult } from '@/types';
import PasteArea from './PasteArea';
import { allocateMembers } from '@/lib/allocate';

interface AllocationFormProps {
  onAllocationComplete: (result: AllocationResult) => void;
}

export default function AllocationForm({ onAllocationComplete }: AllocationFormProps) {
  const [members, setMembers] = useState<Member[]>([]);
  const [targetGroups, setTargetGroups] = useState<number>(4);
  const [totalMembers, setTotalMembers] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(false);
  const [allocationName, setAllocationName] = useState<string>('');
  const [selectedLocation, setSelectedLocation] = useState<string>('광야의샘 3층');

  const handleMembersChange = (newMembers: Member[]) => {
    setMembers(newMembers);
    setTotalMembers(newMembers.length);
  };

  const handleAllocate = async () => {
    if (members.length === 0) {
      alert('멤버 데이터를 입력해주세요.');
      return;
    }

    if (targetGroups < 2) {
      alert('조 개수는 2개 이상이어야 합니다.');
      return;
    }

    setIsLoading(true);
    
    setTimeout(() => {
      const result = allocateMembers(members, targetGroups);
      // 선택된 장소를 이름으로 사용
      result.name = selectedLocation;
      onAllocationComplete(result);
      setIsLoading(false);
    }, 500);
  };

  const avgPerGroup = totalMembers > 0 ? (totalMembers / targetGroups).toFixed(1) : '0';
  const baseSize = Math.floor(totalMembers / targetGroups);
  const remainder = totalMembers % targetGroups;

  return (
    <div className="space-y-8">
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-3">
          장소 선택
        </label>
        <div className="grid grid-cols-2 gap-4">
          <button
            type="button"
            onClick={() => setSelectedLocation('광야의샘 3층')}
            className={`px-6 py-3 rounded-xl font-medium transition-all ${
              selectedLocation === '광야의샘 3층'
                ? 'bg-blue-600 text-white shadow-lg transform scale-105'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            광야의샘 3층
          </button>
          <button
            type="button"
            onClick={() => setSelectedLocation('GCC')}
            className={`px-6 py-3 rounded-xl font-medium transition-all ${
              selectedLocation === 'GCC'
                ? 'bg-blue-600 text-white shadow-lg transform scale-105'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            GCC
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="total-members" className="block text-sm font-semibold text-gray-700 mb-3">
            총 인원 수
          </label>
          <div className="relative">
            <input
              id="total-members"
              type="number"
              value={totalMembers}
              onChange={(e) => setTotalMembers(Number(e.target.value))}
              className="w-full px-4 py-3 pl-12 bg-gray-50 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all font-semibold text-lg"
              readOnly
            />
            <svg className="absolute left-4 top-3.5 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </div>
        </div>
        
        <div>
          <label htmlFor="target-groups" className="block text-sm font-semibold text-gray-700 mb-3">
            목표 조 개수
          </label>
          <div className="relative">
            <input
              id="target-groups"
              type="number"
              value={targetGroups}
              onChange={(e) => setTargetGroups(Number(e.target.value))}
              min="2"
              className="w-full px-4 py-3 pl-12 bg-white border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all font-semibold text-lg"
            />
            <svg className="absolute left-4 top-3.5 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
          </div>
        </div>
      </div>

      {totalMembers > 0 && targetGroups > 0 && (
        <div className="bg-gradient-to-r from-blue-100 to-purple-100 border-2 border-blue-200 rounded-xl p-5">
          <div className="flex items-center">
            <svg className="w-5 h-5 text-blue-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-blue-800 font-medium">
              평균 {avgPerGroup}명/조 • {remainder > 0 
                ? `${remainder}개 조는 ${baseSize + 1}명, 나머지 ${targetGroups - remainder}개 조는 ${baseSize}명`
                : `모든 조 ${baseSize}명`}
            </p>
          </div>
        </div>
      )}

      <PasteArea onMembersChange={handleMembersChange} />

      <button
        onClick={handleAllocate}
        disabled={isLoading || members.length === 0}
        className="w-full py-4 px-6 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold text-lg rounded-xl hover:from-blue-700 hover:to-purple-700 disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed transition-all transform hover:scale-105 shadow-lg disabled:shadow-none"
      >
        {isLoading ? (
          <span className="flex items-center justify-center">
            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            배정 중...
          </span>
        ) : (
          <span className="flex items-center justify-center">
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            랜덤 배정 실행
          </span>
        )}
      </button>
    </div>
  );
}