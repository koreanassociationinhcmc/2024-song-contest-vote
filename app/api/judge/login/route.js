export async function POST(request) {
  try {
    const { username, password } = await request.json();
    
    // 여기에 실제 심사위원 인증 로직 구현
    // 예시: 데이터베이스에서 심사위원 정보 확인
    
    // 임시 검증 로직
    if (username === 'judge' && password === 'password') {
      return Response.json({ 
        success: true,
        judgeId: 'judge-001',
        name: '심사위원1'
      });
    }

    return Response.json(
      { error: '인증 실패' },
      { status: 401 }
    );
  } catch (error) {
    console.error('심사위원 로그인 오류:', error);
    return Response.json(
      { error: '로그인 처리 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}