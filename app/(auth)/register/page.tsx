// ─── Register Role Selector ────────────────────────────────────────────────
// NOTE: Logo + Navbar is handled by (auth)/layout.tsx — no duplicate logo here.
import Link from "next/link"
import { Rocket, Briefcase, ArrowRight } from "lucide-react"

export const metadata = { title: "Register — VentureLens" }

const roles = [
  {
    href: "/register/founder",
    icon: Rocket,
    title: "Founder",
    description: "I have a startup idea I want to validate and build with a team.",
    color: "hover:border-btn/40 hover:shadow-[0_0_32px_rgba(248,198,34,0.12)]",
    badge: "bg-btn/10 text-btn border-btn/20",
    perks: ["Submit unlimited ideas", "AI Venture Score", "Contributor matching"],
  },
  {
    href: "/register/employee",
    icon: Briefcase,
    title: "Contributor",
    description: "I want to join exciting startups and apply my skills to validated ideas.",
    color: "hover:border-success/40 hover:shadow-[0_0_32px_rgba(107,203,119,0.12)]",
    badge: "bg-success/10 text-success border-success/20",
    perks: ["Browse curated ideas", "Filter by skills", "Direct apply to founders"],
  },
]

export default function RegisterRolePage() {
  return (
    <div className="flex flex-col items-center w-full">
      {/* Heading */}
      <div className="text-center mb-8 space-y-2 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-accent-yellow">Create your account</h1>
        <p className="text-accent-muted">How will you use VentureLens?</p>
      </div>

      {/* Role cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 w-full animate-in fade-in slide-in-from-bottom-6 duration-500 [animation-delay:100ms]">
        {roles.map((r) => (
          <Link key={r.href} href={r.href}
            className={`group rounded-3xl p-8 flex flex-col gap-5 border-2 border-border-subtle
              bg-card/75 backdrop-blur-2xl
              shadow-[0_8px_40px_rgba(0,0,0,0.45)]
              transition-all duration-300 hover:-translate-y-1 ${r.color}`}>
            <div className={`w-12 h-12 rounded-2xl border flex items-center justify-center ${r.badge}`}>
              <r.icon className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-bold text-accent-yellow text-xl mb-1.5">{r.title}</h2>
              <p className="text-accent-muted text-sm leading-relaxed mb-4">{r.description}</p>
              <ul className="space-y-1.5">
                {r.perks.map((p) => (
                  <li key={p} className="flex items-center gap-2 text-xs text-accent-muted">
                    <span className="w-1.5 h-1.5 rounded-full bg-btn flex-shrink-0" />
                    {p}
                  </li>
                ))}
              </ul>
            </div>
            <div className="flex items-center gap-1.5 text-xs font-semibold text-accent-muted group-hover:text-accent-yellow transition-colors mt-auto">
              Get started <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>
        ))}
      </div>

      <p className="text-sm text-accent-muted mt-8">
        Already have an account?{" "}
        <Link href="/login" className="text-btn hover:underline font-semibold">Sign in</Link>
      </p>
    </div>
  )
}
