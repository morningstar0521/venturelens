import { requireFounderSession } from "@/lib/auth/guards"
import { redirect } from "next/navigation"

export default async function LegacyIdeaTeamPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  await requireFounderSession()
  redirect(`/dashboard/founder/team/${id}`)
}
