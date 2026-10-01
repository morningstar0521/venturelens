// ─── One-time DB initialisation endpoint ──────────────────────────────────
// Hit GET /api/db/init once after deployment to create the users table.
// Protect this with a secret in production.
import { NextRequest, NextResponse } from "next/server"
import { initDb } from "@/lib/db/users"
import { initIdeasDb } from "@/lib/db/ideas"
import { initApplicationsDb } from "@/lib/db/applications"
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
    await initDb()
    await initIdeasDb()
    await initApplicationsDb()
    return NextResponse.json({ ok: true, message: "Database tables initialised successfully." })
  } catch (err) {
    console.error("[db/init]", err)
    return NextResponse.json({ ok: false, error: String(err) }, { status: 500 })
  }
}
