import { auth, signOut } from "@/auth"
import { redirect } from "next/navigation"
import { ShieldCheck, Users, Lightbulb, BarChart3, LogOut, Zap, AlertTriangle } from "lucide-react"

export const metadata = { title: "Admin Dashboard — VentureLens" }

export default async function AdminDashboardPage() {
  const session = await auth()

  if (!session?.user) redirect("/login/admin")
  if (session.user.role !== "admin") redirect("/dashboard")

  const stats = [
    { label: "Total Users",      value: "—",  icon: Users,      color: "btn"     },
    { label: "Ideas Submitted",  value: "—",  icon: Lightbulb,  color: "success" },
    { label: "Avg Venture Score", value: "—", icon: BarChart3,  color: "accent-yellow" },
    { label: "Open Reports",     value: "0",  icon: AlertTriangle, color: "error" },
  ]

  return (
    <div className="min-h-screen bg-bg-secondary/60">
      {/* Admin navbar — red-tinted */}
      <header className="border-b border-error/10 bg-bg-secondary/80 backdrop-blur-xl sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-btn flex items-center justify-center">
              <Zap className="w-4 h-4 text-btn-text fill-btn-text" />
            </div>
            <span className="font-bold text-lg">
              <span className="text-btn">Venture</span><span className="text-accent-yellow">Lens</span>
            </span>
            <span className="ml-2 text-xs font-bold bg-error/10 text-error border border-error/20 px-2.5 py-0.5 rounded-full">
              ADMIN
            </span>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-accent-muted hidden sm:block">{session.user.email}</span>
            <form action={async () => { "use server"; await signOut({ redirectTo: "/login/admin" }) }}>
              <button type="submit"
                className="flex items-center gap-1.5 text-sm text-accent-muted hover:text-error transition-colors">
                <LogOut className="w-4 h-4" /> Sign out
              </button>
            </form>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-10 space-y-8 animate-in fade-in duration-500">
        {/* Header */}
        <div className="glass-panel rounded-3xl p-8 border border-error/10">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-error/10 border border-error/20 flex items-center justify-center">
              <ShieldCheck className="w-7 h-7 text-error" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-accent-yellow">Admin Control Panel</h1>
              <p className="text-accent-muted text-sm mt-0.5">
                Signed in as <span className="text-error font-semibold">{session.user.name}</span>
              </p>
            </div>
          </div>
        </div>

        {/* Stats grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((s) => (
            <div key={s.label}
              className="glass-panel rounded-3xl p-6 border border-white/5 space-y-3">
              <div className={`w-10 h-10 rounded-xl bg-${s.color}/10 border border-${s.color}/20 flex items-center justify-center`}>
                <s.icon className={`w-5 h-5 text-${s.color}`} />
              </div>
              <div>
                <div className="text-2xl font-extrabold text-accent-yellow">{s.value}</div>
                <div className="text-xs text-accent-muted mt-0.5">{s.label}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Management sections */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            { title: "User Management",    desc: "View, suspend, or delete user accounts",      icon: Users,       color: "btn" },
            { title: "Idea Moderation",    desc: "Review and approve submitted startup ideas",   icon: Lightbulb,   color: "success" },
            { title: "Analytics",          desc: "Platform usage, score distribution, trends",   icon: BarChart3,   color: "accent-yellow" },
            { title: "Reports & Flags",    desc: "Review flagged content and reported users",    icon: AlertTriangle, color: "error" },
          ].map((item) => (
            <div key={item.title}
              className="glass-panel rounded-3xl p-6 border border-white/5 hover:border-white/10 hover:-translate-y-0.5 transition-all duration-300 cursor-pointer flex items-start gap-4">
              <div className={`w-10 h-10 rounded-xl bg-${item.color}/10 border border-${item.color}/20 flex items-center justify-center flex-shrink-0`}>
                <item.icon className={`w-5 h-5 text-${item.color}`} />
              </div>
              <div>
                <h3 className="font-bold text-accent-yellow">{item.title}</h3>
                <p className="text-accent-muted text-sm mt-1">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
