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
      <div className="bg-grid-main pointer-events-none absolute inset-0" />
      <div
        className="pointer-events-none absolute top-0 left-1/2 h-105 w-175 -translate-x-1/2"
        style={{
          background: "radial-gradient(ellipse, rgba(62,0,227,0.18) 0%, transparent 70%)",
        }}
      />

      <div className="form-enter relative mx-auto max-w-5xl px-4 pt-24 pb-20 text-center">
        <div className="mb-8 flex justify-center">
          <div className="shadow-logo-glow h-28 w-28 overflow-hidden rounded-2xl bg-white">
            <Image
              src="/platinum512.png"
              alt="Platinum"
              width={112}
              height={112}
              priority
              unoptimized
            />
          </div>
        </div>

        <h1 className="mb-5 text-5xl leading-[1.05] font-bold tracking-tight sm:text-6xl lg:text-[72px]">
          <span className="text-white">O teu arquivo</span>
          <br />
          <span className="text-silver-dim">de jogos.</span>
        </h1>

        <p className="text-silver-dim mx-auto mb-10 max-w-sm text-base leading-relaxed sm:text-lg">
          Regista o que jogaste, avalia o que sentiste, e partilha com quem percebe.
        </p>

        {session ? (
          <div className="flex flex-wrap items-center justify-center gap-3">
            <Button size="lg" asChild>
              <Link href="/feed">Feed</Link>
            </Button>
            <Button size="lg" asChild>
              <Link href="/users">Users</Link>
            </Button>
            <Button size="lg" asChild>
              <Link href="/games">Games</Link>
            </Button>
          </div>
        ) : (
          <div className="flex flex-wrap items-center justify-center gap-3">
            <Button size="lg" asChild>
              <Link href="/register">Começar grátis</Link>
            </Button>
            <Button
              size="lg"
              variant="ghost"
              asChild
              className="text-silver-dim hover:text-silver hover:bg-bg-card"
            >
              <Link href="/games">Games</Link>
            </Button>
          </div>
        )}
      </div>
    </section>
  );
}
