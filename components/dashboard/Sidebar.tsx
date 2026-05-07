"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { LogOut, Menu, X, UserCircle, ChevronLeft, ChevronRight } from "lucide-react"
import { useState, useTransition } from "react"
import { signOut } from "next-auth/react"
import { saveActivePathAction } from "@/actions/nav"
import { VentureLensLogo } from "@/components/ui/VentureLensLogo"

export interface NavLink {
  label: string
  href: string
  icon: React.ReactNode
  /** If true, only match this href exactly (not as a prefix). Default: false */
  exact?: boolean
}

interface SidebarProps {
  role: "admin" | "founder" | "employee"
  userName: string
  links: NavLink[]
  isCollapsed?: boolean
  onToggle?: () => void
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

export function Sidebar({ role, userName, links, isCollapsed = false, onToggle }: SidebarProps) {
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)
  const [, startTransition] = useTransition()

  const activeHref = resolveActive(links, pathname)
  const homeHref = role === "admin" ? "/admin/dashboard" : `/dashboard/${role}`
  const profileHref = role === "admin" ? "/admin/dashboard/profile" : `/dashboard/${role}/profile`

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

      {/* Desktop collapse toggle — fixed, always visible, slides with sidebar */}
      {onToggle && (
        <button
          onClick={onToggle}
          style={{ left: isCollapsed ? "66px" : "242px" }}
          className="hidden lg:flex fixed top-[41px] -translate-y-1/2 w-7 h-7 rounded-full bg-btn text-btn-text items-center justify-center shadow-[0_8px_24px_rgba(255,176,0,0.35)] hover:scale-110 transition-all duration-300 z-[60]"
        >
          {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      )}

      {/* Sidebar */}
      <aside className={`
        fixed inset-y-0 left-0 z-50 bg-ink/82 backdrop-blur-2xl border-r border-white/10
        flex flex-col transform transition-all duration-300 lg:translate-x-0
        ${isCollapsed ? "lg:w-20 w-64" : "w-64"}
        ${isOpen ? "translate-x-0" : "-translate-x-full"}
      `}>
        {/* Logo */}
        <div className={`p-6 flex items-center ${isCollapsed ? "justify-center" : "justify-between"}`}>
          <Link
            href={homeHref}
            onClick={() => handleNavClick(homeHref)}
            className="flex items-center gap-3"
          >
            <VentureLensLogo size={34} showText={!isCollapsed} />
          </Link>

          <button onClick={() => setIsOpen(false)} className="lg:hidden text-accent-muted">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Role badge */}
        {!isCollapsed && (
          <div className="px-6 mb-6">
            <span className={`text-[10px] uppercase font-bold px-2 py-1 rounded-md border tracking-wider ${roleColors[role]}`}>
              {role}
            </span>
          </div>
        )}

        {/* Nav links */}
        <nav className={`flex-1 px-4 space-y-1 overflow-y-auto ${isCollapsed ? "flex flex-col items-center" : ""}`}>
          {links.map((link) => {
            const isActive = activeHref === link.href

            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => handleNavClick(link.href)}
                className={`
                  flex items-center gap-3 py-3 rounded-xl text-sm font-medium
                  transition-all duration-150 group relative
                  ${isCollapsed ? "px-3 justify-center" : "px-4"}
                  ${isActive
                    ? "bg-btn/15 text-white border border-btn/25 shadow-[0_12px_28px_rgba(255,176,0,0.12)]"
                    : "text-accent-muted hover:bg-white/[0.075] hover:text-white border border-transparent"
                  }
                `}
                title={isCollapsed ? link.label : ""}
              >
                {/* Active indicator bar */}
                {isActive && (
                  <span className={`absolute left-0 top-1/2 -translate-y-1/2 bg-btn rounded-r-full ${isCollapsed ? "w-1 h-6" : "w-0.5 h-5"}`} />
                )}

                {/* Icon wrapper */}
                <span className={`shrink-0 transition-transform duration-150 ${isActive ? "text-btn" : "group-hover:scale-110"}`}>
                  {link.icon}
                </span>

                {!isCollapsed && link.label}
              </Link>
            )
          })}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-white/5">
          <div className={`flex flex-col ${isCollapsed ? "items-center gap-4" : "px-4 py-3 rounded-2xl bg-white/[0.04] border border-white/10"}`}>
            <Link
              href={profileHref}
              onClick={() => handleNavClick(profileHref)}
              className={`flex items-center gap-2 text-xs text-accent-muted hover:text-accent-yellow transition-colors truncate ${isCollapsed ? "justify-center" : "mb-3"}`}
              title={isCollapsed ? userName : ""}
            >
              <UserCircle className="w-4 h-4 shrink-0" />
              {!isCollapsed && <span className="truncate">{userName}</span>}
            </Link>
            <button
              onClick={() => signOut({ callbackUrl: "/login" })}
              className={`flex items-center gap-2 text-sm text-error/70 hover:text-error transition-colors ${isCollapsed ? "justify-center" : "w-full"}`}
              title={isCollapsed ? "Sign out" : ""}
            >
              <LogOut className="w-4 h-4" />
              {!isCollapsed && "Sign out"}
            </button>
          </div>
        </div>
      </aside>
    </>
  )
}
