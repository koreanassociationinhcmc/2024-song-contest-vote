// ... 기존 코드 ...
<div className="flex gap-4">
  <button onClick={handleStartVote} className="...">
    투표 시작
  </button>
  <button onClick={handleEndVote} className="...">
    투표 종료
  </button>
  <button 
    onClick={() => router.push('/admin/vote-results')} 
    className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
  >
    투표 결과보기
  </button>
</div>
// ... 기존 코드 ...