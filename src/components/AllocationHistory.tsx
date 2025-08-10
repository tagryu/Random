"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { getHistory, removeFromHistory, clearHistory, AllocationHistory } from '@/lib/storage';

interface AllocationHistoryProps {
  onSelectHistory?: (history: AllocationHistory) => void;
  onSelectShortId?: (shortId: string) => void;
}

export default function AllocationHistoryComponent({ onSelectHistory, onSelectShortId }: AllocationHistoryProps) {
  const [history, setHistory] = useState<AllocationHistory[]>([]);
  const [showConfirmClear, setShowConfirmClear] = useState(false);

  useEffect(() => {
    setHistory(getHistory());
  }, []);

  const handleDelete = (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    removeFromHistory(id);
    setHistory(getHistory());
  };

  const handleClearAll = () => {
    clearHistory();
    setHistory([]);
    setShowConfirmClear(false);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);
    
    if (diffInHours < 1) {
      const diffInMinutes = Math.floor(diffInHours * 60);
      return `${diffInMinutes}분 전`;
    } else if (diffInHours < 24) {
      return `${Math.floor(diffInHours)}시간 전`;
    } else if (diffInHours < 168) {
      return `${Math.floor(diffInHours / 24)}일 전`;
    } else {
      return date.toLocaleDateString('ko-KR');
    }
  };

  if (history.length === 0) {
    return null;
  }

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-gray-800 flex items-center">
          <svg className="w-6 h-6 mr-2 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          최근 배정 기록
        </h2>
        <button
          onClick={() => setShowConfirmClear(true)}
          className="text-sm text-red-600 hover:text-red-700 font-medium"
        >
          전체 삭제
        </button>
      </div>

      {showConfirmClear && (
        <div className="mb-4 p-3 bg-red-50 rounded-lg border border-red-200">
          <p className="text-sm text-red-800 mb-2">정말로 모든 기록을 삭제하시겠습니까?</p>
          <div className="flex gap-2">
            <button
              onClick={handleClearAll}
              className="px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700"
            >
              삭제
            </button>
            <button
              onClick={() => setShowConfirmClear(false)}
              className="px-3 py-1 bg-gray-200 text-gray-700 text-sm rounded hover:bg-gray-300"
            >
              취소
            </button>
          </div>
        </div>
      )}

      <div className="space-y-2 max-h-64 overflow-y-auto">
        {history.map((item) => (
          <div
            key={item.id}
            className="group relative flex items-center justify-between p-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer"
          >
            {onSelectHistory ? (
              <button
                onClick={() => onSelectHistory(item)}
                className="flex-1 text-left"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <span className="font-medium text-gray-800">{item.title}</span>
                    <span className="text-sm text-gray-500 ml-2">{formatDate(item.createdAt)}</span>
                  </div>
                  <span className="text-sm text-gray-400">중복률 {item.result.stats.duplicateRate.toFixed(1)}%</span>
                </div>
              </button>
            ) : (
              <Link
                href={`/result/${item.shortId}`}
                className="flex-1 text-left"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <span className="font-medium text-gray-800">{item.title}</span>
                    <span className="text-sm text-gray-500 ml-2">{formatDate(item.createdAt)}</span>
                  </div>
                  <span className="text-sm text-gray-400">중복률 {item.result.stats.duplicateRate.toFixed(1)}%</span>
                </div>
              </Link>
            )}
            
            <button
              onClick={(e) => handleDelete(item.id, e)}
              className="ml-2 p-1 text-gray-400 hover:text-red-600 opacity-0 group-hover:opacity-100 transition-opacity"
              title="삭제"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}