export async function GET(request, { params }) {
  const { stageId } = params;
  
  // 예시 데이터 (실제로는 DB에서 가져와야 함)
  const mockResults = {
    results: [
      { name: '임영웅', votes: 150 },
      { name: '아이유', votes: 120 },
      { name: 'BTS', votes: 100 },
      { name: '블랙핑크', votes: 80 },
      { name: '트와이스', votes: 60 },
      // ... 더 많은 결과
    ],
    maxVotes: 150  // 최대 투표수
  };

  return Response.json(mockResults);
}