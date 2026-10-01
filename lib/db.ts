import { neon } from "@neondatabase/serverless"

// ─── Neon Serverless SQL Client ───────────────────────────────────────────
// This module is server-only. Never import from client components.
// Note: We avoid a module-level throw so `next build` can complete without
// a live DATABASE_URL. The Neon client will throw at query time if the URL
// is missing or invalid.
export const sql = neon(process.env.DATABASE_URL!)
