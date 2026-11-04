import { neon, type NeonQueryFunction } from "@neondatabase/serverless"

// ─── Neon Serverless SQL Client ───────────────────────────────────────────
// This module is server-only. Never import from client components.
//
// The client is created lazily on first query. `neon()` throws immediately
// when DATABASE_URL is missing, and `next build` imports every route module
// while collecting page data, so a module-level `neon(...)` breaks any build
// that runs without DATABASE_URL (e.g. a Vercel Preview environment).
// With lazy init the build succeeds and a missing URL fails at query time.

type Sql = NeonQueryFunction<false, false>

let client: Sql | null = null

function getClient(): Sql {
  if (!client) {
    const url = process.env.DATABASE_URL
    if (!url) {
      throw new Error("DATABASE_URL is not set. Add it to your environment variables.")
    }
    client = neon(url)
  }
  return client
}

// Behaves exactly like the neon client: sql`...`, sql.query(...), sql.transaction(...)
export const sql = new Proxy((() => {}) as unknown as Sql, {
  apply: (_target, _this, args) => Reflect.apply(getClient() as unknown as (...a: unknown[]) => unknown, undefined, args),
  get: (_target, prop) => {
    // Don't connect just because something inspected the object (await, util.inspect, bundler interop)
    if (typeof prop === "symbol" || prop === "then") return undefined
    const value = Reflect.get(getClient() as object, prop)
    return typeof value === "function" ? value.bind(getClient()) : value
  },
})
