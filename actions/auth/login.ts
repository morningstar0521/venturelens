"use server"

import { AuthError } from "next-auth"
import { signIn } from "@/auth"
import { LoginSchema } from "@/lib/validations"

export type LoginResult =
  | { success: string; error?: never }
  | { error: string; success?: never }

export async function login(formData: FormData): Promise<LoginResult> {
  // 1. Validate form data shape
  const parsed = LoginSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  })

  if (!parsed.success) {
    const firstError = parsed.error.issues[0]?.message
    return { error: firstError ?? "Invalid fields." }
  }

  const { email, password } = parsed.data

  // 2. Attempt sign in — auth logic lives in auth.ts authorize()
  try {
    await signIn("credentials", { email, password, redirect: false })
    return { success: "Signed in successfully!" }
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return { error: "Invalid email or password." }
        case "AccessDenied":
          return { error: "Access denied." }
        default:
          return { error: "Something went wrong. Please try again." }
      }
    }
    // Re-throw non-auth errors (e.g. network issues)
    throw error
  }
}
