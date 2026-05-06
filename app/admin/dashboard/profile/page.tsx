import { auth } from "@/auth"
import { getUserById } from "@/lib/db/users"
import { ProfileForm } from "@/components/dashboard/ProfileForm"
import { notFound } from "next/navigation"

export const metadata = { title: "Profile — VentureLens" }

export default async function AdminProfilePage() {
  const session = await auth()
  const user = await getUserById(session!.user.id)
  if (!user) notFound()

  return (
    <div className="max-w-3xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-accent-yellow">Profile Management</h1>
        <p className="text-sm text-accent-muted mt-1">Update your profile. Email cannot be changed.</p>
      </div>
      <ProfileForm user={user} />
    </div>
  )
}
