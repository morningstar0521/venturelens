// ─── AI Evaluate API Route ────────────────────────────────────────────────────
// POST /api/ai/evaluate — manually (re)triggers AI evaluation for an idea.
// Normal submissions no longer call this route: server actions run the
// evaluation in-process with `after()` (see actions/ideas.ts).
import { NextRequest, NextResponse } from "next/server"
import { getIdeaById, updateIdeaStatus } from "@/lib/db/ideas"
import { runEvaluation } from "@/lib/ai/run-evaluation"
import { auth } from "@/auth"

export const dynamic = "force-dynamic"
export const maxDuration = 60

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

    // Caller must be the idea owner or an admin
    const session = await auth().catch(() => null)
    const allowed = Boolean(
      session?.user && (session.user.id === idea.founder_id || session.user.role === "admin")
    )
    if (!allowed) {
      return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 })
    }

    await updateIdeaStatus(ideaId, "evaluating")
    const result = await runEvaluation(ideaId)
    return NextResponse.json(result, { status: result.ok ? 200 : 500 })
  } catch (err) {
    console.error("[api/ai/evaluate]", err)
    return NextResponse.json({ ok: false, error: String(err) }, { status: 500 })
  }
}
