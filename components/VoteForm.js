'use client';
import { useState } from 'react';
import { contestants } from '@/data/contestants';
import Link from 'next/link';

export default function VoteForm({ isJudge }) {
  const [selectedContestant, setSelectedContestant] = useState(null);
  const [score, setScore] = useState(5);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedContestant) return;

    try {
      const response = await fetch('/api/vote', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contestantId: selectedContestant,
          score: isJudge ? score : 1,
          isJudge,
        }),
      });

      if (response.ok) {
        alert('투표가 완료되었습니다!');
        window.location.href = '/';
      }
    } catch (error) {
      alert('투표 중 오류가 발생했습니다.');
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <Link 
        href="/"
        className="block mb-4 text-blue-500 hover:underline"
      >
        ← 메인으로 돌아가기
      </Link>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {contestants.map((contestant) => (
            <div 
              key={contestant.id}
              onClick={() => setSelectedContestant(contestant.id)}
              className={`cursor-pointer border rounded-lg p-4 ${
                selectedContestant === contestant.id ? 'border-blue-500 bg-blue-50' : ''
              }`}
            >
              <div className="relative aspect-square mb-2">
                <img
                  src={contestant.imageUrl}
                  alt={contestant.name}
                  className="object-cover rounded-lg w-full h-full"
                />
                <div className="absolute top-2 left-2 bg-white rounded-full w-8 h-8 flex items-center justify-center">
                  {contestant.performanceNumber}
                </div>
              </div>
              <h3 className="font-semibold text-center">{contestant.name}</h3>
              <p className="text-sm text-gray-600 text-center">{contestant.song}</p>
            </div>
          ))}
        </div>

        {isJudge && (
          <div className="mt-6">
            <label className="block text-center">
              점수 (1-10):
              <input
                type="range"
                min="1"
                max="10"
                value={score}
                onChange={(e) => setScore(Number(e.target.value))}
                className="w-full max-w-xs mx-auto block mt-2"
              />
              <span className="block mt-2">{score}점</span>
            </label>
          </div>
        )}

        <button
          type="submit"
          disabled={!selectedContestant}
          className="w-full max-w-xs mx-auto block bg-blue-500 text-white py-3 rounded-lg disabled:bg-gray-300"
        >
          투표하기
        </button>
      </form>
    </div>
  );
}