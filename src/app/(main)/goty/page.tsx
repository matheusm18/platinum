import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { GotyBoard } from "@/components/goty/GotyBoard";
import { getSession } from "@/lib/session";
import { getUserGotyRankings, saveGotyRanking } from "@/lib/actions/goty";
import { getGotyYear } from "@/lib/goty-data";
import { getHydratedGotyYears } from "@/lib/goty";

type Props = {
  searchParams: Promise<{ year?: string }>;
};

export const metadata: Metadata = {
  title: "GOTY — Platinum",
  description: "Monta o teu Top 5 dos nomeados a Game of the Year.",
};

export default async function GotyPage({ searchParams }: Props) {
  const { year } = await searchParams;
  const session = await getSession();

  if (!session?.user) redirect("/login");

  const hydratedYears = await getHydratedGotyYears();
  const userId = session.user.id!;
  const userGoty = await getUserGotyRankings(userId);
  const initialYear = getGotyYear(Number(year)).year;

  return (
    <GotyBoard
      years={hydratedYears}
      initialYear={initialYear}
      initialRankings={userGoty.rankings}
      initialPinnedYears={userGoty.pinnedYears}
      isAuthenticated={!!session?.user}
      onSave={saveGotyRanking}
    />
  );
}
