import { contestants } from '@/data/contestants';

export default function ContestantGrid() {
  return (
    <div className="grid grid-cols-3 md:grid-cols-5 gap-1 md:gap-2 mb-4">
      {contestants.map((contestant) => (
        <div key={contestant.id} className="border rounded-lg p-1 md:p-2">
          <div className="relative aspect-square mb-1">
            <img
              src={contestant.imageUrl}
              alt={contestant.name}
              className="object-cover rounded-lg w-full h-full"
            />
            <div className="absolute top-1 left-1 bg-white rounded-full w-5 h-5 md:w-6 md:h-6 flex items-center justify-center text-xs md:text-sm">
              {contestant.performanceNumber}
            </div>
          </div>
          <h3 className="font-semibold text-center text-xs md:text-sm truncate">
            {contestant.name}
          </h3>
          <p className="text-xs text-gray-600 text-center truncate">
            {contestant.song}
          </p>
        </div>
      ))}
    </div>
  );
}