"use client"

import { useTransition, useState } from "react"
import { cancelApplicationAction } from "@/actions/applications"
import { Loader2, X, AlertTriangle } from "lucide-react"

export function CancelApplicationButton({ applicationId }: { applicationId: string }) {
  const [isPending, startTransition] = useTransition()
  const [confirming, setConfirming] = useState(false)
  const [error, setError] = useState<string | null>(null)

  function handleCancel() {
    setError(null)
    startTransition(async () => {
      const res = await cancelApplicationAction(applicationId)
      if (res?.error) {
        setError(res.error)
        setConfirming(false)
      }
    })
  }

  if (error) {
    return (
      <span className="flex items-center gap-1.5 text-xs text-error">
        <AlertTriangle className="w-3 h-3 shrink-0" />
        {error}
      </span>
    )
  }

  if (confirming) {
    return (
      <div className="flex items-center gap-2">
        <button
          onClick={handleCancel}
          disabled={isPending}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-error/10 hover:bg-error/20 border border-error/30 text-error rounded-lg text-xs font-semibold transition-all disabled:opacity-60"
        >
          {isPending ? (
            <Loader2 className="w-3 h-3 animate-spin" />
          ) : (
            <X className="w-3 h-3" />
          )}
          {isPending ? "Cancelling…" : "Confirm"}
        </button>
        {!isPending && (
          <button
            onClick={() => setConfirming(false)}
            className="px-3 py-1.5 text-xs text-accent-muted hover:text-white border border-white/10 rounded-lg transition-colors"
          >
            Keep
          </button>
        )}
      </div>
    )
  }

  return (
    <button
      onClick={() => setConfirming(true)}
      className="px-3 py-1.5 text-xs text-accent-muted hover:text-error border border-white/10 hover:border-error/30 rounded-lg transition-all duration-200 font-medium"
    >
      Cancel
    </button>
  )
}
