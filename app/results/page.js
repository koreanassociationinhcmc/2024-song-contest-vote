'use client';
import { useState } from 'react';
import Link from 'next/link';

export default function ResultsPage() {
  const [currentAward, setCurrentAward] = useState('popularity');

  const awards = {
    popularity: { title: '인기상', description: '방청객 투표 100%' },
    achievement: { title: '장려상', description: '심사위원 40% + 방청객 60%' },
    excellence: { title: '우수상', description: '심사위원 40% + 방청객 60%' },
    grand: { title: '최우수상', description: '심사위원 40% + 방청객 60%' }
  };

  return (
    <main className="container mx-auto px-2 py-4">
      <h1 className="text-2xl md:text-4xl font-bold text-center mb-4">
        투표 결과
      </h1>

      <div className="max-w-2xl mx-auto">
        {/* 상 선택 버튼들 */}
        <div className="flex flex-wrap justify-center gap-2 mb-6">
          {Object.entries(awards).map(([key, { title }]) => (
            <button
              key={key}
              onClick={() => setCurrentAward(key)}
              className={`px-4 py-2 rounded-lg text-sm md:text-base
                ${currentAward === key 
                  ? 'bg-blue-500 text-white' 
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
            >
              {title}
            </button>
          ))}
        </div>

        {/* 선택된 상의 결과 표시 */}
        <div className="bg-white rounded-lg shadow-lg p-4">
          <h2 className="text-xl font-bold text-center mb-2">
            {awards[currentAward].title}
          </h2>
          <p className="text-gray-600 text-center text-sm mb-4">
            {awards[currentAward].description}
          </p>

          {/* 여기에 실제 수상자 정보 표시 */}
          <div className="text-center text-gray-500">
            투표 진행 중...
          </div>
        </div>

        {/* 메인으로 돌아가기 버튼 */}
        <div className="text-center mt-6">
          <Link 
            href="/" 
            className="text-blue-500 hover:underline"
          >
            ← 메인으로 돌아가기
          </Link>
        </div>
      </div>
    </main>
  );
}