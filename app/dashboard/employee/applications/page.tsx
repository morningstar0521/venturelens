import { auth } from "@/auth"
import { getApplicationsByEmployee } from "@/lib/db/applications"
import { getAllIdeas } from "@/lib/db/ideas"
import { DataTable } from "@/components/dashboard/DataTable"
import { StatusBadge } from "@/components/dashboard/StatusBadge"

export const metadata = { title: "My Applications — VentureLens" }

export default async function ApplicationsPage() {
  const session = await auth()
  const applications = await getApplicationsByEmployee(session!.user.id)
  
  // Fetch ideas so we can map idea_id to idea title
  const ideas = await getAllIdeas()
  const ideaMap = new Map(ideas.map(i => [i.id, i.title]))

  const columns = ["Startup Idea", "My Message", "Applied On", "Status"]

  const data = applications.map(app => [
    <div key={`idea-${app.id}`} className="font-bold text-white max-w-xs truncate">
      {ideaMap.get(app.idea_id) || "Unknown Idea"}
    </div>,
    <div key={`msg-${app.id}`} className="text-sm text-accent-muted max-w-sm truncate" title={app.message || ""}>
      {app.message || <span className="italic opacity-50">No message</span>}
    </div>,
    <div key={`date-${app.id}`} className="text-sm text-accent-muted">
      {new Date(app.created_at).toLocaleDateString()}
    </div>,
    <StatusBadge key={`status-${app.id}`} status={app.status} />
  ])

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-accent-yellow">My Applications</h1>
        <p className="text-sm text-accent-muted mt-1">Track the status of the startup ideas you've applied to.</p>
      </div>

      <DataTable columns={columns} data={data} emptyMessage="You haven't applied to any ideas yet." />
    </div>
  )
}
