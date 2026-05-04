import { sql } from "@/lib/db"

export type RoleCategory    = "Tech" | "Marketing" | "Product" | "Ops" | "Design" | "Finance" | "Sales"
export type ExperienceLevel = "junior" | "mid" | "senior" | "lead"

export interface DbRole {
  id: string
  idea_id: string
  role_title: string
  category: RoleCategory
  experience_level: ExperienceLevel
  skills: string[]
  description: string | null
  openings: number
  ai_suggested: boolean
  created_at: Date
}

// ── Table init (called from /api/db/migrate) ──────────────────────────────────

export async function initRolesDb() {
  await sql`
    CREATE TABLE IF NOT EXISTS role_requirements (
      id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      idea_id          UUID NOT NULL REFERENCES ideas(id) ON DELETE CASCADE,
      role_title       VARCHAR(100) NOT NULL,
      category         VARCHAR(50)  NOT NULL DEFAULT 'Tech',
      experience_level VARCHAR(50)  NOT NULL DEFAULT 'mid',
      skills           JSONB        NOT NULL DEFAULT '[]',
      description      TEXT,
      openings         INT          NOT NULL DEFAULT 1,
      ai_suggested     BOOLEAN      NOT NULL DEFAULT FALSE,
      created_at       TIMESTAMPTZ  DEFAULT NOW()
    )
  `
  // Add role_requirement_id to applications if not present
  await sql`
    ALTER TABLE applications
    ADD COLUMN IF NOT EXISTS role_requirement_id UUID REFERENCES role_requirements(id) ON DELETE SET NULL
  `
  // Extend status to include shortlisted (no constraint — just convention)
}

// ── CRUD ──────────────────────────────────────────────────────────────────────

export async function createRole(data: {
  ideaId: string
  roleTitle: string
  category: RoleCategory
  experienceLevel: ExperienceLevel
  skills: string[]
  description?: string
  openings?: number
  aiSuggested?: boolean
}): Promise<{ id: string }> {
  const rows = await sql`
    INSERT INTO role_requirements
      (idea_id, role_title, category, experience_level, skills, description, openings, ai_suggested)
    VALUES
      (${data.ideaId}, ${data.roleTitle}, ${data.category}, ${data.experienceLevel},
       ${JSON.stringify(data.skills)}::jsonb, ${data.description ?? null},
       ${data.openings ?? 1}, ${data.aiSuggested ?? false})
    RETURNING id
  `
  return rows[0] as { id: string }
}

export async function getRolesByIdea(ideaId: string): Promise<DbRole[]> {
  const rows = await sql`
    SELECT * FROM role_requirements WHERE idea_id = ${ideaId} ORDER BY created_at ASC
  `
  return rows as DbRole[]
}

export async function updateRole(id: string, data: {
  roleTitle?: string
  category?: RoleCategory
  experienceLevel?: ExperienceLevel
  skills?: string[]
  description?: string
  openings?: number
}): Promise<void> {
  await sql`
    UPDATE role_requirements
    SET
      role_title       = COALESCE(${data.roleTitle       ?? null}, role_title),
      category         = COALESCE(${data.category        ?? null}, category),
      experience_level = COALESCE(${data.experienceLevel ?? null}, experience_level),
      skills           = COALESCE(${data.skills ? JSON.stringify(data.skills) : null}::jsonb, skills),
      description      = COALESCE(${data.description     ?? null}, description),
      openings         = COALESCE(${data.openings        ?? null}, openings)
    WHERE id = ${id}
  `
}

export async function deleteRole(id: string): Promise<void> {
  await sql`DELETE FROM role_requirements WHERE id = ${id}`
}

export async function bulkReplaceRoles(ideaId: string, roles: Array<{
  roleTitle: string
  category: RoleCategory
  experienceLevel: ExperienceLevel
  skills: string[]
  description?: string
  openings: number
  aiSuggested?: boolean
}>): Promise<void> {
  // Delete old, insert new (simple replace strategy)
  await sql`DELETE FROM role_requirements WHERE idea_id = ${ideaId}`
  for (const r of roles) {
    await createRole({ ideaId, ...r })
  }
}
