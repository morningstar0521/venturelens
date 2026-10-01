import { NextRequest } from "next/server"
import { auth } from "@/auth"

/**
 * Verifies that the incoming request is authorized to execute sensitive bootstrap/migration endpoints.
 * Requires either:
 *  1. An active session with role === 'admin'
 *  2. A matching secret passed via 'x-setup-secret' header or '?secret=' query param (checks SETUP_SECRET or AUTH_SECRET)
 */
export async function verifyBootstrapAccess(req: NextRequest): Promise<boolean> {
  const secretHeader = req.headers.get("x-setup-secret")
  const secretParam = req.nextUrl.searchParams.get("secret")
  const validSecret = process.env.SETUP_SECRET || process.env.AUTH_SECRET

  if (validSecret && (secretHeader === validSecret || secretParam === validSecret)) {
    return true
  }

  try {
    const session = await auth()
    if (session?.user?.role === "admin") {
      return true
    }
  } catch {
    // Session verification failed or not present
  }

  return false
}
