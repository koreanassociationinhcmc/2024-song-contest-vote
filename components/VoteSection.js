'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function VoteSection() {
  const [voteStatus, setVoteStatus] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchVoteStatus = async () => {
      try {
        const response = await fetch('/api/vote-status', {
          cache: 'no-store',
          headers: {
            'Cache-Control': 'no-cache'
          }
        });
        const data = await response.json();
        console.log('투표 상태:', data);
        setVoteStatus(data);
        
        if (!data.isEnded) {
          const pollTimer = setTimeout(fetchVoteStatus, 5000);
          return () => clearTimeout(pollTimer);
        }
      } catch (error) {
        console.error('투표 상태 조회 실패:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchVoteStatus();
  }, []);

    const handleEndVote = async () => {
      try {
        const response = await fetch('/api/end-vote', {
          method: 'POST',
        });
        if (response.ok) {
          fetchVoteStatus();
        }
      } catch (error) {
        console.error('투표 종료 실패:', error);
      }
    };

    const handleNextStage = async () => {
      try {
        const response = await fetch('/api/next-stage', {
          method: 'POST',
        });
        if (response.ok) {
          fetchVoteStatus();
        }
      } catch (error) {
        console.error('다음 단계 시작 실패:', error);
      }
    };

  if (isLoading) {
    return <div className="text-center">로딩 중...</div>;
  }

  if (voteStatus?.isEnded) {
    return (
      <div className="text-center text-xl text-red-500 font-bold">
        현재 진행 중인 투표가 없습니다.
      </div>
    );
  }

  return (
    <>
      {/* 현재 진행 중인 투표 표시 */}
      <h2 className="text-xl text-center text-blue-600 mb-6">
        현재 진행 중: {voteStatus?.stageInfo?.title}
      </h2>

      {/* 투표 버튼 */}
      <div className="flex justify-center gap-2 md:gap-4 mb-4">
        {!voteStatus?.isEnded && voteStatus?.stageInfo?.id && (
          <button
            onClick={() => {
              console.log('방청객 투표로 이동:', voteStatus.stageInfo.id);
              router.push(`/vote/audience/${voteStatus.stageInfo.id}`);
            }}
            className="bg-blue-500 text-white px-4 py-2 md:px-6 md:py-3 rounded-lg hover:bg-blue-600 transition text-sm md:text-base"
          >
            방청객 투표
          </button>
        )}
        {!voteStatus?.isEnded && voteStatus?.stageInfo?.showJudgeVote && voteStatus?.stageInfo?.id && (
          <button
            onClick={() => router.push(`/vote/judge/${voteStatus.stageInfo.id}`)}
            className="bg-green-500 text-white px-4 py-2 md:px-6 md:py-3 rounded-lg hover:bg-green-600 transition text-sm md:text-base"
          >
            심사위원 투표
          </button>
        )}
      </div>

      {/* 투표 정보 표시 */}
      <div className="text-center text-sm text-gray-600">
        <p>방청객 반영률: {voteStatus?.stageInfo?.audienceWeight}%</p>
        {voteStatus?.stageInfo?.showJudgeVote && (
          <p>심사위원 반영률: {voteStatus?.stageInfo?.judgeWeight}%</p>
        )}
      </div>

      {/* 관리자 컨트롤 섹션 추가 */}
      {voteStatus?.isAdmin && (
        <div className="mt-8 flex justify-center gap-4">
          <button
            onClick={handleEndVote}
            className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition"
            disabled={voteStatus?.isEnded}
          >
            현재 투표 종료
          </button>
          <button
            onClick={handleNextStage}
            className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition"
            disabled={!voteStatus?.isEnded || voteStatus?.isLastStage}
          >
            다음 단계 시작
          </button>
        </div>
      )}
    </>
  );
}