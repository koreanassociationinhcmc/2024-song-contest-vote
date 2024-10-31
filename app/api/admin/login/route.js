import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST(request) {
  try {
    const { password } = await request.json();
    
    // 환경변수에서 비밀번호 확인
    const adminPassword = process.env.ADMIN_PASSWORD;

    if (!adminPassword) {
      console.error('관리자 비밀번호가 설정되지 않았습니다.');
      return NextResponse.json(
        { error: '서버 설정 오류' },
        { status: 500 }
      );
    }

    if (password === adminPassword) {
      // 관리자 인증 쿠키 설정
      cookies().set('admin_auth', 'true', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 // 24시간
      });

      return NextResponse.json({ success: true });
    }

    return NextResponse.json(
      { error: '비밀번호가 올바르지 않습니다.' },
      { status: 401 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: '로그인 처리 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}