import { GameCard } from "@/components/GameCard";
import { fetchGames } from "@/lib/rawg";

export default async function GamesPage() {
  const games = await fetchGames();

  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-silver">Games</h1>
        <p className="mt-1 text-silver-dim">{games.length} jogos encontrados</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {games.map((game) => (
          <GameCard key={game.id} game={game} />
        ))}
      </div>
    </div>
  );
}