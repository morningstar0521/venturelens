"use server"

import { auth } from "@/auth"
import { applyToIdea, applyToRole, updateApplicationStatus, updateApplicationRole, shortlistApplication, deleteApplication, ApplicationStatus, AssignedRole } from "@/lib/db/applications"
import { ApplicationSchema } from "@/lib/validations"
import { revalidatePath } from "next/cache"

export async function applyToIdeaAction(ideaId: string, formData: FormData) {
  const session = await auth()
  if (!session?.user || session.user.role !== "employee") {
    throw new Error("Unauthorized")
  }

  const data = { message: formData.get("message") as string }
  const parsed = ApplicationSchema.safeParse(data)
  if (!parsed.success) {
    return { error: parsed.error.issues[0].message }
  }

  try {
    await applyToIdea({
      ideaId,
      employeeId: session.user.id,
      message:    parsed.data.message,
    })
    revalidatePath("/dashboard/employee/applications")
    revalidatePath("/dashboard/founder/applicants")
  } catch {
    return { error: "Failed to apply. You may have already applied to this idea." }
  }
}

export async function updateApplicationStatusAction(id: string, status: ApplicationStatus) {
  const session = await auth()
  if (!session?.user || session.user.role !== "founder") {
    throw new Error("Unauthorized")
  }

  try {
    await updateApplicationStatus(id, status)
    revalidatePath("/dashboard/founder/applicants")
    revalidatePath("/dashboard/employee/applications")
  } catch {
    return { error: "Failed to update application status" }
  }
}

export async function assignRoleAction(applicationId: string, role: AssignedRole) {
  const session = await auth()
  if (!session?.user || session.user.role !== "founder") {
    throw new Error("Unauthorized")
  }

  try {
    await updateApplicationRole(applicationId, role)
    revalidatePath("/dashboard/founder/applicants")
  } catch {
    return { error: "Failed to assign role" }
  }
}

export async function applyToRoleAction(ideaId: string, roleRequirementId: string, formData: FormData) {
  const session = await auth()
  if (!session?.user || session.user.role !== "employee") {
    throw new Error("Unauthorized")
  }

  const message = (formData.get("message") as string) ?? ""
  try {
    await applyToRole({ ideaId, roleRequirementId, employeeId: session.user.id, message })
    revalidatePath("/dashboard/employee/applications")
    revalidatePath("/dashboard/founder/applicants")
  } catch {
    return { error: "Failed to apply. You may have already applied to this idea." }
  }
}

export async function shortlistApplicationAction(id: string) {
  const session = await auth()
  if (!session?.user || session.user.role !== "founder") {
    throw new Error("Unauthorized")
  }
  try {
    await shortlistApplication(id)
    revalidatePath("/dashboard/founder/applicants")
    revalidatePath("/dashboard/employee/applications")
  } catch {
    return { error: "Failed to shortlist" }
  }
}

export async function cancelApplicationAction(applicationId: string) {
  const session = await auth()
  if (!session?.user || session.user.role !== "employee") {
    throw new Error("Unauthorized")
  }

  const deleted = await deleteApplication(applicationId, session.user.id)
  if (!deleted) {
    return { error: "Could not cancel — application may already be reviewed." }
  }

  revalidatePath("/dashboard/employee/applications")
}
