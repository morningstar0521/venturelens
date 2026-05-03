import { auth } from "@/auth"
import { getIdeaById } from "@/lib/db/ideas"
import { EvaluationReportView } from "@/components/dashboard/EvaluationReport"
import { StatusBadge } from "@/components/dashboard/StatusBadge"
import { notFound, redirect } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, Cpu } from "lucide-react"

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const idea = await getIdeaById(id)
  return { title: idea ? `${idea.title} — Report` : "Idea Report" }
}

export default async function IdeaReportPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const session = await auth()
  if (!session?.user) redirect("/login")

  const idea = await getIdeaById(id)
  if (!idea || idea.founder_id !== session.user.id) notFound()

  return (
    <div className="space-y-6">
      {/* Back + Header */}
      <div className="flex items-start gap-4">
        <Link
          href="/dashboard/founder/ideas"
          className="mt-1 w-9 h-9 rounded-xl border border-white/10 flex items-center justify-center hover:bg-white/5 transition-colors shrink-0"
        >
          <ArrowLeft className="w-4 h-4 text-white/60" />
        </Link>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3 flex-wrap mb-1">
            <StatusBadge status={idea.status} />
            {idea.venture_score !== null && (
              <span className="text-xs text-white/40">Score: <strong className="text-accent-yellow">{idea.venture_score}</strong>/100</span>
            )}
          </div>
          <h1 className="text-2xl font-bold text-accent-yellow truncate">{idea.title}</h1>
          <p className="text-sm text-white/40 mt-0.5">
            {idea.industry && <span className="mr-3">🏭 {idea.industry}</span>}
            <span className="capitalize">📊 {idea.stage}</span>
          </p>
        </div>
      </div>

      {/* Report or pending state */}
      {idea.status === "evaluating" ? (
        <div className="glass-panel rounded-3xl p-16 border border-white/5 flex flex-col items-center gap-6 text-center">
          <div className="w-20 h-20 rounded-full bg-blue-500/10 border-2 border-blue-400/20 flex items-center justify-center">
            <Cpu className="w-10 h-10 text-blue-400 animate-pulse" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white mb-2">AI Evaluation in Progress</h2>
            <p className="text-white/50 max-w-md">
              Our multi-model AI pipeline is analyzing your idea. This takes 30–60 seconds.
              Refresh the page to see your results.
            </p>
          </div>
          <div className="flex gap-1.5">
            {[0, 1, 2].map((i) => (
              <div key={i} className="w-2 h-2 rounded-full bg-blue-400 animate-bounce" style={{ animationDelay: `${i * 0.15}s` }} />
            ))}
          </div>
          <Link
            href={`/dashboard/founder/ideas/${id}`}
            className="text-sm text-btn hover:text-btn/80 transition-colors"
          >
            Click to refresh →
          </Link>
        </div>
      ) : idea.ai_report ? (
        <EvaluationReportView report={idea.ai_report} />
      ) : (
        <div className="glass-panel rounded-3xl p-12 border border-white/5 text-center">
          <p className="text-white/50 mb-4">No AI evaluation report available for this idea yet.</p>
          <p className="text-sm text-white/30">
            This idea was submitted before the AI evaluation feature was added.
            Re-submit your idea to generate a report.
          </p>
        </div>
      )}
    </div>
  )
}
