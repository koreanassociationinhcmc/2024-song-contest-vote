import { NextResponse } from 'next/server';

export async function POST() {
  try {
    // 여기서는 클라이언트 측에서 로컬 스토리지 초기화만 수행
    return NextResponse.json({ message: '모든 투표가 초기화되었습니다.' });
  } catch (error) {
    console.error('투표 초기화 오류:', error);
    return NextResponse.json(
      { error: '투표 초기화 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}