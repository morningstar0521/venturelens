// ─── One-time admin seeding endpoint ─────────────────────────────────────────
// Hit GET /api/db/seed-admin once to insert the admin user into the DB.
// Safe to call multiple times – skips insert if admin already exists.
import { NextRequest, NextResponse } from "next/server"
import bcrypt from "bcryptjs"
import { getUserByEmail, createUser } from "@/lib/db/users"
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
    const isProd = process.env.NODE_ENV === "production"
    const email = process.env.ADMIN_EMAIL ?? (!isProd ? "admin@venturelens.ai" : "")
    const password = process.env.ADMIN_PASSWORD ?? (!isProd ? "Admin@VL2024!" : "")
    const name = "Admin"

    if (!email || !password) {
      return NextResponse.json(
        { ok: false, error: "ADMIN_EMAIL and ADMIN_PASSWORD environment variables must be defined." },
        { status: 400 }
      )
    }

    if (isProd && (password === "Admin@VL2024!" || password.length < 10)) {
      return NextResponse.json(
        { ok: false, error: "In production, ADMIN_PASSWORD must not be the default and must be at least 10 characters." },
        { status: 400 }
      )
    }

    // Skip if already exists
    const existing = await getUserByEmail(email)
    if (existing) {
      return NextResponse.json({ ok: true, message: "Admin user already exists.", email })
    }

    const passwordHash = await bcrypt.hash(password, 12)
    await createUser({ name, email, passwordHash, role: "admin" })

    return NextResponse.json({ ok: true, message: "Admin user created successfully.", email })
  } catch (err) {
    console.error("[db/seed-admin]", err)
    return NextResponse.json({ ok: false, error: String(err) }, { status: 500 })
  }
}
