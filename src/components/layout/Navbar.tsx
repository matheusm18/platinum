import Link from "next/link";

export function Navbar() {
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
          <Link href="/login" className="hover:text-silver transition-colors">
            Sign in
          </Link>
          <Link
            href="/register"
            className="rounded-md bg-purple px-3 py-1.5 text-white font-medium hover:bg-purple-light transition-colors"
          >
            Register
          </Link>
        </div>
      </nav>
    </header>
  );
}
