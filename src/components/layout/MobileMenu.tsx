"use client";

import { useState } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { signOutAction } from "@/lib/actions/auth";

type Props = {
  username?: string | null;
};

export function MobileMenu({ username }: Props) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Button
        variant="ghost"
        size="sm"
        className="text-silver-dim hover:text-silver md:hidden"
        onClick={() => setIsOpen(true)}
      >
        <Menu className="h-5 w-5" />
      </Button>

      {isOpen &&
        createPortal(
          <div className="bg-bg fixed inset-0 z-9999 flex flex-col">
            <div className="flex justify-end p-4">
              <Button
                variant="ghost"
                size="sm"
                className="text-silver-dim hover:text-silver"
                onClick={() => setIsOpen(false)}
              >
                <X className="h-5 w-5" />
              </Button>
            </div>

            <nav className="flex flex-1 flex-col items-center justify-center gap-2 pb-20">
              {username && (
                <Link
                  href="/feed"
                  onClick={() => setIsOpen(false)}
                  className="text-silver-dim w-full py-4 text-center text-2xl font-semibold transition-colors hover:text-white"
                >
                  Feed
                </Link>
              )}

              {username && (
                <Link
                  href="/users"
                  onClick={() => setIsOpen(false)}
                  className="text-silver-dim w-full py-4 text-center text-2xl font-semibold transition-colors hover:text-white"
                >
                  Users
                </Link>
              )}

              <Link
                href="/games"
                onClick={() => setIsOpen(false)}
                className="text-silver-dim w-full py-4 text-center text-2xl font-semibold transition-colors hover:text-white"
              >
                Games
              </Link>

              <div className="bg-border my-4 h-px w-16" />

              {username ? (
                <>
                  <Link
                    href={`/users/${username}`}
                    onClick={() => setIsOpen(false)}
                    className="text-silver-dim w-full py-4 text-center text-2xl font-semibold transition-colors hover:text-white"
                  >
                    {username}
                  </Link>
                  <Button
                    variant="ghost"
                    size="lg"
                    className="text-silver-dim text-2xl font-semibold hover:text-white"
                    onClick={async () => {
                      setIsOpen(false);
                      await signOutAction();
                    }}
                  >
                    Sair
                  </Button>
                </>
              ) : (
                <div className="mt-2 flex flex-col items-center gap-3">
                  <Button
                    variant="ghost"
                    size="lg"
                    asChild
                    className="text-silver-dim text-lg hover:text-white"
                  >
                    <Link href="/login" onClick={() => setIsOpen(false)}>
                      Entrar
                    </Link>
                  </Button>
                  <Button size="lg" asChild className="px-10 text-lg">
                    <Link href="/register" onClick={() => setIsOpen(false)}>
                      Registar
                    </Link>
                  </Button>
                </div>
              )}
            </nav>
          </div>,
          document.body,
        )}
    </>
  );
}
