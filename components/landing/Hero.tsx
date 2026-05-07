import Link from "next/link"
import {
  ArrowRight,
  BadgeIndianRupee,
  MapPin,
  Radar,
  Sparkles,
  Target,
  TrendingUp,
  Users,
  Zap,
} from "lucide-react"

const metrics = [
  ["84", "Venture Score"],
  ["₹18Cr", "Market signal"],
  ["23", "Builder matches"],
]

const signals = [
  { label: "Bengaluru SaaS demand", value: 92, color: "bg-btn" },
  { label: "UPI payment fit", value: 88, color: "bg-success" },
  { label: "Competitive gap", value: 74, color: "bg-cyan" },
]

export function Hero() {
  return (
    <section className="relative isolate overflow-hidden px-6 pb-24 pt-32 sm:pt-36 lg:min-h-screen">
      <div className="landing-grid absolute inset-0 -z-20" />
      <div className="hero-glow absolute inset-0 -z-10" />

      <div className="mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-[0.9fr_1.1fr]">
        <div>
          <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-btn/30 bg-btn/10 px-3 py-1.5 text-sm font-semibold text-accent-yellow shadow-[0_12px_40px_rgba(255,176,0,0.14)] backdrop-blur-xl">
            <Sparkles className="h-4 w-4 text-btn" />
            Built for Indian founders, teams, and startup cells
          </div>

          <h1 className="max-w-3xl text-5xl font-black leading-[0.98] tracking-tight text-white sm:text-6xl lg:text-7xl">
            Turn your startup idea into a decision-ready venture report.
          </h1>
          <div className="bharat-band mt-7 h-1.5 w-56 rounded-full shadow-[0_0_30px_rgba(255,176,0,0.35)]" />

          <p className="mt-7 max-w-2xl text-lg leading-8 text-accent-muted">
            VentureLens scores Indian-market ideas with AI, highlights risk, estimates opportunity,
            and helps founders find the right contributors before money and months are wasted.
          </p>

          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/register"
              className="inline-flex items-center justify-center gap-2 rounded-2xl bg-btn px-7 py-4 text-sm font-black text-btn-text shadow-[0_22px_55px_rgba(255,176,0,0.30)] transition hover:-translate-y-0.5 hover:bg-btn-hover"
            >
              Validate My Idea
              <ArrowRight className="h-4 w-4" />
            </Link>
            <a
              href="#how-it-works"
              className="inline-flex items-center justify-center gap-2 rounded-2xl border border-white/15 bg-white/[0.07] px-7 py-4 text-sm font-bold text-white backdrop-blur-xl transition hover:-translate-y-0.5 hover:border-ashoka/50"
            >
              See How It Works
            </a>
          </div>

          <div className="mt-10 grid max-w-xl grid-cols-3 gap-3">
            {metrics.map(([value, label]) => (
              <div key={label} className="premium-card rounded-2xl p-4">
                <div className="text-2xl font-black text-white">{value}</div>
                <div className="mt-1 text-xs font-medium text-accent-muted">{label}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="relative">
          <div className="premium-card overflow-hidden rounded-[1.75rem] border-btn/25 bg-surface/95 shadow-[0_34px_100px_rgba(49,92,255,0.24)]">
            <div className="bharat-band h-1.5" />
            <div className="flex items-center justify-between border-b border-white/10 px-5 py-4">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.24em] text-btn">AI Venture Desk</p>
                <h2 className="mt-1 text-xl font-black text-white">EcoCart Bharat</h2>
              </div>
              <span className="rounded-full border border-btn/30 bg-btn/15 px-3 py-1 text-xs font-bold text-accent-yellow">
                Investor-ready
              </span>
            </div>

            <div className="grid gap-0 lg:grid-cols-[0.9fr_1.1fr]">
              <div className="border-b border-white/10 p-5 lg:border-b-0 lg:border-r lg:border-white/10">
                <div className="rounded-3xl border border-white/12 bg-ink/70 p-5">
                  <div className="flex items-center justify-between">
                    <div className="text-sm font-bold text-accent-muted">Venture Score</div>
                    <TrendingUp className="h-5 w-5 text-btn" />
                  </div>
                  <div className="mt-6 grid place-items-center">
                    <div className="relative grid h-48 w-48 place-items-center rounded-full border border-white/10 bg-white/[0.04]">
                      <div className="absolute inset-5 rounded-full border-[16px] border-white/10" />
                      <div className="absolute inset-5 rounded-full border-[16px] border-btn border-l-success border-t-ashoka shadow-[0_0_35px_rgba(255,176,0,0.20)]" />
                      <div className="text-center">
                        <div className="text-6xl font-black text-btn">84</div>
                        <div className="text-xs font-black uppercase tracking-[0.24em] text-accent-muted">Strong</div>
                      </div>
                    </div>
                  </div>
                  <p className="mt-5 text-center text-sm leading-6 text-accent-muted">
                    Strong urban demand with clear pricing tests needed before MVP spend.
                  </p>
                </div>
              </div>

              <div className="space-y-4 p-5">
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { icon: BadgeIndianRupee, label: "Revenue test", value: "₹499/mo" },
                    { icon: MapPin, label: "Best launch city", value: "Pune" },
                    { icon: Users, label: "Team fit", value: "4 roles" },
                    { icon: Radar, label: "Risk flags", value: "6" },
                  ].map((item) => (
                    <div key={item.label} className="rounded-2xl border border-white/10 bg-white/[0.055] p-4">
                      <item.icon className="h-4 w-4 text-cyan" />
                      <div className="mt-3 text-xl font-black text-white">{item.value}</div>
                      <div className="text-xs text-accent-muted">{item.label}</div>
                    </div>
                  ))}
                </div>

                <div className="rounded-2xl border border-white/10 bg-white/[0.055] p-4">
                  <div className="mb-4 flex items-center gap-2 text-sm font-black text-white">
                    <Target className="h-4 w-4 text-btn" />
                    India market signals
                  </div>
                  <div className="space-y-3">
                    {signals.map((signal) => (
                      <div key={signal.label}>
                        <div className="mb-1.5 flex justify-between text-xs">
                          <span className="text-accent-muted">{signal.label}</span>
                          <span className="font-bold text-white">{signal.value}%</span>
                        </div>
                        <div className="h-2 rounded-full bg-white/10">
                          <div className={`h-full rounded-full ${signal.color}`} style={{ width: `${signal.value}%` }} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="rounded-2xl border border-btn/25 bg-btn/10 p-4">
                  <div className="flex items-center gap-2 text-sm font-black text-accent-yellow">
                    <Zap className="h-4 w-4 text-btn" />
                    Next move
                  </div>
                  <p className="mt-2 text-sm leading-6 text-accent-muted">
                    Run a 50-customer WhatsApp survey and validate willingness to pay in Pune and Bengaluru.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
