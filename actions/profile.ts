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
  _prev: ProfileActionState | null | undefined | FormData,
  formData?: FormData
): Promise<ProfileActionState> {
  // Support both (formData) and (_prev, formData) signatures
  const actualFormData = _prev instanceof FormData ? _prev : formData;
  if (!actualFormData) {
    return { success: false, message: "No form data provided" };
  }

  const session = await auth()
  if (!session?.user?.id) {
    return { success: false, message: "Unauthorized" }
  }

  // Parse skills from comma-separated string
  const rawSkills = (actualFormData.get("skills") as string | null) ?? ""
  const skills = rawSkills
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean)

  const raw = {
    name: actualFormData.get("name"),
    skills,
    experience: actualFormData.get("experience"),
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
    await updateUserProfile(session.user.id, {
      name: parsed.data.name,
      skills: parsed.data.skills,
      experience: parsed.data.experience,
    })
    revalidatePath("/dashboard/employee/profile")
    revalidatePath("/dashboard/employee")
    return { success: true, message: "Profile updated successfully!" }
  } catch {
    return { success: false, message: "Something went wrong. Please try again." }
  }
}
