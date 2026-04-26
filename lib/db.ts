import { neon } from "@neondatabase/serverless"

// ─── Neon Serverless SQL Client ───────────────────────────────────────────
// This module is server-only. Never import from client components.
if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL environment variable is not set.")
}

export const sql = neon(process.env.DATABASE_URL)
