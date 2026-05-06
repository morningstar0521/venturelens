import { auth } from "@/auth"
import { redirect } from "next/navigation"

export async function requireFounderSession() {
  const session = await auth()

  // auth() validates the signed JWT session cookie before exposing the session.
  if (!session?.user) redirect("/login")
  if (session.user.role !== "founder") redirect("/dashboard")

  return session
}
