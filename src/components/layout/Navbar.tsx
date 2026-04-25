import Link from "next/link";
import Image from "next/image";
import { auth, signOut } from "@/auth";
import { Button } from "@/components/ui/button";

export async function Navbar() {
  const session = await auth();

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-bg/80 backdrop-blur-sm">
      <nav className="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between">

        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-7 h-7 bg-white rounded-lg overflow-hidden shrink-0">
            <Image src="/platinum192.png" alt="Platinum" width={28} height={28} />
          </div>
          <span className="font-bold tracking-tight text-white group-hover:text-silver transition-colors">
            Platinum
          </span>
        </Link>

        <div className="flex items-center gap-1">
          <Link
            href="/games"
            className="px-3 py-1.5 text-sm text-silver-dim hover:text-silver transition-colors rounded-md hover:bg-bg-card"
          >
            Games
          </Link>

          <div className="w-px h-4 bg-border mx-2" />

          {session ? (
            <>
              <Link
                href={`/profile/${session.user?.name}`}
                className="px-5 py-1.5 text-sm text-silver-dim hover:text-silver transition-colors rounded-md hover:bg-bg-card"
              >
                {session.user?.name}
              </Link>

              <form action={async () => {
                "use server";
                await signOut({ redirectTo: "/" });
              }}>
                <Button variant="ghost" size="sm" type="submit" className="text-silver-dim">
                  Sair
                </Button>
              </form>
            </>
          ) : (
            <>
              <Button variant="ghost" size="sm" asChild className="text-silver-dim hover:bg-bg-card hover:text-silver px-5 py-1.5">
                <Link href="/login">Entrar</Link>
              </Button>

              <Button size="sm" asChild>
                <Link href="/register">Registar</Link>
              </Button>
            </>
          )}
        </div>
      </nav>
    </header>
  );
}