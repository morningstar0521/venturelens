"use client"

import React, { useEffect, useState, useTransition } from "react"
import {
  Sparkles, Users, Lock, Plus, Trash2, ChevronDown,
  Loader2, CheckCircle2, Briefcase, ArrowRight, RotateCcw,
  Tag, X, Save, AlertCircle
} from "lucide-react"
import { saveRoleRequirementsAction, RoleInput } from "@/actions/roles"
import type { DbRole } from "@/lib/db/roles"
import type { SuggestedRole, TeamSuggestion } from "@/app/api/ai/team-suggestions/route"

// ── Constants ─────────────────────────────────────────────────────────────────

const CATEGORIES = ["Tech", "Marketing", "Product", "Ops", "Design", "Finance", "Sales"] as const
const EXPERIENCES = [
  { value: "junior", label: "Junior (0–2 yrs)" },
  { value: "mid",    label: "Mid (2–4 yrs)" },
  { value: "senior", label: "Senior (4–7 yrs)" },
  { value: "lead",   label: "Lead / Head (7+ yrs)" },
] as const

const CATEGORY_COLORS: Record<string, string> = {
  Tech:      "bg-blue-500/10 text-blue-300 border-blue-400/20",
  Marketing: "bg-orange-500/10 text-orange-300 border-orange-400/20",
  Product:   "bg-purple-500/10 text-purple-300 border-purple-400/20",
  Ops:       "bg-yellow-500/10 text-yellow-300 border-yellow-400/20",
  Design:    "bg-pink-500/10 text-pink-300 border-pink-400/20",
  Finance:   "bg-green-500/10 text-green-300 border-green-400/20",
  Sales:     "bg-cyan-500/10 text-cyan-300 border-cyan-400/20",
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function suggestedToInput(s: SuggestedRole): RoleInput {
  return {
    roleTitle: s.role,
    category: s.category,
    experienceLevel: s.experience,
    skills: s.skills,
    description: s.responsibilities.join("\n"),
    openings: 1,
    aiSuggested: true,
  }
}

function blankRole(): RoleInput {
  return {
    roleTitle: "",
    category: "Tech",
    experienceLevel: "mid",
    skills: [],
    description: "",
    openings: 1,
    aiSuggested: false,
  }
}

// ── Sub-components ────────────────────────────────────────────────────────────

function SkillTagInput({
  skills, onChange
}: { skills: string[]; onChange: (s: string[]) => void }) {
  const [input, setInput] = useState("")

  function addSkill() {
    const trimmed = input.trim()
    if (trimmed && !skills.includes(trimmed) && skills.length < 10) {
      onChange([...skills, trimmed])
      setInput("")
    }
  }

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap gap-1.5">
        {skills.map(skill => (
          <span key={skill} className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-btn/10 border border-btn/20 text-xs text-btn font-medium">
            {skill}
            <button
              type="button"
              onClick={() => onChange(skills.filter(s => s !== skill))}
              className="hover:text-error transition-colors"
            >
              <X className="w-3 h-3" />
            </button>
          </span>
        ))}
      </div>
      <div className="flex gap-2">
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => { if (e.key === "Enter") { e.preventDefault(); addSkill() } }}
          placeholder="Type skill and press Enter…"
          className="flex-1 bg-black/20 border border-white/10 rounded-lg px-3 py-1.5 text-sm text-white placeholder:text-white/25 focus:outline-none focus:border-btn/40"
        />
        <button
          type="button"
          onClick={addSkill}
          className="px-3 py-1.5 rounded-lg bg-btn/10 border border-btn/20 text-btn text-xs hover:bg-btn/20 transition-colors"
        >
          <Tag className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  )
}

