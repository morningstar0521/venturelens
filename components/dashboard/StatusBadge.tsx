import React from "react"

export function StatusBadge({ status }: { status: string | boolean }) {
  if (typeof status === 'boolean') {
    return status ? (
      <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-success/10 text-success border border-success/20">Active</span>
    ) : (
      <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-error/10 text-error border border-error/20">Suspended</span>
    )
  }

  const styles: Record<string, string> = {
    pending: "bg-btn/10 text-btn border-btn/20",
    approved: "bg-success/10 text-success border-success/20",
    rejected: "bg-error/10 text-error border-error/20",
    accepted: "bg-success/10 text-success border-success/20",
  }

  const defaultStyle = "bg-white/10 text-white border-white/20"

  return (
    <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold border capitalize ${styles[status] || defaultStyle}`}>
      {status}
    </span>
  )
}
