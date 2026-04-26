import { ReactNode } from "react"
import { cn } from "@/lib/utils"

interface AuthCardProps {
  children: ReactNode
  title: string
  subtitle?: string
  className?: string
  /** Optional icon element to replace the default lock icon */
  icon?: ReactNode
}

// ─── AuthCard ──────────────────────────────────────────────────────────────
// Thick, highly visible glassmorphism card used on all auth pages.
export function AuthCard({ children, title, subtitle, className, icon }: AuthCardProps) {
  return (
    <div className="w-full max-w-md mx-auto animate-in fade-in zoom-in-95 duration-500">
      <div className={cn(
        // Thick border, strong glass background, prominent shadow
        "rounded-3xl p-9 sm:p-11",
        "bg-card/80 backdrop-blur-2xl",
        "border-2 border-border-subtle",
        "shadow-[0_8px_64px_0_rgba(0,0,0,0.55),0_0_0_1px_rgba(248,198,34,0.07)]",
        "ring-1 ring-white/5",
        className
      )}>
        {/* Icon + heading */}
        <div className="flex flex-col items-center text-center mb-8 space-y-3">
          <div className="w-14 h-14 rounded-2xl bg-btn/15 border-2 border-btn/30 mb-1 flex items-center justify-center shadow-[0_0_24px_rgba(248,198,98,0.2)]">
            {icon ?? (
              <svg className="w-6 h-6 text-btn" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            )}
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-accent-yellow">{title}</h1>
          {subtitle && <p className="text-accent-muted text-sm">{subtitle}</p>}
        </div>
        {children}
      </div>
    </div>
  )
}
