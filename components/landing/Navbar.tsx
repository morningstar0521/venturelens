"use client"

import { useState } from "react"
import Link from "next/link"
import { ArrowRight, Menu, X } from "lucide-react"
import { VentureLensLogo } from "@/components/ui/VentureLensLogo"

export function Navbar() {
  const [open, setOpen] = useState(false)

  const links = [
    { href: "#how-it-works", label: "Workflow" },
    { href: "#features", label: "Platform" },
    { href: "#testimonials", label: "Signal" },
  ]

  return (
    <nav className="fixed inset-x-0 top-0 z-50 px-4 pt-4">
      <div className="glass-nav mx-auto flex h-16 max-w-7xl items-center justify-between rounded-2xl px-4 ring-1 ring-btn/10 sm:px-5">
        <Link href="/" className="flex items-center gap-2.5">
          <VentureLensLogo size={34} showText />
        </Link>

        <div className="hidden items-center gap-1 rounded-xl border border-white/10 bg-white/[0.055] p-1 md:flex">
          {links.map((link) => (
            <a key={link.href} href={link.href} className="rounded-lg px-4 py-2 text-sm font-semibold text-accent-muted transition hover:bg-white/[0.08] hover:text-white">
              {link.label}
            </a>
          ))}
        </div>

        <div className="hidden items-center gap-2 md:flex">
          <Link href="/login" className="rounded-xl px-4 py-2 text-sm font-bold text-accent-muted transition hover:text-white">
            Login
          </Link>
          <Link href="/register" className="inline-flex items-center gap-2 rounded-xl bg-btn px-5 py-2 text-sm font-black text-btn-text shadow-[0_14px_36px_rgba(255,176,0,0.30)] transition hover:bg-btn-hover">
            Start
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        <button className="p-2 text-white md:hidden" onClick={() => setOpen(!open)} aria-label="Toggle menu">
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {open && (
        <div className="glass-nav mx-auto mt-2 max-w-7xl rounded-2xl p-4 md:hidden">
          {links.map((link) => (
            <a key={link.href} href={link.href} onClick={() => setOpen(false)} className="block rounded-xl px-3 py-2 text-sm font-semibold text-accent-muted hover:bg-white/[0.08] hover:text-white">
              {link.label}
            </a>
          ))}
          <div className="mt-3 grid grid-cols-2 gap-2 border-t border-white/10 pt-3">
            <Link href="/login" onClick={() => setOpen(false)} className="rounded-xl border border-white/10 py-2.5 text-center text-sm font-bold text-accent-muted">
              Login
            </Link>
            <Link href="/register" onClick={() => setOpen(false)} className="rounded-xl bg-btn py-2.5 text-center text-sm font-black text-btn-text">
              Start
            </Link>
          </div>
        </div>
      )}
    </nav>
  )
}
