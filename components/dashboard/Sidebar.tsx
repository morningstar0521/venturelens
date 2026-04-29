"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Zap, LogOut, Menu, X } from "lucide-react"
import { useState } from "react"
import { signOut } from "next-auth/react"

interface SidebarProps {
  role: "admin" | "founder" | "employee"
  email: string
  links: {
    label: string
    href: string
    icon: React.ReactNode
  }[]
}

export function Sidebar({ role, email, links }: SidebarProps) {
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)

  const roleColors = {
    admin: "text-error border-error/20 bg-error/10",
    founder: "text-btn border-btn/20 bg-btn/10",
    employee: "text-success border-success/20 bg-success/10",
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
        <div className="p-6 flex items-center justify-between">
          <Link href={`/${role === 'admin' ? 'admin/dashboard' : 'dashboard/' + role}`} className="flex items-center gap-3">
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

        <div className="px-6 mb-6">
          <span className={`text-[10px] uppercase font-bold px-2 py-1 rounded-md border tracking-wider ${roleColors[role]}`}>
            {role}
          </span>
        </div>

        <nav className="flex-1 px-4 space-y-1 overflow-y-auto">
          {links.map((link) => {
            const isActive = pathname === link.href || pathname.startsWith(link.href + '/')
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className={`
                  flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors
                  ${isActive 
                    ? "bg-white/10 text-accent-yellow" 
                    : "text-accent-muted hover:bg-white/5 hover:text-white"
                  }
                `}
              >
                {link.icon}
                {link.label}
              </Link>
            )
          })}
        </nav>

        <div className="p-4 border-t border-white/5">
          <div className="px-4 py-3">
            <p className="text-xs text-accent-muted truncate mb-3">{email}</p>
            <button 
              onClick={() => signOut({ callbackUrl: "/login" })}
              className="flex items-center gap-2 text-sm text-error/80 hover:text-error transition-colors w-full"
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
