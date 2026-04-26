import { Lightbulb, Brain, BarChart3, Users } from "lucide-react"

const steps = [
  {
    icon: Lightbulb,
    step: "01",
    title: "Submit Your Idea",
    description: "Describe your startup concept — product, target market, and what problem you're solving.",
  },
  {
    icon: Brain,
    step: "02",
    title: "AI Deep Analysis",
    description: "Our AI evaluates market size, competition landscape, technical feasibility, and key risks in seconds.",
  },
  {
    icon: BarChart3,
    step: "03",
    title: "Receive Venture Score",
    description: "Get a 0–100 viability score with a detailed breakdown across 4 dimensions.",
  },
  {
    icon: Users,
    step: "04",
    title: "Connect with Contributors",
    description: "Browse matched founders, developers, and designers who want to build your vision with you.",
  },
]

// ─── How It Works Section ──────────────────────────────────────────────────
export function HowItWorks() {
  return (
    <section id="how-it-works" className="py-24 px-6 relative overflow-hidden">
      {/* Ambient */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[2px] bg-gradient-to-r from-transparent via-btn/30 to-transparent" />
      </div>

      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16 space-y-4">
          <p className="text-btn text-sm font-semibold uppercase tracking-widest">Simple Process</p>
          <h2 className="text-4xl lg:text-5xl font-extrabold text-accent-yellow">How It Works</h2>
          <p className="text-accent-muted max-w-xl mx-auto text-lg">
            From idea to validated concept in four steps — all powered by AI.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((s, i) => (
            <div key={s.step} className="relative group">
              {/* Connector line */}
              {i < steps.length - 1 && (
                <div className="hidden lg:block absolute top-10 left-[calc(100%-0px)] w-full h-px bg-gradient-to-r from-btn/30 to-transparent z-0 translate-x-4" />
              )}

              <div className="glass-panel rounded-3xl p-6 h-full space-y-4 border border-white/5 hover:border-btn/20 transition-all duration-300 hover:shadow-[0_0_32px_rgba(248,198,34,0.08)] relative z-10">
                {/* Step badge + icon */}
                <div className="flex items-start gap-3">
                  <span className="text-xs font-black text-btn/50 tracking-widest mt-1">{s.step}</span>
                  <div className="w-12 h-12 rounded-2xl bg-btn/10 border border-btn/10 flex items-center justify-center group-hover:bg-btn/20 transition-colors">
                    <s.icon className="w-5 h-5 text-btn" />
                  </div>
                </div>
                <h3 className="font-bold text-accent-yellow text-lg">{s.title}</h3>
                <p className="text-accent-muted text-sm leading-relaxed">{s.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
