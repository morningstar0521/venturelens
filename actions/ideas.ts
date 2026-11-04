"use server"

import { auth } from "@/auth"
import { createIdea, getIdeaById, updateIdeaForReassessment, updateIdeaStatus, IdeaStage, IdeaStatus } from "@/lib/db/ideas"
import { IdeaSchema } from "@/lib/validations"
import { revalidatePath } from "next/cache"
import { after } from "next/server"
import { runEvaluation } from "@/lib/ai/run-evaluation"

export async function submitIdeaAction(formData: FormData) {
  const session = await auth()
  if (!session?.user || session.user.role !== "founder") {
    throw new Error("Unauthorized")
  }

  const data = {
    title:            formData.get("title")            as string,
    description:      formData.get("description")      as string,
    problemStatement: formData.get("problemStatement") as string || "",
    solution:         formData.get("solution")         as string || "",
    targetAudience:   formData.get("targetAudience")   as string || "",
    revenueModel:     formData.get("revenueModel")     as string || "",
    industry:         formData.get("industry")         as string,
    stage:            formData.get("stage")            as IdeaStage,
  }

  const parsed = IdeaSchema.safeParse(data)
  if (!parsed.success) {
    return { error: parsed.error.issues[0].message }
  }

  let ideaId: string
  try {
    const result = await createIdea({
      founderId:        session.user.id,
      title:            parsed.data.title,
      description:      parsed.data.description,
      problemStatement: parsed.data.problemStatement || undefined,
      solution:         parsed.data.solution         || undefined,
      targetAudience:   parsed.data.targetAudience   || undefined,
      revenueModel:     parsed.data.revenueModel     || undefined,
      industry:         parsed.data.industry,
      stage:            parsed.data.stage as IdeaStage,
    })
    ideaId = result.id
  } catch {
    return { error: "Failed to submit idea. Please try again." }
  }

  // Run AI evaluation after the response is sent. `after()` keeps the
  // serverless function alive until it finishes (a bare un-awaited fetch can be
  // frozen by Vercel before it is ever sent, leaving the idea stuck).
  after(() => runEvaluation(ideaId))

  revalidatePath("/dashboard/founder/ideas")
  revalidatePath("/admin/dashboard/ideas")

  return { success: true, ideaId }
}

export async function reassessIdeaAction(ideaId: string, formData: FormData) {
  const session = await auth()
  if (!session?.user || session.user.role !== "founder") {
    throw new Error("Unauthorized")
  }

  const idea = await getIdeaById(ideaId)
  if (!idea || idea.founder_id !== session.user.id) {
    return { error: "Idea not found" }
  }

  if ((idea.venture_score ?? 0) >= 70) {
    return { error: "Only locked ideas can be edited and reassessed." }
  }

  const data = {
    title:            formData.get("title")            as string,
    description:      formData.get("description")      as string,
    problemStatement: formData.get("problemStatement") as string || "",
    solution:         formData.get("solution")         as string || "",
    targetAudience:   formData.get("targetAudience")   as string || "",
    revenueModel:     formData.get("revenueModel")     as string || "",
    industry:         formData.get("industry")         as string,
    stage:            formData.get("stage")            as IdeaStage,
  }

  const parsed = IdeaSchema.safeParse(data)
  if (!parsed.success) {
    return { error: parsed.error.issues[0].message }
  }

  try {
    await updateIdeaForReassessment(ideaId, {
      title:            parsed.data.title,
      description:      parsed.data.description,
      problemStatement: parsed.data.problemStatement || undefined,
      solution:         parsed.data.solution || undefined,
      targetAudience:   parsed.data.targetAudience || undefined,
      revenueModel:     parsed.data.revenueModel || undefined,
      industry:         parsed.data.industry,
      stage:            parsed.data.stage as IdeaStage,
    })

    revalidatePath("/dashboard/founder/ideas")
    revalidatePath("/admin/dashboard/ideas")
  } catch {
    return { error: "Failed to update idea. Please try again." }
  }

  after(() => runEvaluation(ideaId))

  revalidatePath(`/dashboard/founder/ideas/${ideaId}`)
  revalidatePath("/dashboard/founder/ideas")
  revalidatePath("/dashboard/founder/team")
  revalidatePath("/admin/dashboard/ideas")

  return { success: true }
}

export async function retryEvaluationAction(ideaId: string) {
  const session = await auth()
  if (!session?.user || (session.user.role !== "founder" && session.user.role !== "admin")) {
    return { error: "Unauthorized" }
  }

  const idea = await getIdeaById(ideaId)
  if (!idea || (session.user.role !== "admin" && idea.founder_id !== session.user.id)) {
    return { error: "Idea not found" }
  }

  try {
    await updateIdeaStatus(ideaId, "evaluating")
  } catch {
    return { error: "Could not start evaluation. Please try again." }
  }

  after(() => runEvaluation(ideaId))

  revalidatePath(`/dashboard/founder/ideas/${ideaId}`)
  revalidatePath("/dashboard/founder/ideas")
  return { success: true }
}

export async function updateIdeaStatusAction(ideaId: string, status: IdeaStatus) {
  const session = await auth()
  if (!session?.user || session.user.role !== "admin") {
    throw new Error("Unauthorized")
  }

  try {
    await updateIdeaStatus(ideaId, status)
    revalidatePath("/admin/dashboard/ideas")
    revalidatePath("/dashboard/employee/browse")
  } catch {
    return { error: "Failed to update status" }
  }
}
