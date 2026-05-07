import Link from "next/link"
import { ArrowRight, BriefcaseBusiness, Rocket, ShieldCheck } from "lucide-react"

export const metadata = { title: "Login - VentureLens" }

const roles = [
  {
    href: "/login/founder",
    icon: Rocket,
    title: "Founder",
    description: "Submit ideas, review Venture Scores, and build your first team.",
    accent: "hover:border-btn/50",
    badge: "bg-btn/12 text-btn border-btn/25",
  },
  {
    href: "/login/employee",
    icon: BriefcaseBusiness,
    title: "Contributor",
    description: "Browse approved startup ideas and apply where your skills fit.",
    accent: "hover:border-success/50",
    badge: "bg-success/12 text-success border-success/25",
  },
  {
    href: "/login/admin",
    icon: ShieldCheck,
    title: "Admin",
    description: "Review ideas, manage users, and keep the ecosystem trustworthy.",
    accent: "hover:border-ashoka/50",
    badge: "bg-ashoka/12 text-cyan border-ashoka/25",
  },
]

export default function LoginRolePage() {
  return (
    <div className="w-full">
      <div className="mb-8 text-center">
        <div className="bharat-band mx-auto mb-5 h-1.5 w-28 rounded-full" />
        <h1 className="text-4xl font-black text-white sm:text-5xl">Choose your workspace</h1>
        <p className="mt-3 text-accent-muted">Login based on how you build inside VentureLens.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        {roles.map((role) => (
          <Link
            key={role.href}
            href={role.href}
            className={`group premium-card rounded-3xl p-6 transition hover:-translate-y-1 ${role.accent}`}
          >
            <div className={`mb-8 flex h-13 w-13 items-center justify-center rounded-2xl border ${role.badge}`}>
              <role.icon className="h-6 w-6" />
            </div>
            <h2 className="text-xl font-black text-white">{role.title}</h2>
            <p className="mt-3 min-h-18 text-sm leading-7 text-accent-muted">{role.description}</p>
            <div className="mt-6 flex items-center gap-2 text-sm font-black text-btn">
              Sign in
              <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
            </div>
          </Link>
        ))}
      </div>

      <p className="mt-8 text-center text-sm text-accent-muted">
        New here?{" "}
        <Link href="/register" className="font-black text-btn hover:underline">
          Create an account
        </Link>
      </p>
    </div>
  )
}
