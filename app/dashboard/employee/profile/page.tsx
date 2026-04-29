import { auth } from "@/auth"
import { getUserById } from "@/lib/db/users"
import { User, Mail, Briefcase, Award } from "lucide-react"

export const metadata = { title: "Profile — VentureLens" }

export default async function EmployeeProfilePage() {
  const session = await auth()
  const user = await getUserById(session!.user.id)

  if (!user) return null

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-accent-yellow">My Profile</h1>
        <p className="text-sm text-accent-muted mt-1">Manage your details and skills.</p>
      </div>

      <div className="glass-panel rounded-3xl p-8 border border-white/5 space-y-8">
        <div className="flex items-center gap-4 border-b border-white/5 pb-6">
          <div className="w-16 h-16 rounded-full bg-success/10 border border-success/20 flex items-center justify-center">
            <User className="w-8 h-8 text-success" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">{user.name}</h2>
            <div className="flex items-center gap-2 text-accent-muted text-sm mt-1">
              <Mail className="w-4 h-4" />
              {user.email}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div>
            <div className="flex items-center gap-2 text-sm text-accent-yellow font-semibold mb-3">
              <Award className="w-4 h-4" /> Experience Level
            </div>
            <div className="inline-block px-4 py-2 bg-black/20 border border-white/5 rounded-lg text-white capitalize">
              {user.experience || "Not specified"}
            </div>
          </div>

          <div>
            <div className="flex items-center gap-2 text-sm text-accent-yellow font-semibold mb-3">
              <Briefcase className="w-4 h-4" /> Skills
            </div>
            {user.skills && user.skills.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {user.skills.map(skill => (
                  <span key={skill} className="px-3 py-1.5 bg-success/10 border border-success/20 text-success rounded-lg text-sm font-medium">
                    {skill}
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-sm text-accent-muted italic">No skills listed.</p>
            )}
          </div>
        </div>

        <div className="pt-6 border-t border-white/5 flex justify-end">
          <button disabled className="px-6 py-2 bg-white/5 border border-white/10 text-accent-muted rounded-xl text-sm font-semibold cursor-not-allowed">
            Edit Profile (Coming Soon)
          </button>
        </div>
      </div>
    </div>
  )
}
