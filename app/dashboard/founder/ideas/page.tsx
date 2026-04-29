import { auth } from "@/auth"
import { getIdeasByFounder } from "@/lib/db/ideas"
import { IdeaCard } from "@/components/dashboard/IdeaCard"
import Link from "next/link"
import { PlusCircle } from "lucide-react"

export const metadata = { title: "My Ideas — VentureLens" }

export default async function FounderIdeasPage() {
  const session = await auth()
  const ideas = await getIdeasByFounder(session!.user.id)

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-bold text-accent-yellow">My Ideas</h1>
          <p className="text-sm text-accent-muted mt-1">Manage your submitted startup concepts.</p>
        </div>
        <Link href="/dashboard/founder/ideas/new" className="bg-btn text-btn-foreground px-4 py-2 rounded-xl text-sm font-bold hover:bg-btn/90 transition-colors flex items-center gap-2">
          <PlusCircle className="w-4 h-4" />
          New Idea
        </Link>
      </div>

      {ideas.length === 0 ? (
        <div className="glass-panel rounded-2xl p-10 text-center border border-white/5 flex flex-col items-center gap-4">
          <p className="text-accent-muted">You haven't submitted any ideas yet.</p>
          <Link href="/dashboard/founder/ideas/new" className="bg-btn/10 text-btn border border-btn/20 px-6 py-2 rounded-xl font-semibold hover:bg-btn/20 transition-colors">
            Submit your first idea
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {ideas.map((idea) => (
            <IdeaCard 
              key={idea.id} 
              idea={idea} 
              actions={
                <div className="flex gap-2 text-sm text-accent-muted">
                  <Link href={`/dashboard/founder/applicants?idea=${idea.id}`} className="hover:text-white transition-colors">
                    View Applicants →
                  </Link>
                </div>
              }
            />
          ))}
        </div>
      )}
    </div>
  )
}
