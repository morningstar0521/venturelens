"use client"

import { reassessIdeaAction } from "@/actions/ideas"
import type { DbIdea } from "@/lib/db/ideas"
import { CheckCircle2, Save, X, Sparkles } from "lucide-react"
import { useRouter } from "next/navigation"
import { useEffect, useState, useTransition } from "react"

function Textarea({
  name,
  label,
  value,
  onChange,
  required,
  minLength,
}: {
  name: string
  label: string
  value: string
  onChange: (value: string) => void
  required?: boolean
  minLength?: number
}) {
  return (
    <div className="space-y-1.5">
      <label className="text-sm font-semibold text-accent-muted px-1">
        {label} {required && <span className="text-btn text-xs">*</span>}
      </label>
      <textarea
        name={name}
        required={required}
        minLength={minLength}
        value={value}
        onChange={e => onChange(e.target.value)}
        className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-btn/50 min-h-[110px] resize-y"
      />
    </div>
  )
}

export function EditIdeaForm({ idea }: { idea: DbIdea }) {
  const router = useRouter()
  const reportHref = `/dashboard/founder/ideas/${idea.id}`
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [title, setTitle] = useState(idea.title)
  const [description, setDescription] = useState(idea.description)
  const [problemStatement, setProblemStatement] = useState(idea.problem_statement ?? "")
  const [solution, setSolution] = useState(idea.solution ?? "")
  const [targetAudience, setTargetAudience] = useState(idea.target_audience ?? "")
  const [revenueModel, setRevenueModel] = useState(idea.revenue_model ?? "")
  const [industry, setIndustry] = useState(idea.industry ?? "")
  const [stage, setStage] = useState(idea.stage)

  useEffect(() => {
    if (!success) return

    const timer = window.setTimeout(() => setSuccess(""), 1000)
    return () => window.clearTimeout(timer)
  }, [success])

  function resetForm() {
    setError("")
    setSuccess("")
    setTitle(idea.title)
    setDescription(idea.description)
    setProblemStatement(idea.problem_statement ?? "")
    setSolution(idea.solution ?? "")
    setTargetAudience(idea.target_audience ?? "")
    setRevenueModel(idea.revenue_model ?? "")
    setIndustry(idea.industry ?? "")
    setStage(idea.stage)
    router.push(reportHref)
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError("")
    setSuccess("")
    const formData = new FormData(e.currentTarget)
    formData.set("stage", stage)

    startTransition(async () => {
      const res = await reassessIdeaAction(idea.id, formData)
      if (res?.error) {
        setError(res.error)
      } else {
        setSuccess("Changes saved successfully. Reassessment started.")
        setTimeout(() => {
          router.push(reportHref)
          router.refresh()
        }, 1200)
      }
    })
  }

  function clearSuccess() {
    if (success) setSuccess("")
  }

  return (
    <form onSubmit={handleSubmit} className="glass-panel rounded-3xl p-8 border border-white/5 space-y-6">
      <div className="space-y-1.5">
        <label className="text-sm font-semibold text-accent-muted px-1">Startup / Idea Title</label>
        <input
          name="title"
          required
          minLength={5}
          value={title}
          onChange={e => {
            setTitle(e.target.value)
            clearSuccess()
          }}
          className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-btn/50"
        />
      </div>

      <Textarea name="description" label="Brief Overview" value={description} onChange={value => {
        setDescription(value)
        clearSuccess()
      }} required minLength={20} />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Textarea name="problemStatement" label="Problem Statement" value={problemStatement} onChange={value => {
          setProblemStatement(value)
          clearSuccess()
        }} minLength={20} />
        <Textarea name="solution" label="Your Solution" value={solution} onChange={value => {
          setSolution(value)
          clearSuccess()
        }} minLength={20} />
        <Textarea name="targetAudience" label="Target Audience" value={targetAudience} onChange={value => {
          setTargetAudience(value)
          clearSuccess()
        }} minLength={10} />
        <Textarea name="revenueModel" label="Revenue Model" value={revenueModel} onChange={value => {
          setRevenueModel(value)
          clearSuccess()
        }} minLength={10} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <label className="text-sm font-semibold text-accent-muted px-1">Industry</label>
          <input
            name="industry"
            required
            value={industry}
            onChange={e => {
              setIndustry(e.target.value)
              clearSuccess()
            }}
            className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-btn/50"
          />
        </div>
        <div className="space-y-1.5">
          <label className="text-sm font-semibold text-accent-muted px-1">Current Stage</label>
          <select
            value={stage}
            onChange={e => {
              setStage(e.target.value as DbIdea["stage"])
              clearSuccess()
            }}
            className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-btn/50"
          >
            <option value="idea">Just an Idea</option>
            <option value="mvp">Building MVP</option>
            <option value="growth">Early Growth</option>
          </select>
        </div>
      </div>

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
          {isPending ? <Sparkles className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          {isPending ? "Reassessing..." : "Save & Reassess"}
        </button>
      </div>
    </form>
  )
}
