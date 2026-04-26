// ─── Login Role Selector ───────────────────────────────────────────────────
// NOTE: Logo + Navbar is handled by (auth)/layout.tsx — no duplicate logo here.
import Link from "next/link"
import { Rocket, Briefcase, ShieldCheck, ArrowRight } from "lucide-react"

export const metadata = { title: "Login — VentureLens" }

const roles = [
  {
    href: "/login/founder",
    icon: Rocket,
    title: "Founder",
    description: "Submit and track your startup ideas, view AI analysis and Venture Scores.",
    accent: "hover:border-btn/40 hover:shadow-[0_0_32px_rgba(248,198,34,0.12)]",
    badge: "bg-btn/10 text-btn border-btn/20",
  },
  {
    href: "/login/employee",
    icon: Briefcase,
    title: "Contributor",
    description: "Browse validated startup ideas and apply to roles that match your skill set.",
    accent: "hover:border-success/40 hover:shadow-[0_0_32px_rgba(107,203,119,0.12)]",
    badge: "bg-success/10 text-success border-success/20",
  },
  {
    href: "/login/admin",
    icon: ShieldCheck,
    title: "Admin",
    description: "Manage platform users, moderate ideas, and oversee the contributor ecosystem.",
    accent: "hover:border-error/40 hover:shadow-[0_0_32px_rgba(255,107,107,0.1)]",
    badge: "bg-error/10 text-error border-error/20",
  },
]

export default function LoginRolePage() {
  return (
    <div className="flex flex-col items-center w-full">
      {/* Heading */}
      <div className="text-center mb-8 space-y-2 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-accent-yellow">Welcome back</h1>
        <p className="text-accent-muted">Choose your role to continue</p>
      </div>

      {/* Role cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 w-full animate-in fade-in slide-in-from-bottom-6 duration-500 [animation-delay:100ms]">
        {roles.map((r) => (
          <Link key={r.href} href={r.href}
            className={`group rounded-3xl p-7 flex flex-col gap-4 border-2 border-border-subtle
              bg-card/75 backdrop-blur-2xl
              shadow-[0_8px_40px_rgba(0,0,0,0.45)]
              transition-all duration-300 hover:-translate-y-1 ${r.accent}`}>
            <div className={`w-12 h-12 rounded-2xl border flex items-center justify-center ${r.badge}`}>
              <r.icon className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-bold text-accent-yellow text-lg mb-1">{r.title}</h2>
              <p className="text-accent-muted text-sm leading-relaxed">{r.description}</p>
            </div>
            <div className="flex items-center gap-1.5 text-xs font-semibold text-accent-muted group-hover:text-accent-yellow transition-colors mt-auto">
              Sign in <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>
        ))}
      </div>

      <p className="text-sm text-accent-muted mt-8">
        New here?{" "}
        <Link href="/register" className="text-btn hover:underline font-semibold">Create an account</Link>
      </p>
    </div>
  )
}
