import { auth } from "@/auth"
import { getUserById } from "@/lib/db/users"
import { User, Mail } from "lucide-react"
import { EditProfileForm } from "@/components/dashboard/EditProfileForm"

export const metadata = { title: "Profile — VentureLens" }

export default async function EmployeeProfilePage() {
  const session = await auth()
  const user = await getUserById(session!.user.id)

  if (!user) return null

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-accent-yellow">My Profile</h1>
        <p className="text-sm text-accent-muted mt-1">
          Keep your details up to date so founders know who you are.
        </p>
      </div>

      <div className="glass-panel rounded-3xl p-8 border border-white/5 space-y-8">
        {/* Avatar + identity (read-only) */}
        <div className="flex items-center gap-4 border-b border-white/5 pb-6">
          <div className="w-16 h-16 rounded-full bg-success/10 border border-success/20 flex items-center justify-center shrink-0">
            <User className="w-8 h-8 text-success" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">{user.name}</h2>
            <div className="flex items-center gap-2 text-accent-muted text-sm mt-1">
              <Mail className="w-4 h-4" />
              {user.email}
            </div>
            <span className="inline-block mt-2 text-[10px] uppercase font-bold px-2 py-0.5 rounded-md border text-success border-success/20 bg-success/10 tracking-wider">
              Employee
            </span>
          </div>
        </div>

        {/* Editable fields */}
        <EditProfileForm user={user} />
      </div>
    </div>
  )
}
