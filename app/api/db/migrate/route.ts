// ─── Idempotent migration endpoint ───────────────────────────────────────────
// GET /api/db/migrate — adds new columns safely (ADD COLUMN IF NOT EXISTS).
// Safe to run multiple times.
import { NextRequest, NextResponse } from "next/server"
import { sql } from "@/lib/db"
import { initRolesDb } from "@/lib/db/roles"
import { verifyBootstrapAccess } from "@/lib/auth/bootstrap-guard"

export const dynamic = 'force-dynamic'

export async function GET(req: NextRequest) {
  if (!await verifyBootstrapAccess(req)) {
    return NextResponse.json(
      { ok: false, error: "Unauthorized. Admin session or valid secret (?secret= or x-setup-secret header) required." },
      { status: 401 }
    )
  }

  try {
    // ── users: track last navigation path ────────────────────────────────────
    await sql`ALTER TABLE users ADD COLUMN IF NOT EXISTS last_active_path TEXT`

    // ── ideas: new rich submission fields ────────────────────────────────────
    await sql`ALTER TABLE ideas ADD COLUMN IF NOT EXISTS problem_statement TEXT`
    await sql`ALTER TABLE ideas ADD COLUMN IF NOT EXISTS solution TEXT`
    await sql`ALTER TABLE ideas ADD COLUMN IF NOT EXISTS target_audience TEXT`
    await sql`ALTER TABLE ideas ADD COLUMN IF NOT EXISTS revenue_model TEXT`
    await sql`ALTER TABLE ideas ADD COLUMN IF NOT EXISTS ai_report JSONB`
    await sql`ALTER TABLE ideas ADD COLUMN IF NOT EXISTS evaluated_at TIMESTAMPTZ`

    // ── applications: role assignment for team formation ─────────────────────
    await sql`ALTER TABLE applications ADD COLUMN IF NOT EXISTS assigned_role VARCHAR(50)`

    // ── role_requirements + applications.role_requirement_id ─────────────────
    await initRolesDb()

    // ── applications: allow multiple applications per idea (one per role) ─────
    await sql`ALTER TABLE applications DROP CONSTRAINT IF EXISTS applications_idea_id_employee_id_key`
    await sql`
      DO $$
      BEGIN
        IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'applications_idea_employee_role_key') THEN
          ALTER TABLE applications ADD CONSTRAINT applications_idea_employee_role_key UNIQUE (idea_id, employee_id, role_requirement_id);
        END IF;
      END
      $$;
    `

    // ── applications: resume and questionnaire ───────────────────────────────
    await sql`ALTER TABLE applications ADD COLUMN IF NOT EXISTS resume_url TEXT`
    await sql`ALTER TABLE applications ADD COLUMN IF NOT EXISTS questionnaire_answers JSONB`

    return NextResponse.json({ ok: true, message: "Migration applied successfully." })
  } catch (err) {
    console.error("[db/migrate]", err)
    return NextResponse.json({ ok: false, error: String(err) }, { status: 500 })
  }
}
