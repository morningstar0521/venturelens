import { Brain, FileSearch, Lightbulb, UsersRound } from "lucide-react"

const steps = [
  {
    icon: Lightbulb,
    title: "Founder submits idea",
    text: "Problem, audience, city, stage, pricing, competitors, and required skills.",
  },
  {
    icon: Brain,
    title: "AI scores the opportunity",
    text: "The engine checks feasibility, Indian-market timing, competition, risks, and business clarity.",
  },
  {
    icon: FileSearch,
    title: "Report becomes actionable",
    text: "The founder gets a score, risk radar, next experiments, and a sharper validation path.",
  },
  {
    icon: UsersRound,
    title: "Team matching starts",
    text: "Contributors can discover approved ideas and apply where their skills fit.",
  },
]

export function HowItWorks() {
  return (
    <section id="how-it-works" className="px-6 py-24">
      <div className="mx-auto max-w-7xl">
        <div className="mb-12 grid gap-8 lg:grid-cols-[0.85fr_1.15fr] lg:items-end">
          <div>
            <div className="bharat-band mb-5 h-1.5 w-28 rounded-full" />
            <p className="text-sm font-black uppercase tracking-[0.24em] text-btn">Operating flow</p>
            <h2 className="mt-3 text-4xl font-black leading-tight text-white lg:text-5xl">
              From pitch line to practical startup decision.
            </h2>
          </div>
          <p className="max-w-2xl text-base leading-8 text-accent-muted lg:ml-auto">
            The UI now behaves like a founder workspace, not a brochure. Every section reinforces the
            same product promise: submit, score, understand, and build.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {steps.map((step, index) => (
            <div key={step.title} className="group premium-card relative overflow-hidden rounded-3xl p-6">
              <div className="absolute right-4 top-4 text-6xl font-black text-white/[0.035]">0{index + 1}</div>
              <div className="mb-10 flex h-13 w-13 items-center justify-center rounded-2xl border border-btn/25 bg-btn/12 text-btn transition group-hover:bg-btn group-hover:text-btn-text">
                <step.icon className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-black text-white">{step.title}</h3>
              <p className="mt-3 text-sm leading-7 text-accent-muted">{step.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
