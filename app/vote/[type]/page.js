import VoteForm from '@/components/VoteForm'

export default function VotePage({ params }) {
  const isJudge = params.type === 'judge'
  
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center mb-8">
        {isJudge ? '심사위원 투표' : '방청객 투표'}
      </h1>
      <VoteForm isJudge={isJudge} />
    </div>
  )
}