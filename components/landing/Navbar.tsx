"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Menu, X } from "lucide-react"

// ─── Navbar ────────────────────────────────────────────────────────────────
export function Navbar() {
  const [open, setOpen] = useState(false)

  const navLinks = [
    { href: "#how-it-works", label: "How It Works" },
    { href: "#features",     label: "Features"     },
    { href: "#testimonials", label: "Testimonials"  },
  ]

  const logoContent = (
    <div className="flex items-center gap-2.5" suppressHydrationWarning>
      <Image
        src="/logo/logo.png"
        alt="VentureLens"
        width={36}
        height={36}
        priority
        className="h-9 w-auto object-contain"
        suppressHydrationWarning
      />
      <span className="font-bold text-lg tracking-tight">
        <span className="text-btn">Venture</span>
        <span className="text-accent-yellow">Lens</span>
      </span>
    </div>
  )

  return (
    <nav className="fixed top-0 inset-x-0 z-50 border-b border-white/5 bg-background/80 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">

        {/* Logo */}
        <Link href="/" className="group">
          {logoContent}
        </Link>

        {/* Desktop nav links */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((l) => (
            <a key={l.href} href={l.href}
              className="text-sm text-accent-muted hover:text-accent-yellow transition-colors duration-200">
              {l.label}
            </a>
          ))}
        </div>

        {/* CTA buttons */}
        <div className="hidden md:flex items-center gap-3">
          <Link href="/login"
            className="text-sm px-4 py-2 rounded-xl border border-border-subtle text-accent-muted hover:text-accent-yellow hover:border-btn/40 transition-all duration-200">
            Login
          </Link>
          <Link href="/register"
            className="text-sm px-5 py-2 rounded-xl bg-btn text-btn-text font-semibold hover:bg-btn-hover shadow-[0_0_16px_rgba(248,198,34,0.25)] hover:shadow-[0_0_24px_rgba(248,198,34,0.4)] transition-all duration-200">
            Get Started
          </Link>
        </div>

        {/* Mobile toggle */}
        <button className="md:hidden text-accent-yellow p-1" onClick={() => setOpen(!open)} aria-label="Toggle menu">
          {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile dropdown */}
      {open && (
        <div className="md:hidden border-t border-white/5 bg-background/95 backdrop-blur-xl px-6 py-4 space-y-3">
          {navLinks.map((l) => (
            <a key={l.href} href={l.href} onClick={() => setOpen(false)}
              className="block text-sm text-accent-muted hover:text-accent-yellow transition-colors py-1.5">
              {l.label}
            </a>
          ))}
          <div className="pt-2 flex flex-col gap-2 border-t border-white/5">
            <Link href="/login" onClick={() => setOpen(false)}
              className="text-center text-sm py-2.5 rounded-xl border border-border-subtle text-accent-muted">
              Login
            </Link>
            <Link href="/register" onClick={() => setOpen(false)}
              className="text-center text-sm py-2.5 rounded-xl bg-btn text-btn-text font-semibold">
              Get Started
            </Link>
          </div>
        </div>
      )}
    </nav>
  )
}
