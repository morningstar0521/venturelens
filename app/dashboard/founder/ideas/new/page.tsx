import { requireFounderSession } from "@/lib/auth/guards"
import { SubmitIdeaForm } from "@/components/dashboard/SubmitIdeaForm"

export const metadata = { title: "Submit Idea — VentureLens" }

export default async function NewIdeaPage() {
  await requireFounderSession()

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-accent-yellow">Submit New Idea</h1>
        <p className="text-sm text-accent-muted mt-1">Provide details about your startup concept for AI validation.</p>
      </div>

      <div className="glass-panel rounded-3xl p-8 border border-white/5">
        <SubmitIdeaForm />
      </div>
    </div>
  )
}
