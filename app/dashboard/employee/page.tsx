import { auth } from "@/auth"
import { StatsCard } from "@/components/dashboard/StatsCard"
import { Send, CheckCircle, Clock, Briefcase } from "lucide-react"
import { getApplicationsByEmployee } from "@/lib/db/applications"
import Link from "next/link"

export const metadata = { title: "Dashboard — Employee" }

export default async function EmployeeDashboardPage() {
  const session = await auth()
  const applications = await getApplicationsByEmployee(session!.user.id)

  const pendingCount = applications.filter(a => a.status === "pending").length
  const acceptedCount = applications.filter(a => a.status === "accepted").length

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="glass-panel rounded-3xl p-8 border border-success/10">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-success/10 border border-success/20 flex items-center justify-center">
            <Briefcase className="w-7 h-7 text-success" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-accent-yellow">
              Welcome back, {session!.user.name?.split(" ")[0]}!
            </h1>
            <p className="text-accent-muted text-sm mt-0.5">
              Ready to find your next startup venture?
            </p>
          </div>
        </div>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatsCard 
          icon={Send} 
          label="Total Applications" 
          value={applications.length} 
          color="success" 
        />
        <StatsCard 
          icon={Clock} 
          label="Pending Responses" 
          value={pendingCount} 
          color="accent-yellow" 
        />
        <StatsCard 
          icon={CheckCircle} 
          label="Accepted Matches" 
          value={acceptedCount} 
          color="btn" 
        />
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Link href="/dashboard/employee/browse" className="glass-panel rounded-3xl p-6 border border-white/5 hover:border-white/10 hover:-translate-y-1 transition-all duration-300 group">
          <div className="w-10 h-10 rounded-xl bg-success/10 border border-success/20 flex items-center justify-center mb-4">
            <Send className="w-5 h-5 text-success group-hover:scale-110 transition-transform" />
          </div>
          <h3 className="font-bold text-accent-yellow">Browse Ideas</h3>
          <p className="text-accent-muted text-sm mt-1">Explore verified startup concepts and apply to join their team.</p>
        </Link>
        <Link href="/dashboard/employee/applications" className="glass-panel rounded-3xl p-6 border border-white/5 hover:border-white/10 hover:-translate-y-1 transition-all duration-300 group">
          <div className="w-10 h-10 rounded-xl bg-accent-yellow/10 border border-accent-yellow/20 flex items-center justify-center mb-4">
            <Clock className="w-5 h-5 text-accent-yellow group-hover:scale-110 transition-transform" />
          </div>
          <h3 className="font-bold text-accent-yellow">Track Applications</h3>
          <p className="text-accent-muted text-sm mt-1">View the status of your sent applications and founder responses.</p>
        </Link>
      </div>
    </div>
  )
}
