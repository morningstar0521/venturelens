import { auth } from "@/auth"
import { getIdeaById } from "@/lib/db/ideas"
import { getRolesByIdea } from "@/lib/db/roles"
import { ApplicationForm } from "@/components/dashboard/ApplicationForm"
import { notFound, redirect } from "next/navigation"

export default async function ApplyPage(props: {
  searchParams: Promise<{ ideaId?: string; roleId?: string }>
}) {
  const session = await auth()
  if (!session?.user || session.user.role !== "employee") {
    redirect("/login")
  }

  const { ideaId, roleId } = await props.searchParams

  if (!ideaId) notFound()

  const idea = await getIdeaById(ideaId)
  if (!idea) notFound()

  let roleTitle = undefined
  if (roleId) {
    const roles = await getRolesByIdea(ideaId)
    const role = roles.find(r => r.id === roleId)
    if (role) {
      roleTitle = role.role_title
    }
  }

  return (
    <div className="py-8">
      <ApplicationForm
        ideaId={ideaId}
        ideaTitle={idea.title}
        roleId={roleId}
        roleTitle={roleTitle}
      />
    </div>
  )
}
