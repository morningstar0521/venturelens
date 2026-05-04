"use client"

import React from "react"
import { IdeaStatus } from "@/lib/db/ideas"
import { ApplicationStatus } from "@/lib/db/applications"

type AnyStatus = IdeaStatus | ApplicationStatus | string

const CONFIG: Record<string, { label: string; classes: string; dot?: string; animate?: boolean }> = {
  pending: {
    label: "Pending Review",
    classes: "bg-white/5 text-white/70 border-white/10",
    dot: "bg-white/40",
  },
  evaluating: {
    label: "AI Evaluating…",
    classes: "bg-blue-500/10 text-blue-300 border-blue-400/20",
    dot: "bg-blue-400",
    animate: true,
  },
  approved: {
    label: "Approved",
    classes: "bg-success/10 text-success border-success/20",
    dot: "bg-success",
  },
  rejected: {
    label: "Rejected",
    classes: "bg-error/10 text-error border-error/20",
    dot: "bg-error",
  },
  accepted: {
    label: "Accepted",
    classes: "bg-success/10 text-success border-success/20",
    dot: "bg-success",
  },
  shortlisted: {
    label: "Shortlisted",
    classes: "bg-violet-500/10 text-violet-300 border-violet-400/20",
    dot: "bg-violet-400",
  },
  active: {
    label: "Active",
    classes: "bg-success/10 text-success border-success/20",
    dot: "bg-success",
  },
  suspended: {
    label: "Suspended",
    classes: "bg-error/10 text-error border-error/20",
    dot: "bg-error",
  },
}

export function StatusBadge({ status }: { status: AnyStatus }) {
  const cfg = CONFIG[status] ?? {
    label: status.charAt(0).toUpperCase() + status.slice(1),
    classes: "bg-white/5 text-white/50 border-white/10",
    dot: "bg-white/30",
  }

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${cfg.classes}`}
    >
      <span
        className={`w-1.5 h-1.5 rounded-full ${cfg.dot} ${cfg.animate ? "animate-pulse" : ""}`}
      />
      {cfg.label}
    </span>
  )
}
