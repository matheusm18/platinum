"use client"

import { useState } from "react"
import { createPortal } from "react-dom"
import Link from "next/link"
import { Menu, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { signOutAction } from "@/lib/actions/auth"

type Props = {
  username?: string | null
}

export function MobileMenu({ username }: Props) {
  const [isOpen, setIsOpen] = useState(false)


  return (
    <>
      <Button
        variant="ghost"
        size="sm"
        className="md:hidden text-silver-dim hover:text-silver"
        onClick={() => setIsOpen(true)}
      >
        <Menu className="w-5 h-5" />
      </Button>

      {isOpen && createPortal(
        <div className="fixed inset-0 z-9999 bg-bg flex flex-col">
          <div className="flex justify-end p-4">
            <Button
              variant="ghost"
              size="sm"
              className="text-silver-dim hover:text-silver"
              onClick={() => setIsOpen(false)}
            >
              <X className="w-5 h-5" />
            </Button>
          </div>

          <nav className="flex flex-col items-center justify-center flex-1 gap-2 pb-20">
            {username && (
              <Link
                href="/users"
                onClick={() => setIsOpen(false)}
                className="w-full text-center py-4 text-2xl font-semibold text-silver-dim hover:text-white transition-colors"
              >
                Users
              </Link>
            )}
            <Link
              href="/games"
              onClick={() => setIsOpen(false)}
              className="w-full text-center py-4 text-2xl font-semibold text-silver-dim hover:text-white transition-colors"
            >
              Games
            </Link>

            <div className="w-16 h-px bg-border my-4" />

            {username ? (
              <>
                <Link
                  href={`/users/${username}`}
                  onClick={() => setIsOpen(false)}
                  className="w-full text-center py-4 text-2xl font-semibold text-silver-dim hover:text-white transition-colors"
                >
                  {username}
                </Link>
                <Button
                  variant="ghost"
                  size="lg"
                  className="text-silver-dim hover:text-white text-2xl font-semibold"
                  onClick={async () => {
                    setIsOpen(false)
                    await signOutAction()
                  }}
                >
                  Sair
                </Button>
              </>
            ) : (
              <div className="flex flex-col items-center gap-3 mt-2">
                <Button variant="ghost" size="lg" asChild className="text-silver-dim hover:text-white text-lg">
                  <Link href="/login" onClick={() => setIsOpen(false)}>Entrar</Link>
                </Button>
                <Button size="lg" asChild className="text-lg px-10">
                  <Link href="/register" onClick={() => setIsOpen(false)}>Registar</Link>
                </Button>
              </div>
            )}
          </nav>
        </div>,
        document.body
      )}
    </>
  )
}
