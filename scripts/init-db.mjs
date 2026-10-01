import { neon } from "@neondatabase/serverless";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";

dotenv.config();

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  console.error("❌ DATABASE_URL is not set in environment variables or .env file.");
  process.exit(1);
}

const sql = neon(databaseUrl);

async function initDatabase() {
  console.log("🚀 Initializing VentureLens database on Neon...");

  try {
    // 1. Users table
    console.log("Creating 'users' table...");
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
        last_active_path TEXT,
        created_at TIMESTAMPTZ DEFAULT NOW()
      )
    `;
    await sql`ALTER TABLE users ADD COLUMN IF NOT EXISTS last_active_path TEXT`;
    console.log("✓ 'users' table ready.");

    // 2. Ideas table
    console.log("Creating 'ideas' table...");
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
    `;
    await sql`ALTER TABLE ideas ADD COLUMN IF NOT EXISTS problem_statement TEXT`;
    await sql`ALTER TABLE ideas ADD COLUMN IF NOT EXISTS solution TEXT`;
    await sql`ALTER TABLE ideas ADD COLUMN IF NOT EXISTS target_audience TEXT`;
    await sql`ALTER TABLE ideas ADD COLUMN IF NOT EXISTS revenue_model TEXT`;
    await sql`ALTER TABLE ideas ADD COLUMN IF NOT EXISTS ai_report JSONB`;
    await sql`ALTER TABLE ideas ADD COLUMN IF NOT EXISTS evaluated_at TIMESTAMPTZ`;
    console.log("✓ 'ideas' table ready.");

    // 3. Role requirements table
    console.log("Creating 'role_requirements' table...");
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
    console.log("✓ 'role_requirements' table ready.");

    // 4. Applications table
    console.log("Creating 'applications' table...");
    await sql`
      CREATE TABLE IF NOT EXISTS applications (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        idea_id UUID NOT NULL REFERENCES ideas(id) ON DELETE CASCADE,
        employee_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        role_requirement_id UUID REFERENCES role_requirements(id) ON DELETE SET NULL,
        message TEXT,
        status VARCHAR(50) DEFAULT 'pending',
        assigned_role VARCHAR(50),
        resume_url TEXT,
        questionnaire_answers JSONB,
        created_at TIMESTAMPTZ DEFAULT NOW(),
        UNIQUE(idea_id, employee_id, role_requirement_id)
      )
    `;
    await sql`ALTER TABLE applications ADD COLUMN IF NOT EXISTS role_requirement_id UUID REFERENCES role_requirements(id) ON DELETE SET NULL`;
    await sql`ALTER TABLE applications ADD COLUMN IF NOT EXISTS assigned_role VARCHAR(50)`;
    await sql`ALTER TABLE applications ADD COLUMN IF NOT EXISTS resume_url TEXT`;
    await sql`ALTER TABLE applications ADD COLUMN IF NOT EXISTS questionnaire_answers JSONB`;

    // Drop legacy constraint if present
    await sql`ALTER TABLE applications DROP CONSTRAINT IF EXISTS applications_idea_id_employee_id_key`;
    console.log("✓ 'applications' table ready.");

    // 5. Seed admin user
    const isProd = process.env.NODE_ENV === "production";
    const adminEmail = process.env.ADMIN_EMAIL ?? (!isProd ? "admin@venturelens.ai" : "");
    const adminPassword = process.env.ADMIN_PASSWORD ?? (!isProd ? "Admin@VL2024!" : "");
    const adminName = "Admin";

    if (!adminEmail || !adminPassword) {
      console.warn("⚠️ ADMIN_EMAIL and ADMIN_PASSWORD must be set to seed admin. Skipping admin seeding.");
    } else if (isProd && (adminPassword === "Admin@VL2024!" || adminPassword.length < 10)) {
      console.warn("⚠️ Production warning: Default or short ADMIN_PASSWORD detected. Skipping default admin seeding for safety.");
    } else {
      const existingAdmin = await sql`SELECT id FROM users WHERE email = ${adminEmail} LIMIT 1`;
      if (existingAdmin.length > 0) {
        console.log(`ℹ Admin user (${adminEmail}) already exists.`);
      } else {
        console.log(`Creating admin user (${adminEmail})...`);
        const hash = await bcrypt.hash(adminPassword, 12);
        await sql`
          INSERT INTO users (name, email, password_hash, role)
          VALUES (${adminName}, ${adminEmail}, ${hash}, 'admin')
        `;
        console.log(`✓ Admin user created successfully (${adminEmail}).`);
      }
    }

    console.log("\n🎉 Database initialization and schema migration completed successfully!");
  } catch (error) {
    console.error("❌ Database initialization failed:", error);
    process.exit(1);
  }
}

initDatabase();
