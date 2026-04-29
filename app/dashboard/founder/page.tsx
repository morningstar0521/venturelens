import { auth } from "@/auth"
import { StatsCard } from "@/components/dashboard/StatsCard"
import { Lightbulb, Users, BarChart3, PlusCircle } from "lucide-react"
import { getIdeasByFounder } from "@/lib/db/ideas"
import Link from "next/link"

export const metadata = { title: "Dashboard — Founder" }

export default async function FounderDashboardPage() {
  const session = await auth()
  const ideas = await getIdeasByFounder(session!.user.id)

  const approvedCount = ideas.filter(i => i.status === "approved").length
  
  // Calculate average venture score for scored ideas
  const scoredIdeas = ideas.filter(i => i.venture_score !== null)
  const avgScore = scoredIdeas.length > 0 
    ? Math.round(scoredIdeas.reduce((acc, curr) => acc + curr.venture_score!, 0) / scoredIdeas.length)
    : "—"

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="glass-panel rounded-3xl p-8 border border-btn/10">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-btn/10 border border-btn/20 flex items-center justify-center">
            <Lightbulb className="w-7 h-7 text-btn" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-accent-yellow">
              Welcome back, {session!.user.name?.split(" ")[0]}!
            </h1>
            <p className="text-accent-muted text-sm mt-0.5">
              Manage your startup ideas and review applicants.
            </p>
          </div>
        </div>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatsCard 
          icon={Lightbulb} 
          label="Total Ideas" 
          value={ideas.length} 
          color="btn" 
        />
        <StatsCard 
          icon={BarChart3} 
          label="Avg Venture Score" 
          value={avgScore} 
          color="accent-yellow" 
        />
        <StatsCard 
          icon={Users} 
          label="Approved Ideas" 
          value={approvedCount} 
          color="success" 
        />
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <Link href="/dashboard/founder/ideas/new" className="glass-panel rounded-3xl p-6 border border-white/5 hover:border-white/10 hover:-translate-y-1 transition-all duration-300 group">
          <div className="w-10 h-10 rounded-xl bg-btn/10 border border-btn/20 flex items-center justify-center mb-4">
            <PlusCircle className="w-5 h-5 text-btn group-hover:scale-110 transition-transform" />
          </div>
          <h3 className="font-bold text-accent-yellow">Submit Idea</h3>
          <p className="text-accent-muted text-sm mt-1">Add a new startup concept to be validated and scored.</p>
        </Link>
        <Link href="/dashboard/founder/ideas" className="glass-panel rounded-3xl p-6 border border-white/5 hover:border-white/10 hover:-translate-y-1 transition-all duration-300 group">
          <div className="w-10 h-10 rounded-xl bg-accent-yellow/10 border border-accent-yellow/20 flex items-center justify-center mb-4">
            <Lightbulb className="w-5 h-5 text-accent-yellow group-hover:scale-110 transition-transform" />
          </div>
          <h3 className="font-bold text-accent-yellow">My Ideas</h3>
          <p className="text-accent-muted text-sm mt-1">Review the status and scores of your submitted ideas.</p>
        </Link>
        <Link href="/dashboard/founder/applicants" className="glass-panel rounded-3xl p-6 border border-white/5 hover:border-white/10 hover:-translate-y-1 transition-all duration-300 group md:col-span-2 lg:col-span-1">
          <div className="w-10 h-10 rounded-xl bg-success/10 border border-success/20 flex items-center justify-center mb-4">
            <Users className="w-5 h-5 text-success group-hover:scale-110 transition-transform" />
          </div>
          <h3 className="font-bold text-accent-yellow">Review Applicants</h3>
          <p className="text-accent-muted text-sm mt-1">Review contributors who want to join your approved ideas.</p>
        </Link>
      </div>
    </div>
  )
}
