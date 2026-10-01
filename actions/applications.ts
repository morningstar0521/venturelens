"use server"

import { auth } from "@/auth"
import { 
  applyToIdea, 
  applyToRole, 
  updateApplicationStatus, 
  updateApplicationRole, 
  shortlistApplication, 
  deleteApplication, 
  getApplicationById,
  ApplicationStatus, 
  AssignedRole 
} from "@/lib/db/applications"
import { getIdeaById } from "@/lib/db/ideas"
import { ApplicationSchema } from "@/lib/validations"
import { revalidatePath } from "next/cache"

function validateResume(resumeUrl?: string | null): string | null {
  if (!resumeUrl || resumeUrl.trim() === "") return null

  // If external URL (e.g. https://... or http://...)
  if (/^https?:\/\//i.test(resumeUrl)) {
    if (resumeUrl.length > 2048) {
      return "Resume URL is too long."
    }
    return null
  }

  // Base64 Data URI check
  // 1. Size check (~2 MB binary = ~2.8 MB base64 string)
  const MAX_BASE64_LENGTH = 3 * 1024 * 1024 // 3 MB string limit
  if (resumeUrl.length > MAX_BASE64_LENGTH) {
    return "Resume file size exceeds the 2 MB limit."
  }

  // 2. Allowed document MIME types
  const allowedPrefixes = [
    "data:application/pdf;base64,",
    "data:application/msword;base64,",
    "data:application/vnd.openxmlformats-officedocument.wordprocessingml.document;base64,",
    "data:text/plain;base64,"
  ]

  const isAllowedType = allowedPrefixes.some(prefix => resumeUrl.toLowerCase().startsWith(prefix))
  if (!isAllowedType) {
    return "Invalid resume format. Only PDF, DOC, DOCX, or TXT files are accepted."
  }

  return null
}

export async function applyToIdeaAction(ideaId: string, formData: FormData) {
  const session = await auth()
  if (!session?.user || session.user.role !== "employee") {
    throw new Error("Unauthorized")
  }

  const message = formData.get("message") as string
  const resumeUrl = formData.get("resumeUrl") as string
  const questionnaireAnswersRaw = formData.get("questionnaireAnswers") as string

  const resumeError = validateResume(resumeUrl)
  if (resumeError) {
    return { error: resumeError }
  }

  let questionnaireAnswers = {}
  try {
    questionnaireAnswers = questionnaireAnswersRaw ? JSON.parse(questionnaireAnswersRaw) : {}
  } catch (e) {}

  try {
    await applyToIdea({
      ideaId,
      employeeId: session.user.id,
      message,
      resumeUrl,
      questionnaireAnswers,
    })
    revalidatePath("/dashboard/employee/applications")
    revalidatePath("/dashboard/founder/applicants")
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Failed to apply"
    if (errorMessage.includes("unique constraint")) {
      return { error: "You have already applied to this idea" }
    }
    return { error: "Failed to apply. You may have already sent a general application for this idea." }
  }
}

export async function updateApplicationStatusAction(id: string, status: ApplicationStatus) {
  const session = await auth()
  if (!session?.user || session.user.role !== "founder") {
    throw new Error("Unauthorized")
  }

  const app = await getApplicationById(id)
  if (!app) return { error: "Application not found" }

  const idea = await getIdeaById(app.idea_id)
  if (!idea || idea.founder_id !== session.user.id) {
    return { error: "Unauthorized: You do not own the idea for this application" }
  }

  try {
    await updateApplicationStatus(id, status)
    revalidatePath("/dashboard/founder/applicants")
    revalidatePath("/dashboard/founder", "layout")
    revalidatePath("/dashboard/founder/my-team")
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

  const app = await getApplicationById(applicationId)
  if (!app) return { error: "Application not found" }

  const idea = await getIdeaById(app.idea_id)
  if (!idea || idea.founder_id !== session.user.id) {
    return { error: "Unauthorized: You do not own the idea for this application" }
  }

  try {
    await updateApplicationRole(applicationId, role)
    revalidatePath("/dashboard/founder/applicants")
    revalidatePath("/dashboard/founder/my-team")
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
  const resumeUrl = formData.get("resumeUrl") as string
  const questionnaireAnswersRaw = formData.get("questionnaireAnswers") as string

  const resumeError = validateResume(resumeUrl)
  if (resumeError) {
    return { error: resumeError }
  }

  let questionnaireAnswers = {}
  try {
    questionnaireAnswers = questionnaireAnswersRaw ? JSON.parse(questionnaireAnswersRaw) : {}
  } catch (e) {}

  try {
    await applyToRole({ 
      ideaId, 
      roleRequirementId, 
      employeeId: session.user.id, 
      message, 
      resumeUrl, 
      questionnaireAnswers,
    })
    revalidatePath("/dashboard/employee/applications")
    revalidatePath("/dashboard/founder/applicants")
  } catch {
    return { error: "Failed to apply. You may have already applied for this specific role." }
  }
}

export async function shortlistApplicationAction(id: string) {
  const session = await auth()
  if (!session?.user || session.user.role !== "founder") {
    throw new Error("Unauthorized")
  }

  const app = await getApplicationById(id)
  if (!app) return { error: "Application not found" }

  const idea = await getIdeaById(app.idea_id)
  if (!idea || idea.founder_id !== session.user.id) {
    return { error: "Unauthorized: You do not own the idea for this application" }
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
    return { error: "Could not cancel - application may already be reviewed." }
  }

  revalidatePath("/dashboard/employee/applications")
}

