import { auth } from "@/auth"
import { getIdeasByFounder } from "@/lib/db/ideas"
import { getApplicationsForIdea, DbApplication } from "@/lib/db/applications"
import { getUserById } from "@/lib/db/users"
import { DataTable } from "@/components/dashboard/DataTable"
import { StatusBadge } from "@/components/dashboard/StatusBadge"
import { updateApplicationStatusAction } from "@/actions/applications"

export const metadata = { title: "Applicants — VentureLens" }

interface AppWithIdea extends DbApplication {
  ideaTitle: string
}

export default async function FounderApplicantsPage() {
  const session = await auth()
  const ideas = await getIdeasByFounder(session!.user.id)

  const allApplications: AppWithIdea[] = []

  for (const idea of ideas) {
    const apps = await getApplicationsForIdea(idea.id)
    allApplications.push(...apps.map(app => ({ ...app, ideaTitle: idea.title })))
  }

  allApplications.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())

  const data = await Promise.all(allApplications.map(async (app) => {
    const user = await getUserById(app.employee_id)

    async function accept() {
      "use server"
      await updateApplicationStatusAction(app.id, "accepted")
    }
    async function reject() {
      "use server"
      await updateApplicationStatusAction(app.id, "rejected")
    }

    return [
      <div key={`user-${app.id}`}>
        <div className="font-bold text-white">{user?.name || "Unknown User"}</div>
        <div className="text-xs text-accent-muted">{user?.email}</div>
      </div>,
      <div key={`idea-${app.id}`} className="text-sm font-medium text-accent-yellow max-w-[150px] truncate" title={app.ideaTitle}>
        {app.ideaTitle}
      </div>,
      <div key={`skills-${app.id}`} className="text-xs text-accent-muted">
        <span className="capitalize text-white">{user?.experience || "N/A"}</span>
        {user?.skills && (
          <div className="mt-1 truncate max-w-[150px]" title={user.skills.join(", ")}>
            {user.skills.join(", ")}
          </div>
        )}
      </div>,
      <div key={`msg-${app.id}`} className="text-sm text-accent-muted max-w-[200px] whitespace-normal line-clamp-2" title={app.message || ""}>
        {app.message}
      </div>,
      <StatusBadge key={`status-${app.id}`} status={app.status} />,
      <div key={`actions-${app.id}`} className="flex gap-2">
        {app.status === "pending" && (
          <>
            <form action={accept}>
              <button type="submit" className="text-xs font-semibold px-3 py-1.5 rounded-lg border text-success border-success/20 hover:bg-success/10 transition-colors">
                Accept
              </button>
            </form>
            <form action={reject}>
              <button type="submit" className="text-xs font-semibold px-3 py-1.5 rounded-lg border text-error border-error/20 hover:bg-error/10 transition-colors">
                Reject
              </button>
            </form>
          </>
        )}
      </div>,
    ]
  }))

  const columns = ["Applicant", "Idea", "Experience/Skills", "Message", "Status", "Actions"]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-accent-yellow">Applicants</h1>
        <p className="text-sm text-accent-muted mt-1">Review contributors who want to join your startups.</p>
      </div>

      <DataTable columns={columns} data={data} emptyMessage="No applications received yet." />
    </div>
  )
}
