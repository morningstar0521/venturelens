import { requireFounderSession } from "@/lib/auth/guards"
import { getIdeasByFounder } from "@/lib/db/ideas"
import { getApplicationsForIdea } from "@/lib/db/applications"
import { getRolesByIdea } from "@/lib/db/roles"
import { getUserById } from "@/lib/db/users"
import { StatusBadge } from "@/components/dashboard/StatusBadge"
import {
  updateApplicationStatusAction,
  shortlistApplicationAction,
} from "@/actions/applications"
import { DbApplication } from "@/lib/db/applications"
import { DbUser } from "@/lib/db/users"
import { DbRole } from "@/lib/db/roles"
import {
  Briefcase,
  Calendar,
  ChevronDown,
  FileText,
  Lock,
  Mail,
  MessageSquare,
  Star,
  UserRound,
  Users,
  Zap,
} from "lucide-react"
import type { ReactNode } from "react"

export const metadata = { title: "Applicants & Team — VentureLens" }

interface EnrichedApp extends DbApplication {
  user: DbUser | null
  ideaTitle: string
  ideaScore: number | null
  roleName: string | null
}

export default async function FounderApplicantsPage({
  searchParams,
}: {
  searchParams: Promise<{ idea?: string }>
}) {
  const { idea: filterIdeaId } = await searchParams
  const session = await requireFounderSession()
  const ideas = await getIdeasByFounder(session.user.id)

  let filteredIdeas = ideas
  if (filterIdeaId) {
    filteredIdeas = ideas.filter(i => i.id === filterIdeaId)
  }

  // Collect all apps enriched with user + idea + role info
  const allApps: EnrichedApp[] = []
  const roleMap: Record<string, DbRole> = {}

  for (const idea of filteredIdeas) {
    const [apps, roles] = await Promise.all([
      getApplicationsForIdea(idea.id),
      getRolesByIdea(idea.id).catch(() => [] as DbRole[]),
    ])
    for (const r of roles) roleMap[r.id] = r
    for (const app of apps) {
      const user = await getUserById(app.employee_id)
      const roleName = app.role_requirement_id ? (roleMap[app.role_requirement_id]?.role_title ?? null) : null
      allApps.push({ ...app, user, ideaTitle: idea.title, ideaScore: idea.venture_score, roleName })
    }
  }
  allApps.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())

  const pendingApps    = allApps.filter(a => a.status === "pending")
  const shortlistedApps = allApps.filter(a => a.status === "shortlisted")
  const acceptedApps   = allApps.filter(a => a.status === "accepted")
  const rejectedApps   = allApps.filter(a => a.status === "rejected")

  const lockedIdeas   = ideas.filter(i => i.venture_score !== null && i.venture_score < 70)
  const unlockedIdeas = ideas.filter(i => i.venture_score !== null && i.venture_score >= 70)

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-accent-yellow">Applicants & Team</h1>
        <p className="text-sm text-accent-muted mt-1">
          Manage contributors applying to your ideas. Ideas with Venture Score ≥ 70 unlock hiring.
        </p>
      </div>

      {/* Unlock summary */}
      {ideas.some(i => i.venture_score !== null) && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="glass-panel rounded-2xl p-5 border border-success/10">
            <div className="flex items-center gap-2 mb-2"><Zap className="w-4 h-4 text-success" /><span className="font-bold text-success text-sm">Unlocked</span></div>
            <div className="text-3xl font-black text-white">{unlockedIdeas.length}</div>
            <p className="text-xs text-white/40 mt-1">Ideas open for contributors</p>
          </div>
          <div className="glass-panel rounded-2xl p-5 border border-white/5">
            <div className="flex items-center gap-2 mb-2"><Lock className="w-4 h-4 text-white/40" /><span className="font-bold text-white/50 text-sm">Locked</span></div>
            <div className="text-3xl font-black text-white">{lockedIdeas.length}</div>
            <p className="text-xs text-white/40 mt-1">Need higher score</p>
          </div>
          <div className="glass-panel rounded-2xl p-5 border border-violet-400/10">
            <div className="flex items-center gap-2 mb-2"><Star className="w-4 h-4 text-violet-400" /><span className="font-bold text-violet-300 text-sm">Shortlisted</span></div>
            <div className="text-3xl font-black text-white">{shortlistedApps.length}</div>
            <p className="text-xs text-white/40 mt-1">Candidates to interview</p>
          </div>
          <div className="glass-panel rounded-2xl p-5 border border-success/10">
            <div className="flex items-center gap-2 mb-2"><Users className="w-4 h-4 text-success" /><span className="font-bold text-success text-sm">Team</span></div>
            <div className="text-3xl font-black text-white">{acceptedApps.length}</div>
            <p className="text-xs text-white/40 mt-1">Accepted members</p>
          </div>
        </div>
      )}

      {/* Pending applications */}
      <Section
        title="Pending Applications"
        icon={<Users className="w-5 h-5" />}
        count={pendingApps.length}
        empty="No pending applications yet."
      >
        {pendingApps.map(app => {
          const isLocked = (app.ideaScore ?? 0) < 70

          async function accept() { "use server"; await updateApplicationStatusAction(app.id, "accepted") }
          async function reject() { "use server"; await updateApplicationStatusAction(app.id, "rejected") }
          async function shortlist() { "use server"; await shortlistApplicationAction(app.id) }

          return (
            <ApplicationCard
              key={app.id}
              app={app}
              isLocked={isLocked}
              actions={!isLocked ? (
                <div className="flex gap-2 shrink-0 flex-wrap">
                  <form action={shortlist}>
                    <button type="submit" className="px-3 py-2 rounded-xl text-sm font-bold border text-violet-300 border-violet-400/20 bg-violet-500/5 hover:bg-violet-500/15 transition-colors flex items-center gap-1.5">
                      <Star className="w-3.5 h-3.5" /> Shortlist
                    </button>
                  </form>
                  <form action={accept}>
                    <button type="submit" className="px-3 py-2 rounded-xl text-sm font-bold border text-success border-success/20 bg-success/5 hover:bg-success/15 transition-colors">
                      Accept
                    </button>
                  </form>
                  <form action={reject}>
                    <button type="submit" className="px-3 py-2 rounded-xl text-sm font-bold border text-error border-error/20 bg-error/5 hover:bg-error/15 transition-colors">
                      Reject
                    </button>
                  </form>
                </div>
              ) : null}
            />
          )
        })}
      </Section>

      {/* Shortlisted */}
      {shortlistedApps.length > 0 && (
        <Section title="Shortlisted" icon={<Star className="w-5 h-5 text-violet-400" />} count={shortlistedApps.length}>
          {shortlistedApps.map(app => {
            async function accept() { "use server"; await updateApplicationStatusAction(app.id, "accepted") }
            async function reject() { "use server"; await updateApplicationStatusAction(app.id, "rejected") }
            return (
              <ApplicationCard
                key={app.id}
                app={app}
                isLocked={false}
                actions={
                  <div className="flex gap-2 shrink-0">
                    <form action={accept}>
                      <button type="submit" className="px-3 py-2 rounded-xl text-sm font-bold border text-success border-success/20 bg-success/5 hover:bg-success/15 transition-colors">
                        Accept
                      </button>
                    </form>
                    <form action={reject}>
                      <button type="submit" className="px-3 py-2 rounded-xl text-sm font-bold border text-error border-error/20 bg-error/5 hover:bg-error/15 transition-colors">
                        Reject
                      </button>
                    </form>
                  </div>
                }
              />
            )
          })}
        </Section>
      )}

      {/* Rejected */}
      {rejectedApps.length > 0 && (
        <div>
          <h2 className="text-base font-semibold text-white/40 mb-3">Rejected ({rejectedApps.length})</h2>
          <div className="space-y-2">
            {rejectedApps.map(app => (
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

// ── Sub-components ────────────────────────────────────────────────────────────

function Section({
  title, icon, count, empty, children
}: {
  title: string; icon: ReactNode; count: number; empty?: string; children: ReactNode
}) {
  return (
    <div>
      <h2 className="text-lg font-bold text-accent-yellow mb-4 flex items-center gap-2">
        {icon}
        {title}
        {count > 0 && (
          <span className="ml-1 px-2 py-0.5 rounded-full bg-btn/10 border border-btn/20 text-btn text-xs font-bold">{count}</span>
        )}
      </h2>
      {count === 0 ? (
        <div className="glass-panel rounded-2xl p-8 text-center border border-white/5 text-white/40 text-sm">{empty}</div>
      ) : (
        <div className="space-y-4">{children}</div>
      )}
    </div>
  )
}

function ApplicationCard({
  app, isLocked, actions
}: {
  app: EnrichedApp; isLocked: boolean; actions: ReactNode | null
}) {
  const answers = app.questionnaire_answers ?? {}
  const answerEntries = Object.entries(answers).filter(([, answer]) => answer?.trim())
  const appliedOn = new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(app.created_at))

  return (
    <details className={`group glass-panel rounded-2xl border transition-all ${isLocked ? "border-white/5 opacity-60" : "border-white/10 hover:border-btn/20"}`}>
      <summary className="list-none cursor-pointer p-5">
        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-3 flex-wrap mb-1">
              <span className="font-bold text-white">{app.user?.name ?? "Unknown"}</span>
              <StatusBadge status={app.status} />
              {app.roleName && (
                <span className="flex items-center gap-1 px-2 py-0.5 rounded-md bg-btn/10 border border-btn/20 text-btn text-[10px] font-bold">
                  <Briefcase className="w-2.5 h-2.5" /> {app.roleName}
                </span>
              )}
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
                {app.user.skills.slice(0, 5).map(s => (
                  <span key={s} className="text-xs px-2 py-0.5 rounded-md bg-white/5 border border-white/5 text-white/50">{s}</span>
                ))}
              </div>
            )}
          </div>
          <div className="flex items-center gap-2 text-xs font-bold text-btn">
            View details
            <ChevronDown className="w-4 h-4 transition-transform group-open:rotate-180" />
          </div>
        </div>
      </summary>

      <div className="border-t border-white/10 px-5 pb-5 pt-4 space-y-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <DetailItem icon={<UserRound className="w-4 h-4" />} label="Applicant" value={app.user?.name ?? "Unknown"} />
          <DetailItem icon={<Mail className="w-4 h-4" />} label="Email" value={app.user?.email ?? "Not available"} />
          <DetailItem icon={<Calendar className="w-4 h-4" />} label="Applied on" value={appliedOn} />
          <DetailItem icon={<Briefcase className="w-4 h-4" />} label="Experience" value={app.user?.experience ?? "Not added"} />
        </div>

        {app.user?.skills && app.user.skills.length > 0 && (
          <div>
            <div className="text-xs font-black text-white/30 uppercase tracking-widest mb-2">Skills</div>
            <div className="flex flex-wrap gap-2">
              {app.user.skills.map(skill => (
                <span key={skill} className="text-xs px-2.5 py-1 rounded-md bg-white/5 border border-white/10 text-white/70">{skill}</span>
              ))}
            </div>
          </div>
        )}

        {app.resume_url ? (
          <a
            href={app.resume_url}
            download={`${app.user?.name ?? "applicant"}-resume`}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 rounded-xl border border-btn/20 bg-btn/10 px-4 py-2 text-sm font-bold text-btn hover:bg-btn/15 transition-colors"
          >
            <FileText className="w-4 h-4" />
            Open resume
          </a>
        ) : (
          <div className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-white/40">
            <FileText className="w-4 h-4" />
            No resume uploaded
          </div>
        )}

        {answerEntries.length > 0 && (
          <div>
            <div className="text-xs font-black text-white/30 uppercase tracking-widest mb-3">Questionnaire answers</div>
            <div className="space-y-3">
              {answerEntries.map(([question, answer]) => (
                <div key={question} className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
                  <div className="text-sm font-bold text-accent-yellow">{question}</div>
                  <p className="text-sm text-white/70 mt-2 leading-6 whitespace-pre-wrap">{answer}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {app.message && (
          <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
            <div className="flex items-center gap-2 text-xs font-black text-white/30 uppercase tracking-widest">
              <MessageSquare className="w-4 h-4" />
              Additional message
            </div>
            <p className="text-sm text-white/70 mt-2 leading-6 whitespace-pre-wrap">{app.message}</p>
          </div>
        )}

        {actions && (
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-t border-white/10 pt-4">
            <p className="text-xs text-white/40">Review the applicant details, then choose the next step.</p>
            {actions}
          </div>
        )}
      </div>
    </details>
  )
}

function DetailItem({
  icon,
  label,
  value,
}: {
  icon: ReactNode
  label: string
  value: string
}) {
  return (
    <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
      <div className="flex items-center gap-2 text-xs font-black text-white/30 uppercase tracking-widest">
        <span className="text-btn">{icon}</span>
        {label}
      </div>
      <div className="text-sm font-semibold text-white mt-2 break-words">{value}</div>
    </div>
  )
}
