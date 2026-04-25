"use client";

import Image from "next/image";
import { Ripple } from "@/components/ui/ripple";

export function BrandPanel() {
  return (
    <section className="hidden lg:flex lg:w-[40%] min-h-screen relative overflow-hidden bg-bg border-r border-border flex-col items-center justify-center p-12">
      <div className="absolute inset-0 pointer-events-none bg-grid-main"/>

      <div className="relative z-10 flex flex-col items-center text-center gap-8">
        
        <div className="relative flex items-center justify-center w-64 h-64">
          <div className="absolute inset-0 opacity-20 text-purple-light">
            <Ripple mainCircleSize={112} mainCircleOpacity={0.15} numCircles={3} />
          </div>

          <div className="relative z-10 w-28 h-28 rounded-2xl bg-white shadow-logo-glow overflow-hidden">
            <Image
              src="/platinum512.png"
              alt="Platinum logo"
              width={112}
              height={112}
              priority
              className="object-cover"
            />
          </div>
        </div>

        <div className="space-y-3">
          <h1 className="text-5xl font-bold text-white tracking-tight leading-none">
            Platinum
          </h1>
          <p className="text-silver-dim text-sm leading-relaxed">
            O teu diário de jogos.<br />
            As tuas memórias. A tua coleção.
          </p>
        </div>
      </div>
    </section>
  );
}