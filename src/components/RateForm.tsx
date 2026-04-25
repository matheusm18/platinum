"use client";

import { useState, useTransition } from "react";
import { Star } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

interface Props {
  onSave: (score: number, content: string) => Promise<{ success: boolean }>;
  onDelete?: () => Promise<{ success: boolean }>;
  existingScore?: number | null;
  existingContent?: string | null;
}

function getStarColor(value: number): string {
  const db = value * 2;
  if (db <= 4) return "fill-red-500 text-red-500";
  if (db <= 6) return "fill-yellow-400 text-yellow-400";
  if (db <= 7) return "fill-orange-400 text-orange-400";
  if (db <= 9) return "fill-green-500 text-green-500";
  return "fill-green-700 text-green-700";
}

function StarIcon({ fill, colorClass }: { fill: "full" | "half" | "empty"; colorClass: string }) {
  if (fill === "full") {
    return <Star size={28} className={colorClass} />;
  }
  if (fill === "empty") {
    return <Star size={28} className="fill-transparent text-white/20" />;
  }
  return (
    <div className="relative w-7 h-7">
      <Star size={28} className="fill-transparent text-white/20" />
      <div className="absolute inset-0 overflow-hidden w-1/2">
        <Star size={28} className={colorClass} />
      </div>
    </div>
  );
}

export function RateForm({ onSave, onDelete, existingScore, existingContent }: Props) {
  const [hovered, setHovered] = useState<number | null>(null);
  const [selected, setSelected] = useState<number | null>(existingScore ?? null);
  const [content, setContent] = useState(existingContent ?? "");
  const [isPending, startTransition] = useTransition();

  const active = hovered ?? selected ?? 0;
  const colorClass = active > 0 ? getStarColor(active) : "fill-transparent text-white/20";

  function getFill(star: number): "full" | "half" | "empty" {
    if (active >= star) return "full";
    if (active >= star - 0.5) return "half";
    return "empty";
  }

  function handleMouseMove(e: React.MouseEvent<HTMLDivElement>, star: number) {
    const rect = e.currentTarget.getBoundingClientRect();
    const isLeftHalf = e.clientX - rect.left < rect.width / 2;
    setHovered(isLeftHalf ? star - 0.5 : star);
  }

  function handleSubmit() {
    if (!selected) return;
    startTransition(async () => {
      const res = await onSave(selected, content);
      if (res.success) toast.success(existingScore ? "Avaliação atualizada." : "Avaliação guardada.");
    });
  }

  function handleDelete() {
    if (!onDelete) return;
    startTransition(async () => {
      const res = await onDelete();
      if (res.success) {
        toast.success("Avaliação removida.");
        setSelected(null);
        setContent("");
      }
    });
  }

  return (
    <div className="border-t border-border pt-8">
      <h2 className="text-lg font-semibold text-silver mb-6">Avaliar jogo</h2>

      <div className="flex gap-1 mb-6" onMouseLeave={() => setHovered(null)}>
        {[1, 2, 3, 4, 5].map((star) => (
          <div
            key={star}
            onMouseMove={(e) => handleMouseMove(e, star)}
            onClick={() => setSelected(hovered ?? star)}
            className="cursor-pointer transition-transform hover:scale-110 p-0.5"
          >
            <StarIcon fill={getFill(star)} colorClass={colorClass} />
          </div>
        ))}
      </div>

      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Escreve sobre a tua experiência com o jogo..."
        rows={4}
        className="w-full rounded-md border border-border bg-bg-card px-3 py-2 text-sm text-silver placeholder:text-silver-dim/40 focus:outline-none focus:ring-1 focus:ring-white/20 resize-none mb-4"
      />

      <div className="flex items-center gap-3">
        <Button onClick={handleSubmit} disabled={!selected || isPending}>
          {isPending ? "A guardar..." : existingScore ? "Atualizar avaliação" : "Guardar avaliação"}
        </Button>
        {onDelete && existingScore && (
          <Button
            variant="ghost"
            onClick={handleDelete}
            disabled={isPending}
            className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
          >
            Remover
          </Button>
        )}
      </div>
    </div>
  );
}