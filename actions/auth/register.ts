"use server"

import bcrypt from "bcryptjs"
import { RegisterSchema } from "@/lib/validations"

export type RegisterResult =
  | { success: string; error?: never }
  | { error: string; success?: never }

export async function register(formData: FormData): Promise<RegisterResult> {
  // 1. Parse and validate form data
  const parsed = RegisterSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    password: formData.get("password"),
    confirmPassword: formData.get("confirmPassword"),
  })

  if (!parsed.success) {
    const firstError = parsed.error.issues[0]?.message
    return { error: firstError ?? "Invalid fields." }
  }

  const { name, email, password } = parsed.data

  // 2. Hash password
  const hashedPassword = await bcrypt.hash(password, 12)

  // ─── TODO (Phase 2): Replace with Supabase queries ───────────────
  // Check if user already exists:
  // const existing = await prisma.user.findUnique({ where: { email } })
  // if (existing) return { error: "An account with this email already exists." }
  //
  // Create the new user:
  // await prisma.user.create({
  //   data: { name, email, password: hashedPassword, role: "user" },
  // })
  // ─────────────────────────────────────────────────────────────────

  // MOCK: Log what would be saved — remove this block in Phase 2
  console.log("[MOCK] Would create user →", { name, email, hashedPassword })

  return { success: "Account created! You can now sign in." }
}
