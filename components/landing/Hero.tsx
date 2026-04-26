import Link from "next/link"
import { ArrowRight, Sparkles, TrendingUp } from "lucide-react"

// ─── Hero Section ──────────────────────────────────────────────────────────
export function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16">
      {/* Ambient gradient orbs */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] rounded-full bg-btn/10 blur-[120px] animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] rounded-full bg-accent-yellow/5 blur-[100px] animate-pulse [animation-delay:1.5s]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-card/40 blur-[80px]" />
      </div>

      {/* Subtle grid overlay */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{ backgroundImage: "linear-gradient(#F8C622 1px,transparent 1px),linear-gradient(90deg,#F8C622 1px,transparent 1px)", backgroundSize: "60px 60px" }} />

      <div className="relative max-w-7xl mx-auto px-6 py-24 grid lg:grid-cols-2 gap-16 items-center">
        {/* Left: Copy */}
        <div className="text-center lg:text-left space-y-8">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-btn/10 border border-btn/20 rounded-full px-4 py-1.5 text-sm text-btn font-medium">
            <Sparkles className="w-3.5 h-3.5" />
            AI-Powered Startup Validation
          </div>

          <h1 className="text-5xl lg:text-6xl xl:text-7xl font-extrabold leading-[1.08] tracking-tight">
            Validate Your<br />
            <span className="text-btn">Startup Idea</span><br />
            <span className="text-accent-yellow">with AI</span>
          </h1>

          <p className="text-lg text-accent-muted max-w-lg leading-relaxed">
            Get a data-driven <strong className="text-accent-yellow">Venture Score</strong>, competitive analysis,
            and connect with the right contributors — before you write a single line of code.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
            <Link href="/register"
              className="group inline-flex items-center justify-center gap-2 bg-btn hover:bg-btn-hover text-btn-text font-bold px-8 py-4 rounded-2xl shadow-[0_0_24px_rgba(248,198,34,0.35)] hover:shadow-[0_0_36px_rgba(248,198,34,0.5)] transition-all duration-300 text-base">
              Get Started Free
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
            <a href="#how-it-works"
              className="inline-flex items-center justify-center gap-2 border border-border-subtle text-accent-muted hover:text-accent-yellow hover:border-btn/40 font-semibold px-8 py-4 rounded-2xl transition-all duration-300 text-base">
              See How It Works
            </a>
          </div>

          {/* Social proof strip */}
          <div className="flex items-center gap-6 justify-center lg:justify-start pt-2">
            <div className="text-center">
              <div className="text-2xl font-bold text-accent-yellow">500+</div>
              <div className="text-xs text-accent-muted">Ideas Validated</div>
            </div>
            <div className="w-px h-8 bg-border-subtle" />
            <div className="text-center">
              <div className="text-2xl font-bold text-accent-yellow">1,200+</div>
              <div className="text-xs text-accent-muted">Contributors</div>
            </div>
            <div className="w-px h-8 bg-border-subtle" />
            <div className="text-center">
              <div className="text-2xl font-bold text-accent-yellow">92%</div>
              <div className="text-xs text-accent-muted">Accuracy Rate</div>
            </div>
          </div>
        </div>

        {/* Right: Mock Venture Score Card */}
        <div className="relative flex justify-center lg:justify-end">
          <div className="glass-panel rounded-3xl p-8 w-full max-w-sm space-y-6 border border-btn/10">
            {/* Header */}
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-accent-muted font-medium uppercase tracking-widest">AI Analysis</p>
                <h3 className="font-bold text-accent-yellow text-lg mt-0.5">EcoCart App</h3>
              </div>
              <div className="w-10 h-10 rounded-2xl bg-btn/15 flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-btn" />
              </div>
            </div>

            {/* Score gauge */}
            <div className="text-center py-2">
              <div className="relative inline-flex items-center justify-center w-32 h-32">
                <svg className="absolute" width="128" height="128" viewBox="0 0 128 128">
                  <circle cx="64" cy="64" r="56" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="10" />
                  <circle cx="64" cy="64" r="56" fill="none" stroke="#F8C622" strokeWidth="10"
                    strokeDasharray={`${2 * Math.PI * 56 * 0.84} ${2 * Math.PI * 56}`}
                    strokeDashoffset={2 * Math.PI * 56 * 0.25}
                    strokeLinecap="round" transform="rotate(-90 64 64)"
                    style={{ filter: "drop-shadow(0 0 8px rgba(248,198,34,0.6))" }} />
                </svg>
                <div className="text-center z-10">
                  <div className="text-4xl font-black text-btn">84</div>
                  <div className="text-xs text-accent-muted">/ 100</div>
                </div>
              </div>
              <p className="text-sm font-semibold text-success mt-1">High Viability ↑</p>
            </div>

            {/* Metrics */}
            {[
              { label: "Market Size",   val: 92, color: "bg-success" },
              { label: "Competition",   val: 68, color: "bg-btn"     },
              { label: "Feasibility",   val: 81, color: "bg-success" },
              { label: "Risk Level",    val: 45, color: "bg-error"   },
            ].map((m) => (
              <div key={m.label} className="space-y-1.5">
                <div className="flex justify-between text-xs">
                  <span className="text-accent-muted">{m.label}</span>
                  <span className="font-semibold text-white">{m.val}%</span>
                </div>
                <div className="h-1.5 rounded-full bg-white/5 overflow-hidden">
                  <div className={`h-full rounded-full ${m.color} transition-all`} style={{ width: `${m.val}%` }} />
                </div>
              </div>
            ))}

            {/* Footer badge */}
            <div className="bg-btn/10 border border-btn/20 rounded-2xl px-4 py-2.5 flex items-center gap-2">
              <Sparkles className="w-3.5 h-3.5 text-btn flex-shrink-0" />
              <span className="text-xs text-accent-muted">
                <strong className="text-btn">3 contributors</strong> matched for this idea
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
