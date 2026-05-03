// ─── Idempotent migration endpoint ───────────────────────────────────────────
// GET /api/db/migrate — adds new columns safely (ADD COLUMN IF NOT EXISTS).
// Safe to run multiple times.
import { NextResponse } from "next/server"
import { sql } from "@/lib/db"

export async function GET() {
  try {
    // ── ideas: new rich submission fields ────────────────────────────────────
    await sql`ALTER TABLE ideas ADD COLUMN IF NOT EXISTS problem_statement TEXT`
    await sql`ALTER TABLE ideas ADD COLUMN IF NOT EXISTS solution TEXT`
    await sql`ALTER TABLE ideas ADD COLUMN IF NOT EXISTS target_audience TEXT`
    await sql`ALTER TABLE ideas ADD COLUMN IF NOT EXISTS revenue_model TEXT`
    await sql`ALTER TABLE ideas ADD COLUMN IF NOT EXISTS ai_report JSONB`
    await sql`ALTER TABLE ideas ADD COLUMN IF NOT EXISTS evaluated_at TIMESTAMPTZ`

    // ── applications: role assignment for team formation ─────────────────────
    await sql`ALTER TABLE applications ADD COLUMN IF NOT EXISTS assigned_role VARCHAR(50)`

    // ── ideas: allow 'evaluating' status by dropping the old constraint if any
    // (there is no CHECK constraint on status — so nothing to change here)

    return NextResponse.json({ ok: true, message: "Migration applied successfully." })
  } catch (err) {
    console.error("[db/migrate]", err)
    return NextResponse.json({ ok: false, error: String(err) }, { status: 500 })
  }
}
