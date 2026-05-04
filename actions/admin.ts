"use server"

import { auth } from "@/auth"
import { updateUserStatus } from "@/lib/db/users"
import { revalidatePath } from "next/cache"

export async function toggleUserStatusAction(userId: string, isActive: boolean) {
  const session = await auth()
  if (!session?.user || session.user.role !== "admin") {
    throw new Error("Unauthorized")
  }

  try {
    await updateUserStatus(userId, isActive)
    revalidatePath("/admin/dashboard/users")
  } catch (_error) {
    return { error: "Failed to update user status" }
  }
}
