/**
 * Returns the correct base URL for the current environment.
 *
 * Priority:
 * 1. AUTH_URL / NEXTAUTH_URL  (explicit override — always wins)
 * 2. VERCEL_URL               (auto-set by Vercel for every deployment)
 * 3. http://localhost:3000    (local fallback only)
 */
export function getBaseUrl(): string {
  // Explicit override wins (set this in Vercel env vars to your production URL)
  if (process.env.AUTH_URL)      return process.env.AUTH_URL.replace(/\/$/, "")
  if (process.env.NEXTAUTH_URL)  return process.env.NEXTAUTH_URL.replace(/\/$/, "")

  // Vercel auto-injects this for every deployment (preview + production)
  if (process.env.VERCEL_URL)    return `https://${process.env.VERCEL_URL}`

  // Local fallback
  return "http://localhost:3000"
}
