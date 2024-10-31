import { NextResponse } from 'next/server';

// 임시 상태 저장소 (실제로는 DB를 사용해야 함)
let voteStatus = {};

export async function GET() {
  return Response.json(voteStatus);
}

// 상태 업데이트를 위한 헬퍼 함수
export function updateVoteStatus(stageId, status) {
  voteStatus = {
    ...voteStatus,
    [stageId]: status
  };
  return voteStatus[stageId];
}