import { GameCard } from "@/components/GameCard";
import { GameFilters } from "@/components/GameFilters";
import { SearchInput } from "@/components/SearchInput";
import { fetchGames, fetchGenres } from "@/lib/rawg";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

export default async function GamesPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; page?: string; genre?: string; ordering?: string }>;
}) {
  const { q, page: pageParam, genre, ordering: rawOrdering } = await searchParams;
  const page = Math.max(1, Number(pageParam) || 1);
  const VALID_ORDERINGS = ["-added", "-rating", "-released", "name", "-metacritic"];
  const ordering = VALID_ORDERINGS.includes(rawOrdering ?? "") ? rawOrdering : undefined;

  const [{ games, total, totalPages }, genres] = await Promise.all([
    fetchGames(q, page, genre, ordering),
    fetchGenres(),
  ]);

  function pageHref(p: number) {
    const params = new URLSearchParams();
    if (q) params.set("q", q);
    if (genre) params.set("genre", genre);
    if (ordering) params.set("ordering", ordering);
    params.set("page", String(p));
    return `/games?${params}`;
  }

  const pages = buildPageNumbers(page, totalPages);

  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-silver">Games</h1>
        <p className="mt-1 text-silver-dim">
          {q
            ? `Top ${games.length} resultados para "${q}"`
            : `${total.toLocaleString("pt-BR")} jogos encontrados`}
        </p>
      </div>

      <div className="mb-4">
        <SearchInput placeholder="Buscar jogos..." />
      </div>

      {!q && (
        <div className="mb-6">
          <GameFilters genres={genres} />
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {games.map((game) => (
          <GameCard key={game.id} game={game} />
        ))}
      </div>

      {totalPages > 1 && !q && (
        <div className="mt-10">
          <Pagination>
            <PaginationContent>
              {page > 1 && (
                <PaginationItem>
                  <PaginationPrevious href={pageHref(page - 1)} />
                </PaginationItem>
              )}

              {pages.map((p, i) =>
                p === "..." ? (
                  <PaginationItem key={`ellipsis-${i}`}>
                    <PaginationEllipsis />
                  </PaginationItem>
                ) : (
                  <PaginationItem key={p}>
                    <PaginationLink href={pageHref(p)} isActive={p === page}>
                      {p}
                    </PaginationLink>
                  </PaginationItem>
                )
              )}

              {page < totalPages && (
                <PaginationItem>
                  <PaginationNext href={pageHref(page + 1)} />
                </PaginationItem>
              )}
            </PaginationContent>
          </Pagination>
        </div>
      )}
    </div>
  );
}

function buildPageNumbers(current: number, total: number): (number | "...")[] {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);

  if (current <= 3) return [1, 2, 3, 4, 5, "...", total];

  if (current >= total - 2) {
    return [1, "...", total - 4, total - 3, total - 2, total - 1, total];
  }

  return [1, "...", current - 1, current, current + 1, "...", total];
}