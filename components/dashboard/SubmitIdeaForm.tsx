"use client"

import React, { useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import { submitIdeaAction } from "@/actions/ideas"
import { FormInput } from "@/components/ui/FormInput"
import { SelectInput } from "@/components/ui/SelectInput"
import { Sparkles, FileText, Users, DollarSign, Building2, Layers, Cpu, ChevronDown, ChevronUp } from "lucide-react"

function Textarea({
  name,
  label,
  placeholder,
  required,
  minLength,
  icon: Icon,
}: {
  name: string
  label: string
  placeholder: string
  required?: boolean
  minLength?: number
  icon?: React.ElementType
}) {
  return (
    <div className="space-y-1.5">
      <label className="text-sm font-semibold text-accent-muted px-1 flex items-center gap-1.5">
        {Icon && <Icon className="w-3.5 h-3.5" />}
        {label}
        {required && <span className="text-btn text-xs">*</span>}
      </label>
      <textarea
        name={name}
        required={required}
        minLength={minLength}
        placeholder={placeholder}
        className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/30 focus:outline-none focus:border-btn/50 focus:ring-1 focus:ring-btn/20 min-h-[110px] resize-y transition-colors duration-200"
      />
    </div>
  )
}

export function SubmitIdeaForm() {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState("")
  const [stage, setStage] = useState("idea")
  const [showAdvanced, setShowAdvanced] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError("")
    const formData = new FormData(e.currentTarget)
    formData.set("stage", stage)

    startTransition(async () => {
      const res = await submitIdeaAction(formData)
      if (res?.error) {
        setError(res.error)
      } else {
        setSubmitted(true)
        setTimeout(() => {
          router.push("/dashboard/founder/ideas")
          router.refresh()
        }, 1500)
      }
    })
  }

  if (submitted) {
    return (
      <div className="flex flex-col items-center justify-center py-16 gap-6 text-center">
        <div className="w-20 h-20 rounded-full bg-btn/10 border-2 border-btn/30 flex items-center justify-center animate-pulse">
          <Cpu className="w-10 h-10 text-btn" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-accent-yellow mb-2">Idea Submitted!</h2>
          <p className="text-accent-muted max-w-sm">
            Our AI engine is now evaluating your idea. This takes 30–60 seconds. Redirecting to your ideas…
          </p>
        </div>
        <div className="flex gap-1.5">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="w-2 h-2 rounded-full bg-btn animate-bounce"
              style={{ animationDelay: `${i * 0.15}s` }}
            />
          ))}
        </div>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Core fields */}
      <div className="space-y-4">
        <FormInput
          name="title"
          label="Startup / Idea Title"
          placeholder="e.g. AI-powered note taking for engineers"
          required
          minLength={5}
        />

        <Textarea
          name="description"
          label="Brief Overview"
          placeholder="A short summary of what this startup does (shown on your idea card)…"
          required
          minLength={20}
          icon={FileText}
        />
      </div>

      {/* Advanced: AI-evaluated fields */}
      <div className="border border-white/10 rounded-2xl overflow-hidden">
        <button
          type="button"
          onClick={() => setShowAdvanced((v) => !v)}
          className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-white/5 transition-colors"
        >
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-btn/10 border border-btn/20 flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-btn" />
            </div>
            <div>
              <span className="font-semibold text-white text-sm">AI Evaluation Fields</span>
              <p className="text-xs text-accent-muted mt-0.5">Fill these for a more accurate Venture Score</p>
            </div>
          </div>
          {showAdvanced ? (
            <ChevronUp className="w-4 h-4 text-accent-muted" />
          ) : (
            <ChevronDown className="w-4 h-4 text-accent-muted" />
          )}
        </button>

        {showAdvanced && (
          <div className="px-5 pb-5 space-y-4 border-t border-white/5 pt-4">
            <Textarea
              name="problemStatement"
              label="Problem Statement"
              placeholder="What specific problem does this solve? Who suffers from it? How painful is it?"
              minLength={20}
              icon={FileText}
            />
            <Textarea
              name="solution"
              label="Your Solution"
              placeholder="How does your product solve the problem? What makes it unique?"
              minLength={20}
              icon={Sparkles}
            />
            <Textarea
              name="targetAudience"
              label="Target Audience"
              placeholder="Who are your ideal customers? Age, profession, geography, company size?"
              minLength={10}
              icon={Users}
            />
            <Textarea
              name="revenueModel"
              label="Revenue Model"
              placeholder="How will you make money? SaaS subscription, marketplace fees, advertising, freemium?"
              minLength={10}
              icon={DollarSign}
            />
          </div>
        )}
      </div>

      {/* Industry + Stage */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <label className="text-sm font-semibold text-accent-muted px-1 flex items-center gap-1.5">
            <Building2 className="w-3.5 h-3.5" />
            Industry <span className="text-btn text-xs">*</span>
          </label>
          <input
            name="industry"
            required
            placeholder="e.g. EdTech, FinTech, HealthTech, SaaS"
            className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/30 focus:outline-none focus:border-btn/50 focus:ring-1 focus:ring-btn/20 transition-colors duration-200"
          />
        </div>
        <SelectInput
          label="Current Stage"
          value={stage}
          onChange={setStage}
          options={[
            { value: "idea",   label: "💡 Just an Idea" },
            { value: "mvp",    label: "🔧 Building MVP" },
            { value: "growth", label: "🚀 Early Growth" },
          ]}
          required
        />
      </div>

      {/* File upload (disabled placeholder) */}
      <div className="space-y-1.5">
        <label className="text-sm font-semibold text-accent-muted px-1 flex items-center gap-1.5">
          <Layers className="w-3.5 h-3.5" />
          Supporting Documents <span className="text-xs text-white/20 ml-1">(Coming Soon)</span>
        </label>
        <div className="border border-dashed border-white/10 rounded-xl px-4 py-6 text-center opacity-40 cursor-not-allowed select-none">
          <p className="text-sm text-accent-muted">PDF, PPT, DOCX — file upload coming in next release</p>
        </div>
      </div>

      {error && (
        <div className="text-error text-sm bg-error/10 border border-error/20 px-4 py-3 rounded-xl">
          {error}
        </div>
      )}

      <div className="pt-4 border-t border-white/5 flex gap-3">
        <button
          type="submit"
          disabled={isPending}
          className="flex-1 bg-btn text-btn-foreground py-3.5 rounded-xl font-bold hover:bg-btn/90 transition-all duration-200 shadow-lg shadow-btn/20 disabled:opacity-60 flex items-center justify-center gap-2"
        >
          {isPending ? (
            <>
              <div className="w-4 h-4 border-2 border-btn-foreground/30 border-t-btn-foreground rounded-full animate-spin" />
              Submitting…
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4" />
              Submit for AI Evaluation
            </>
          )}
        </button>
      </div>
    </form>
  )
}
