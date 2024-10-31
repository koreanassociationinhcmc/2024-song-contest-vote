'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import AdminLogin from '../components/AdminLogin';
import JudgeLogin from '../components/JudgeLogin';

export default function Home() {
  const [voteStatus, setVoteStatus] = useState({});
  const [isAdmin, setIsAdmin] = useState(false);
  const [isJudge, setIsJudge] = useState(false);
  const [showAdminModal, setShowAdminModal] = useState(false);
  const [showJudgeModal, setShowJudgeModal] = useState(false);
  const [showResults, setShowResults] = useState({});
  const [userVotes, setUserVotes] = useState({});
  const [voteResults, setVoteResults] = useState({});
  const [showVoteResults, setShowVoteResults] = useState(false);

  const awards = [
    {
      id: 1,
      title: '인기상',
      description: '관객들이 뽑은 가장 인기있는 참가자분',
      color: 'bg-pink-500',
      stageId: 'popular',
      votingRatio: '방청객 100%'
    },
    {
      id: 2,
      title: '장려상',
      description: '우수한 실력을 보여주신 참가자분',
      color: 'bg-purple-500',
      stageId: 'encouragement',
      votingRatio: '심사위원 40% + 방청객 60%'
    },
    {
      id: 3,
      title: '우수상',
      description: '뛰어난 실력을 보여주신 참가자분',
      color: 'bg-blue-500',
      stageId: 'excellence',
      votingRatio: '심사위원 40% + 방청객 60%'
    },
    {
      id: 4,
      title: '최우수상',
      description: '최고의 실력을 보여주신 참가자분',
      color: 'bg-green-500',
      stageId: 'grand',
      votingRatio: '심사위원 40% + 방청객 60%'
    }
  ];

  // 투표 상태를 실시간으로 확인하는 useEffect 수정
  useEffect(() => {
    const fetchVoteStatus = async () => {
      try {
        const response = await fetch('/api/vote-status');
        if (response.ok) {
          const data = await response.json();
          setVoteStatus(data);
        }
      } catch (error) {
        console.error('투표 상태 조회 오류:', error);
      }
    };

    fetchVoteStatus(); // 초기 로드
    const interval = setInterval(fetchVoteStatus, 3000); // 3초마다 상태 업데이트

    return () => clearInterval(interval);
  }, []);

  // 투표 시작 핸들러 수정
  const handleStartVoting = async (stageId) => {
    try {
      const response = await fetch('/api/admin/start-vote', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ stageId }),
      });

      if (response.ok) {
        const data = await response.json();
        setVoteStatus(prev => ({
          ...prev,
          [stageId]: {
            isVoting: true,
            hasEnded: false,
            startTime: data.startTime
          }
        }));

        // 해당 stageId에 대한 사용자 투표 기록 초기화
        const updatedUserVotes = { ...userVotes };
        delete updatedUserVotes[stageId];
        setUserVotes(updatedUserVotes);
        localStorage.setItem('userVotes', JSON.stringify(updatedUserVotes));

        alert('투표가 시작되었습니다.');
      }
    } catch (error) {
      console.error('투표 시작 오류:', error);
      alert('투표 시작 중 오류가 발생했습니다.');
    }
  };

  // 투표 종료 핸들러 수정
  const handleEndVoting = async (stageId) => {
    try {
      const response = await fetch('/api/admin/end-vote', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ stageId }),
      });

      if (response.ok) {
        // 투표 상태 업데이트
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

  // 투표 결과를 가져오는 함수
  const fetchVoteResults = async (stageId) => {
    try {
      const response = await fetch(`/api/vote-results/${stageId}`);
      const data = await response.json();
      setShowResults(prev => ({
        ...prev,
        [stageId]: data
      }));
    } catch (error) {
      console.error('투표 결과 조회 오류:', error);
    }
  };

  // 초기 투표 상태 및 사용자 투표 기록 로드
  useEffect(() => {
    // 로컬 스토리지에서 사용자 투표 기록 로드
    const savedVotes = localStorage.getItem('userVotes');
    if (savedVotes) {
      setUserVotes(JSON.parse(savedVotes));
    }

    // ... 기존의 투표 상태 로드 로직 ...
  }, []);

  // 투표 결과 조회 함수
  const handleShowResults = async (stageId) => {
    try {
      const response = await fetch(`/api/vote-results/${stageId}`);
      const data = await response.json();
      
      setVoteResults(prev => ({
        ...prev,
        [stageId]: data
      }));
      setShowResults(prev => ({
        ...prev,
        [stageId]: true
      }));
    } catch (error) {
      console.error('투표 결과 조회 오류:', error);
    }
  };

  // 메인 화면의 투표 버튼 컴포넌트 수정
  const VoteButton = ({ award }) => {
    const status = voteStatus[award.stageId];
    const hasVoted = userVotes[award.stageId];

    if (status?.hasEnded) {
      return (
        <button
          disabled
          className="w-full px-4 py-2 bg-gray-400 text-white rounded cursor-not-allowed"
        >
          투표 종료
        </button>
      );
    }

    if (hasVoted) {
      return (
        <button
          disabled
          className="w-full px-4 py-2 bg-gray-400 text-white rounded cursor-not-allowed"
        >
          투표 완료
        </button>
      );
    }

    if (status?.isVoting) {
      return (
        <Link href={`/vote/audience/${award.stageId}`}>
          <button className="w-full px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600">
            투표하기
          </button>
        </Link>
      );
    }

    return (
      <button
        disabled
        className="w-full px-4 py-2 bg-gray-400 text-white rounded cursor-not-allowed"
      >
        투표 대기중
      </button>
    );
  };

  // 모든 투표 초기화 핸들러 추가
  const handleResetAllVotes = async () => {
    if (!confirm('모든 투표 상태를 초기화하시겠습니까?')) return;

    try {
      const response = await fetch('/api/admin/reset-votes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        // 모든 투표 상태 초기화
        setVoteStatus({});
        // 모든 사용자 투표 기록 초기화
        setUserVotes({});
        localStorage.removeItem('userVotes');
        // 결과 표시 상태 초기화
        setShowResults({});
        setVoteResults({});
        
        alert('모든 투표가 초기화되었습니다.');
      }
    } catch (error) {
      console.error('투표 초기화 오류:', error);
      alert('투표 초기화 중 오류가 발생했습니다.');
    }
  };

  return (
    <main className="min-h-screen">
      {/* 최상단 헤더 */}
      <div className="bg-gray-100 p-4">
        <div className="container mx-auto flex items-center justify-between">
          <div className="w-32"></div>
          
          <h1 className="text-2xl font-bold text-center flex-grow">
            수상자 투표 시스템
          </h1>
          
          <div className="flex items-center gap-4 w-64 justify-end">
            {!isJudge ? (
              <button
                onClick={() => setShowJudgeModal(true)}
                className="bg-green-500 text-white px-6 py-2 rounded text-sm hover:bg-green-600 transition w-28"
              >
                심사위원
              </button>
            ) : (
              <button
                onClick={() => {
                  setIsJudge(false);
                  localStorage.removeItem('isJudge');
                }}
                className="bg-red-500 text-white px-6 py-2 rounded text-sm hover:bg-red-600 transition w-28"
              >
                로그아웃
              </button>
            )}
            
            {!isAdmin ? (
              <button
                onClick={() => setShowAdminModal(true)}
                className="bg-blue-500 text-white px-6 py-2 rounded text-sm hover:bg-blue-600 transition w-28"
              >
                관리자
              </button>
            ) : (
              <button
                onClick={() => {
                  setIsAdmin(false);
                  localStorage.removeItem('isAdmin');
                }}
                className="bg-red-500 text-white px-6 py-2 rounded text-sm hover:bg-red-600 transition w-28"
              >
                로그아웃
              </button>
            )}
          </div>
        </div>
      </div>

      {/* 메인 카드 레이아웃 */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {awards.map((award) => (
            <div key={award.id} className="bg-white rounded-lg shadow-lg overflow-hidden">
              <div className={`${award.color} p-4 h-32 flex items-center justify-center`}>
                <h2 className="text-2xl font-bold text-white text-center">
                  {award.title}
                </h2>
              </div>
              
              <div className="p-4">
                <p className="text-gray-600 mb-4 text-center">
                  {award.description}
                </p>
                <p className="text-sm text-gray-500 text-center mb-4">
                  {award.votingRatio}
                </p>
                
                {/* 방청객 투표 버튼 */}
                {!isAdmin && !isJudge && (
                  <div className="flex justify-center">
                    <VoteButton award={award} />
                  </div>
                )}

                {/* 관리자 컨트롤 수정 */}
                {isAdmin && (
                  <div className="flex flex-col gap-2">
                    {/* 투표 시작/종료 버튼 */}
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        onClick={() => handleStartVoting(award.stageId)}
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
                        onClick={() => handleEndVoting(award.stageId)}
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

                    {/* 모든 투표 초기화 버튼 */}
                    <button
                      onClick={handleResetAllVotes}
                      className="w-full px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600 transition"
                    >
                      모든 투표 초기화
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
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 관리자/심사위원 로그인 모달 */}
      {showAdminModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl w-96">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">관리자 로그인</h2>
              <button
                onClick={() => setShowAdminModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>
            <AdminLogin 
              setIsAdmin={setIsAdmin} 
              onSuccess={() => setShowAdminModal(false)}
            />
          </div>
        </div>
      )}

      {showJudgeModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl w-96">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">심사위원 로그인</h2>
              <button
                onClick={() => setShowJudgeModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>
            <JudgeLogin 
              setIsJudge={setIsJudge} 
              onSuccess={() => setShowJudgeModal(false)}
            />
          </div>
        </div>
      )}

      {/* 기존 컨텐츠 ... */}
    </main>
  );
}
