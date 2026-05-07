import Link from "next/link"
import { ArrowRight, Quote } from "lucide-react"

const stories = [
  ["Priya Sharma", "Founder, GreenLoop", "We changed our launch city and pricing after the report. That saved us a month of confused MVP work."],
  ["Arjun Mehta", "Co-founder, DeliverFast", "The risk radar was blunt in the right way. It showed us what investors would question first."],
  ["Sarah Chen", "Founder, MindBridge AI", "The contributor matching gave us a shortlist of builders who actually fit the idea."],
]

export function Testimonials() {
  return (
    <section id="testimonials" className="px-6 py-24">
      <div className="mx-auto max-w-7xl">
        <div className="mb-10 text-center">
          <p className="text-sm font-black uppercase tracking-[0.24em] text-btn">Founder signal</p>
          <h2 className="mt-3 text-4xl font-black text-white lg:text-5xl">Make the next step obvious.</h2>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          {stories.map(([name, role, quote]) => (
            <div key={name} className="premium-card rounded-3xl p-6">
              <Quote className="h-8 w-8 text-btn" />
              <p className="mt-5 text-sm leading-7 text-accent-muted">&ldquo;{quote}&rdquo;</p>
              <div className="mt-8 border-t border-white/10 pt-5">
                <p className="font-black text-white">{name}</p>
                <p className="mt-1 text-xs text-accent-muted">{role}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 overflow-hidden rounded-[2rem] border border-btn/25 bg-btn text-btn-text shadow-[0_24px_70px_rgba(255,176,0,0.22)]">
          <div className="bharat-band h-1.5" />
          <div className="flex flex-col justify-between gap-5 p-7 sm:flex-row sm:items-center lg:p-9">
            <div>
              <p className="text-3xl font-black">Ready to validate an idea?</p>
              <p className="mt-2 text-sm font-medium text-btn-text/75">Create a founder account and generate your first Venture Score.</p>
            </div>
            <Link
              href="/register"
              className="inline-flex items-center justify-center gap-2 rounded-2xl bg-btn-text px-6 py-3.5 text-sm font-black text-btn transition hover:bg-black"
            >
              Get Started
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
