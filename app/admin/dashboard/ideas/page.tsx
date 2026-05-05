import { getAllIdeas } from "@/lib/db/ideas"
import { getAllUsers } from "@/lib/db/users"
import { AdminIdeasTable } from "@/components/dashboard/AdminIdeasTable"

export const metadata = { title: "Idea Moderation — Admin" }

export default async function AdminIdeasPage() {
  const ideas = await getAllIdeas()
  const users = await getAllUsers()

  // Convert userMap to a serializable format for the Client Component
  const serializedUsers = users.map(u => ({ id: u.id, name: u.name }))

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-accent-yellow">Idea Moderation</h1>
        <p className="text-sm text-accent-muted mt-1">
          Review and approve startup ideas. Click on any row to expand details.
        </p>
      </div>

      <AdminIdeasTable ideas={ideas} users={serializedUsers} />
    </div>
  )
}
