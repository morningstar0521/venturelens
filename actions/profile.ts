"use server"

import { auth } from "@/auth"
import { updateUserProfile } from "@/lib/db/users"
import { revalidatePath } from "next/cache"
import { z } from "zod"

const ProfileSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(100),
  startupName: z.string().max(200).optional(),
  skills: z.array(z.string().min(1)).max(20),
  experience: z.string().max(50).optional(),
})

export async function updateProfileAction(formData: FormData) {
  const session = await auth()
  if (!session?.user) throw new Error("Unauthorized")

  const skills = String(formData.get("skills") ?? "")
    .split(",")
    .map(skill => skill.trim())
    .filter(Boolean)

  const parsed = ProfileSchema.safeParse({
    name: formData.get("name"),
    startupName: String(formData.get("startupName") ?? ""),
    skills,
    experience: String(formData.get("experience") ?? ""),
  })

  if (!parsed.success) {
    return { error: parsed.error.issues[0].message }
  }

  try {
    await updateUserProfile(session.user.id, {
      name: parsed.data.name,
      startupName: session.user.role === "founder" ? parsed.data.startupName || null : null,
      skills: session.user.role === "employee" ? parsed.data.skills : null,
      experience: session.user.role === "employee" ? parsed.data.experience || null : null,
    })
  } catch {
    return { error: "Failed to update profile. Please try again." }
  }

  revalidatePath("/dashboard/founder/profile")
  revalidatePath("/dashboard/employee/profile")
  revalidatePath("/admin/dashboard/profile")
  revalidatePath("/dashboard/founder")
  revalidatePath("/dashboard/employee")
  revalidatePath("/admin/dashboard")

  return { success: true }
}
