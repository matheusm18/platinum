import Link from "next/link";
import Image from "next/image";
import { getSession } from "@/lib/session";
import { Button } from "@/components/ui/button";
import { MobileMenu } from "@/components/layout/MobileMenu";
import { signOutAction } from "@/lib/actions/auth";

export async function Navbar() {
  const session = await getSession();

  return (
    <header className="border-border bg-bg/80 sticky top-0 z-50 border-b backdrop-blur-sm">
      <nav className="mx-auto flex h-14 max-w-5xl items-center justify-between px-4">
        <Link href="/" className="group flex items-center gap-2.5">
          <div className="h-7 w-7 shrink-0 overflow-hidden rounded-lg bg-white">
            <Image
              src="/platinum192.png"
              alt="Platinum"
              width={28}
              height={28}
              unoptimized
              priority
            />
          </div>
          <span className="group-hover:text-silver font-bold tracking-tight text-white transition-colors">
            Platinum
          </span>
        </Link>

        <div className="hidden items-center gap-1 md:flex">
          {session && (
            <Link
              href="/feed"
              className="text-silver-dim hover:text-silver hover:bg-bg-card rounded-md px-3 py-1.5 text-sm transition-colors"
            >
              Feed
            </Link>
          )}

          {session && (
            <Link
              href="/users"
              className="text-silver-dim hover:text-silver hover:bg-bg-card rounded-md px-3 py-1.5 text-sm transition-colors"
            >
              Users
            </Link>
          )}

          <Link
            href="/games"
            className="text-silver-dim hover:text-silver hover:bg-bg-card rounded-md px-3 py-1.5 text-sm transition-colors"
          >
            Games
          </Link>

          <div className="bg-border mx-2 h-4 w-px" />

          {session ? (
            <>
              <Link
                href={`/users/${session.user?.name}`}
                className="text-silver-dim hover:text-silver hover:bg-bg-card rounded-md px-5 py-1.5 text-sm transition-colors"
              >
                {session.user?.name}
              </Link>

              <form action={signOutAction}>
                <Button variant="ghost" size="sm" type="submit" className="text-silver-dim">
                  Sair
                </Button>
              </form>
            </>
          ) : (
            <>
              <Button
                variant="ghost"
                size="sm"
                asChild
                className="text-silver-dim hover:bg-bg-card hover:text-silver px-5 py-1.5"
              >
                <Link href="/login">Entrar</Link>
              </Button>

              <Button size="sm" asChild>
                <Link href="/register">Registar</Link>
              </Button>
            </>
          )}
        </div>

        <MobileMenu username={session?.user?.name} />
      </nav>
    </header>
  );
}