function RoleEditorCard({
  role, index, aiSuggested, onChange, onDelete
}: {
  role: RoleInput
  index: number
  aiSuggested?: boolean
  onChange: (r: RoleInput) => void
  onDelete: () => void
}) {
  const [expanded, setExpanded] = useState(true)

  return (
    <div className={`glass-panel rounded-2xl border transition-all duration-200 ${aiSuggested ? "border-btn/20" : "border-white/8"}`}>
      {/* Card header */}
      <div className="flex items-center gap-3 px-5 py-4">
        {aiSuggested && (
          <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-btn/10 border border-btn/20 text-btn text-[10px] font-bold shrink-0">
            <Sparkles className="w-2.5 h-2.5" /> AI
          </span>
        )}
        <span className={`px-2 py-0.5 rounded-md border text-[10px] font-bold shrink-0 ${CATEGORY_COLORS[role.category]}`}>
          {role.category}
        </span>
        <span className="font-bold text-white text-sm flex-1 truncate">
          {role.roleTitle || `Role ${index + 1}`}
        </span>
        <button
          type="button"
          onClick={() => setExpanded(v => !v)}
          className="text-white/30 hover:text-white transition-colors"
        >
          <ChevronDown className={`w-4 h-4 transition-transform ${expanded ? "" : "-rotate-90"}`} />
        </button>
        <button
          type="button"
          onClick={onDelete}
          className="text-white/20 hover:text-error transition-colors"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>

      {/* Expanded fields */}
      {expanded && (
        <div className="px-5 pb-5 space-y-4 border-t border-white/5 pt-4">
          {/* Title + Category row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-white/40 mb-1 block">Role Title *</label>
              <input
                value={role.roleTitle}
                onChange={e => onChange({ ...role, roleTitle: e.target.value })}
                placeholder="e.g. Co-founder & CTO"
                className="w-full bg-black/20 border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white placeholder:text-white/25 focus:outline-none focus:border-btn/40"
              />
            </div>
            <div>
              <label className="text-xs text-white/40 mb-1 block">Category</label>
              <div className="relative">
                <select
                  value={role.category}
                  onChange={e => onChange({ ...role, category: e.target.value as RoleInput["category"] })}
                  className="w-full appearance-none bg-black/20 border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-btn/40 cursor-pointer"
                >
                  {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
                <ChevronDown className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
              </div>
            </div>
          </div>

          {/* Experience + Openings */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-white/40 mb-1 block">Experience Level</label>
              <div className="relative">
                <select
                  value={role.experienceLevel}
                  onChange={e => onChange({ ...role, experienceLevel: e.target.value as RoleInput["experienceLevel"] })}
                  className="w-full appearance-none bg-black/20 border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-btn/40 cursor-pointer"
                >
                  {EXPERIENCES.map(ex => <option key={ex.value} value={ex.value}>{ex.label}</option>)}
                </select>
                <ChevronDown className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
              </div>
            </div>
            <div>
              <label className="text-xs text-white/40 mb-1 block">Openings</label>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => onChange({ ...role, openings: Math.max(1, role.openings - 1) })}
                  className="w-9 h-9 rounded-lg border border-white/10 flex items-center justify-center text-white/50 hover:text-white hover:border-white/20 transition-colors text-lg font-bold"
                >
                  −
                </button>
                <span className="flex-1 text-center font-bold text-white text-base">{role.openings}</span>
                <button
                  type="button"
                  onClick={() => onChange({ ...role, openings: Math.min(10, role.openings + 1) })}
                  className="w-9 h-9 rounded-lg border border-white/10 flex items-center justify-center text-white/50 hover:text-white hover:border-white/20 transition-colors text-lg font-bold"
                >
                  +
                </button>
              </div>
            </div>
          </div>

          {/* Skills */}
          <div>
            <label className="text-xs text-white/40 mb-2 block flex items-center gap-1">
              <Tag className="w-3 h-3" /> Skills
            </label>
            <SkillTagInput
              skills={role.skills}
              onChange={skills => onChange({ ...role, skills })}
            />
          </div>

          {/* Description */}
          <div>
            <label className="text-xs text-white/40 mb-1 block">Responsibilities / Description</label>
            <textarea
              value={role.description ?? ""}
              onChange={e => onChange({ ...role, description: e.target.value })}
              placeholder="What will this person own and build?"
              rows={3}
              className="w-full bg-black/20 border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white placeholder:text-white/25 focus:outline-none focus:border-btn/40 resize-y"
            />
          </div>
        </div>
      )}
    </div>
  )
}

// ── Locked state ──────────────────────────────────────────────────────────────

