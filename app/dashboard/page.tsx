import { auth, signOut } from "@/auth"
import { redirect } from "next/navigation"
import { Rocket, Briefcase, Zap, LogOut, BarChart3, Users } from "lucide-react"

export const metadata = { title: "Dashboard — VentureLens" }

export default async function DashboardPage() {
  const session = await auth()
  if (!session?.user) redirect("/login")

  const isFounder  = session.user.role === "founder"

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Top nav */}
      <header className="border-b border-white/5 bg-bg-secondary/50 backdrop-blur-xl sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-btn flex items-center justify-center">
              <Zap className="w-4 h-4 text-btn-text fill-btn-text" />
            </div>
            <span className="font-bold text-lg">
              <span className="text-btn">Venture</span><span className="text-accent-yellow">Lens</span>
            </span>
          </div>
          <div className="flex items-center gap-4">
            <span className={`text-xs font-semibold px-3 py-1 rounded-full border ${
              isFounder
                ? "bg-btn/10 text-btn border-btn/20"
                : "bg-success/10 text-success border-success/20"
            }`}>
              {isFounder ? "Founder" : "Contributor"}
            </span>
            <form action={async () => { "use server"; await signOut({ redirectTo: "/login" }) }}>
              <button type="submit"
                className="flex items-center gap-1.5 text-sm text-accent-muted hover:text-error transition-colors">
                <LogOut className="w-4 h-4" /> Sign out
              </button>
            </form>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-6 py-10 space-y-8 animate-in fade-in duration-500">
        {/* Welcome */}
        <div className="glass-panel rounded-3xl p-8 border border-btn/10">
          <div className="flex items-center gap-4">
            <div className={`w-14 h-14 rounded-2xl border flex items-center justify-center ${
              isFounder ? "bg-btn/10 border-btn/20" : "bg-success/10 border-success/20"
            }`}>
              {isFounder ? <Rocket className="w-6 h-6 text-btn" /> : <Briefcase className="w-6 h-6 text-success" />}
            </div>
            <div>
              <h1 className="text-2xl font-bold text-accent-yellow">
                Welcome back, {session.user.name?.split(" ")[0] ?? "User"}!
              </h1>
              <p className="text-accent-muted text-sm mt-0.5">
                {isFounder
                  ? "Your AI-powered idea dashboard is ready."
                  : "Browse curated startup ideas that match your skills."}
              </p>
            </div>
          </div>
        </div>

        {/* Quick actions */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {isFounder ? (
            <>
              <QuickCard icon={<Zap className="w-5 h-5 text-btn" />}
                title="Submit New Idea" description="Validate a new startup concept with AI"
                cta="Get Started →" color="btn" />
              <QuickCard icon={<BarChart3 className="w-5 h-5 text-success" />}
                title="View Venture Scores" description="Review AI analysis for your submitted ideas"
                cta="View Scores →" color="success" />
              <QuickCard icon={<Users className="w-5 h-5 text-accent-yellow" />}
                title="Browse Contributors" description="Find matched contributors for your ideas"
                cta="Find Team →" color="accent-yellow" />
            </>
          ) : (
            <>
              <QuickCard icon={<Zap className="w-5 h-5 text-btn" />}
                title="Browse Ideas" description="Explore validated startup ideas looking for contributors"
                cta="Explore →" color="btn" />
              <QuickCard icon={<Users className="w-5 h-5 text-success" />}
                title="My Applications" description="Track ideas you've applied to"
                cta="View →" color="success" />
              <QuickCard icon={<BarChart3 className="w-5 h-5 text-accent-yellow" />}
                title="Update Profile" description="Add skills and experience to get better matches"
                cta="Update →" color="accent-yellow" />
            </>
          )}
        </div>

        {/* Session debug (dev only) */}
        <div className="glass-panel p-6 rounded-3xl border border-white/5">
          <h3 className="text-xs font-semibold text-accent-yellow uppercase tracking-widest mb-3">
            Session Info
          </h3>
          <pre className="text-xs text-accent-muted bg-black/30 p-4 rounded-2xl overflow-x-auto">
            {JSON.stringify(session.user, null, 2)}
          </pre>
        </div>
      </div>
    </div>
  )
}

function QuickCard({ icon, title, description, cta, color }: {
  icon: React.ReactNode; title: string; description: string; cta: string; color: string
}) {
  return (
    <div className="glass-panel rounded-3xl p-6 border border-white/5 hover:border-white/10 hover:-translate-y-1 transition-all duration-300 cursor-pointer space-y-4">
      <div className={`w-10 h-10 rounded-xl bg-${color}/10 border border-${color}/20 flex items-center justify-center`}>
        {icon}
      </div>
      <div>
        <h3 className="font-bold text-accent-yellow">{title}</h3>
        <p className="text-accent-muted text-sm mt-1 leading-relaxed">{description}</p>
      </div>
      <span className="text-xs font-semibold text-accent-muted">{cta}</span>
    </div>
  )
}
