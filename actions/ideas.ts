"use server"

import { auth } from "@/auth"
import { createIdea, updateIdeaStatus, IdeaStage, IdeaStatus } from "@/lib/db/ideas"
import { IdeaSchema } from "@/lib/validations"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"

export async function submitIdeaAction(formData: FormData) {
  const session = await auth()
  if (!session?.user || session.user.role !== "founder") {
    throw new Error("Unauthorized")
  }

  const data = {
    title: formData.get("title") as string,
    description: formData.get("description") as string,
    industry: formData.get("industry") as string,
    stage: formData.get("stage") as IdeaStage,
  }

  const parsed = IdeaSchema.safeParse(data)
  if (!parsed.success) {
    return { error: parsed.error.issues[0].message }
  }

  try {
    await createIdea({
      founderId: session.user.id,
      title: parsed.data.title,
      description: parsed.data.description,
      industry: parsed.data.industry,
      stage: parsed.data.stage as IdeaStage,
    })
    
    revalidatePath("/dashboard/founder/ideas")
    revalidatePath("/admin/dashboard/ideas")
  } catch {
    return { error: "Failed to submit idea" }
  }

  redirect("/dashboard/founder/ideas")
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
