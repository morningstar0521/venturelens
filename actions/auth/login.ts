"use server"

import { AuthError } from "next-auth"
import { signIn } from "@/auth"
import { LoginSchema } from "@/lib/validations"

export type LoginResult =
  | { success: string; error?: never }
  | { error: string; success?: never }

export async function login(formData: FormData): Promise<LoginResult> {
  // 1. Validate shape (role included)
  const parsed = LoginSchema.safeParse({
    email:    formData.get("email"),
    password: formData.get("password"),
    role:     formData.get("role"),
  })
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid fields." }
  }

  const { email, password, role } = parsed.data

  // 2. Attempt sign-in (auth logic is in auth.ts authorize())
  try {
    await signIn("credentials", { email, password, role, redirect: false })
    return { success: "Signed in successfully!" }
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin": return { error: "Invalid email or password." }
        case "AccessDenied":     return { error: "Access denied." }
        default:                 return { error: "Something went wrong. Please try again." }
      }
    }
    throw error
  }
}
