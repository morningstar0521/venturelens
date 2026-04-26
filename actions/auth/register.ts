"use server"

import bcrypt from "bcryptjs"
import { FounderRegisterSchema, EmployeeRegisterSchema } from "@/lib/validations"
import { getUserByEmail, createUser } from "@/lib/db/users"

export type RegisterResult =
  | { success: string; error?: never }
  | { error: string; success?: never }

// ─── Founder Registration ─────────────────────────────────────────────────
export async function registerFounder(formData: FormData): Promise<RegisterResult> {
  const parsed = FounderRegisterSchema.safeParse({
    name:        formData.get("name"),
    email:       formData.get("email"),
    password:    formData.get("password"),
    confirmPassword: formData.get("confirmPassword"),
    startupName: formData.get("startupName"),
    terms:       formData.get("terms") === "true",
  })
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid fields." }
  }

  const { name, email, password, startupName } = parsed.data

  // Check duplicate email
  const existing = await getUserByEmail(email)
  if (existing) return { error: "An account with this email already exists." }

  const passwordHash = await bcrypt.hash(password, 12)
  await createUser({ name, email, passwordHash, role: "founder", startupName })

  return { success: "Founder account created! You can now sign in." }
}

// ─── Employee Registration ─────────────────────────────────────────────────
export async function registerEmployee(formData: FormData): Promise<RegisterResult> {
  const skillsRaw = formData.get("skills")
  const skills = typeof skillsRaw === "string" && skillsRaw.length > 0
    ? skillsRaw.split(",").map((s) => s.trim()).filter(Boolean)
    : []

  const parsed = EmployeeRegisterSchema.safeParse({
    name:        formData.get("name"),
    email:       formData.get("email"),
    password:    formData.get("password"),
    confirmPassword: formData.get("confirmPassword"),
    skills,
    experience:  formData.get("experience"),
  })
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid fields." }
  }

  const { name, email, password, experience } = parsed.data

  const existing = await getUserByEmail(email)
  if (existing) return { error: "An account with this email already exists." }

  const passwordHash = await bcrypt.hash(password, 12)
  await createUser({ name, email, passwordHash, role: "employee", skills, experience })

  return { success: "Employee account created! You can now sign in." }
}

// ─── Legacy generic register (kept for backward compat) ──────────────────
export async function register(): Promise<RegisterResult> {
  return { error: "Please use the role-specific registration flow." }
}
