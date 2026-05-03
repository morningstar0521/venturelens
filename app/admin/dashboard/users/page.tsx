import { getAllUsers } from "@/lib/db/users"
import { DataTable } from "@/components/dashboard/DataTable"
import { StatusBadge } from "@/components/dashboard/StatusBadge"
import { toggleUserStatusAction } from "@/actions/admin"

export const metadata = { title: "User Management — Admin" }

export default async function AdminUsersPage() {
  const users = await getAllUsers()

  const columns = ["Name", "Email", "Role", "Status", "Joined", "Actions"]

  const data = users.map(user => {
    async function toggle() {
      "use server"
      await toggleUserStatusAction(user.id, !user.is_active)
    }

    return [
      <div key={`name-${user.id}`} className="font-medium text-white">{user.name}</div>,
      <div key={`email-${user.id}`} className="text-accent-muted">{user.email}</div>,
      <span key={`role-${user.id}`} className="capitalize">{user.role}</span>,
      <StatusBadge key={`status-${user.id}`} status={user.is_active ? "active" : "suspended"} />,
      <div key={`date-${user.id}`} className="text-accent-muted">
        {new Date(user.created_at).toLocaleDateString()}
      </div>,
      <form key={`action-${user.id}`} action={toggle}>
        <button
          type="submit"
          className={`text-xs font-semibold px-3 py-1.5 rounded-lg border transition-colors ${
            user.is_active
              ? "text-error border-error/20 hover:bg-error/10"
              : "text-success border-success/20 hover:bg-success/10"
          }`}
        >
          {user.is_active ? "Suspend" : "Activate"}
        </button>
      </form>,
    ]
  })

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-accent-yellow">User Management</h1>
        <p className="text-sm text-accent-muted mt-1">View and manage all registered users.</p>
      </div>

      <DataTable columns={columns} data={data} emptyMessage="No users found." />
    </div>
  )
}
