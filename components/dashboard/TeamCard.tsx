"use client"

import React, { useTransition, useState } from "react"
import { AssignedRole } from "@/lib/db/applications"
import { assignRoleAction } from "@/actions/applications"
import { UserCircle, Briefcase, ChevronDown } from "lucide-react"

const ROLES: AssignedRole[] = ["CTO", "Developer", "Designer", "Marketing", "Sales", "Operations"]

const ROLE_COLORS: Record<AssignedRole, string> = {
  CTO:        "bg-purple-500/10 text-purple-300 border-purple-400/20",
  Developer:  "bg-blue-500/10 text-blue-300 border-blue-400/20",
  Designer:   "bg-pink-500/10 text-pink-300 border-pink-400/20",
  Marketing:  "bg-orange-500/10 text-orange-300 border-orange-400/20",
  Sales:      "bg-cyan-500/10 text-cyan-300 border-cyan-400/20",
  Operations: "bg-yellow-500/10 text-yellow-300 border-yellow-400/20",
}

interface TeamCardProps {
  applicationId: string
  name: string
  email: string
  skills: string[] | null
  experience: string | null
  assignedRole: AssignedRole | null
  ideaTitle: string
}

export function TeamCard({
  applicationId,
  name,
  email,
  skills,
  experience,
  assignedRole,
  ideaTitle,
}: TeamCardProps) {
  const [isPending, startTransition] = useTransition()
  const [currentRole, setCurrentRole] = useState<AssignedRole | null>(assignedRole)
  const [open, setOpen] = useState(false)

  function handleRoleSelect(role: AssignedRole) {
    setOpen(false)
    startTransition(async () => {
      await assignRoleAction(applicationId, role)
      setCurrentRole(role)
    })
  }

  const roleClass = currentRole ? ROLE_COLORS[currentRole] : "bg-white/5 text-white/40 border-white/10"

  return (
    <div className="glass-panel rounded-2xl p-5 border border-success/10 bg-success/3 flex flex-col gap-4">
      {/* Avatar + Info */}
      <div className="flex items-start gap-3">
        <div className="w-11 h-11 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center shrink-0">
          <UserCircle className="w-6 h-6 text-white/50" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="font-bold text-white truncate">{name}</div>
          <div className="text-xs text-white/40 truncate">{email}</div>
          <div className="text-xs text-white/30 mt-0.5">For: <span className="text-accent-yellow">{ideaTitle}</span></div>
        </div>
      </div>

      {/* Skills + Experience */}
      <div className="space-y-1.5">
        {experience && (
          <div className="text-xs text-white/50 capitalize">
            <span className="text-white/30">Level: </span>{experience}
          </div>
        )}
        {skills && skills.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {skills.slice(0, 5).map((s) => (
              <span key={s} className="text-xs px-2 py-0.5 rounded-md bg-white/5 border border-white/5 text-white/50">
                {s}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Role Assignment */}
      <div className="relative">
        <button
          onClick={() => setOpen((v) => !v)}
          disabled={isPending}
          className={`w-full flex items-center justify-between px-3 py-2 rounded-xl border text-sm font-semibold transition-all ${roleClass} hover:opacity-90`}
        >
          <div className="flex items-center gap-2">
            <Briefcase className="w-3.5 h-3.5" />
            {currentRole ?? "Assign Role"}
          </div>
          <ChevronDown className={`w-3.5 h-3.5 transition-transform ${open ? "rotate-180" : ""}`} />
        </button>

        {open && (
          <div className="absolute bottom-full mb-1 left-0 right-0 glass-panel rounded-xl border border-white/10 z-10 overflow-hidden shadow-xl">
            {ROLES.map((role) => (
              <button
                key={role}
                onClick={() => handleRoleSelect(role)}
                className={`w-full text-left px-4 py-2.5 text-sm font-medium transition-colors hover:bg-white/5 ${ROLE_COLORS[role]}`}
              >
                {role}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
