"use client"

import { updateProfileAction } from "@/actions/profile"
import type { DbUser } from "@/lib/db/users"
import { CheckCircle2, Save, X } from "lucide-react"
import { useRouter } from "next/navigation"
import { useEffect, useState, useTransition } from "react"

const EXPERIENCE_OPTIONS = [
  { value: "", label: "Not specified" },
  { value: "junior", label: "Junior (0-2 yrs)" },
  { value: "mid", label: "Mid (2-4 yrs)" },
  { value: "senior", label: "Senior (4-7 yrs)" },
  { value: "lead", label: "Lead / Head (7+ yrs)" },
]

export function ProfileForm({ user }: { user: DbUser }) {
  const router = useRouter()
  const overviewHref = user.role === "admin" ? "/admin/dashboard" : `/dashboard/${user.role}`
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [name, setName] = useState(user.name)
  const [startupName, setStartupName] = useState(user.startup_name ?? "")
  const [skills, setSkills] = useState((user.skills ?? []).join(", "))
  const [experience, setExperience] = useState(user.experience ?? "")

  useEffect(() => {
    if (!success) return

    const timer = window.setTimeout(() => setSuccess(""), 3000)
    return () => window.clearTimeout(timer)
  }, [success])

  function resetForm() {
    setError("")
    setSuccess("")
    setName(user.name)
    setStartupName(user.startup_name ?? "")
    setSkills((user.skills ?? []).join(", "))
    setExperience(user.experience ?? "")
    router.push(overviewHref)
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError("")
    setSuccess("")
    const formData = new FormData(e.currentTarget)

    startTransition(async () => {
      const res = await updateProfileAction(formData)
      if (!res.success) {
        setError(res.message)
      } else {
        setSuccess(res.message)
        router.refresh()
      }
    })
  }

  function clearSuccess() {
    if (success) setSuccess("")
  }

  return (
    <form onSubmit={handleSubmit} className="glass-panel rounded-3xl p-8 border border-white/5 space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <label className="text-sm font-semibold text-accent-muted px-1">Full Name</label>
          <input
            name="name"
            value={name}
            onChange={e => {
              setName(e.target.value)
              clearSuccess()
            }}
            className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-btn/50"
          />
        </div>
        <div className="space-y-1.5">
          <label className="text-sm font-semibold text-accent-muted px-1">Email Address</label>
          <input
            value={user.email}
            disabled
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white/45 cursor-not-allowed"
          />
        </div>
      </div>

      {user.role === "founder" && (
        <div className="space-y-1.5">
          <label className="text-sm font-semibold text-accent-muted px-1">Startup / Idea Name</label>
          <input
            name="startupName"
            value={startupName}
            onChange={e => {
              setStartupName(e.target.value)
              clearSuccess()
            }}
            className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-btn/50"
          />
        </div>
      )}

      {user.role === "employee" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-accent-muted px-1">Skills</label>
            <input
              name="skills"
              value={skills}
              onChange={e => {
                setSkills(e.target.value)
                clearSuccess()
              }}
              placeholder="React, Python, UI/UX"
              className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/30 focus:outline-none focus:border-btn/50"
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-accent-muted px-1">Experience Level</label>
            <select
              name="experience"
              value={experience}
              onChange={e => {
                setExperience(e.target.value)
                clearSuccess()
              }}
              className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-btn/50"
            >
              {EXPERIENCE_OPTIONS.map(option => (
                <option key={option.value} value={option.value}>{option.label}</option>
              ))}
            </select>
          </div>
        </div>
      )}

      {error && (
        <div className="text-error text-sm bg-error/10 border border-error/20 px-4 py-3 rounded-xl">
          {error}
        </div>
      )}

      {success && (
        <div className="flex items-center gap-2 text-success text-sm bg-success/10 border border-success/20 px-4 py-3 rounded-xl">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          {success}
        </div>
      )}

      <div className="pt-4 border-t border-white/5 flex gap-3 justify-end">
        <button
          type="button"
          onClick={resetForm}
          disabled={isPending}
          className="inline-flex items-center gap-2 px-5 py-3 rounded-xl border border-white/10 text-white/55 font-semibold hover:text-white hover:border-white/20 transition-colors disabled:opacity-50"
        >
          <X className="w-4 h-4" />
          Cancel
        </button>
        <button
          type="submit"
          disabled={isPending}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-btn text-btn-foreground font-bold hover:bg-btn/90 transition-colors disabled:opacity-60"
        >
          <Save className="w-4 h-4" />
          {isPending ? "Saving..." : "Save Changes"}
        </button>
      </div>
    </form>
  )
}
