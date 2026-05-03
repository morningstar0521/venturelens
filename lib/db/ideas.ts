import { sql } from "@/lib/db"
import { EvaluationReport } from "@/lib/ai/evaluate"

export type IdeaStage  = "idea" | "mvp" | "growth"
export type IdeaStatus = "pending" | "evaluating" | "approved" | "rejected"

export interface DbIdea {
  id: string
  founder_id: string
  title: string
  description: string
  problem_statement: string | null
  solution: string | null
  target_audience: string | null
  revenue_model: string | null
  industry: string | null
  stage: IdeaStage
  venture_score: number | null
  ai_report: EvaluationReport | null
  status: IdeaStatus
  evaluated_at: Date | null
  created_at: Date
}

export async function initIdeasDb() {
  await sql`
    CREATE TABLE IF NOT EXISTS ideas (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      founder_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      title VARCHAR(200) NOT NULL,
      description TEXT NOT NULL,
      problem_statement TEXT,
      solution TEXT,
      target_audience TEXT,
      revenue_model TEXT,
      industry VARCHAR(100),
      stage VARCHAR(50) DEFAULT 'idea',
      venture_score INT,
      ai_report JSONB,
      status VARCHAR(50) DEFAULT 'pending',
      evaluated_at TIMESTAMPTZ,
      created_at TIMESTAMPTZ DEFAULT NOW()
    )
  `
}

export async function createIdea(data: {
  founderId: string
  title: string
  description: string
  problemStatement?: string
  solution?: string
  targetAudience?: string
  revenueModel?: string
  industry?: string
  stage?: IdeaStage
}): Promise<{ id: string }> {
  const rows = await sql`
    INSERT INTO ideas (
      founder_id, title, description,
      problem_statement, solution, target_audience, revenue_model,
      industry, stage, status
    )
    VALUES (
      ${data.founderId},
      ${data.title},
      ${data.description},
      ${data.problemStatement ?? null},
      ${data.solution ?? null},
      ${data.targetAudience ?? null},
      ${data.revenueModel ?? null},
      ${data.industry ?? null},
      ${data.stage ?? "idea"},
      'evaluating'
    )
    RETURNING id
  `
  return rows[0] as { id: string }
}

export async function getIdeaById(id: string): Promise<DbIdea | null> {
  const rows = await sql`
    SELECT * FROM ideas WHERE id = ${id} LIMIT 1
  `
  return (rows[0] as DbIdea) ?? null
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

export async function updateIdeaReport(
  id: string,
  data: { aiReport: EvaluationReport; ventureScore: number; status: IdeaStatus }
): Promise<void> {
  await sql`
    UPDATE ideas
    SET
      ai_report    = ${JSON.stringify(data.aiReport)},
      venture_score = ${data.ventureScore},
      status        = ${data.status},
      evaluated_at  = NOW()
    WHERE id = ${id}
  `
}

export async function getPublicIdeas(): Promise<DbIdea[]> {
  const rows = await sql`
    SELECT * FROM ideas WHERE status = 'approved' ORDER BY created_at DESC
  `
  return rows as DbIdea[]
}
