'use client';

import { useParams } from 'next/navigation';
import { useState, useEffect } from 'react';

export default function JudgeVotePage() {
  const params = useParams();
  const stageId = params.stageId;
  const [voteData, setVoteData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchVoteData = async () => {
      try {
        const response = await fetch(`/api/vote-data/${stageId}`);
        const data = await response.json();
        setVoteData(data);
      } catch (error) {
        console.error('투표 데이터 로딩 실패:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchVoteData();
  }, [stageId]);

  if (isLoading) {
    return <div className="text-center">로딩 중...</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold text-center mb-6">심사위원 투표</h1>
      {/* 투표 폼 구현 */}
    </div>
  );
}