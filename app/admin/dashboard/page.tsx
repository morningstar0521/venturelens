import { StatsCard } from "@/components/dashboard/StatsCard"
import { ShieldCheck, Users, Lightbulb, BarChart3, AlertTriangle } from "lucide-react"
import { getAllUsers } from "@/lib/db/users"
import { getAllIdeas } from "@/lib/db/ideas"

export const metadata = { title: "Admin Overview — VentureLens" }

export default async function AdminDashboardPage() {
  const users = await getAllUsers()
  const ideas = await getAllIdeas()

  const foundersCount = users.filter(u => u.role === "founder").length
  const employeesCount = users.filter(u => u.role === "employee").length
  
  const pendingIdeasCount = ideas.filter(i => i.status === "pending").length

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="glass-panel rounded-3xl p-8 border border-error/10">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-error/10 border border-error/20 flex items-center justify-center">
            <ShieldCheck className="w-7 h-7 text-error" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-accent-yellow">Admin Overview</h1>
            <p className="text-accent-muted text-sm mt-0.5">
              Platform health and key metrics
            </p>
          </div>
        </div>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard 
          icon={Users} 
          label="Total Users" 
          value={users.length} 
          color="btn" 
        />
        <StatsCard 
          icon={Lightbulb} 
          label="Ideas Submitted" 
          value={ideas.length} 
          color="success" 
        />
        <StatsCard 
          icon={AlertTriangle} 
          label="Pending Ideas" 
          value={pendingIdeasCount} 
          color="error" 
        />
        <StatsCard 
          icon={BarChart3} 
          label="Avg Venture Score" 
          value="—" 
          color="accent-yellow" 
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="glass-panel rounded-3xl p-6 border border-white/5">
          <h3 className="font-bold text-accent-yellow mb-4">User Breakdown</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center pb-4 border-b border-white/5">
              <span className="text-accent-muted">Founders</span>
              <span className="font-bold text-lg">{foundersCount}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-accent-muted">Contributors</span>
              <span className="font-bold text-lg">{employeesCount}</span>
            </div>
          </div>
        </div>

        <div className="glass-panel rounded-3xl p-6 border border-white/5">
          <h3 className="font-bold text-accent-yellow mb-4">Idea Status</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center pb-4 border-b border-white/5">
              <span className="text-accent-muted">Approved</span>
              <span className="font-bold text-lg text-success">{ideas.filter(i => i.status === "approved").length}</span>
            </div>
            <div className="flex justify-between items-center pb-4 border-b border-white/5">
              <span className="text-accent-muted">Pending</span>
              <span className="font-bold text-lg text-btn">{pendingIdeasCount}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-accent-muted">Rejected</span>
              <span className="font-bold text-lg text-error">{ideas.filter(i => i.status === "rejected").length}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
