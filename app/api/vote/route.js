import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST(request) {
  try {
    const body = await request.json();
    const cookieStore = cookies();
    const voteType = body.isJudge ? 'judge' : 'audience';
    const hasVoted = cookieStore.get(`voted-${voteType}`);

    if (hasVoted) {
      return NextResponse.json(
        { error: '이미 투표하셨습니다.' },
        { status: 400 }
      );
    }

    // 여기에 실제 투표 저장 로직 구현
    
    // 쿠키 설정
    cookies().set(`voted-${voteType}`, 'true', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 // 24시간
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: '투표 처리 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}