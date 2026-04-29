"use client"

import React, { useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import { submitIdeaAction } from "@/actions/ideas"
import { FormInput } from "@/components/ui/FormInput"
import { SelectInput } from "@/components/ui/SelectInput"

export function SubmitIdeaForm() {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState("")
  const [stage, setStage] = useState("idea")

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError("")
    const formData = new FormData(e.currentTarget)
    // Ensure stage is included from controlled state
    formData.set("stage", stage)

    startTransition(async () => {
      const res = await submitIdeaAction(formData)
      if (res?.error) {
        setError(res.error)
      } else {
        router.push("/dashboard/founder/ideas")
        router.refresh()
      }
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <FormInput
        name="title"
        label="Startup/Idea Title"
        placeholder="e.g. AI-powered note taking"
        required
        minLength={5}
      />

      <div className="space-y-1.5">
        <label className="text-sm font-semibold text-accent-muted px-1">Description</label>
        <textarea
          name="description"
          required
          minLength={20}
          placeholder="Describe the problem, solution, and target audience..."
          className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-btn/50 min-h-[150px] resize-y"
        ></textarea>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormInput
          name="industry"
          label="Industry"
          placeholder="e.g. EdTech, SaaS"
          required
        />
        <SelectInput
          label="Current Stage"
          value={stage}
          onChange={setStage}
          options={[
            { value: "idea", label: "Just an Idea" },
            { value: "mvp", label: "Building MVP" },
            { value: "growth", label: "Early Growth" },
          ]}
          required
        />
      </div>

      {error && (
        <div className="text-error text-sm bg-error/10 border border-error/20 px-4 py-3 rounded-xl">
          {error}
        </div>
      )}

      <div className="pt-4 border-t border-white/5">
        <button
          type="submit"
          disabled={isPending}
          className="w-full bg-btn text-btn-foreground py-3 rounded-xl font-bold hover:bg-btn/90 transition-colors shadow-lg shadow-btn/20 disabled:opacity-60"
        >
          {isPending ? "Submitting…" : "Submit for Validation"}
        </button>
      </div>
    </form>
  )
}
