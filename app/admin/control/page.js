'use client';
import { useState, useEffect } from 'react';

export default function AdminControl() {
  const [currentStage, setCurrentStage] = useState('popularity');
  const [voteStatus, setVoteStatus] = useState('ongoing'); // 'ongoing' or 'ended'

  const stages = [
    { id: 'popularity', title: '인기상 투표' },
    { id: 'achievement', title: '장려상 투표' },
    { id: 'excellence', title: '우수상 투표' },
    { id: 'grand', title: '최우수상 투표' }
  ];

  const handleEndVote = async () => {
    if (window.confirm('현재 진행 중인 투표를 종료하시겠습니까?')) {
      try {
        const response = await fetch('/api/admin/end-vote', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ stage: currentStage }),
        });

        if (response.ok) {
          setVoteStatus('ended');
          alert('투표가 종료되었습니다.');
        }
      } catch (error) {
        alert('투표 종료 중 오류가 발생했습니다.');
      }
    }
  };

  const handleStartNextStage = async () => {
    const currentIndex = stages.findIndex(stage => stage.id === currentStage);
    if (currentIndex < stages.length - 1) {
      const nextStage = stages[currentIndex + 1].id;
      try {
        const response = await fetch('/api/admin/change-stage', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ stage: nextStage }),
        });

        if (response.ok) {
          setCurrentStage(nextStage);
          setVoteStatus('ongoing');
          alert(`${stages[currentIndex + 1].title}가 시작되었습니다.`);
        }
      } catch (error) {
        alert('다음 단계 시작 중 오류가 발생했습니다.');
      }
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">투표 관리</h1>
      
      {/* 현재 진행 중인 투표 상태 */}
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">
          현재 진행 중: {stages.find(s => s.id === currentStage)?.title}
        </h2>
        <div className="flex gap-4">
          {voteStatus === 'ongoing' ? (
            <button
              onClick={handleEndVote}
              className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
            >
              투표 종료하기
            </button>
          ) : (
            <button
              onClick={handleStartNextStage}
              className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
              disabled={currentStage === stages[stages.length - 1].id}
            >
              다음 투표 시작하기
            </button>
          )}
        </div>
      </div>

      {/* 투표 단계 목록 */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold mb-4">투표 단계</h2>
        <div className="space-y-2">
          {stages.map((stage) => (
            <div
              key={stage.id}
              className={`p-4 rounded-lg ${
                currentStage === stage.id
                  ? 'bg-blue-100 border-2 border-blue-500'
                  : 'bg-gray-100'
              }`}
            >
              {stage.title}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}