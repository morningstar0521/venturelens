import { neon } from "@neondatabase/serverless";
import dotenv from "dotenv";

dotenv.config();

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  console.error("DATABASE_URL is not set in environment variables or .env file.");
  process.exit(1);
}

const sql = neon(databaseUrl);

async function runMigration() {
  console.log("Running database migration...");
  try {
    // Add missing users columns
    await sql`ALTER TABLE users ADD COLUMN IF NOT EXISTS last_active_path TEXT`;
    console.log("✓ Added last_active_path column to users.");

    // Add ideas rich submission fields
    await sql`ALTER TABLE ideas ADD COLUMN IF NOT EXISTS problem_statement TEXT`;
    await sql`ALTER TABLE ideas ADD COLUMN IF NOT EXISTS solution TEXT`;
    await sql`ALTER TABLE ideas ADD COLUMN IF NOT EXISTS target_audience TEXT`;
    await sql`ALTER TABLE ideas ADD COLUMN IF NOT EXISTS revenue_model TEXT`;
    await sql`ALTER TABLE ideas ADD COLUMN IF NOT EXISTS ai_report JSONB`;
    await sql`ALTER TABLE ideas ADD COLUMN IF NOT EXISTS evaluated_at TIMESTAMPTZ`;
    console.log("✓ Added rich submission fields to ideas.");

    // Add role_requirements table
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
    `;
    await sql`ALTER TABLE applications ADD COLUMN IF NOT EXISTS role_requirement_id UUID REFERENCES role_requirements(id) ON DELETE SET NULL`;
    await sql`ALTER TABLE applications ADD COLUMN IF NOT EXISTS assigned_role VARCHAR(50)`;
    console.log("✓ Handled role_requirements and assigned_role.");

    // Drop the old unique constraint
    await sql`ALTER TABLE applications DROP CONSTRAINT IF EXISTS applications_idea_id_employee_id_key`;
    console.log("✓ Dropped old unique constraint.");

    // Add the new unique constraint if it doesn't exist (using a DO block for PostgreSQL)
    await sql`
      DO $$
      BEGIN
        IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'applications_idea_employee_role_key') THEN
          ALTER TABLE applications ADD CONSTRAINT applications_idea_employee_role_key UNIQUE (idea_id, employee_id, role_requirement_id);
        END IF;
      END
      $$;
    `;
    console.log("✓ Handled unique constraint.");

    // Add new columns for resume and questionnaire
    await sql`ALTER TABLE applications ADD COLUMN IF NOT EXISTS resume_url TEXT`;
    await sql`ALTER TABLE applications ADD COLUMN IF NOT EXISTS questionnaire_answers JSONB`;
    console.log("✓ Added resume and questionnaire columns.");

    console.log("Migration completed successfully.");
  } catch (error) {
    console.error("Migration failed:", error);
    process.exit(1);
  }
}

runMigration();
