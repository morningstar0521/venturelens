import { requireFounderSession } from "@/lib/auth/guards"
import { getIdeaById } from "@/lib/db/ideas"
import { getRolesByIdea } from "@/lib/db/roles"
import { TeamBuilder } from "@/components/dashboard/TeamBuilder"
import { StatusBadge } from "@/components/dashboard/StatusBadge"
import { notFound } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, Zap, Users, Briefcase } from "lucide-react"

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const idea = await getIdeaById(id)
  return { title: idea ? `Build Team — ${idea.title}` : "Team Builder" }
}

export default async function TeamModulePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const session = await requireFounderSession()

  const idea = await getIdeaById(id)
  if (!idea || idea.founder_id !== session.user.id) notFound()

  const existingRoles = await getRolesByIdea(id).catch(() => [])
  const isUnlocked = (idea.venture_score ?? 0) >= 70

  return (
    <div className="space-y-8">
      <div className="flex items-start gap-4">
        <Link
          href="/dashboard/founder/team"
          className="mt-1 w-9 h-9 rounded-xl border border-white/10 flex items-center justify-center hover:bg-white/5 transition-colors shrink-0"
        >
          <ArrowLeft className="w-4 h-4 text-white/60" />
        </Link>
        <div className="flex-1">
          <div className="flex items-center gap-3 flex-wrap mb-1">
            <StatusBadge status={idea.status} />
            {idea.venture_score !== null && (
              <span className={`inline-flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full border ${
                isUnlocked
                  ? "bg-success/10 text-success border-success/20"
                  : "bg-white/5 text-white/40 border-white/10"
              }`}>
                <Zap className="w-3 h-3" />
                {idea.venture_score} / 100
              </span>
            )}
          </div>
          <h1 className="text-2xl font-bold text-accent-yellow">{idea.title}</h1>
          <p className="text-sm text-white/40 mt-0.5">Team Building Module</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="glass-panel rounded-2xl p-5 border border-white/5">
          <div className="flex items-center gap-3 mb-2">
            <Zap className="w-4 h-4 text-accent-yellow" />
            <span className="text-xs font-semibold text-white/50 uppercase tracking-wider">Venture Score</span>
          </div>
          <div className={`text-3xl font-black ${isUnlocked ? "text-success" : "text-white/40"}`}>
            {idea.venture_score ?? "-"}
          </div>
          <p className="text-xs text-white/30 mt-1">{isUnlocked ? "Team building unlocked" : "Needs score 70+ to unlock"}</p>
        </div>
        <div className="glass-panel rounded-2xl p-5 border border-white/5">
          <div className="flex items-center gap-3 mb-2">
            <Briefcase className="w-4 h-4 text-btn" />
            <span className="text-xs font-semibold text-white/50 uppercase tracking-wider">Roles Posted</span>
          </div>
          <div className="text-3xl font-black text-white">{existingRoles.length}</div>
          <p className="text-xs text-white/30 mt-1">Open positions for contributors</p>
        </div>
        <div className="glass-panel rounded-2xl p-5 border border-white/5">
          <div className="flex items-center gap-3 mb-2">
            <Users className="w-4 h-4 text-purple-400" />
            <span className="text-xs font-semibold text-white/50 uppercase tracking-wider">Total Openings</span>
          </div>
          <div className="text-3xl font-black text-white">
            {existingRoles.reduce((acc, r) => acc + r.openings, 0) || "-"}
          </div>
          <p className="text-xs text-white/30 mt-1">Seats available across all roles</p>
        </div>
      </div>

      <div className="glass-panel rounded-3xl p-8 border border-white/5">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-btn/10 border border-btn/20 flex items-center justify-center">
            <Users className="w-5 h-5 text-btn" />
          </div>
          <div>
            <h2 className="font-bold text-accent-yellow">AI-Assisted Team Builder</h2>
            <p className="text-xs text-white/40">Generate AI suggestions, edit roles, and post to the contributor marketplace</p>
          </div>
        </div>

        <TeamBuilder
          ideaId={id}
          ventureScore={idea.venture_score ?? 0}
          aiSuggestions={idea.ai_report?.suggestions}
          existingRoles={existingRoles}
        />
      </div>

      {isUnlocked && existingRoles.length > 0 && (
        <div className="glass-panel rounded-2xl p-6 border border-success/10 bg-success/5 flex items-center justify-between gap-4">
          <div>
            <h3 className="font-bold text-success">Roles are live!</h3>
            <p className="text-xs text-success/60 mt-0.5">Contributors can now see and apply to your roles. Review applicants below.</p>
          </div>
          <Link
            href="/dashboard/founder/applicants"
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-success/10 border border-success/20 text-success text-sm font-semibold hover:bg-success/20 transition-colors shrink-0"
          >
            <Users className="w-4 h-4" /> View Applicants
          </Link>
        </div>
      )}
    </div>
  )
}
