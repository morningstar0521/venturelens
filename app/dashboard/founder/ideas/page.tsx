import { requireFounderSession } from "@/lib/auth/guards"
import { getIdeasByFounder } from "@/lib/db/ideas"
import { IdeaCard } from "@/components/dashboard/IdeaCard"
import Link from "next/link"
import { PlusCircle, Zap } from "lucide-react"

export const metadata = { title: "My Ideas — VentureLens" }

export default async function FounderIdeasPage() {
  const session = await requireFounderSession()
  const ideas = await getIdeasByFounder(session.user.id)

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-bold text-accent-yellow">My Ideas</h1>
          <p className="text-sm text-accent-muted mt-1">
            {ideas.length > 0
              ? `${ideas.length} idea${ideas.length !== 1 ? "s" : ""} submitted — click any card to view the full AI report.`
              : "Submit your first idea to get an AI Venture Score."}
          </p>
        </div>
        <Link
          href="/dashboard/founder/ideas/new"
          className="bg-btn text-btn-foreground px-4 py-2 rounded-xl text-sm font-bold hover:bg-btn/90 transition-colors flex items-center gap-2 shrink-0"
        >
          <PlusCircle className="w-4 h-4" />
          New Idea
        </Link>
      </div>

      {ideas.length === 0 ? (
      <div className="glass-panel rounded-2xl p-12 text-center border border-white/5 flex flex-col items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-btn/10 border border-btn/20 flex items-center justify-center">
            <Zap className="w-8 h-8 text-btn" />
          </div>
          <div>
            <p className="text-white font-semibold mb-1">No ideas yet</p>
            <p className="text-accent-muted text-sm">Submit your first idea to get your AI-powered Venture Score.</p>
          </div>
          <Link
            href="/dashboard/founder/ideas/new"
            className="bg-btn/10 text-btn border border-btn/20 px-6 py-2.5 rounded-xl font-semibold hover:bg-btn/20 transition-colors"
          >
            Submit your first idea
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {ideas.map((idea) => {
            const isUnlocked = (idea.venture_score ?? 0) >= 70
            return (
              <IdeaCard
                key={idea.id}
                idea={idea}
                actions={
                  <div className="flex items-center justify-between text-sm">
                    {isUnlocked ? (
                      <Link
                        href={`/dashboard/founder/applicants?idea=${idea.id}`}
                        className="text-accent-muted hover:text-white transition-colors text-xs"
                      >
                        View Applicants →
                      </Link>
                    ) : (
                      <Link
                        href={`/dashboard/founder/ideas/${idea.id}/edit`}
                        className="text-btn hover:text-btn/80 transition-colors text-xs"
                      >
                        Edit & Reassess →
                      </Link>
                    )}
                    <Link
                      href={`/dashboard/founder/ideas/${idea.id}`}
                      className="flex items-center gap-1.5 bg-btn/10 hover:bg-btn/20 border border-btn/20 text-btn px-3 py-1.5 rounded-lg font-semibold text-xs transition-colors"
                    >
                      <Zap className="w-3 h-3" />
                      {idea.ai_report ? "View AI Report" : idea.status === "evaluating" ? "Evaluating…" : "View Details"}
                    </Link>
                  </div>
                }
              />
            )
          })}
        </div>
      )}
    </div>
  )
}
