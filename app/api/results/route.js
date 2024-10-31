import { NextResponse } from 'next/server';

export async function GET(request) {
  // URL에서 상 종류 파라미터 가져오기
  const { searchParams } = new URL(request.url);
  const awardType = searchParams.get('type');

  try {
    // 여기에 실제 데이터베이스 조회 로직 구현
    // 현재는 더미 데이터 반환
    const results = {
      popularity: { rank: 1, name: "김하늘", score: 245 },
      achievement: { rank: 3, name: "이지원", score: 88 },
      excellence: { rank: 2, name: "박도윤", score: 92 },
      grand: { rank: 1, name: "조용필", score: 98 }
    };

    return NextResponse.json({ 
      success: true, 
      result: results[awardType] || null 
    });

  } catch (error) {
    return NextResponse.json(
      { error: '결과 조회 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}