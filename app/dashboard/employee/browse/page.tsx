import { getPublicIdeas } from "@/lib/db/ideas"
import { IdeaCard } from "@/components/dashboard/IdeaCard"
import { ApplyForm } from "@/components/dashboard/ApplyForm"

export const metadata = { title: "Browse Ideas — VentureLens" }

export default async function BrowseIdeasPage() {
  const ideas = await getPublicIdeas()

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-accent-yellow">Browse Ideas</h1>
        <p className="text-sm text-accent-muted mt-1">Explore approved startup concepts and apply to contribute.</p>
      </div>

      {ideas.length === 0 ? (
        <div className="glass-panel rounded-2xl p-10 text-center border border-white/5">
          <p className="text-accent-muted">No ideas available right now. Check back later!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {ideas.map((idea) => (
            <IdeaCard
              key={idea.id}
              idea={idea}
              actions={<ApplyForm ideaId={idea.id} />}
            />
          ))}
        </div>
      )}
    </div>
  )
}
