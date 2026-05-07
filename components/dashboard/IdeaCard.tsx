"use client"

import React from "react"
import { DbIdea } from "@/lib/db/ideas"
import { StatusBadge } from "./StatusBadge"
import { Building2, Activity, Zap } from "lucide-react"

interface IdeaCardProps {
  idea: DbIdea
  actions?: React.ReactNode
}

export function IdeaCard({ idea, actions }: IdeaCardProps) {
  return (
    <div className="premium-card rounded-3xl p-6 hover:border-btn/30 transition-all duration-300 flex flex-col h-full hover:-translate-y-1">
      <div className="flex justify-between items-start mb-4">
        <StatusBadge status={idea.status} />
        {idea.venture_score !== null && (
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-accent-yellow/10 border border-accent-yellow/20 text-accent-yellow text-xs font-bold">
            <Zap className="w-3 h-3 fill-accent-yellow" />
            {idea.venture_score}/100
          </div>
        )}
      </div>

      <h3 className="text-xl font-bold text-white mb-2 line-clamp-2">{idea.title}</h3>
      <p className="text-sm text-accent-muted mb-6 flex-1 line-clamp-3">
        {idea.description}
      </p>

      <div className="space-y-4 mt-auto">
        <div className="flex flex-wrap gap-2">
          {idea.industry && (
            <span className="flex items-center gap-1.5 text-xs text-accent-muted bg-white/5 px-2.5 py-1 rounded-md border border-white/5">
              <Building2 className="w-3 h-3" />
              {idea.industry}
            </span>
          )}
          <span className="flex items-center gap-1.5 text-xs text-accent-muted bg-white/5 px-2.5 py-1 rounded-md border border-white/5">
            <Activity className="w-3 h-3" />
            <span className="capitalize">{idea.stage}</span>
          </span>
        </div>

        {actions && (
          <div className="pt-4 border-t border-white/10">
            {actions}
          </div>
        )}
      </div>
    </div>
  )
}
