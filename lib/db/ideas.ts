import { sql } from "@/lib/db"

export type IdeaStage = "idea" | "mvp" | "growth"
export type IdeaStatus = "pending" | "approved" | "rejected"

export interface DbIdea {
  id: string
  founder_id: string
  title: string
  description: string
  industry: string | null
  stage: IdeaStage
  venture_score: number | null
  status: IdeaStatus
  created_at: Date
}

export async function initIdeasDb() {
  await sql`
    CREATE TABLE IF NOT EXISTS ideas (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      founder_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      title VARCHAR(200) NOT NULL,
      description TEXT NOT NULL,
      industry VARCHAR(100),
      stage VARCHAR(50) DEFAULT 'idea',
      venture_score INT,
      status VARCHAR(50) DEFAULT 'pending',
      created_at TIMESTAMPTZ DEFAULT NOW()
    )
  `
}

export async function createIdea(data: {
  founderId: string
  title: string
  description: string
  industry?: string
  stage?: IdeaStage
}): Promise<{ id: string }> {
  const rows = await sql`
    INSERT INTO ideas (founder_id, title, description, industry, stage)
    VALUES (
      ${data.founderId},
      ${data.title},
      ${data.description},
      ${data.industry ?? null},
      ${data.stage ?? "idea"}
    )
    RETURNING id
  `
  return rows[0] as { id: string }
}

export async function getIdeasByFounder(founderId: string): Promise<DbIdea[]> {
  const rows = await sql`
    SELECT * FROM ideas WHERE founder_id = ${founderId} ORDER BY created_at DESC
  `
  return rows as DbIdea[]
}

export async function getAllIdeas(): Promise<DbIdea[]> {
  const rows = await sql`
    SELECT * FROM ideas ORDER BY created_at DESC
  `
  return rows as DbIdea[]
}

export async function updateIdeaStatus(id: string, status: IdeaStatus): Promise<void> {
  await sql`
    UPDATE ideas SET status = ${status} WHERE id = ${id}
  `
}

export async function getPublicIdeas(): Promise<DbIdea[]> {
  const rows = await sql`
    SELECT * FROM ideas WHERE status = 'approved' ORDER BY created_at DESC
  `
  return rows as DbIdea[]
}
