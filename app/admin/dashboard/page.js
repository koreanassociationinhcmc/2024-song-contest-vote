'use client';
import { useState, useEffect } from 'react';

export default function AdminDashboard() {
  // 상태 관리 - 중복 여부 확인
  const [voteStatus, setVoteStatus] = useState({});
  const [showResults, setShowResults] = useState({});
  const [voteResults, setVoteResults] = useState({});
  const [showVoteResults, setShowVoteResults] = useState(false);

  const awards = [
    {
      stageId: 'encouragement',
      title: '장려상',
      description: '실력을 발휘한 팀',
      color: 'bg-blue-500'
    },
    {
      stageId: 'excellence',
      title: '우수상',
      description: '실력을 발휘한 팀',
      color: 'bg-purple-500'
    },
    {
      stageId: 'grand',
      title: '최우수상',
      description: '실력을 발휘한 팀',
      color: 'bg-red-500'
    }
  ];

  // 투표 시작 핸들러
  const handleStartVote = async (stageId) => {
    try {
      const response = await fetch('/api/admin/start-vote', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ stageId }),
      });

      if (response.ok) {
        setVoteStatus(prev => ({
          ...prev,
          [stageId]: {
            isVoting: true,
            hasEnded: false,
            startTime: new Date().toISOString()
          }
        }));
        alert('투표가 시작되었습니다.');
      }
    } catch (error) {
      console.error('투표 시작 오류:', error);
      alert('투표 시작 중 오류가 발생했습니다.');
    }
  };

  // 투표 종료 핸들러
  const handleEndVote = async (stageId) => {
    try {
      const response = await fetch('/api/admin/end-vote', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ stageId }),
      });

      if (response.ok) {
        setVoteStatus(prev => ({
          ...prev,
          [stageId]: {
            isVoting: false,
            hasEnded: true,
            endTime: new Date().toISOString()
          }
        }));
        alert('투표가 종료되었습니다.');
      }
    } catch (error) {
      console.error('투표 종료 오류:', error);
      alert('투표 종료 중 오류가 발생했습니다.');
    }
  };

  // 투표 결과 보기 핸들러
  const handleShowResults = async (stageId) => {
    try {
      setShowResults(prev => ({
        ...prev,
        [stageId]: true
      }));
      // 여기에 투표 결과를 가져오는 로직 추가
    } catch (error) {
      console.error('투표 결과 조회 오류:', error);
      alert('투표 결과를 불러오는 중 오류가 발생했습니다.');
    }
  };

  // 모든 투표 초기화 핸들러
  const handleResetAllVotes = async () => {
    if (!confirm('모든 투표 상태를 초기화하시겠습니까?')) return;

    try {
      // 로컬 스토리지 초기화
      localStorage.removeItem('userVotes');
      localStorage.removeItem('allVotes');

      // 상태 초기화
      setVoteStatus({});
      setShowResults({});
      setVoteResults({});
      setShowVoteResults(false);

      alert('모든 투표가 초기화되었습니다.');
    } catch (error) {
      console.error('초기화 오류:', error);
      alert('초기화 중 오류가 발생했습니다.');
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">관리자 대시보드</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {awards.map((award) => (
          <div key={award.stageId} className="bg-white rounded-lg shadow p-4">
            <h2 className="text-xl font-bold mb-4">{award.title}</h2>
            <div className="flex flex-col gap-2">
              {/* 투표 시작/종료 버튼 */}
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => handleStartVote(award.stageId)}
                  className={`px-4 py-2 rounded text-white ${
                    voteStatus[award.stageId]?.isVoting 
                      ? 'bg-gray-400 cursor-not-allowed' 
                      : 'bg-green-500 hover:bg-green-600'
                  }`}
                  disabled={voteStatus[award.stageId]?.isVoting}
                >
                  {voteStatus[award.stageId]?.isVoting ? '투표 진행중' : '투표 시작'}
                </button>
                <button
                  onClick={() => handleEndVote(award.stageId)}
                  className={`px-4 py-2 rounded text-white ${
                    !voteStatus[award.stageId]?.isVoting
                      ? 'bg-gray-400 cursor-not-allowed' 
                      : 'bg-red-500 hover:bg-red-600'
                  }`}
                  disabled={!voteStatus[award.stageId]?.isVoting}
                >
                  투표 종료
                </button>
              </div>

              {/* 투표 결과 보기 버튼 */}
              <button
                onClick={() => handleShowResults(award.stageId)}
                className="w-full px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
              >
                투표 결과 보기
              </button>

              {/* 투표 결과 표시 */}
              {showResults[award.stageId] && voteResults[award.stageId] && (
                <div className="mt-4 border-t pt-4">
                  <h3 className="font-bold text-lg mb-4">투표 결과</h3>
                  {voteResults[award.stageId].results
                    .sort((a, b) => b.votes - a.votes)
                    .map((result, index) => (
                      <div key={result.name} className="mb-3">
                        <div className="flex justify-between items-center mb-1">
                          <span className="font-medium">
                            {index + 1}. {result.name}
                          </span>
                          <span className="text-sm text-gray-600">
                            {result.votes}표
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2.5">
                          <div
                            className={`h-2.5 rounded-full ${award.color}`}
                            style={{
                              width: `${(result.votes / voteResults[award.stageId].maxVotes) * 100}%`,
                              transition: 'width 0.5s ease-in-out'
                            }}
                          />
                        </div>
                      </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* 모든 투표 초기화 버튼 */}
      <div className="mt-4">
        <button
          onClick={handleResetAllVotes}
          className="w-full px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600 transition"
        >
          모든 투표 초기화
        </button>
      </div>
    </div>
  );
}