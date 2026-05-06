import { sql } from "@/lib/db"

export type ApplicationStatus = "pending" | "shortlisted" | "accepted" | "rejected"
export type AssignedRole = "CTO" | "Developer" | "Designer" | "Marketing" | "Sales" | "Operations"

export interface DbApplication {
  id: string
  idea_id: string
  employee_id: string
  role_requirement_id: string | null
  role_title?: string // Joined from role_requirements
  message: string | null
  resume_url?: string
  questionnaire_answers?: Record<string, string>
  status: ApplicationStatus
  assigned_role: AssignedRole | null
  created_at: Date
}

export async function initApplicationsDb() {
  await sql`
    CREATE TABLE IF NOT EXISTS applications (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      idea_id UUID NOT NULL REFERENCES ideas(id) ON DELETE CASCADE,
      employee_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      role_requirement_id UUID REFERENCES role_requirements(id) ON DELETE SET NULL,
      message TEXT,
      status VARCHAR(50) DEFAULT 'pending',
      assigned_role VARCHAR(50),
      created_at TIMESTAMPTZ DEFAULT NOW(),
      UNIQUE(idea_id, employee_id, role_requirement_id)
    )
  `
}

export async function applyToIdea(data: {
  ideaId: string
  employeeId: string
  message?: string
  resumeUrl?: string
  questionnaireAnswers?: Record<string, string>
}): Promise<{ id: string }> {
  const rows = await sql`
    INSERT INTO applications (idea_id, employee_id, message, resume_url, questionnaire_answers)
    VALUES (${data.ideaId}, ${data.employeeId}, ${data.message ?? null}, ${data.resumeUrl ?? null}, ${data.questionnaireAnswers ? JSON.stringify(data.questionnaireAnswers) : null})
    ON CONFLICT (idea_id, employee_id, role_requirement_id) WHERE role_requirement_id IS NULL 
    DO UPDATE SET 
      message = EXCLUDED.message,
      resume_url = EXCLUDED.resume_url,
      questionnaire_answers = EXCLUDED.questionnaire_answers
    RETURNING id
  `
  return rows[0] as { id: string }
}

export async function getApplicationsByEmployee(employeeId: string): Promise<DbApplication[]> {
  const rows = await sql`
    SELECT a.*, r.role_title
    FROM applications a
    LEFT JOIN role_requirements r ON a.role_requirement_id = r.id
    WHERE a.employee_id = ${employeeId} 
    ORDER BY a.created_at DESC
  `
  return rows as DbApplication[]
}

export async function getApplicationsForIdea(ideaId: string): Promise<DbApplication[]> {
  const rows = await sql`
    SELECT a.*, r.role_title
    FROM applications a
    LEFT JOIN role_requirements r ON a.role_requirement_id = r.id
    WHERE a.idea_id = ${ideaId} 
    ORDER BY a.created_at DESC
  `
  return rows as DbApplication[]
}

export async function getApplicationsForFounder(founderIdeas: string[]): Promise<DbApplication[]> {
  if (founderIdeas.length === 0) return []
  const rows = await sql`
    SELECT a.*, r.role_title
    FROM applications a
    LEFT JOIN role_requirements r ON a.role_requirement_id = r.id
    WHERE a.idea_id = ANY(${founderIdeas}::uuid[])
    ORDER BY a.created_at DESC
  `
  return rows as DbApplication[]
}

export async function updateApplicationStatus(id: string, status: ApplicationStatus): Promise<void> {
  await sql`
    UPDATE applications SET status = ${status} WHERE id = ${id}
  `
}

export async function updateApplicationRole(id: string, role: AssignedRole): Promise<void> {
  await sql`
    UPDATE applications SET assigned_role = ${role} WHERE id = ${id}
  `
}

export async function applyToRole(data: {
  ideaId: string
  roleRequirementId: string
  employeeId: string
  message?: string
  resumeUrl?: string
  questionnaireAnswers?: Record<string, string>
}): Promise<{ id: string }> {
  const rows = await sql`
    INSERT INTO applications (idea_id, role_requirement_id, employee_id, message, resume_url, questionnaire_answers)
    VALUES (${data.ideaId}, ${data.roleRequirementId}, ${data.employeeId}, ${data.message ?? null}, ${data.resumeUrl ?? null}, ${data.questionnaireAnswers ? JSON.stringify(data.questionnaireAnswers) : null})
    ON CONFLICT (idea_id, employee_id, role_requirement_id) 
    DO UPDATE SET 
      message = EXCLUDED.message,
      resume_url = EXCLUDED.resume_url,
      questionnaire_answers = EXCLUDED.questionnaire_answers
    RETURNING id
  `
  return rows[0] as { id: string }
}

export async function shortlistApplication(id: string): Promise<void> {
  await sql`UPDATE applications SET status = 'shortlisted' WHERE id = ${id}`
}

export async function getApplicationsByRole(roleRequirementId: string): Promise<DbApplication[]> {
  const rows = await sql`
    SELECT * FROM applications WHERE role_requirement_id = ${roleRequirementId} ORDER BY created_at DESC
  `
  return rows as DbApplication[]
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
