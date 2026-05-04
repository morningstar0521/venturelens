import { sql } from "@/lib/db"

export type ApplicationStatus = "pending" | "accepted" | "rejected"

export interface DbApplication {
  id: string
  idea_id: string
  employee_id: string
  message: string | null
  status: ApplicationStatus
  created_at: Date
}

export async function initApplicationsDb() {
  await sql`
    CREATE TABLE IF NOT EXISTS applications (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      idea_id UUID NOT NULL REFERENCES ideas(id) ON DELETE CASCADE,
      employee_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      message TEXT,
      status VARCHAR(50) DEFAULT 'pending',
      created_at TIMESTAMPTZ DEFAULT NOW(),
      UNIQUE(idea_id, employee_id)
    )
  `
}

export async function applyToIdea(data: {
  ideaId: string
  employeeId: string
  message?: string
}): Promise<{ id: string }> {
  const rows = await sql`
    INSERT INTO applications (idea_id, employee_id, message)
    VALUES (${data.ideaId}, ${data.employeeId}, ${data.message ?? null})
    RETURNING id
  `
  return rows[0] as { id: string }
}

export async function getApplicationsByEmployee(employeeId: string): Promise<DbApplication[]> {
  const rows = await sql`
    SELECT * FROM applications WHERE employee_id = ${employeeId} ORDER BY created_at DESC
  `
  return rows as DbApplication[]
}

export async function getApplicationsForIdea(ideaId: string): Promise<DbApplication[]> {
  const rows = await sql`
    SELECT * FROM applications WHERE idea_id = ${ideaId} ORDER BY created_at DESC
  `
  return rows as DbApplication[]
}

export async function updateApplicationStatus(id: string, status: ApplicationStatus): Promise<void> {
  await sql`
    UPDATE applications SET status = ${status} WHERE id = ${id}
  `
}

export async function deleteApplication(id: string, employeeId: string): Promise<boolean> {
  const rows = await sql`
    DELETE FROM applications
    WHERE id = ${id}
      AND employee_id = ${employeeId}
      AND status = 'pending'
    RETURNING id
  `
  return rows.length > 0
}