function LockedState({ score, suggestions }: { score: number; suggestions?: string[] }) {
  const needed = 70 - score
  return (
    <div className="glass-panel rounded-2xl p-8 border border-white/5 text-center space-y-5">
      <div className="flex justify-center">
        <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center">
          <Lock className="w-8 h-8 text-white/30" />
        </div>
      </div>
      <div>
        <h3 className="text-lg font-bold text-white/60 mb-1">Team Building Locked</h3>
        <p className="text-sm text-white/40">
          Improve your idea to unlock team building.{" "}
          <span className="text-btn font-semibold">You need {needed} more point{needed !== 1 ? "s" : ""} (currently {score}/100)</span>
        </p>
      </div>
      {suggestions && suggestions.length > 0 && (
        <div className="text-left space-y-2 pt-2 border-t border-white/5">
          <p className="text-xs font-semibold text-white/30 uppercase tracking-wider">AI Suggestions to improve:</p>
          {suggestions.slice(0, 4).map((s, i) => (
            <div key={i} className="flex items-start gap-2 text-sm text-white/50">
              <ArrowRight className="w-3.5 h-3.5 text-btn/50 shrink-0 mt-0.5" />
              {s}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

// ── Main Component ────────────────────────────────────────────────────────────

interface TeamBuilderProps {
  ideaId: string
  ventureScore: number
  aiSuggestions?: string[]          // from existing evaluation report
  existingRoles?: DbRole[]          // already-saved roles
}

type Step = "idle" | "loading-ai" | "editing" | "saving" | "done"

export function TeamBuilder({ ideaId, ventureScore, aiSuggestions, existingRoles = [] }: TeamBuilderProps) {
  const isUnlocked = ventureScore >= 70
  const initialPostedRoles = existingRoles.map(r => ({
    roleTitle: r.role_title,
    category: r.category,
    experienceLevel: r.experience_level,
    skills: r.skills,
    description: r.description ?? "",
    openings: r.openings,
    aiSuggested: r.ai_suggested,
  }))
  const [step, setStep] = useState<Step>(existingRoles.length > 0 ? "done" : "idle")
  const [postedRoles, setPostedRoles] = useState<RoleInput[]>(initialPostedRoles)
  const [roles, setRoles] = useState<RoleInput[]>(initialPostedRoles)
  const [isAddingOnly, setIsAddingOnly] = useState(false)
  const [aiMeta, setAiMeta] = useState<TeamSuggestion | null>(null)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [, startTransition] = useTransition()

  useEffect(() => {
    if (!success) return

    const timer = window.setTimeout(() => setSuccess(""), 3000)
    return () => window.clearTimeout(timer)
  }, [success])

  if (!isUnlocked) {
    return <LockedState score={ventureScore} suggestions={aiSuggestions} />
  }

  // ── Step: idle — show CTA ──────────────────────────────────────────────────

  if (step === "idle") {
    return (
      <div className="glass-panel rounded-2xl p-8 border border-btn/10 text-center space-y-5">
        <div className="flex justify-center">
          <div className="w-16 h-16 rounded-2xl bg-btn/10 border border-btn/20 flex items-center justify-center">
            <Users className="w-8 h-8 text-btn" />
          </div>
        </div>
        <div>
          <h3 className="text-lg font-bold text-accent-yellow mb-1">Build Your Team</h3>
          <p className="text-sm text-white/50 max-w-sm mx-auto">
            Your Venture Score of <strong className="text-btn">{ventureScore}</strong> qualifies this idea for contributors.
            Let AI suggest the ideal team structure for your Indian startup.
          </p>
        </div>
        <button
          onClick={handleGenerateSuggestions}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-btn text-btn-foreground font-bold hover:bg-btn/90 transition-all shadow-lg shadow-btn/20"
        >
          <Sparkles className="w-4 h-4" />
          Generate AI Team Suggestions
        </button>
      </div>
    )
  }

  // ── Step: loading ──────────────────────────────────────────────────────────

  if (step === "loading-ai") {
    return (
      <div className="glass-panel rounded-2xl p-12 border border-btn/10 text-center space-y-4">
        <Loader2 className="w-10 h-10 text-btn animate-spin mx-auto" />
        <p className="text-white/60 text-sm">
          {isAddingOnly ? "AI is recommending one new role..." : "AI is building your ideal team structure..."}
        </p>
      </div>
    )
  }

  // ── Step: done ─────────────────────────────────────────────────────────────

  if (step === "done") {
    return (
      <div className="space-y-4">
        {success && (
          <div className="flex items-center gap-2 px-4 py-3 rounded-xl bg-success/10 border border-success/20 text-success text-sm">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            {success}
          </div>
        )}

        <div className="glass-panel rounded-2xl p-5 border border-success/20 bg-success/5 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-success/10 border border-success/20 flex items-center justify-center">
              <CheckCircle2 className="w-5 h-5 text-success" />
            </div>
            <div>
              <p className="font-bold text-success text-sm">Team Requirements Posted!</p>
              <p className="text-xs text-success/60">{postedRoles.length} role{postedRoles.length !== 1 ? "s" : ""} visible to contributors</p>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => {
                setSuccess("")
                setIsAddingOnly(true)
                setRoles([blankRole()])
                setStep("editing")
              }}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-btn/10 border border-btn/20 text-btn text-sm font-semibold hover:bg-btn/20 transition-colors"
            >
              <Plus className="w-3.5 h-3.5" /> Add Role
            </button>
            <button
              onClick={() => {
                setSuccess("")
                setIsAddingOnly(false)
                setRoles(postedRoles)
                setStep("editing")
              }}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl border border-white/10 text-white/60 text-sm hover:text-white hover:border-white/20 transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" /> Edit Roles
            </button>
          </div>
        </div>

        {/* Preview posted roles */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {postedRoles.map((r, i) => (
            <div key={i} className="glass-panel rounded-xl p-4 border border-white/5 flex items-start gap-3">
              <div className="w-9 h-9 rounded-lg bg-btn/10 border border-btn/20 flex items-center justify-center shrink-0">
                <Briefcase className="w-4 h-4 text-btn" />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-2 flex-wrap mb-0.5">
                  <span className="font-bold text-sm text-white truncate">{r.roleTitle}</span>
                  {r.aiSuggested && (
                    <span className="px-1.5 py-0.5 rounded-full bg-btn/10 text-btn text-[9px] font-bold border border-btn/20">AI</span>
                  )}
                </div>
                <span className={`inline-block px-1.5 py-0.5 rounded-md border text-[10px] font-bold ${CATEGORY_COLORS[r.category]}`}>
                  {r.category}
                </span>
                <span className="ml-2 text-xs text-white/30">{r.openings} opening{r.openings !== 1 ? "s" : ""}</span>
                {r.skills.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-1.5">
                    {r.skills.slice(0, 3).map(s => (
                      <span key={s} className="px-1.5 py-0.5 rounded bg-white/5 text-white/40 text-[10px]">{s}</span>
                    ))}
                    {r.skills.length > 3 && <span className="text-[10px] text-white/30">+{r.skills.length - 3}</span>}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  // ── Step: editing ──────────────────────────────────────────────────────────

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="font-bold text-accent-yellow flex items-center gap-2">
            <Users className="w-5 h-5 text-btn" />
            {isAddingOnly ? "Add New Role" : "Configure Team Requirements"}
          </h3>
          {aiMeta && (
            <p className="text-xs text-white/40 mt-1">
              AI suggests a team of <strong className="text-btn">{aiMeta.team_size}</strong> · Priority order: {aiMeta.hiring_order.slice(0, 3).join(" → ")}
            </p>
          )}
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={handleCancelEdit}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-white/10 text-white/50 text-xs font-semibold hover:text-white hover:border-white/20 transition-colors"
          >
            Cancel
          </button>
          {isAddingOnly ? (
            <button
              type="button"
              onClick={handleGenerateNewRoleSuggestion}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-btn/20 text-btn text-xs font-semibold hover:bg-btn/10 transition-colors"
            >
              <Sparkles className="w-3 h-3" /> AI Recommendation
            </button>
          ) : (
            <button
              type="button"
              onClick={handleGenerateSuggestions}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-btn/20 text-btn text-xs font-semibold hover:bg-btn/10 transition-colors"
            >
              <RotateCcw className="w-3 h-3" /> Regenerate AI
            </button>
          )}
        </div>
      </div>

      {/* Role cards */}
      <div className="space-y-3">
        {roles.map((role, i) => (
          <RoleEditorCard
            key={i}
            role={role}
            index={i}
            aiSuggested={role.aiSuggested}
            onChange={updated => setRoles(prev => prev.map((r, idx) => idx === i ? updated : r))}
            onDelete={() => setRoles(prev => prev.filter((_, idx) => idx !== i))}
          />
        ))}
      </div>

      {!isAddingOnly && (
        <button
          type="button"
          onClick={() => setRoles(prev => [...prev, blankRole()])}
          className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl border border-dashed border-white/15 text-white/40 text-sm hover:text-white hover:border-white/25 transition-colors"
        >
          <Plus className="w-4 h-4" /> Add Role
        </button>
      )}

      {/* Error */}
      {error && (
        <div className="flex items-center gap-2 px-4 py-3 rounded-xl bg-error/10 border border-error/20 text-error text-sm">
          <AlertCircle className="w-4 h-4 shrink-0" />
          {error}
        </div>
      )}

      {/* Post CTA */}
      <div className="flex gap-3 pt-2 border-t border-white/5">
        <button
          type="button"
          disabled={step === "saving"}
          onClick={handleCancelEdit}
          className="px-5 py-3.5 rounded-xl border border-white/10 text-white/50 font-semibold hover:text-white hover:border-white/20 transition-colors disabled:opacity-50"
        >
          Go Back
        </button>
        <button
          type="button"
          disabled={step === "saving" || roles.length === 0}
          onClick={handleSave}
          className="flex-1 flex items-center justify-center gap-2 py-3.5 rounded-xl bg-btn text-btn-foreground font-bold hover:bg-btn/90 transition-all shadow-lg shadow-btn/20 disabled:opacity-50"
        >
          {step === "saving" ? (
            <><Loader2 className="w-4 h-4 animate-spin" /> Saving…</>
          ) : (
            <><Save className="w-4 h-4" /> Post {roles.length} Role{roles.length !== 1 ? "s" : ""}</>
          )}
        </button>
      </div>
    </div>
  )

  // ── Handlers ───────────────────────────────────────────────────────────────

  async function handleGenerateSuggestions() {
    setIsAddingOnly(false)
    setStep("loading-ai")
    setError("")
    setSuccess("")
    try {
      const res = await fetch("/api/ai/team-suggestions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ideaId }),
      })
      const json = await res.json()
      if (!res.ok) throw new Error(json.error ?? "AI call failed")
      const suggestion: TeamSuggestion = json.suggestion
      setAiMeta(suggestion)
      setRoles(suggestion.recommended_roles.map(suggestedToInput))
      setIsAddingOnly(false)
      setStep("editing")
    } catch (err) {
      setError(String(err))
      setStep("idle")
    }
  }

  function handleCancelEdit() {
    setError("")
    setAiMeta(null)
    setRoles(postedRoles)
    setIsAddingOnly(false)
    setStep(postedRoles.length > 0 ? "done" : "idle")
  }

  async function handleGenerateNewRoleSuggestion() {
    setIsAddingOnly(true)
    setStep("loading-ai")
    setError("")
    setSuccess("")
    try {
      const res = await fetch("/api/ai/team-suggestions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ideaId,
          singleRole: true,
          existingRoles: postedRoles.map(role => role.roleTitle),
        }),
      })
      const json = await res.json()
      if (!res.ok) throw new Error(json.error ?? "AI call failed")

      const suggestion: TeamSuggestion = json.suggestion
      const role = suggestion.recommended_roles[0]
      if (!role) throw new Error("No new role recommendation available")

      setAiMeta(suggestion)
      setRoles([suggestedToInput(role)])
      setStep("editing")
    } catch (err) {
      setError(String(err))
      setRoles([blankRole()])
      setStep("editing")
    }
  }

  async function handleSave() {
    setError("")
    setSuccess("")
    const invalid = roles.find(r => !r.roleTitle.trim())
    if (invalid) { setError("All roles must have a title."); return }
    setStep("saving")
    startTransition(async () => {
      const nextRoles = isAddingOnly ? [...postedRoles, ...roles] : roles
      const res = await saveRoleRequirementsAction(ideaId, nextRoles)
      if (res?.error) {
        setError(res.error)
        setStep("editing")
      } else {
        setPostedRoles(nextRoles)
        setRoles(nextRoles)
        setSuccess(isAddingOnly ? "Changes saved successfully. New role added." : "Changes saved successfully. Roles updated.")
        setIsAddingOnly(false)
        setStep("done")
      }
    })
  }
}
