import { Quote } from "lucide-react"

const testimonials = [
  {
    quote:
      "VentureLens gave us a Venture Score of 78 before we even built an MVP. That number alone convinced our first angel investor to write a cheque.",
    name: "Priya Sharma",
    title: "Founder, GreenLoop",
    initials: "PS",
    color: "from-btn/30 to-success/20",
  },
  {
    quote:
      "The AI competitive analysis surfaced three competitors I had no idea existed. Better to know before we spent ₹40 lakhs on development.",
    name: "Arjun Mehta",
    title: "Co-founder, DeliverFast",
    initials: "AM",
    color: "from-success/20 to-btn/20",
  },
  {
    quote:
      "Found my technical co-founder through the contributor matching within a week. The skill-fit algorithm is surprisingly accurate.",
    name: "Sarah Chen",
    title: "Founder, MindBridge AI",
    initials: "SC",
    color: "from-accent-yellow/20 to-btn/20",
  },
]

// ─── Testimonials Section ──────────────────────────────────────────────────
export function Testimonials() {
  return (
    <section id="testimonials" className="py-24 px-6 relative">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[2px] bg-gradient-to-r from-transparent via-btn/30 to-transparent" />
      </div>

      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16 space-y-4">
          <p className="text-btn text-sm font-semibold uppercase tracking-widest">Founder Stories</p>
          <h2 className="text-4xl lg:text-5xl font-extrabold text-accent-yellow">
            Trusted by Ambitious<br className="hidden sm:block" /> Founders
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((t) => (
            <div key={t.name}
              className="glass-panel rounded-3xl p-8 space-y-6 border border-white/5 hover:border-btn/20 hover:-translate-y-1 transition-all duration-300 hover:shadow-[0_0_40px_rgba(248,198,34,0.07)]">
              <Quote className="w-8 h-8 text-btn/40" />
              <p className="text-accent-muted leading-relaxed text-sm italic">&ldquo;{t.quote}&rdquo;</p>
              <div className="flex items-center gap-3 pt-2 border-t border-white/5">
                <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${t.color} border border-btn/20 flex items-center justify-center flex-shrink-0`}>
                  <span className="text-xs font-bold text-accent-yellow">{t.initials}</span>
                </div>
                <div>
                  <p className="font-semibold text-accent-yellow text-sm">{t.name}</p>
                  <p className="text-xs text-accent-muted">{t.title}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Trust strip */}
        <div className="mt-16 glass-panel rounded-3xl p-8 flex flex-col sm:flex-row items-center justify-between gap-6 border border-btn/10">
          <p className="text-accent-yellow font-bold text-xl text-center sm:text-left">
            Ready to validate your idea?
          </p>
          <a href="/register"
            className="inline-flex items-center gap-2 bg-btn hover:bg-btn-hover text-btn-text font-bold px-8 py-3.5 rounded-2xl shadow-[0_0_24px_rgba(248,198,34,0.3)] hover:shadow-[0_0_36px_rgba(248,198,34,0.5)] transition-all duration-300 whitespace-nowrap">
            Start Free Today →
          </a>
        </div>
      </div>
    </section>
  )
}
