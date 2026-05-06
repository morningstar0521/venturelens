// ─── AI Evaluate API Route ────────────────────────────────────────────────────
// POST /api/ai/evaluate — triggers AI evaluation for a given idea ID
// Called from the submitIdeaAction server action after idea creation.
import { NextRequest, NextResponse } from "next/server"
import { evaluateIdea } from "@/lib/ai/evaluate"
import { getIdeaById, updateIdeaReport } from "@/lib/db/ideas"
import { IdeaStatus } from "@/lib/db/ideas"

export async function POST(req: NextRequest) {
  try {
    const { ideaId } = await req.json()
    if (!ideaId) {
      return NextResponse.json({ ok: false, error: "ideaId is required" }, { status: 400 })
    }

    const idea = await getIdeaById(ideaId)
    if (!idea) {
      return NextResponse.json({ ok: false, error: "Idea not found" }, { status: 404 })
    }

    // Run the AI evaluation pipeline
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

    // Determine status based on venture score
    const newStatus: IdeaStatus = report.ventureScore >= 70 ? "approved" : "pending"

    // Persist report and score back to DB
    await updateIdeaReport(ideaId, {
      aiReport:     report,
      ventureScore: report.ventureScore,
      status:       newStatus,
    })

    return NextResponse.json({ ok: true, ventureScore: report.ventureScore, modelUsed: report.modelUsed })
  } catch (err) {
    console.error("[api/ai/evaluate]", err)
    return NextResponse.json({ ok: false, error: String(err) }, { status: 500 })
  }
}
