import { Sparkles, BarChart3, Users, Shield, Zap, Target } from "lucide-react"

const features = [
  {
    icon: Sparkles,
    title: "AI-Powered Analysis",
    description:
      "Our large language models evaluate your idea across market size, competition landscape, technical feasibility, and risk vectors — returning structured insights in under 30 seconds.",
    tags: ["GPT-4o", "Market Research", "Competitive Intel"],
  },
  {
    icon: BarChart3,
    title: "Venture Score™",
    description:
      "A single 0–100 viability score backed by 4 sub-dimensions. Compare your score to 500+ ideas in our database and benchmark against industry verticals.",
    tags: ["0–100 Score", "4 Dimensions", "Benchmarking"],
  },
  {
    icon: Users,
    title: "Contributor Matching",
    description:
      "Automatically matched to skilled contributors — co-founders, engineers, designers, and marketers — based on your idea's tech stack, domain, and funding stage.",
    tags: ["Skills Match", "Role Fit", "Direct Connect"],
  },
  {
    icon: Shield,
    title: "Risk Assessment",
    description:
      "Identify regulatory, market timing, and execution risks before they become problems. Get mitigation suggestions tailored to your idea's vertical.",
    tags: ["Risk Matrix", "Mitigation Tips", "Legal Alerts"],
  },
  {
    icon: Zap,
    title: "Instant Feedback",
    description:
      "No waiting. Submit your idea and receive a full report in real time. Iterate on your concept with each analysis to watch your score improve.",
    tags: ["Real-time", "Iterative", "History Tracking"],
  },
  {
    icon: Target,
    title: "Market Fit Score",
    description:
      "Go beyond viability — understand how well your idea resonates with your target demographic, using signals from public data and startup trend databases.",
    tags: ["PMF Analysis", "Demographics", "Trend Data"],
  },
]

// ─── Features Section ──────────────────────────────────────────────────────
export function Features() {
  return (
    <section id="features" className="py-24 px-6 relative">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[2px] bg-gradient-to-r from-transparent via-btn/30 to-transparent" />
      </div>

      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16 space-y-4">
          <p className="text-btn text-sm font-semibold uppercase tracking-widest">Platform Features</p>
          <h2 className="text-4xl lg:text-5xl font-extrabold text-accent-yellow">
            Everything You Need to<br className="hidden sm:block" /> Launch with Confidence
          </h2>
          <p className="text-accent-muted max-w-xl mx-auto text-lg">
            From raw idea to validated venture — all in one platform.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((f) => (
            <div key={f.title}
              className="glass-panel group rounded-3xl p-7 space-y-5 border border-white/5 hover:border-btn/20 transition-all duration-300 hover:shadow-[0_0_40px_rgba(248,198,34,0.07)] hover:-translate-y-1">
              {/* Icon */}
              <div className="w-12 h-12 rounded-2xl bg-btn/10 border border-btn/10 flex items-center justify-center group-hover:bg-btn/20 transition-colors duration-300">
                <f.icon className="w-5 h-5 text-btn" />
              </div>

              <div className="space-y-2">
                <h3 className="font-bold text-accent-yellow text-lg">{f.title}</h3>
                <p className="text-accent-muted text-sm leading-relaxed">{f.description}</p>
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-2">
                {f.tags.map((tag) => (
                  <span key={tag} className="text-xs bg-white/5 border border-white/8 rounded-full px-3 py-1 text-accent-muted">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
