import { auth } from "@/auth"
import { getIdeasByFounder } from "@/lib/db/ideas"
import { getApplicationsForIdea } from "@/lib/db/applications"
import { getUserById } from "@/lib/db/users"
import { StatusBadge } from "@/components/dashboard/StatusBadge"
import { TeamCard } from "@/components/dashboard/TeamCard"
import { updateApplicationStatusAction } from "@/actions/applications"
import { DbApplication, AssignedRole } from "@/lib/db/applications"
import { DbUser } from "@/lib/db/users"

import { Lock, Users, Zap } from "lucide-react"

export const metadata = { title: "Applicants & Team — VentureLens" }

interface EnrichedApp extends DbApplication {
  user: DbUser | null
  ideaTitle: string
  ideaScore: number | null
}

export default async function FounderApplicantsPage() {
  const session = await auth()
  const ideas = await getIdeasByFounder(session!.user.id)

  // Collect all apps with enriched user + idea data
  const allApps: EnrichedApp[] = []
  for (const idea of ideas) {
    const apps = await getApplicationsForIdea(idea.id)
    for (const app of apps) {
      const user = await getUserById(app.employee_id)
      allApps.push({ ...app, user, ideaTitle: idea.title, ideaScore: idea.venture_score })
    }
  }
  allApps.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())

  const pendingApps   = allApps.filter((a) => a.status === "pending")
  const acceptedApps  = allApps.filter((a) => a.status === "accepted")
  const rejectedApps  = allApps.filter((a) => a.status === "rejected")

  // Score-locked ideas (< 70)
  const lockedIdeas   = ideas.filter((i) => i.venture_score !== null && i.venture_score < 70)
  const unlockedIdeas = ideas.filter((i) => i.venture_score !== null && i.venture_score >= 70)

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-accent-yellow">Applicants &amp; Team</h1>
        <p className="text-sm text-accent-muted mt-1">
          Manage contributors applying to your ideas. Ideas with Venture Score ≥ 70 unlock hiring.
        </p>
      </div>

      {/* Unlock summary */}
      {ideas.some((i) => i.venture_score !== null) && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="glass-panel rounded-2xl p-5 border border-success/10">
            <div className="flex items-center gap-3 mb-2">
              <Zap className="w-5 h-5 text-success" />
              <span className="font-bold text-success">Unlocked Ideas</span>
            </div>
            <div className="text-3xl font-black text-white">{unlockedIdeas.length}</div>
            <p className="text-xs text-white/40 mt-1">Ideas with score ≥ 70 — open for contributors</p>
          </div>
          <div className="glass-panel rounded-2xl p-5 border border-white/5">
            <div className="flex items-center gap-3 mb-2">
              <Lock className="w-5 h-5 text-white/40" />
              <span className="font-bold text-white/50">Locked Ideas</span>
            </div>
            <div className="text-3xl font-black text-white">{lockedIdeas.length}</div>
            <p className="text-xs text-white/40 mt-1">Improve these ideas to unlock contributors</p>
          </div>
        </div>
      )}

      {/* Pending applications */}
      <div>
        <h2 className="text-lg font-bold text-accent-yellow mb-4 flex items-center gap-2">
          <Users className="w-5 h-5" />
          Pending Applications
          {pendingApps.length > 0 && (
            <span className="ml-1 px-2 py-0.5 rounded-full bg-btn/10 border border-btn/20 text-btn text-xs font-bold">
              {pendingApps.length}
            </span>
          )}
        </h2>

        {pendingApps.length === 0 ? (
          <div className="glass-panel rounded-2xl p-8 text-center border border-white/5 text-white/40">
            No pending applications yet.
          </div>
        ) : (
          <div className="space-y-4">
            {pendingApps.map((app) => {
              const isLocked = (app.ideaScore ?? 0) < 70

              async function accept() {
                "use server"
                await updateApplicationStatusAction(app.id, "accepted")
              }
              async function reject() {
                "use server"
                await updateApplicationStatusAction(app.id, "rejected")
              }

              return (
                <div
                  key={app.id}
                  className={`glass-panel rounded-2xl p-5 border transition-all ${isLocked ? "border-white/5 opacity-60" : "border-white/10"}`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                    {/* Applicant info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 flex-wrap mb-1">
                        <span className="font-bold text-white">{app.user?.name ?? "Unknown"}</span>
                        <StatusBadge status={app.status} />
                        {isLocked && (
                          <span className="flex items-center gap-1 text-xs text-white/30">
                            <Lock className="w-3 h-3" /> Score too low to accept
                          </span>
                        )}
                      </div>
                      <div className="text-xs text-white/40 mb-1">{app.user?.email}</div>
                      <div className="text-xs text-accent-muted">
                        Idea: <span className="text-accent-yellow">{app.ideaTitle}</span>
                        {app.ideaScore !== null && (
                          <span className="ml-2 text-white/30">Score: <strong className="text-btn">{app.ideaScore}</strong></span>
                        )}
                      </div>
                      {app.user?.skills && (
                        <div className="flex flex-wrap gap-1.5 mt-2">
                          {app.user.skills.slice(0, 5).map((s) => (
                            <span key={s} className="text-xs px-2 py-0.5 rounded-md bg-white/5 border border-white/5 text-white/50">{s}</span>
                          ))}
                        </div>
                      )}
                      {app.message && (
                        <p className="text-sm text-white/50 mt-2 line-clamp-2 italic">&quot;{app.message}&quot;</p>
                      )}
                    </div>

                    {/* Actions */}
                    {!isLocked && (
                      <div className="flex gap-2 shrink-0">
                        <form action={accept}>
                          <button
                            type="submit"
                            className="px-4 py-2 rounded-xl text-sm font-bold border text-success border-success/20 bg-success/5 hover:bg-success/15 transition-colors"
                          >
                            Accept
                          </button>
                        </form>
                        <form action={reject}>
                          <button
                            type="submit"
                            className="px-4 py-2 rounded-xl text-sm font-bold border text-error border-error/20 bg-error/5 hover:bg-error/15 transition-colors"
                          >
                            Reject
                          </button>
                        </form>
                      </div>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* Team members (accepted) */}
      {acceptedApps.length > 0 && (
        <div>
          <h2 className="text-lg font-bold text-success mb-4 flex items-center gap-2">
            Your Team
            <span className="ml-1 px-2 py-0.5 rounded-full bg-success/10 border border-success/20 text-success text-xs font-bold">
              {acceptedApps.length}
            </span>
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {acceptedApps.map((app) => (
              <TeamCard
                key={app.id}
                applicationId={app.id}
                name={app.user?.name ?? "Unknown"}
                email={app.user?.email ?? ""}
                skills={app.user?.skills ?? null}
                experience={app.user?.experience ?? null}
                assignedRole={app.assigned_role as AssignedRole | null}
                ideaTitle={app.ideaTitle}
              />
            ))}
          </div>
        </div>
      )}

      {/* Rejected */}
      {rejectedApps.length > 0 && (
        <div>
          <h2 className="text-base font-semibold text-white/40 mb-3">Rejected ({rejectedApps.length})</h2>
          <div className="space-y-2">
            {rejectedApps.map((app) => (
              <div key={app.id} className="flex items-center gap-3 px-4 py-3 glass-panel rounded-xl border border-white/5 opacity-50">
                <span className="text-sm text-white/60">{app.user?.name ?? "Unknown"}</span>
                <span className="text-xs text-white/30">→ {app.ideaTitle}</span>
                <StatusBadge status={app.status} />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
