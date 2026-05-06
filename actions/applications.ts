"use server"

import { auth } from "@/auth"
import { applyToIdea, updateApplicationStatus, ApplicationStatus } from "@/lib/db/applications"
import { ApplicationSchema } from "@/lib/validations"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"

export async function applyToIdeaAction(ideaId: string, formData: FormData) {
  const session = await auth()
  if (!session?.user || session.user.role !== "employee") {
    throw new Error("Unauthorized")
  }

  const data = {
    message: formData.get("message") as string,
  }

  const parsed = ApplicationSchema.safeParse(data)
  if (!parsed.success) {
    return { error: parsed.error.issues[0].message }
  }

  try {
    await applyToIdea({
      ideaId,
      employeeId: session.user.id,
      message: parsed.data.message,
    })
    
    revalidatePath("/dashboard/employee/applications")
    revalidatePath("/dashboard/founder/applicants")
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Failed to apply"
    if (errorMessage.includes("unique constraint")) {
      return { error: "You have already applied to this idea" }
    }
    return { error: "Failed to apply" }
  }

  redirect("/dashboard/employee/applications")
}

export async function updateApplicationStatusAction(applicationId: string, status: ApplicationStatus) {
  const session = await auth()
  if (!session?.user || session.user.role !== "founder") {
    throw new Error("Unauthorized")
  }

  try {
    // In a real app we'd also verify the founder owns the idea this application is for
    await updateApplicationStatus(applicationId, status)
    revalidatePath("/dashboard/founder/applicants")
    revalidatePath("/dashboard/employee/applications")
  } catch {
    return { error: "Failed to update status" }
  }
}
