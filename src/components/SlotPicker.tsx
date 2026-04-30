"use client";

import { useState, useTransition, useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { rawgResize } from "@/lib/utils";
import { Pencil, X, Check } from "lucide-react";
import { useRouter } from "next/navigation";
import { clsx } from "clsx";

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
  buttonText?: string;
  buttonHref?: string;
  hrefPrefix: string;
  onSave: (position: number, slug: string | null) => Promise<void>;
  onSearch: (query: string) => Promise<SearchResult[]>;
}

export function SlotPicker({
  slots,
  isOwner,
  label,
  buttonText,
  buttonHref,
  hrefPrefix,
  onSave,
  onSearch,
}: Props) {
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
    if (activeSlot === null) return;

    if (debounceRef.current) clearTimeout(debounceRef.current);

    debounceRef.current = setTimeout(async () => {
      setSearching(true);

      const res = await onSearch(query);

      setResults(res);
      setSearching(false);
    }, 400);

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [query, activeSlot, onSearch]);

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
      }),
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
      prev.map((s) =>
        s.position === position ? { position, slug: null, title: null, coverUrl: null } : s,
      ),
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
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-silver-dim text-xs font-semibold tracking-widest uppercase">{label}</h2>

        <div className="flex items-center gap-4">
          {buttonText && buttonHref && (
            <Link
              href={buttonHref}
              className="text-silver-dim text-xs font-medium transition-colors hover:text-white"
            >
              {buttonText}
            </Link>
          )}

          {isOwner &&
            (editing ? (
              <button
                onClick={exitEditing}
                className="text-silver-dim hover:text-silver flex items-center gap-1 text-xs transition-colors"
              >
                <Check size={12} />
                Concluído
              </button>
            ) : (
              <button
                onClick={() => setEditing(true)}
                className="text-silver-dim hover:text-silver flex items-center gap-1 text-xs transition-colors"
              >
                <Pencil size={12} />
                Editar
              </button>
            ))}
        </div>
      </div>

      <div className="flex gap-3">
        {localSlots.map((slot) => {
          const isActive = activeSlot === slot.position;
          const hasCover = slot.slug && slot.coverUrl;

          return (
            <div
              key={slot.position}
              onClick={() => handleSlotClick(slot.position)}
              className={clsx([
                "bg-bg-card group relative aspect-2/3 flex-1 overflow-hidden rounded-lg border",
                editing ? "cursor-pointer" : "",
                isActive ? "border-white/30 ring-1 ring-white/10" : "border-border",
              ])}
            >
              {hasCover ? (
                <>
                  {editing ? (
                    <>
                      <Image
                        src={rawgResize(slot.coverUrl!, 640)}
                        alt={slot.title ?? ""}
                        fill
                        sizes="(max-width: 768px) 25vw, 150px"
                        className="object-cover"
                        unoptimized
                      />
                      <div className="absolute inset-x-0 bottom-0 border-t border-white/10 bg-black/40 px-2.5 py-2 backdrop-blur-md">
                        <span className="line-clamp-1 block text-center text-xs leading-snug font-semibold text-white/70">
                          {slot.title}
                        </span>
                      </div>
                    </>
                  ) : (
                    <Link
                      href={`${hrefPrefix}${slot.slug}`}
                      className="relative block h-full w-full"
                    >
                      <Image
                        src={rawgResize(slot.coverUrl!, 640)}
                        alt={slot.title ?? ""}
                        fill
                        sizes="(max-width: 768px) 25vw, 150px"
                        className="object-cover transition-transform duration-500 ease-out group-hover:scale-110"
                        unoptimized
                      />

                      <div className="absolute inset-x-0 bottom-0 border-t border-white/10 bg-black/40 px-2.5 py-2 backdrop-blur-md">
                        <span className="line-clamp-1 block text-center text-xs leading-snug font-semibold text-white/70">
                          {slot.title}
                        </span>
                      </div>
                    </Link>
                  )}

                  {editing && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 transition-opacity group-hover:opacity-100">
                      <button
                        onClick={(e) => handleRemove(slot.position, e)}
                        className="absolute top-1.5 right-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-black/70 text-white/60 transition-colors hover:text-white"
                      >
                        <X size={10} />
                      </button>
                      <Pencil size={14} className="text-white/80" />
                    </div>
                  )}
                </>
              ) : (
                <div className="flex h-full w-full items-center justify-center">
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
        <div className="bg-bg-card border-border mt-4 rounded-xl border p-4">
          <p className="text-silver-dim mb-3 text-xs">Slot #{activeSlot}</p>
          <input
            ref={searchRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Procurar jogo..."
            className="border-border bg-bg text-silver placeholder:text-silver-dim/50 w-full rounded-md border px-3 py-2 text-sm focus:ring-1 focus:ring-white/20 focus:outline-none"
          />

          {searching && <p className="text-silver-dim/50 mt-3 pl-1 text-xs">A procurar...</p>}

          {!searching && results.length > 0 && (
            <div className="mt-3 space-y-1">
              {results.map((r) => (
                <button
                  key={r.slug}
                  onClick={() => handleSelect(r)}
                  disabled={isPending}
                  className="flex w-full items-center gap-3 rounded-lg px-2 py-2 text-left transition-colors hover:bg-white/5"
                >
                  <div className="bg-bg border-border relative h-11 w-8 shrink-0 overflow-hidden rounded border">
                    {r.coverUrl && (
                      <Image
                        src={r.coverUrl}
                        alt={r.title}
                        fill
                        sizes="32px"
                        className="object-cover"
                        unoptimized
                      />
                    )}
                  </div>
                  <span className="text-silver truncate text-sm">{r.title}</span>
                </button>
              ))}
            </div>
          )}

          {!searching && query.trim() && results.length === 0 && (
            <p className="text-silver-dim/50 mt-3 pl-1 text-xs">Nenhum resultado.</p>
          )}
        </div>
      )}
    </section>
  );
}
