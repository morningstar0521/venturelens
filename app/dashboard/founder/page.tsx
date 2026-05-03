import { auth } from "@/auth"
import { StatsCard } from "@/components/dashboard/StatsCard"
import { StatusBadge } from "@/components/dashboard/StatusBadge"
import { Lightbulb, Users, BarChart3, PlusCircle, Cpu, Zap, Clock } from "lucide-react"
import { getIdeasByFounder } from "@/lib/db/ideas"
import Link from "next/link"

export const metadata = { title: "Dashboard — Founder | VentureLens" }

export default async function FounderDashboardPage() {
  const session = await auth()
  const ideas = await getIdeasByFounder(session!.user.id)

  const totalIdeas    = ideas.length
  const evaluatedIdeas = ideas.filter((i) => i.ai_report !== null).length
  const approvedCount  = ideas.filter((i) => i.status === "approved").length
  const evaluatingCount = ideas.filter((i) => i.status === "evaluating").length

  const scoredIdeas = ideas.filter((i) => i.venture_score !== null)
  const avgScore = scoredIdeas.length > 0
    ? Math.round(scoredIdeas.reduce((acc, curr) => acc + curr.venture_score!, 0) / scoredIdeas.length)
    : null

  const recentIdeas = ideas.slice(0, 5)

  return (
    <div className="space-y-8">
      {/* Welcome header */}
      <div className="glass-panel rounded-3xl p-8 border border-btn/10 relative overflow-hidden">
        <div className="absolute -top-10 -right-10 w-40 h-40 bg-btn/5 rounded-full blur-3xl pointer-events-none" />
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-btn/10 border border-btn/20 flex items-center justify-center">
            <Lightbulb className="w-7 h-7 text-btn" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-accent-yellow">
              Welcome back, {session!.user.name?.split(" ")[0]}! 👋
            </h1>
            <p className="text-accent-muted text-sm mt-0.5">
              {totalIdeas === 0
                ? "Submit your first idea to get an AI-powered Venture Score."
                : `You have ${totalIdeas} idea${totalIdeas !== 1 ? "s" : ""} — ${evaluatedIdeas} evaluated by AI.`}
            </p>
          </div>
        </div>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard icon={Lightbulb}  label="Total Ideas"     value={totalIdeas}               color="btn" />
        <StatsCard icon={Cpu}        label="AI Evaluated"    value={evaluatedIdeas}            color="accent-yellow" />
        <StatsCard icon={Zap}        label="Approved"        value={approvedCount}             color="success" />
        <StatsCard
          icon={BarChart3}
          label="Avg Score"
          value={avgScore !== null ? `${avgScore}/100` : "—"}
          color="btn"
        />
      </div>

      {/* CTA + Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Quick actions */}
        <div className="space-y-3">
          <h2 className="text-sm font-semibold text-white/40 uppercase tracking-wider px-1">Quick Actions</h2>

          <Link
            href="/dashboard/founder/ideas/new"
            className="glass-panel rounded-2xl p-5 border border-btn/10 hover:border-btn/25 hover:-translate-y-0.5 transition-all duration-200 group flex items-center gap-4"
          >
            <div className="w-10 h-10 rounded-xl bg-btn/10 border border-btn/20 flex items-center justify-center group-hover:scale-110 transition-transform">
              <PlusCircle className="w-5 h-5 text-btn" />
            </div>
            <div>
              <div className="font-bold text-white text-sm">Submit New Idea</div>
              <div className="text-xs text-white/40">Get your AI Venture Score</div>
            </div>
          </Link>

          <Link
            href="/dashboard/founder/ideas"
            className="glass-panel rounded-2xl p-5 border border-white/5 hover:border-white/10 hover:-translate-y-0.5 transition-all duration-200 group flex items-center gap-4"
          >
            <div className="w-10 h-10 rounded-xl bg-accent-yellow/10 border border-accent-yellow/20 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Lightbulb className="w-5 h-5 text-accent-yellow" />
            </div>
            <div>
              <div className="font-bold text-white text-sm">My Ideas</div>
              <div className="text-xs text-white/40">View scores &amp; reports</div>
            </div>
          </Link>

          <Link
            href="/dashboard/founder/applicants"
            className="glass-panel rounded-2xl p-5 border border-white/5 hover:border-white/10 hover:-translate-y-0.5 transition-all duration-200 group flex items-center gap-4"
          >
            <div className="w-10 h-10 rounded-xl bg-success/10 border border-success/20 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Users className="w-5 h-5 text-success" />
            </div>
            <div>
              <div className="font-bold text-white text-sm">Team &amp; Applicants</div>
              <div className="text-xs text-white/40">Review contributors</div>
            </div>
          </Link>
        </div>

        {/* Recent activity */}
        <div className="lg:col-span-2">
          <h2 className="text-sm font-semibold text-white/40 uppercase tracking-wider px-1 mb-3">Recent Activity</h2>

          {recentIdeas.length === 0 ? (
            <div className="glass-panel rounded-2xl p-8 border border-white/5 text-center">
              <p className="text-white/40 text-sm">No ideas yet.</p>
              <Link
                href="/dashboard/founder/ideas/new"
                className="inline-block mt-3 text-btn text-sm hover:text-btn/80 transition-colors"
              >
                Submit your first idea →
              </Link>
            </div>
          ) : (
            <div className="space-y-2">
              {recentIdeas.map((idea) => (
                <Link
                  key={idea.id}
                  href={`/dashboard/founder/ideas/${idea.id}`}
                  className="glass-panel rounded-xl p-4 border border-white/5 hover:border-white/10 hover:bg-white/3 transition-all duration-200 flex items-center gap-4 group"
                >
                  {/* Status dot */}
                  <div className="shrink-0">
                    <StatusBadge status={idea.status} />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-white text-sm truncate group-hover:text-accent-yellow transition-colors">
                      {idea.title}
                    </div>
                    <div className="flex items-center gap-3 mt-0.5">
                      {idea.industry && (
                        <span className="text-xs text-white/30">{idea.industry}</span>
                      )}
                      <span className="text-xs text-white/20 flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {new Date(idea.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                      </span>
                    </div>
                  </div>

                  {idea.venture_score !== null ? (
                    <div className="shrink-0 flex items-center gap-1 text-sm font-bold text-accent-yellow">
                      <Zap className="w-3.5 h-3.5" />
                      {idea.venture_score}
                    </div>
                  ) : (
                    <div className="shrink-0 text-xs text-white/20">
                      {idea.status === "evaluating" ? "Scoring…" : "No score"}
                    </div>
                  )}
                </Link>
              ))}
            </div>
          )}

          {/* AI evaluating indicator */}
          {evaluatingCount > 0 && (
            <div className="mt-3 flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-500/5 border border-blue-400/15 text-xs text-blue-300">
              <Cpu className="w-4 h-4 animate-pulse" />
              {evaluatingCount} idea{evaluatingCount > 1 ? "s are" : " is"} being evaluated by AI — refresh in 30–60s
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
