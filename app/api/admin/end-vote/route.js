import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const { stageId } = await request.json();
    
    // DB 업데이트 로직 추가 필요
    return NextResponse.json({
      isVoting: false,
      hasEnded: true,
      endTime: new Date().toISOString(),
    });
  } catch (error) {
    console.error('투표 종료 처리 오류:', error);
    return NextResponse.json(
      { error: '투표 종료 처리 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}