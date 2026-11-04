"use client"

import { useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import { retryEvaluationAction } from "@/actions/ideas"
import { AlertTriangle, Loader2, RefreshCw } from "lucide-react"

export function RetryEvaluationButton({ ideaId, label = "Run AI evaluation" }: { ideaId: string; label?: string }) {
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  function handleRetry() {
    setError(null)
    startTransition(async () => {
      const res = await retryEvaluationAction(ideaId)
      if (res?.error) setError(res.error)
      else router.refresh()
    })
  }

  return (
    <div className="flex flex-col items-center gap-2">
      <button
        onClick={handleRetry}
        disabled={isPending}
        className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-btn text-btn-foreground text-sm font-bold hover:bg-btn/90 transition-colors disabled:opacity-60"
      >
        {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4" />}
        {label}
      </button>
      {error && (
        <span className="flex items-center gap-1.5 text-xs text-error">
          <AlertTriangle className="w-3 h-3 shrink-0" />
          {error}
        </span>
      )}
    </div>
  )
}
