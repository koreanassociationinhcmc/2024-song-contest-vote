import { NextResponse } from 'next/server';

export function middleware(request) {
  // 결과 페이지 접근 시 관리자 인증 체크
  if (request.nextUrl.pathname.startsWith('/results')) {
    const adminAuth = request.cookies.get('admin_auth');
    
    if (!adminAuth || adminAuth.value !== 'true') {
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: '/results/:path*'
}