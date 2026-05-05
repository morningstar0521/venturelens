"use client"

import React, { useState } from "react"
import { DbIdea } from "@/lib/db/ideas"
import { StatusBadge } from "./StatusBadge"
import { updateIdeaStatusAction } from "@/actions/ideas"
import { 
  ChevronDown, 
  ChevronUp, 
  Info, 
  AlertTriangle, 
  Zap, 
  Target, 
  Briefcase, 
  TrendingUp,
  User
} from "lucide-react"

interface AdminIdeasTableProps {
  ideas: DbIdea[]
  users: { id: string; name: string }[]
}

export function AdminIdeasTable({ ideas, users }: AdminIdeasTableProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const userMap = new Map(users.map(u => [u.id, u.name]))

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id)
  }

  return (
    <div className="glass-panel rounded-2xl border border-white/5 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="text-xs text-accent-muted uppercase bg-black/20 border-b border-white/5">
            <tr>
              <th className="px-6 py-4 font-semibold w-10"></th>
              <th className="px-6 py-4 font-semibold">Startup Idea</th>
              <th className="px-6 py-4 font-semibold">Founder</th>
              <th className="px-6 py-4 font-semibold">Industry/Stage</th>
              <th className="px-6 py-4 font-semibold">Status</th>
              <th className="px-6 py-4 font-semibold text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {ideas.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-8 text-center text-accent-muted">
                  No ideas submitted yet.
                </td>
              </tr>
            ) : (
              ideas.map((idea) => (
                <React.Fragment key={idea.id}>
                  {/* Main Row */}
                  <tr 
                    className={`border-b border-white/5 last:border-0 hover:bg-white/5 transition-colors cursor-pointer ${expandedId === idea.id ? "bg-white/5" : ""}`}
                    onClick={() => toggleExpand(idea.id)}
                  >
                    <td className="px-6 py-4">
                      {expandedId === idea.id ? (
                        <ChevronUp className="w-4 h-4 text-accent-yellow" />
                      ) : (
                        <ChevronDown className="w-4 h-4 text-accent-muted" />
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-bold text-white max-w-xs truncate" title={idea.title}>
                        {idea.title}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-accent-muted flex items-center gap-2">
                        <User className="w-3.5 h-3.5 opacity-50" />
                        {userMap.get(idea.founder_id) || "Unknown"}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex flex-col gap-0.5">
                        <span className="text-xs text-accent-muted font-medium">{idea.industry || "N/A"}</span>
                        <span className="text-[10px] uppercase tracking-wider text-white/40">{idea.stage}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <StatusBadge status={idea.status} />
                    </td>
                    <td className="px-6 py-4 text-right" onClick={(e) => e.stopPropagation()}>
                      <div className="flex justify-end gap-2">
                        {idea.status !== "approved" && (
                          <button 
                            onClick={async () => await updateIdeaStatusAction(idea.id, "approved")}
                            className="text-xs font-bold px-3 py-1.5 rounded-lg border border-success/20 text-success hover:bg-success/10 transition-colors"
                          >
                            Approve
                          </button>
                        )}
                        {idea.status !== "rejected" && (
                          <button 
                            onClick={async () => await updateIdeaStatusAction(idea.id, "rejected")}
                            className="text-xs font-bold px-3 py-1.5 rounded-lg border border-error/20 text-error hover:bg-error/10 transition-colors"
                          >
                            Reject
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>

                  {/* Expansion Row */}
                  {expandedId === idea.id && (
                    <tr className="bg-black/40 border-b border-white/5">
                      <td colSpan={6} className="px-8 py-8 animate-in slide-in-from-top-2 duration-300">
                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                          {/* Left Side: Summary & Scores */}
                          <div className="lg:col-span-4 space-y-6">
                            <div className="glass-panel p-5 border-white/5 bg-white/2 rounded-2xl">
                              <h4 className="text-[10px] font-black text-accent-yellow uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
                                <TrendingUp className="w-3.5 h-3.5" /> Venture Score
                              </h4>
                              {idea.venture_score !== null ? (
                                <div className="flex items-baseline gap-1">
                                  <span className={`text-4xl font-black ${idea.venture_score >= 70 ? "text-success" : "text-error"}`}>
                                    {idea.venture_score}
                                  </span>
                                  <span className="text-xs text-white/20 font-bold">/ 100</span>
                                </div>
                              ) : (
                                <p className="text-sm text-white/30 italic">Not evaluated yet</p>
                              )}
                            </div>

                            <div className="glass-panel p-5 border-white/5 bg-white/2 rounded-2xl">
                              <h4 className="text-[10px] font-black text-white/40 uppercase tracking-[0.2em] mb-3 flex items-center gap-2">
                                <Target className="w-3.5 h-3.5" /> Market Fit
                              </h4>
                              <p className="text-xs text-white/60 leading-relaxed italic">
                                {idea.target_audience || "N/A"}
                              </p>
                            </div>

                            <div className="glass-panel p-5 border-white/5 bg-white/2 rounded-2xl">
                              <h4 className="text-[10px] font-black text-white/40 uppercase tracking-[0.2em] mb-3 flex items-center gap-2">
                                <Briefcase className="w-3.5 h-3.5" /> Business Model
                              </h4>
                              <p className="text-xs text-white/60 leading-relaxed italic">
                                {idea.revenue_model || "N/A"}
                              </p>
                            </div>
                          </div>

                          {/* Right Side: Detailed Pitch */}
                          <div className="lg:col-span-8 space-y-6">
                            <div className="space-y-3">
                              <h4 className="text-xs font-black text-white uppercase tracking-[0.3em] flex items-center gap-2">
                                <Info className="w-4 h-4 text-accent-yellow" /> Executive Summary
                              </h4>
                              <p className="text-sm text-white/70 leading-relaxed bg-white/5 p-5 rounded-2xl border border-white/5">
                                {idea.description}
                              </p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                              <div className="space-y-3">
                                <h4 className="text-xs font-black text-error/70 uppercase tracking-[0.3em] flex items-center gap-2">
                                  <AlertTriangle className="w-4 h-4" /> The Problem
                                </h4>
                                <div className="bg-error/5 border border-error/10 rounded-2xl p-5 text-xs text-white/60 leading-relaxed min-h-[120px]">
                                  {idea.problem_statement || "No problem statement provided."}
                                </div>
                              </div>
                              <div className="space-y-3">
                                <h4 className="text-xs font-black text-success/70 uppercase tracking-[0.3em] flex items-center gap-2">
                                  <Zap className="w-4 h-4" /> The Solution
                                </h4>
                                <div className="bg-success/5 border border-success/10 rounded-2xl p-5 text-xs text-white/60 leading-relaxed min-h-[120px]">
                                  {idea.solution || "No solution provided."}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
