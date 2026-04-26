import Link from "next/link";
import Image from "next/image";
import type { Session } from "next-auth";
import { Button } from "@/components/ui/button";

interface HeroProps {
  session: Session | null;
}

export function Hero({ session }: HeroProps) {
  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0 bg-grid-main pointer-events-none" />
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-175 h-105 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse, rgba(62,0,227,0.18) 0%, transparent 70%)",
        }}
      />

      <div className="form-enter relative max-w-5xl mx-auto px-4 pt-24 pb-20 text-center">
        <div className="flex justify-center mb-8">
            <div className="w-28 h-28 bg-white rounded-2xl overflow-hidden shadow-logo-glow">
            <Image src="/platinum512.png" alt="Platinum" width={112} height={112} priority unoptimized />
            </div>
        </div>

        <h1 className="text-5xl sm:text-6xl lg:text-[72px] font-bold tracking-tight leading-[1.05] mb-5">
          <span className="text-white">O teu arquivo</span>
          <br />
          <span className="text-silver-dim">de jogos.</span>
        </h1>

        <p className="text-silver-dim text-base sm:text-lg max-w-sm mx-auto mb-10 leading-relaxed">
          Regista o que jogaste, avalia o que sentiste,
          e partilha com quem percebe.
        </p>

        {session ? (
          <div className="flex items-center justify-center gap-3 flex-wrap">
            <Button size="lg" asChild>
              <Link href="/games">Games</Link>
            </Button>
            <Button size="lg" asChild>
              <Link href="/users">Users</Link>
            </Button>
          </div>
        ) : (
          <div className="flex items-center justify-center gap-3 flex-wrap">
            <Button size="lg" asChild>
              <Link href="/register">Começar grátis</Link>
            </Button>
            <Button
              size="lg"
              variant="ghost"
              asChild
              className="text-silver-dim hover:text-silver hover:bg-bg-card"
            >
              <Link href="/games">Ver jogos</Link>
            </Button>
          </div>
        )}
      </div>
    </section>
  );
}