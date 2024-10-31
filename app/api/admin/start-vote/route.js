import { updateVoteStatus } from '../../vote-status/route';

export async function POST(request) {
  try {
    const { stageId } = await request.json();
    
    const status = updateVoteStatus(stageId, {
      isVoting: true,
      hasEnded: false,
      startTime: new Date().toISOString()
    });

    return Response.json(status);
  } catch (error) {
    return Response.json(
      { error: '투표 시작 처리 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}