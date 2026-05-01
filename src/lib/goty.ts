import type { GotyYear } from "@/lib/goty-data";
import { gotyYears } from "@/lib/goty-data";
import { getGameWithMirror } from "@/lib/games";

export async function getHydratedGotyYears() {
  const gameResults = await Promise.allSettled(
    gotyYears.flatMap((year) => year.nominees.map((nominee) => getGameWithMirror(nominee.slug))),
  );

  const gameBySlug = new Map(
    gameResults
      .filter((result) => result.status === "fulfilled")
      .map((result) => [result.value.slug, result.value]),
  );

  return gotyYears.map((year): GotyYear => {
    return {
      ...year,
      nominees: year.nominees.map((nominee) => {
        const game = gameBySlug.get(nominee.slug);

        return {
          ...nominee,
          title: game?.title ?? nominee.title,
          coverUrl: game?.coverUrl ?? nominee.coverUrl ?? null,
        };
      }),
    };
  });
}
