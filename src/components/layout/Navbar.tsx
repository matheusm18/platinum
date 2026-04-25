import Link from "next/link";
import { auth, signOut } from "@/auth";
import { Button } from "@/components/ui/button";

export async function Navbar() {
  const session = await auth();

  return (
    <header className="border-b border-border bg-bg">
      <nav className="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between">
        <Link href="/" className="text-lg font-bold tracking-tight text-silver">
          Platinum
        </Link>

        <div className="flex items-center gap-6 text-sm text-silver-dim">
          <Link href="/games" className="hover:text-silver transition-colors">
            Games
          </Link>

          {session ? (
            <>
              <Link
                href={`/profile/${session.user?.name}`}
                className="hover:text-silver transition-colors"
              >
                {session.user?.name}
              </Link>

              <form action={async () => {
                "use server";
                await signOut({ redirectTo: "/" });
              }}>
                <Button variant="ghost" size="sm" type="submit">
                  Sair
                </Button>
              </form>
            </>
          ) : (
            <>
              <Link href="/login" className="hover:text-silver transition-colors">
                Entrar
              </Link>
              <Link
                href="/register"
                className="rounded-md bg-purple px-3 py-1.5 text-white font-medium hover:bg-purple-light transition-colors"
              >
                Registar
              </Link>
            </>
          )}
        </div>
      </nav>
    </header>
  );
}