"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { FilterCapsule } from "@/components/FilterCapsule";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { Genre } from "@/lib/igdb";

const SORT_OPTIONS = [
  { label: "Popularidade", value: "-added" },
  { label: "Metacritic", value: "-metacritic" },
  { label: "Lançamento", value: "-released" },
];

export function GameFilters({ genres }: { genres: Genre[] }) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const activeGenre = searchParams.get("genre") ?? "";
  const activeOrdering = searchParams.get("ordering") ?? "-added";

  function update(key: string, value: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (value) params.set(key, value);
    else params.delete(key);
    params.delete("page");
    router.replace(`/games?${params}`);
  }

  return (
    <div className="flex items-center justify-between gap-4">
      <div className="flex items-center gap-0.5 bg-black/30 border border-white/6 rounded-xl p-1 shadow-[inset_0_1px_0_rgba(255,255,255,0.03)]">
        {SORT_OPTIONS.map((opt) => (
          <FilterCapsule
            key={opt.value}
            label={opt.label}
            active={activeOrdering === opt.value}
            onClick={() => update("ordering", opt.value)}
          />
        ))}
      </div>

      <Select
        value={activeGenre || "all"}
        onValueChange={(v) => update("genre", v === "all" ? "" : v)}
      >
        <SelectTrigger className="w-44 bg-black/30 border-white/6 text-white/60 text-xs rounded-xl h-10">
          <SelectValue placeholder="Género" />
        </SelectTrigger>
        <SelectContent className="bg-[#16161f] border-white/10 text-[#c8cdd6]">
          <SelectItem value="all">Todos os géneros</SelectItem>
          {genres.map((genre) => (
            <SelectItem key={genre.slug} value={genre.slug}>
              {genre.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}