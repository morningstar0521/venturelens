import { requireFounderSession } from "@/lib/auth/guards"
import { getUserById } from "@/lib/db/users"
import { ProfileForm } from "@/components/dashboard/ProfileForm"
import { notFound } from "next/navigation"

export const metadata = { title: "Profile — VentureLens" }

export default async function FounderProfilePage() {
  const session = await requireFounderSession()
  const user = await getUserById(session.user.id)
  if (!user) notFound()

  return (
    <div className="max-w-3xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-accent-yellow">Profile Management</h1>
        <p className="text-sm text-accent-muted mt-1">Update your founder details. Email cannot be changed.</p>
      </div>
      <ProfileForm user={user} />
    </div>
  )
}
