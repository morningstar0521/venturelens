"use client"

import { useActionState, useState, useRef, useEffect } from "react"
import { updateProfileAction, ProfileActionState } from "@/actions/profile"
import { DbUser } from "@/lib/db/users"
import { Save, X, Plus, CheckCircle, AlertCircle, Loader2 } from "lucide-react"

const EXPERIENCE_OPTIONS = [
  { value: "junior", label: "Junior (0–2 yrs)" },
  { value: "mid",    label: "Mid-level (2–5 yrs)" },
  { value: "senior", label: "Senior (5–10 yrs)" },
  { value: "lead",   label: "Lead / Principal (10+ yrs)" },
]

const initialState: ProfileActionState = { success: false, message: "" }

interface Props {
  user: DbUser
}

export function EditProfileForm({ user }: Props) {
  const [state, formAction, isPending] = useActionState(updateProfileAction, initialState)

  // Skill tag state
  const [skills, setSkills] = useState<string[]>(user.skills ?? [])
  const [skillInput, setSkillInput] = useState("")
  const skillRef = useRef<HTMLInputElement>(null)

  // Keep a hidden input in sync so the FormData picks it up
  // (we pass skills as a comma-separated string)
  const skillsValue = skills.join(",")

  function addSkill() {
    const trimmed = skillInput.trim()
    if (trimmed && !skills.includes(trimmed)) {
      setSkills((prev) => [...prev, trimmed])
    }
    setSkillInput("")
    skillRef.current?.focus()
  }

  function removeSkill(skill: string) {
    setSkills((prev) => prev.filter((s) => s !== skill))
  }

  function handleSkillKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault()
      addSkill()
    } else if (e.key === "Backspace" && skillInput === "" && skills.length > 0) {
      setSkills((prev) => prev.slice(0, -1))
    }
  }

  // Auto-dismiss success toast
  const [showSuccess, setShowSuccess] = useState(false)
  useEffect(() => {
    if (state.success) {
      setShowSuccess(true)
      const timer = setTimeout(() => setShowSuccess(false), 4000)
      return () => clearTimeout(timer)
    }
  }, [state])

  return (
    <form action={formAction} className="space-y-8">
      {/* Hidden skills input */}
      <input type="hidden" name="skills" value={skillsValue} />

      {/* Toast notification */}
      {showSuccess && (
        <div className="flex items-center gap-3 px-5 py-3.5 bg-success/10 border border-success/30 rounded-2xl text-success text-sm font-medium animate-in slide-in-from-top-2 duration-300">
          <CheckCircle className="w-4 h-4 shrink-0" />
          {state.message}
        </div>
      )}
      {!state.success && state.message && (
        <div className="flex items-center gap-3 px-5 py-3.5 bg-error/10 border border-error/30 rounded-2xl text-error text-sm font-medium animate-in slide-in-from-top-2 duration-300">
          <AlertCircle className="w-4 h-4 shrink-0" />
          {state.message}
        </div>
      )}

      {/* Name */}
      <div>
        <label htmlFor="profile-name" className="block text-sm font-semibold text-accent-yellow mb-2">
          Full Name
        </label>
        <input
          id="profile-name"
          name="name"
          type="text"
          defaultValue={user.name}
          placeholder="Your full name"
          className="w-full glass-input rounded-xl px-4 py-3 text-white text-sm placeholder:text-accent-muted/50 outline-none"
        />
        {state.errors?.name && (
          <p className="mt-1.5 text-xs text-error">{state.errors.name[0]}</p>
        )}
      </div>

      {/* Experience */}
      <div>
        <label htmlFor="profile-experience" className="block text-sm font-semibold text-accent-yellow mb-2">
          Experience Level
        </label>
        <select
          id="profile-experience"
          name="experience"
          defaultValue={user.experience ?? ""}
          className="w-full glass-input rounded-xl px-4 py-3 text-white text-sm bg-bg-secondary/50 outline-none cursor-pointer"
        >
          <option value="" disabled className="bg-card text-accent-muted">
            Select your experience level
          </option>
          {EXPERIENCE_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value} className="bg-card text-white">
              {opt.label}
            </option>
          ))}
        </select>
        {state.errors?.experience && (
          <p className="mt-1.5 text-xs text-error">{state.errors.experience[0]}</p>
        )}
      </div>

      {/* Skills */}
      <div>
        <label className="block text-sm font-semibold text-accent-yellow mb-2">
          Skills
        </label>

        {/* Tag chips */}
        <div
          className="min-h-[52px] glass-input rounded-xl px-3 py-2.5 flex flex-wrap gap-2 cursor-text"
          onClick={() => skillRef.current?.focus()}
        >
          {skills.map((skill) => (
            <span
              key={skill}
              className="flex items-center gap-1.5 px-3 py-1 bg-success/15 border border-success/30 text-success rounded-lg text-xs font-medium"
            >
              {skill}
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); removeSkill(skill) }}
                className="hover:text-error transition-colors"
                aria-label={`Remove ${skill}`}
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          ))}
          <input
            ref={skillRef}
            type="text"
            value={skillInput}
            onChange={(e) => setSkillInput(e.target.value)}
            onKeyDown={handleSkillKeyDown}
            placeholder={skills.length === 0 ? "Type a skill and press Enter…" : "Add more…"}
            className="flex-1 min-w-[140px] bg-transparent outline-none text-sm text-white placeholder:text-accent-muted/50"
          />
        </div>

        <div className="flex items-center justify-between mt-2">
          <p className="text-xs text-accent-muted">
            Press <kbd className="px-1 py-0.5 bg-white/5 border border-white/10 rounded text-[10px]">Enter</kbd> or{" "}
            <kbd className="px-1 py-0.5 bg-white/5 border border-white/10 rounded text-[10px]">,</kbd> to add · Backspace to remove last
          </p>
          {skillInput && (
            <button
              type="button"
              onClick={addSkill}
              className="flex items-center gap-1 text-xs text-success hover:text-success/80 transition-colors font-medium"
            >
              <Plus className="w-3 h-3" /> Add
            </button>
          )}
        </div>

        {state.errors?.skills && (
          <p className="mt-1 text-xs text-error">{state.errors.skills[0]}</p>
        )}
      </div>

      {/* Submit */}
      <div className="pt-4 border-t border-white/5 flex justify-end">
        <button
          type="submit"
          disabled={isPending}
          className="flex items-center gap-2.5 px-7 py-3 bg-btn hover:bg-btn-hover text-btn-text rounded-xl text-sm font-bold transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed hover:shadow-[0_0_20px_rgba(248,198,98,0.25)] active:scale-95"
        >
          {isPending ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Saving…
            </>
          ) : (
            <>
              <Save className="w-4 h-4" />
              Save Changes
            </>
          )}
        </button>
      </div>
    </form>
  )
}
