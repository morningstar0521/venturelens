"use server"

import { auth } from "@/auth"
import { sql } from "@/lib/db"

export async function saveActivePathAction(path: string) {
  const session = await auth()
  if (!session?.user?.id) return

  await sql`
    UPDATE users SET last_active_path = ${path} WHERE id = ${session.user.id}
  `
}
