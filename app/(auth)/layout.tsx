import { ReactNode } from "react"
import { Navbar } from "@/components/landing/Navbar"
import { Sparkles } from "lucide-react"

// ─── Auth Layout ──────────────────────────────────────────────────────────
// Shared by all login / register pages.
export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-background text-white flex flex-col relative overflow-hidden selection:bg-btn/30">
      {/* Ambient gradient orbs */}
      <div className="absolute top-[-5%] left-[-8%] w-[45%] h-[45%] rounded-full bg-btn/10 blur-[130px] pointer-events-none" />
      <div className="absolute bottom-[-8%] right-[-8%] w-[40%] h-[40%] rounded-full bg-success/8 blur-[110px] pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60%] h-[50%] rounded-full bg-card/30 blur-[90px] pointer-events-none" />

      {/* Subtle grid overlay */}
      <div className="absolute inset-0 opacity-[0.025] pointer-events-none"
        style={{ backgroundImage: "linear-gradient(#F8C622 1px,transparent 1px),linear-gradient(90deg,#F8C622 1px,transparent 1px)", backgroundSize: "60px 60px" }} />

      {/* Sticky Navbar */}
      <Navbar />

      {/* ── Trust / tagline strip just below navbar ── */}
      {/* Sits right under the 64px navbar, provides visual context so there's no dead space */}
      <div className="relative z-10 pt-16">
        <div className="border-b border-white/5 bg-white/[0.02] backdrop-blur-sm">
          <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-center gap-8 flex-wrap">
            <div className="flex items-center gap-2 text-xs text-accent-muted">
              <Sparkles className="w-3.5 h-3.5 text-btn flex-shrink-0" />
              <span>AI-powered startup validation</span>
            </div>
            <div className="hidden sm:block w-px h-4 bg-border-subtle" />
            <div className="hidden sm:flex items-center gap-1.5 text-xs text-accent-muted">
              <span className="w-1.5 h-1.5 rounded-full bg-success inline-block animate-pulse" />
              <span>500+ ideas validated</span>
            </div>
            <div className="hidden sm:block w-px h-4 bg-border-subtle" />
            <div className="hidden sm:flex items-center gap-1.5 text-xs text-accent-muted">
              <span className="w-1.5 h-1.5 rounded-full bg-btn inline-block" />
              <span>Free to get started</span>
            </div>
          </div>
        </div>
      </div>

      {/* Centred page content */}
      <div className="relative z-10 flex-1 flex items-center justify-center px-4 py-10">
        <div className="w-full max-w-3xl">
          {children}
        </div>
      </div>
    </div>
  )
}
