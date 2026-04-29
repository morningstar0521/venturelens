import { getAllIdeas } from "@/lib/db/ideas"
import { getAllUsers } from "@/lib/db/users"
import { DataTable } from "@/components/dashboard/DataTable"
import { StatusBadge } from "@/components/dashboard/StatusBadge"
import { updateIdeaStatusAction } from "@/actions/ideas"

export const metadata = { title: "Idea Moderation — Admin" }

export default async function AdminIdeasPage() {
  const ideas = await getAllIdeas()
  const users = await getAllUsers()

  const userMap = new Map(users.map(u => [u.id, u.name]))

  const columns = ["Title", "Founder", "Industry/Stage", "Status", "Actions"]

  const data = ideas.map(idea => {
    async function approve() {
      "use server"
      await updateIdeaStatusAction(idea.id, "approved")
    }
    async function reject() {
      "use server"
      await updateIdeaStatusAction(idea.id, "rejected")
    }

    return [
      <div key={`title-${idea.id}`} className="font-medium text-white max-w-xs truncate" title={idea.title}>
        {idea.title}
      </div>,
      <div key={`founder-${idea.id}`} className="text-accent-muted">
        {userMap.get(idea.founder_id) || "Unknown"}
      </div>,
      <div key={`tags-${idea.id}`} className="flex flex-col gap-1">
        <span className="text-xs text-accent-muted">{idea.industry || "N/A"}</span>
        <span className="text-xs capitalize">{idea.stage}</span>
      </div>,
      <StatusBadge key={`status-${idea.id}`} status={idea.status} />,
      <div key={`actions-${idea.id}`} className="flex gap-2">
        {idea.status !== "approved" && (
          <form action={approve}>
            <button type="submit" className="text-xs font-semibold px-3 py-1.5 rounded-lg border text-success border-success/20 hover:bg-success/10 transition-colors">
              Approve
            </button>
          </form>
        )}
        {idea.status !== "rejected" && (
          <form action={reject}>
            <button type="submit" className="text-xs font-semibold px-3 py-1.5 rounded-lg border text-error border-error/20 hover:bg-error/10 transition-colors">
              Reject
            </button>
          </form>
        )}
      </div>,
    ]
  })

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-accent-yellow">Idea Moderation</h1>
        <p className="text-sm text-accent-muted mt-1">Review and approve startup ideas.</p>
      </div>

      <DataTable columns={columns} data={data} emptyMessage="No ideas submitted yet." />
    </div>
  )
}
