"use server"

import { auth } from "@/auth"
import { bulkReplaceRoles, deleteRole, initRolesDb, RoleCategory, ExperienceLevel } from "@/lib/db/roles"
import { getIdeaById } from "@/lib/db/ideas"
import { revalidatePath } from "next/cache"

export interface RoleInput {
  roleTitle: string
  category: RoleCategory
  experienceLevel: ExperienceLevel
  skills: string[]
  description?: string
  openings: number
  aiSuggested?: boolean
}

export async function saveRoleRequirementsAction(ideaId: string, roles: RoleInput[]) {
  const session = await auth()
  if (!session?.user || session.user.role !== "founder") {
    return { error: "Unauthorized" }
  }

  // Verify idea ownership
  const idea = await getIdeaById(ideaId)
  if (!idea || idea.founder_id !== session.user.id) {
    return { error: "Idea not found" }
  }

  // Must be unlocked
  if ((idea.venture_score ?? 0) < 70) {
    return { error: "Venture Score must be ≥ 70 to post requirements" }
  }

  if (roles.length === 0) {
    return { error: "Add at least one role before posting" }
  }

  try {
    await initRolesDb()
    await bulkReplaceRoles(ideaId, roles)
    revalidatePath(`/dashboard/founder/ideas/${ideaId}`)
    revalidatePath(`/dashboard/founder/team/${ideaId}`)
    revalidatePath("/dashboard/founder/team")
    revalidatePath("/dashboard/employee/browse")
    return { success: true }
  } catch (err) {
    console.error("[roles] save failed:", err)
    return { error: "Failed to save role requirements. Please try again." }
  }
}

export async function deleteRoleAction(roleId: string, ideaId: string) {
  const session = await auth()
  if (!session?.user || session.user.role !== "founder") {
    return { error: "Unauthorized" }
  }

  try {
    await initRolesDb()
    await deleteRole(roleId)
    revalidatePath(`/dashboard/founder/ideas/${ideaId}`)
    revalidatePath(`/dashboard/founder/team/${ideaId}`)
    revalidatePath("/dashboard/founder/team")
    return { success: true }
  } catch {
    return { error: "Failed to delete role" }
  }
}
