'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';

export default function AudienceVotePage() {
  const params = useParams();
  const router = useRouter();
  const [selectedArtist, setSelectedArtist] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 가수 목록
  const artists = [
    '임영웅', '아이유', '방탄소년단', '블랙핑크', '트와이스',
    '엑소', '레드벨벳', 'NCT', '에스파', '뉴진스',
    '르세라핌', '아이브', '스테이씨', '몬스타엑스', '세븐틴'
  ];

  const handleVoteSubmit = async (e) => {
    e.preventDefault();
    if (!selectedArtist) return;

    setIsSubmitting(true);
    try {
      const response = await fetch('/api/submit-vote', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          stageId: params.stageId,
          artist: selectedArtist,
        }),
      });

      if (response.ok) {
        // 로컬 스토리지에 투표 기록 저장
        const userVotes = JSON.parse(localStorage.getItem('userVotes') || '{}');
        userVotes[params.stageId] = selectedArtist;
        localStorage.setItem('userVotes', JSON.stringify(userVotes));

        // 메인 페이지로 리다이렉트
        router.push('/');
      } else {
        alert('투표 처리 중 오류가 발생했습니다.');
      }
    } catch (error) {
      console.error('투표 오류:', error);
      alert('투표 처리 중 오류가 발생했습니다.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center mb-8">방청객 투표</h1>
      
      <form onSubmit={handleVoteSubmit} className="max-w-2xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
          {artists.map((artist) => (
            <div key={artist} className="relative">
              <input
                type="radio"
                id={artist}
                name="artist"
                value={artist}
                checked={selectedArtist === artist}
                onChange={(e) => setSelectedArtist(e.target.value)}
                className="peer hidden"
              />
              <label
                htmlFor={artist}
                className={`
                  block p-4 rounded-lg border-2 text-center cursor-pointer
                  transition-all duration-200
                  ${selectedArtist === artist 
                    ? 'border-blue-500 bg-blue-50' 
                    : 'border-gray-200 hover:border-blue-200'}
                  peer-checked:border-blue-500 peer-checked:bg-blue-50
                `}
              >
                {artist}
              </label>
            </div>
          ))}
        </div>

        <div className="text-center">
          <button
            type="submit"
            disabled={isSubmitting || !selectedArtist}
            className={`
              px-8 py-3 rounded-full font-semibold text-white
              transition-colors duration-200
              ${isSubmitting || !selectedArtist 
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-blue-500 hover:bg-blue-600'}
            `}
          >
            {isSubmitting ? '투표 중...' : '투표하기'}
          </button>
        </div>
      </form>
    </div>
  );
}