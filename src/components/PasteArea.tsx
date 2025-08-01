"use client";

import { useState } from 'react';
import { Member } from '@/types';
import { parsePasteData } from '@/lib/parsePaste';

interface PasteAreaProps {
  onMembersChange: (members: Member[]) => void;
}

export default function PasteArea({ onMembersChange }: PasteAreaProps) {
  const [pasteText, setPasteText] = useState('');
  const [members, setMembers] = useState<Member[]>([]);

  const handlePaste = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const text = e.target.value;
    setPasteText(text);
    
    const parsedMembers = parsePasteData(text);
    setMembers(parsedMembers);
    onMembersChange(parsedMembers);
  };

  return (
    <div className="space-y-6">
      <div>
        <label htmlFor="paste-area" className="block text-sm font-semibold text-gray-700 mb-3 flex items-center">
          <svg className="w-5 h-5 mr-2 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          엑셀 데이터 붙여넣기 (이름, 기존조 형식)
        </label>
        <textarea
          id="paste-area"
          value={pasteText}
          onChange={handlePaste}
          placeholder="이름	기존조&#10;홍길동	A조&#10;김철수	B조"
          className="w-full h-48 px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all font-mono text-sm"
        />
      </div>
      
      {members.length > 0 && (
        <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-6 border-2 border-green-200">
          <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
            <svg className="w-5 h-5 mr-2 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            파싱된 데이터 ({members.length}명)
          </h3>
          <div className="max-h-64 overflow-y-auto border-2 border-gray-200 rounded-xl bg-white">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50 sticky top-0">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                    이름
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                    기존 조
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {members.map((member, index) => (
                  <tr key={index} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                      {member.name}
                    </td>
                    <td className="px-6 py-3 whitespace-nowrap text-sm text-gray-600">
                      {member.prevGroup ? (
                        <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-semibold">
                          {member.prevGroup}
                        </span>
                      ) : (
                        <span className="text-gray-400">-</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}