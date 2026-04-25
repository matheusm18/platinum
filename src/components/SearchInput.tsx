"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";

export function SearchInput() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [value, setValue] = useState(searchParams.get("q") ?? "");
  const mounted = useRef(false);
  const searchParamsRef = useRef(searchParams);

  useEffect(() => {
    searchParamsRef.current = searchParams;
  }, [searchParams]);

  useEffect(() => {
    if (!mounted.current) {
      mounted.current = true;
      return;
    }

    const timeout = setTimeout(() => {
      const params = new URLSearchParams(searchParamsRef.current.toString());
      if (value) params.set("q", value);
      else params.delete("q");
      params.delete("page");
      router.replace(`/games?${params}`);
    }, 400);

    return () => clearTimeout(timeout);
  }, [value, router]);

  return (
    <input
      type="search"
      placeholder="Buscar jogos..."
      value={value}
      onChange={(e) => setValue(e.target.value)}
      className="w-full rounded-md border border-white/10 bg-white/5 px-4 py-2 text-sm text-silver placeholder:text-silver-dim focus:outline-none focus:ring-1 focus:ring-white/20"
    />
  );
}