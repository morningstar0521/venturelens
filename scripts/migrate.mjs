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
