// ─── One-time DB initialisation endpoint ──────────────────────────────────
// Hit GET /api/db/init once after deployment to create the users table.
// Protect this with a secret in production.
import { NextResponse } from "next/server"
import { initDb } from "@/lib/db/users"

export async function GET() {
  try {
    await initDb()
    return NextResponse.json({ ok: true, message: "Database initialised successfully." })
  } catch (err) {
    console.error("[db/init]", err)
    return NextResponse.json({ ok: false, error: String(err) }, { status: 500 })
  }
}
