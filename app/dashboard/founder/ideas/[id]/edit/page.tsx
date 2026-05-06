import { requireFounderSession } from "@/lib/auth/guards"
import { getIdeaById } from "@/lib/db/ideas"
import { EditIdeaForm } from "@/components/dashboard/EditIdeaForm"
import { notFound, redirect } from "next/navigation"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"

export const metadata = { title: "Edit & Reassess Idea — VentureLens" }

export default async function EditIdeaPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const session = await requireFounderSession()

  const idea = await getIdeaById(id)
  if (!idea || idea.founder_id !== session.user.id) notFound()
  if ((idea.venture_score ?? 0) >= 70) redirect(`/dashboard/founder/ideas/${id}`)

  return (
    <div className="max-w-4xl space-y-6">
      <div className="flex items-start gap-4">
        <Link
          href={`/dashboard/founder/ideas/${id}`}
          className="mt-1 w-9 h-9 rounded-xl border border-white/10 flex items-center justify-center hover:bg-white/5 transition-colors shrink-0"
        >
          <ArrowLeft className="w-4 h-4 text-white/60" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-accent-yellow">Edit & Reassess Idea</h1>
          <p className="text-sm text-accent-muted mt-1">Improve your locked idea and generate a fresh AI report.</p>
        </div>
      </div>
      <EditIdeaForm idea={idea} />
    </div>
  )
}
