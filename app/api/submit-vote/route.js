import { NextResponse } from 'next/server';

// 투표 결과를 저장할 객체 (실제로는 데이터베이스를 사용해야 합니다)
let voteResults = {};

export async function POST(request) {
  try {
    const body = await request.json();
    const { stageId, artist } = body;

    // 해당 스테이지의 투표 결과가 없으면 초기화
    if (!voteResults[stageId]) {
      voteResults[stageId] = {};
    }

    // 해당 가수의 득표수 증가
    if (!voteResults[stageId][artist]) {
      voteResults[stageId][artist] = 0;
    }
    voteResults[stageId][artist]++;

    // 투표 결과 확인용 로그
    console.log(`Stage ${stageId} 투표 현황:`, voteResults[stageId]);

    return NextResponse.json({ 
      success: true, 
      message: '투표가 성공적으로 처리되었습니다.',
      results: voteResults[stageId]
    });

  } catch (error) {
    console.error('투표 처리 중 오류 발생:', error);
    return NextResponse.json(
      { success: false, message: '투표 처리 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}

// 투표 결과 조회 API
export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const stageId = searchParams.get('stageId');

  if (!stageId) {
    return NextResponse.json(
      { success: false, message: 'stageId가 필요합니다.' },
      { status: 400 }
    );
  }

  return NextResponse.json({
    success: true,
    results: voteResults[stageId] || {}
  });
}