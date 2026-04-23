import { ReactNode } from "react"
import { cn } from "@/lib/utils"

interface AuthCardProps {
  children: ReactNode
  title: string
  subtitle?: string
  className?: string
}

export function AuthCard({ children, title, subtitle, className }: AuthCardProps) {
  return (
    <div className="w-full max-w-md w-full animate-in fade-in zoom-in-95 duration-500">
      <div className={cn("glass-panel rounded-3xl p-8 sm:p-10", className)}>
        <div className="flex flex-col items-center text-center mb-8 space-y-2">
          <div className="w-12 h-12 rounded-full bg-btn mb-2 flex items-center justify-center shadow-[0_0_20px_rgba(248,198,98,0.4)]">
            <svg
              className="w-6 h-6 text-btn-text"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
              />
            </svg>
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-accent-yellow">
            {title}
          </h1>
          {subtitle && (
            <p className="text-accent-muted text-sm">{subtitle}</p>
          )}
        </div>
        {children}
      </div>
    </div>
  )
}
