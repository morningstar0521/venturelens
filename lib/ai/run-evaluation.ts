// ─── Evaluation Runner ────────────────────────────────────────────────────────
// Single place that evaluates an idea and persists the result.
// Called in-process via `after()` from server actions (no HTTP self-call), and
// by POST /api/ai/evaluate for manual / external triggers.
//
// Guarantee: an idea never stays in "evaluating" because of an error here.

import { evaluateIdea } from "@/lib/ai/evaluate"
import { getIdeaById, updateIdeaReport, updateIdeaStatus, IdeaStatus } from "@/lib/db/ideas"

export async function runEvaluation(ideaId: string): Promise<{ ok: boolean; ventureScore?: number; modelUsed?: string; error?: string }> {
  try {
    const idea = await getIdeaById(ideaId)
    if (!idea) return { ok: false, error: "Idea not found" }

    const report = await evaluateIdea({
      title:            idea.title,
      description:      idea.description,
      problemStatement: idea.problem_statement,
      solution:         idea.solution,
      targetAudience:   idea.target_audience,
      revenueModel:     idea.revenue_model,
      industry:         idea.industry,
      stage:            idea.stage,
    })

    const status: IdeaStatus = report.ventureScore >= 70 ? "approved" : "pending"

    await updateIdeaReport(ideaId, {
      aiReport:     report,
      ventureScore: report.ventureScore,
      status,
    })

    console.info(`[runEvaluation] ${ideaId} scored ${report.ventureScore} via ${report.modelUsed}`)
    return { ok: true, ventureScore: report.ventureScore, modelUsed: report.modelUsed }
  } catch (err) {
    console.error(`[runEvaluation] ${ideaId} failed:`, err)
    // Release the idea from "evaluating" so the UI can offer a retry
    await updateIdeaStatus(ideaId, "pending").catch((e) =>
      console.error(`[runEvaluation] ${ideaId} could not reset status:`, e)
    )
    return { ok: false, error: err instanceof Error ? err.message : String(err) }
  }
}
