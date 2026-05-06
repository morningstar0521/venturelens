import { requireFounderSession } from "@/lib/auth/guards"
import { getApplicationsForFounder } from "@/lib/db/applications"
import { getIdeasByFounder } from "@/lib/db/ideas"
import { getUserById } from "@/lib/db/users"
import { TeamCard } from "@/components/dashboard/TeamCard"
import { AssignedRole } from "@/lib/db/applications"
import { ArrowRight, UserCheck, Users } from "lucide-react"
import Link from "next/link"

export const metadata = { title: "My Team — VentureLens" }

export default async function FounderMyTeamPage() {
  const session = await requireFounderSession()
  const ideas = await getIdeasByFounder(session.user.id)
  const ideaMap = new Map(ideas.map(idea => [idea.id, idea.title]))
  const applications = await getApplicationsForFounder(ideas.map(idea => idea.id))
  const acceptedApps = applications.filter(app => app.status === "accepted")

  const teamMembers = await Promise.all(
    acceptedApps.map(async app => ({
      application: app,
      user: await getUserById(app.employee_id),
      ideaTitle: ideaMap.get(app.idea_id) ?? "Unknown idea",
    }))
  )

  return (
    <div className="space-y-8">
      <div className="glass-panel rounded-3xl p-8 border border-success/10">
        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-success/10 border border-success/20 flex items-center justify-center">
            <UserCheck className="w-7 h-7 text-success" />
          </div>
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-accent-yellow">My Team</h1>
            <p className="text-sm text-accent-muted mt-0.5">
              Accepted applicants who are now part of your startup teams.
            </p>
          </div>
          <div className="px-3 py-1.5 rounded-full bg-success/10 border border-success/20 text-success text-sm font-bold">
            {teamMembers.length} member{teamMembers.length !== 1 ? "s" : ""}
          </div>
        </div>
      </div>

      {teamMembers.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {teamMembers.map(({ application, user, ideaTitle }) => (
            <TeamCard
              key={application.id}
              applicationId={application.id}
              name={user?.name ?? "Unknown"}
              email={user?.email ?? ""}
              skills={user?.skills ?? null}
              experience={user?.experience ?? null}
              assignedRole={application.assigned_role as AssignedRole | null}
              ideaTitle={ideaTitle}
            />
          ))}
        </div>
      ) : (
        <div className="glass-panel rounded-2xl p-12 text-center border border-white/5">
          <Users className="w-12 h-12 text-white/20 mx-auto mb-4" />
          <p className="text-white/50 font-semibold">No accepted members yet.</p>
          <p className="text-sm text-white/30 mt-1">
            Accepted applicants will appear here automatically.
          </p>
          <Link
            href="/dashboard/founder/applicants"
            className="inline-flex items-center gap-2 mt-5 px-4 py-2 rounded-xl bg-btn text-btn-foreground text-sm font-bold hover:bg-btn/90 transition-colors"
          >
            Review applicants
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      )}
    </div>
  )
}
