'use client';

export default function VoteResults({ stageId }) {
  const [results, setResults] = useState(null);

  useEffect(() => {
    const fetchResults = async () => {
      const response = await fetch(`/api/vote-results/${stageId}`);
      const data = await response.json();
      setResults(data);
    };

    fetchResults();
  }, [stageId]);

  if (!results) return null;

  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <div className="mb-4">
        <h4 className="font-semibold">심사위원 투표 결과</h4>
        <p>{results.judgeWinner}</p>
      </div>
      <div className="mb-4">
        <h4 className="font-semibold">방청객 투표 결과</h4>
        <p>{results.audienceWinner}</p>
      </div>
      <div className="mt-4 pt-4 border-t">
        <h4 className="font-bold text-lg">최종 수상자</h4>
        <p className="text-xl text-blue-600">{results.finalWinner}</p>
      </div>
    </div>
  );
}