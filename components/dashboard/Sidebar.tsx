"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Zap, LogOut, Menu, X } from "lucide-react"
import { useState, useTransition } from "react"
import { signOut } from "next-auth/react"
import { saveActivePathAction } from "@/actions/nav"

interface NavLink {
  label: string
  href: string
  icon: React.ReactNode
  /** If true, only match this href exactly (not as a prefix). Default: false */
  exact?: boolean
}

interface SidebarProps {
  role: "admin" | "founder" | "employee"
  email: string
  links: NavLink[]
}

/**
 * Determine if a nav link should be highlighted.
 *
 * Rules (in priority order):
 * 1. Exact match always wins.
 * 2. If `exact` flag is set on the link, only highlight on exact match.
 * 3. Otherwise highlight when the pathname starts with href + '/'
 *    BUT only if no *longer* link also matches (most-specific wins).
 */
function resolveActive(links: NavLink[], pathname: string): string | null {
  // Find all links whose href matches the current path
  const matches = links.filter((link) => {
    if (pathname === link.href) return true                         // exact
    if (link.exact) return false                                   // strict exact only
    return pathname.startsWith(link.href + "/")                    // prefix
  })

  if (matches.length === 0) return null

  // Among matches, pick the most specific (longest href) to avoid
  // parent routes stealing the highlight from children.
  matches.sort((a, b) => b.href.length - a.href.length)
  return matches[0].href
}

export function Sidebar({ role, email, links }: SidebarProps) {
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)
  const [, startTransition] = useTransition()

  const activeHref = resolveActive(links, pathname)

  const roleColors = {
    admin:    "text-error border-error/20 bg-error/10",
    founder:  "text-btn border-btn/20 bg-btn/10",
    employee: "text-success border-success/20 bg-success/10",
  }

  function handleNavClick(href: string) {
    setIsOpen(false)
    // Persist to DB (non-blocking)
    startTransition(() => {
      saveActivePathAction(href)
    })
  }

  return (
    <>
      {/* Mobile toggle */}
      <button
        onClick={() => setIsOpen(true)}
        className="lg:hidden fixed top-4 left-4 z-50 w-10 h-10 rounded-xl bg-card border border-white/5 flex items-center justify-center"
      >
        <Menu className="w-5 h-5" />
      </button>

      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed inset-y-0 left-0 z-50 w-64 glass-panel border-l-0 border-t-0 border-b-0
        flex flex-col transform transition-transform duration-300 lg:translate-x-0
        ${isOpen ? "translate-x-0" : "-translate-x-full"}
      `}>
        {/* Logo */}
        <div className="p-6 flex items-center justify-between">
          <Link
            href={role === "admin" ? "/admin/dashboard" : `/dashboard/${role}`}
            onClick={() => handleNavClick(role === "admin" ? "/admin/dashboard" : `/dashboard/${role}`)}
            className="flex items-center gap-3"
          >
            <div className="w-8 h-8 rounded-xl bg-btn flex items-center justify-center shrink-0">
              <Zap className="w-4 h-4 text-btn-text fill-btn-text" />
            </div>
            <span className="font-bold text-lg">
              <span className="text-btn">Venture</span><span className="text-accent-yellow">Lens</span>
            </span>
          </Link>
          <button onClick={() => setIsOpen(false)} className="lg:hidden text-accent-muted">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Role badge */}
        <div className="px-6 mb-6">
          <span className={`text-[10px] uppercase font-bold px-2 py-1 rounded-md border tracking-wider ${roleColors[role]}`}>
            {role}
          </span>
        </div>

        {/* Nav links */}
        <nav className="flex-1 px-4 space-y-1 overflow-y-auto">
          {links.map((link) => {
            const isActive = activeHref === link.href

            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => handleNavClick(link.href)}
                className={`
                  flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium
                  transition-all duration-150 group relative
                  ${isActive
                    ? "bg-btn/15 text-accent-yellow border border-btn/20 shadow-sm"
                    : "text-accent-muted hover:bg-white/5 hover:text-white border border-transparent"
                  }
                `}
              >
                {/* Active indicator bar */}
                {isActive && (
                  <span className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 bg-btn rounded-r-full" />
                )}

                {/* Icon wrapper */}
                <span className={`shrink-0 transition-transform duration-150 ${isActive ? "text-btn" : "group-hover:scale-110"}`}>
                  {link.icon}
                </span>

                {link.label}
              </Link>
            )
          })}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-white/5">
          <div className="px-4 py-3">
            <p className="text-xs text-accent-muted truncate mb-3">{email}</p>
            <button
              onClick={() => signOut({ callbackUrl: "/login" })}
              className="flex items-center gap-2 text-sm text-error/70 hover:text-error transition-colors w-full"
            >
              <LogOut className="w-4 h-4" />
              Sign out
            </button>
          </div>
        </div>
      </aside>
    </>
  )
}
