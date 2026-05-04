"use server"

import { auth } from "@/auth"
import { updateUserProfile } from "@/lib/db/users"
import { UpdateProfileSchema } from "@/lib/validations"
import { revalidatePath } from "next/cache"

export type ProfileActionState = {
  success: boolean
  message: string
  errors?: Record<string, string[]>
}

export async function updateProfileAction(
  _prev: ProfileActionState,
  formData: FormData
): Promise<ProfileActionState> {
  const session = await auth()
  if (!session?.user?.id) {
    return { success: false, message: "Unauthorized" }
  }

  // Parse skills from comma-separated string
  const rawSkills = (formData.get("skills") as string | null) ?? ""
  const skills = rawSkills
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean)

  const raw = {
    name: formData.get("name"),
    skills,
    experience: formData.get("experience"),
  }

  const parsed = UpdateProfileSchema.safeParse(raw)
  if (!parsed.success) {
    return {
      success: false,
      message: "Please fix the errors below.",
      errors: parsed.error.flatten().fieldErrors as Record<string, string[]>,
    }
  }

  try {
    await updateUserProfile(session.user.id, parsed.data)
    revalidatePath("/dashboard/employee/profile")
    return { success: true, message: "Profile updated successfully!" }
  } catch {
    return { success: false, message: "Something went wrong. Please try again." }
  }
}
