import { requireFounderSession } from "@/lib/auth/guards"
import { getIdeasByFounder } from "@/lib/db/ideas"
import { getRolesByIdea } from "@/lib/db/roles"
import { DbRole } from "@/lib/db/roles"
import Link from "next/link"
import { Briefcase, Users, Zap, Lock, ArrowRight, Sparkles } from "lucide-react"

export const metadata = { title: "Team Builder — VentureLens" }

const CATEGORY_COLORS: Record<string, string> = {
  Tech:      "bg-blue-500/10 text-blue-300 border-blue-400/20",
  Marketing: "bg-orange-500/10 text-orange-300 border-orange-400/20",
  Product:   "bg-purple-500/10 text-purple-300 border-purple-400/20",
  Ops:       "bg-yellow-500/10 text-yellow-300 border-yellow-400/20",
  Design:    "bg-pink-500/10 text-pink-300 border-pink-400/20",
  Finance:   "bg-green-500/10 text-green-300 border-green-400/20",
  Sales:     "bg-cyan-500/10 text-cyan-300 border-cyan-400/20",
}

export default async function TeamBuilderOverviewPage() {
  const session = await requireFounderSession()
  const ideas = await getIdeasByFounder(session.user.id)

  const ideasWithRoles = await Promise.all(
    ideas
      .filter(i => i.ai_report !== null) // only evaluated ideas
      .map(async idea => ({
        ...idea,
        roles: await getRolesByIdea(idea.id).catch(() => [] as DbRole[]),
      }))
  )

  const unlocked = ideasWithRoles.filter(i => (i.venture_score ?? 0) >= 70)
  const locked   = ideasWithRoles.filter(i => (i.venture_score ?? 0) < 70)
  const totalRoles = unlocked.reduce((acc, i) => acc + i.roles.length, 0)

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="glass-panel rounded-3xl p-8 border border-btn/10 relative overflow-hidden">
        <div className="absolute -top-10 -right-10 w-40 h-40 bg-btn/5 rounded-full blur-3xl pointer-events-none" />
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-btn/10 border border-btn/20 flex items-center justify-center">
            <Briefcase className="w-7 h-7 text-btn" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-accent-yellow">Team Builder</h1>
            <p className="text-sm text-accent-muted mt-0.5">
              Post open roles and attract contributors for your high-scoring ideas
            </p>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="glass-panel rounded-2xl p-5 border border-success/10">
          <div className="flex items-center gap-2 mb-2"><Zap className="w-4 h-4 text-success" /><span className="text-xs font-semibold text-white/50 uppercase tracking-wider">Unlocked Ideas</span></div>
          <div className="text-3xl font-black text-white">{unlocked.length}</div>
          <p className="text-xs text-white/30 mt-1">Ready for team building</p>
        </div>
        <div className="glass-panel rounded-2xl p-5 border border-btn/10">
          <div className="flex items-center gap-2 mb-2"><Briefcase className="w-4 h-4 text-btn" /><span className="text-xs font-semibold text-white/50 uppercase tracking-wider">Roles Posted</span></div>
          <div className="text-3xl font-black text-white">{totalRoles}</div>
          <p className="text-xs text-white/30 mt-1">Open positions live</p>
        </div>
        <div className="glass-panel rounded-2xl p-5 border border-white/5">
          <div className="flex items-center gap-2 mb-2"><Lock className="w-4 h-4 text-white/40" /><span className="text-xs font-semibold text-white/50 uppercase tracking-wider">Locked Ideas</span></div>
          <div className="text-3xl font-black text-white">{locked.length}</div>
          <p className="text-xs text-white/30 mt-1">Need higher Venture Score</p>
        </div>
      </div>

      {/* Unlocked ideas */}
      {unlocked.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-sm font-bold text-white/50 uppercase tracking-widest">Unlocked — Ready to Build</h2>
          {unlocked.map(idea => (
            <div key={idea.id} className="glass-panel rounded-2xl border border-success/10 overflow-hidden">
              <div className="p-5 flex items-start gap-4 flex-wrap">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 flex-wrap mb-1">
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-success/10 border border-success/20 text-success text-xs font-bold">
                      <Zap className="w-3 h-3" /> {idea.venture_score}
                    </span>
                    {idea.roles.length > 0 && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-btn/10 border border-btn/20 text-btn text-[10px] font-bold">
                        <Briefcase className="w-2.5 h-2.5" /> {idea.roles.length} role{idea.roles.length !== 1 ? "s" : ""} posted
                      </span>
                    )}
                  </div>
                  <h3 className="font-bold text-accent-yellow text-base">{idea.title}</h3>
                  <p className="text-xs text-white/40 mt-0.5">{idea.industry} · {idea.stage}</p>

                  {/* Role previews */}
                  {idea.roles.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mt-3">
                      {idea.roles.map(r => (
                        <span key={r.id} className={`px-2 py-0.5 rounded-md border text-[10px] font-bold ${CATEGORY_COLORS[r.category] ?? "bg-white/5 text-white/40 border-white/10"}`}>
                          {r.role_title}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
                <Link
                  href={`/dashboard/founder/team/${idea.id}`}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-btn text-btn-foreground text-sm font-bold hover:bg-btn/90 transition-all shadow shadow-btn/20 shrink-0"
                >
                  {idea.roles.length > 0 ? "Manage Team" : (
                    <><Sparkles className="w-4 h-4" /> Build Team</>
                  )}
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Locked ideas */}
      {locked.length > 0 && (
        <div className="space-y-3">
          <h2 className="text-sm font-bold text-white/30 uppercase tracking-widest">Locked — Improve to Unlock</h2>
          {locked.map(idea => (
            <div key={idea.id} className="glass-panel rounded-2xl border border-white/5 p-5 opacity-60 flex items-center gap-4">
              <Lock className="w-5 h-5 text-white/30 shrink-0" />
              <div className="flex-1 min-w-0">
                <div className="font-semibold text-white/60 text-sm truncate">{idea.title}</div>
                <div className="text-xs text-white/30 mt-0.5">
                  Score: <strong className="text-white/50">{idea.venture_score ?? "—"}</strong>/100 · Needs ≥ 70
                </div>
              </div>
              <Link
                href={`/dashboard/founder/ideas/${idea.id}/edit`}
                className="text-xs text-btn hover:text-btn/80 transition-colors flex items-center gap-1 shrink-0"
              >
                Edit & Reassess <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          ))}
        </div>
      )}

      {ideasWithRoles.length === 0 && (
        <div className="glass-panel rounded-2xl p-12 text-center border border-white/5">
          <Users className="w-12 h-12 text-white/20 mx-auto mb-4" />
          <p className="text-white/40">Submit and evaluate ideas to unlock team building.</p>
          <Link href="/dashboard/founder/ideas/new" className="inline-block mt-4 text-btn hover:text-btn/80 text-sm transition-colors">
            Submit your first idea →
          </Link>
        </div>
      )}
    </div>
  )
}
