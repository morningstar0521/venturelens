// ─── One-time admin seeding endpoint ─────────────────────────────────────────
// Hit GET /api/db/seed-admin once to insert the admin user into the DB.
// Safe to call multiple times – skips insert if admin already exists.
import { NextResponse } from "next/server"
import bcrypt from "bcryptjs"
import { getUserByEmail, createUser } from "@/lib/db/users"

export async function GET() {
  try {
    const email    = process.env.ADMIN_EMAIL    ?? "admin@venturelens.ai"
    const password = process.env.ADMIN_PASSWORD ?? "Admin@VL2024!"
    const name     = "Admin"

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
