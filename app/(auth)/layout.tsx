import { ReactNode } from "react"
import { Navbar } from "@/components/landing/Navbar"
import { BadgeIndianRupee, MapPin, Sparkles } from "lucide-react"

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="relative flex min-h-screen flex-col overflow-hidden bg-background text-white selection:bg-btn/30">
      <div className="hero-glow absolute inset-0 pointer-events-none" />
      <div className="landing-grid absolute inset-0 opacity-70 pointer-events-none" />

      <Navbar />

      <div className="relative z-10 pt-24">
        <div className="mx-auto max-w-7xl px-4">
          <div className="glass-panel rounded-2xl px-4 py-3">
            <div className="flex flex-wrap items-center justify-center gap-4 text-xs font-semibold text-accent-muted sm:gap-8">
              <span className="flex items-center gap-2">
                <Sparkles className="h-3.5 w-3.5 text-btn" />
                AI validation for Indian startups
              </span>
              <span className="hidden h-4 w-px bg-white/10 sm:block" />
              <span className="hidden items-center gap-2 sm:flex">
                <MapPin className="h-3.5 w-3.5 text-cyan" />
                City and market-fit signals
              </span>
              <span className="hidden h-4 w-px bg-white/10 sm:block" />
              <span className="hidden items-center gap-2 sm:flex">
                <BadgeIndianRupee className="h-3.5 w-3.5 text-success" />
                Pricing experiments before MVP
              </span>
            </div>
          </div>
        </div>
      </div>

      <main className="relative z-10 flex flex-1 items-center justify-center px-4 py-12">
        <div className="w-full max-w-3xl">{children}</div>
      </main>
    </div>
  )
}
