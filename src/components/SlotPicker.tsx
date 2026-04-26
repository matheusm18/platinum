"use client";

import { useState, useTransition, useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { rawgResize } from "@/lib/utils";
import { Pencil, X, Check } from "lucide-react";
import { useRouter } from "next/navigation";

export type Slot = {
  position: number;
  slug: string | null;
  title: string | null;
  coverUrl: string | null;
};

type SearchResult = { slug: string; title: string; coverUrl: string };

interface Props {
  slots: Slot[];
  isOwner: boolean;
  label: string;
  hrefPrefix: string;
  onSave: (position: number, slug: string | null) => Promise<void>;
  onSearch: (query: string) => Promise<SearchResult[]>;
}

export function SlotPicker({ slots, isOwner, label, hrefPrefix, onSave, onSearch }: Props) {
  const router = useRouter();

  // copia dos slots para manipular localmente e evitar lag na UI enquanto espera a resposta
  const [localSlots, setLocalSlots] = useState<Slot[]>(slots);
  const [prevSlots, setPrevSlots] = useState<Slot[]>(slots);

  if (slots !== prevSlots) {
    setPrevSlots(slots);
    setLocalSlots(slots);
  }

  const [editing, setEditing] = useState(false);
  const [activeSlot, setActiveSlot] = useState<number | null>(null);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [searching, setSearching] = useState(false);
  const [isPending, startTransition] = useTransition();
  const searchRef = useRef<HTMLInputElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (activeSlot !== null) searchRef.current?.focus();
  }, [activeSlot]);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);

    debounceRef.current = setTimeout(async () => {
      if (!query.trim()) { setResults([]); return; }
      setSearching(true);
      const res = await onSearch(query);
      setResults(res);
      setSearching(false);
    }, 400);

    return () => { if (debounceRef.current) clearTimeout(debounceRef.current); };
  }, [query, onSearch]);

  function handleSlotClick(position: number) {
    if (!editing) return;
    setActiveSlot(position === activeSlot ? null : position);
    setQuery("");
    setResults([]);
  }

  function handleSelect(result: SearchResult) {
    if (activeSlot === null) return;
    const position = activeSlot;

    // atualiza o slot localmente antes do servidor confirmar pra evitar lag
    setLocalSlots((prev) =>
      prev.map((s) => {
        if (s.position === position) {
          return { position, slug: result.slug, title: result.title, coverUrl: result.coverUrl };
        }

        if (s.slug === result.slug) {
          return { position: s.position, slug: null, title: null, coverUrl: null };
        }
        return s;
    })
    );
    setActiveSlot(null);
    setQuery("");
    setResults([]);

    // sincroniza com o servidor
    startTransition(async () => {
      await onSave(position, result.slug);
      router.refresh();
    });
  }

  function handleRemove(position: number, e: React.MouseEvent) {
    e.stopPropagation();

    // remove o slot localmente antes do servidor confirmar pra evitar lag
    setLocalSlots((prev) =>
      prev.map((s) => (s.position === position ? { position, slug: null, title: null, coverUrl: null } : s))
    );
    if (activeSlot === position) {
      setActiveSlot(null);
      setQuery("");
      setResults([]);
    }

    // sincroniza com o servidor
    startTransition(async () => {
      await onSave(position, null);
      router.refresh();
    });
  }

  function exitEditing() {
    setEditing(false);
    setActiveSlot(null);
    setQuery("");
    setResults([]);
  }

  return (
    <section className="mb-12">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xs font-semibold text-silver-dim uppercase tracking-widest">
          {label}
        </h2>
        {isOwner && (
          editing ? (
            <button
              onClick={exitEditing}
              className="flex items-center gap-1 text-xs text-silver-dim hover:text-silver transition-colors"
            >
              <Check size={12} />
              Concluído
            </button>
          ) : (
            <button
              onClick={() => setEditing(true)}
              className="flex items-center gap-1 text-xs text-silver-dim hover:text-silver transition-colors"
            >
              <Pencil size={12} />
              Editar
            </button>
          )
        )}
      </div>

      <div className="flex gap-3">
        {localSlots.map((slot) => {
          const isActive = activeSlot === slot.position;
          const hasCover = slot.slug && slot.coverUrl;

          return (
            <div
              key={slot.position}
              onClick={() => handleSlotClick(slot.position)}
              className={[
                "flex-1 aspect-2/3 rounded-lg overflow-hidden bg-bg-card border relative group",
                editing ? "cursor-pointer" : "",
                isActive ? "border-white/30 ring-1 ring-white/10" : "border-border",
              ].join(" ")}
            >
              {hasCover ? (
                <>
                  {editing ? (
                    <Image src={rawgResize(slot.coverUrl!, 640)} alt={slot.title ?? ""} fill sizes="(max-width: 768px) 25vw, 150px" className="object-cover" unoptimized />
                  ) : (
                    <Link href={`${hrefPrefix}${slot.slug}`} className="relative block w-full h-full">
                      <Image
                        src={rawgResize(slot.coverUrl!, 640)}
                        alt={slot.title ?? ""}
                        fill
                        sizes="(max-width: 768px) 25vw, 150px"
                        className="object-cover transition-transform duration-300 group-hover:scale-105"
                        unoptimized
                      />
                    </Link>
                  )}

                  {editing && (
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={(e) => handleRemove(slot.position, e)}
                        className="absolute top-1.5 right-1.5 w-5 h-5 rounded-full bg-black/70 flex items-center justify-center text-white/60 hover:text-white transition-colors"
                      >
                        <X size={10} />
                      </button>
                      <Pencil size={14} className="text-white/80" />
                    </div>
                  )}
                </>
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  {editing ? (
                    <span className="text-silver-dim/40 text-xl font-light">+</span>
                  ) : (
                    <span className="text-border text-xl font-bold">{slot.position}</span>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {editing && activeSlot !== null && (
        <div className="mt-4 bg-bg-card border border-border rounded-xl p-4">
          <p className="text-xs text-silver-dim mb-3">Slot #{activeSlot}</p>
          <input
            ref={searchRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Procurar jogo..."
            className="w-full rounded-md border border-border bg-bg px-3 py-2 text-sm text-silver placeholder:text-silver-dim/50 focus:outline-none focus:ring-1 focus:ring-white/20"
          />

          {searching && (
            <p className="text-xs text-silver-dim/50 mt-3 pl-1">A procurar...</p>
          )}

          {!searching && results.length > 0 && (
            <div className="mt-3 space-y-1">
              {results.map((r) => (
                <button
                  key={r.slug}
                  onClick={() => handleSelect(r)}
                  disabled={isPending}
                  className="w-full flex items-center gap-3 rounded-lg px-2 py-2 hover:bg-white/5 transition-colors text-left"
                >
                  <div className="w-8 h-11 rounded shrink-0 overflow-hidden bg-bg border border-border relative">
                    {r.coverUrl && (
                      <Image src={r.coverUrl} alt={r.title} fill sizes="32px" className="object-cover" unoptimized />
                    )}
                  </div>
                  <span className="text-sm text-silver truncate">{r.title}</span>
                </button>
              ))}
            </div>
          )}

          {!searching && query.trim() && results.length === 0 && (
            <p className="text-xs text-silver-dim/50 mt-3 pl-1">Nenhum resultado.</p>
          )}
        </div>
      )}
    </section>
  );
}