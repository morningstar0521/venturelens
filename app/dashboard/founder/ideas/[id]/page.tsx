import { requireFounderSession } from "@/lib/auth/guards"
import { getIdeaById } from "@/lib/db/ideas"
import { getRolesByIdea } from "@/lib/db/roles"
import { EvaluationReportView } from "@/components/dashboard/EvaluationReport"
import { StatusBadge } from "@/components/dashboard/StatusBadge"
import { notFound } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, Cpu, Pencil, RefreshCw } from "lucide-react"
import { RetryEvaluationButton } from "@/components/dashboard/RetryEvaluationButton"
import { normalizeStoredReport } from "@/lib/ai/evaluate"

// The retry action runs the AI evaluation via after(); give it time to finish.
export const maxDuration = 60

// If an idea has been "evaluating" longer than this, offer a manual retry.
const STUCK_AFTER_MS = 2 * 60 * 1000

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const idea = await getIdeaById(id)
  return { title: idea ? `${idea.title} — Report` : "Idea Report" }
}

export default async function IdeaReportPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const session = await requireFounderSession()

  const idea = await getIdeaById(id)
  if (!idea || idea.founder_id !== session.user.id) notFound()
  const existingRoles = await getRolesByIdea(id).catch(() => [])
  const isLocked = idea.ai_report && (idea.venture_score ?? 0) < 70
  // Coerce stored JSON into the exact shape the report UI expects, so a loosely
  // formatted LLM response saved earlier can never crash the page.
  const report = idea.ai_report
    ? normalizeStoredReport(idea.ai_report, {
        title:            idea.title,
        description:      idea.description,
        problemStatement: idea.problem_statement,
        solution:         idea.solution,
        targetAudience:   idea.target_audience,
        revenueModel:     idea.revenue_model,
        industry:         idea.industry,
        stage:            idea.stage,
      })
    : null
  const lastTouched = new Date(idea.evaluated_at ?? idea.created_at).getTime()
  const looksStuck = idea.status === "evaluating" && Date.now() - lastTouched > STUCK_AFTER_MS

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

      {isLocked && idea.status !== "evaluating" && (
        <div className="glass-panel rounded-2xl p-5 border border-btn/20 bg-btn/5 flex items-center justify-between gap-4">
          <div>
            <h2 className="font-bold text-accent-yellow text-sm">Improve and reassess this idea</h2>
            <p className="text-xs text-white/45 mt-1">Edit the idea details and generate a fresh Venture Score report.</p>
          </div>
          <Link
            href={`/dashboard/founder/ideas/${id}/edit`}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-btn text-btn-foreground text-sm font-bold hover:bg-btn/90 transition-colors shrink-0"
          >
            <Pencil className="w-4 h-4" />
            Edit & Reassess
            <RefreshCw className="w-4 h-4" />
          </Link>
        </div>
      )}

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
          {looksStuck && (
            <div className="flex flex-col items-center gap-3 pt-2 border-t border-white/5">
              <p className="text-xs text-white/40">Taking longer than expected?</p>
              <RetryEvaluationButton ideaId={id} label="Retry evaluation" />
            </div>
          )}
        </div>
      ) : report ? (
        <EvaluationReportView
          report={report}
          ideaId={id}
          hasPostedRoles={existingRoles.length > 0}
        />
      ) : (
        <div className="glass-panel rounded-3xl p-12 border border-white/5 text-center">
          <p className="text-white/50 mb-2">No AI evaluation report available for this idea yet.</p>
          <p className="text-sm text-white/30 mb-6">
            The last evaluation did not complete. Run it again to generate your report.
          </p>
          <RetryEvaluationButton ideaId={id} />
        </div>
      )}
    </div>
  )
}
