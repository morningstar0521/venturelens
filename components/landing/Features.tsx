import { Activity, BarChart3, Handshake, ShieldAlert, Sparkles, Trophy } from "lucide-react"

const features = [
  ["AI Venture Report", "Structured analysis with a score, summary, risks, and recommended experiments.", Sparkles, "text-btn"],
  ["India Market Lens", "Signals shaped around pricing, adoption, launch city, and early customer behavior.", Trophy, "text-cyan"],
  ["Risk Radar", "Execution, competition, compliance, and demand risks become visible before build starts.", ShieldAlert, "text-error"],
  ["Founder Dashboard", "Track submitted ideas, scores, applications, and team formation in one place.", BarChart3, "text-success"],
  ["Contributor Marketplace", "Skilled builders can browse approved ideas and apply to meaningful roles.", Handshake, "text-btn"],
  ["Admin Control", "Moderate users, review ideas, and keep the ecosystem high quality.", Activity, "text-cyan"],
] as const

export function Features() {
  return (
    <section id="features" className="px-6 py-24">
      <div className="mx-auto max-w-7xl overflow-hidden rounded-[2rem] border border-white/12 bg-white/[0.045] backdrop-blur-2xl">
        <div className="bharat-band h-1.5" />
        <div className="grid gap-10 p-6 sm:p-8 lg:grid-cols-[0.78fr_1.22fr] lg:p-10">
          <div>
            <p className="text-sm font-black uppercase tracking-[0.24em] text-btn">Frontend direction</p>
            <h2 className="mt-3 text-4xl font-black leading-tight text-white lg:text-5xl">
              Bold, Indian, professional, and built around the product.
            </h2>
            <p className="mt-5 text-base leading-8 text-accent-muted">
              The new visual system uses saffron for action, Ashoka blue for intelligence, emerald for
              growth, and deep navy for a premium command-center feel.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {features.map(([title, description, Icon, color]) => (
              <div key={title} className="rounded-3xl border border-white/10 bg-ink/35 p-5 transition hover:-translate-y-1 hover:border-btn/30 hover:bg-card/70">
                <div className={`mb-5 flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.07] ${color}`}>
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className="text-lg font-black text-white">{title}</h3>
                <p className="mt-2 text-sm leading-7 text-accent-muted">{description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
