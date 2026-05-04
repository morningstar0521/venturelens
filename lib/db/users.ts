import { sql } from "@/lib/db"

// ─── Types ────────────────────────────────────────────────────────────────
export type UserRole = "founder" | "employee" | "admin"

export interface DbUser {
  id: string
  name: string
  email: string
  password_hash: string
  role: UserRole
  startup_name: string | null
  skills: string[] | null
  experience: string | null
  is_active: boolean
  created_at: Date
}

// ─── Initialise DB (creates table if not exists) ─────────────────────────
// Call once from a server action or API route on first deploy.
export async function initDb() {
  await sql`
    CREATE TABLE IF NOT EXISTS users (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      name VARCHAR(100) NOT NULL,
      email VARCHAR(255) UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      role VARCHAR(20) NOT NULL CHECK (role IN ('founder', 'employee', 'admin')),
      startup_name VARCHAR(200),
      skills TEXT[],
      experience VARCHAR(50),
      is_active BOOLEAN DEFAULT TRUE,
      created_at TIMESTAMPTZ DEFAULT NOW()
    )
  `
}

// ─── Queries ──────────────────────────────────────────────────────────────
export async function getUserByEmail(email: string): Promise<DbUser | null> {
  const rows = await sql`
    SELECT * FROM users WHERE email = ${email} LIMIT 1
  `
  return (rows[0] as DbUser) ?? null
}

export async function createUser(data: {
  name: string
  email: string
  passwordHash: string
  role: UserRole
  startupName?: string
  skills?: string[]
  experience?: string
}): Promise<{ id: string }> {
  const rows = await sql`
    INSERT INTO users (name, email, password_hash, role, startup_name, skills, experience)
    VALUES (
      ${data.name},
      ${data.email},
      ${data.passwordHash},
      ${data.role},
      ${data.startupName ?? null},
      ${data.skills ? data.skills : null},
      ${data.experience ?? null}
    )
    RETURNING id
  `
  return rows[0] as { id: string }
}

export async function getAllUsers(): Promise<DbUser[]> {
  const rows = await sql`
    SELECT * FROM users ORDER BY created_at DESC
  `
  return rows as DbUser[]
}

export async function getUserById(id: string): Promise<DbUser | null> {
  const rows = await sql`
    SELECT * FROM users WHERE id = ${id} LIMIT 1
  `
  return (rows[0] as DbUser) ?? null
}

export async function updateUserStatus(id: string, isActive: boolean): Promise<void> {
  await sql`
    UPDATE users SET is_active = ${isActive} WHERE id = ${id}
  `
}

export async function updateUserProfile(
  id: string,
  data: { name?: string; skills?: string[]; experience?: string }
): Promise<void> {
  await sql`
    UPDATE users 
    SET 
      name       = COALESCE(${data.name ?? null}, name),
      skills     = ${data.skills ?? null},
      experience = ${data.experience ?? null}
    WHERE id = ${id}
  `
}
