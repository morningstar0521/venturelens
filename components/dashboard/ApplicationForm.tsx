"use client"

import React, { useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import { applyToIdeaAction, applyToRoleAction } from "@/actions/applications"
import { Briefcase, Upload, Send, ChevronLeft, Loader2 } from "lucide-react"

interface ApplicationFormProps {
  ideaId: string
  ideaTitle: string
  roleId?: string
  roleTitle?: string
}

export function ApplicationForm({ ideaId, ideaTitle, roleId, roleTitle }: ApplicationFormProps) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)
  
  // Form state
  const [message, setMessage] = useState("")
  const [q1, setQ1] = useState("")
  const [q2, setQ2] = useState("")
  const [q3, setQ3] = useState("")
  const [resumeBase64, setResumeBase64] = useState<string | null>(null)
  const [fileName, setFileName] = useState<string | null>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (file.size > 2 * 1024 * 1024) {
      alert("File is too large. Max 2MB.")
      return
    }

    setFileName(file.name)
    const reader = new FileReader()
    reader.onloadend = () => {
      setResumeBase64(reader.result as string)
    }
    reader.readAsDataURL(file)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    const formData = new FormData()
    formData.append("message", message)
    formData.append("resumeUrl", resumeBase64 || "")
    formData.append("questionnaireAnswers", JSON.stringify({
      "Why do you want to join?": q1,
      "What relevant experience do you have?": q2,
      "What is your expected contribution?": q3,
    }))

    startTransition(async () => {
      let result
      if (roleId) {
        result = await applyToRoleAction(ideaId, roleId, formData)
      } else {
        result = await applyToIdeaAction(ideaId, formData)
      }

      if (result?.error) {
        setError(result.error)
      } else {
        router.push("/dashboard/employee/applications")
      }
    })
  }

  return (
    <div className="max-w-2xl mx-auto">
      <button 
        onClick={() => router.back()}
        className="flex items-center gap-2 text-accent-muted hover:text-white mb-6 transition-colors"
      >
        <ChevronLeft className="w-4 h-4" /> Back to Browse
      </button>

      <div className="glass-panel rounded-[2rem] border border-white/10 overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="p-8 border-b border-white/10 bg-white/5">
          <div className="flex items-center gap-4 mb-2">
            <div className="w-12 h-12 rounded-2xl bg-btn/10 border border-btn/20 flex items-center justify-center">
              <Briefcase className="w-6 h-6 text-btn" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">Apply to {ideaTitle}</h1>
              {roleTitle && <p className="text-accent-yellow font-bold text-sm">Role: {roleTitle}</p>}
            </div>
          </div>
          <p className="text-sm text-accent-muted">Complete the application to connect with the founder.</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-8 space-y-8">
          {error && (
            <div className="p-4 rounded-xl bg-error/10 border border-error/20 text-error text-sm font-bold animate-in fade-in slide-in-from-top-1">
              {error}
            </div>
          )}

          {/* Questionnaire */}
          <div className="space-y-6">
            <div className="space-y-2">
              <label className="text-xs font-black text-white/30 uppercase tracking-widest">Why do you want to join this startup?</label>
              <textarea
                required
                value={q1}
                onChange={(e) => setQ1(e.target.value)}
                placeholder="Share your motivation..."
                rows={3}
                className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-btn/40 transition-colors resize-none"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-black text-white/30 uppercase tracking-widest">What relevant experience do you have?</label>
              <textarea
                required
                value={q2}
                onChange={(e) => setQ2(e.target.value)}
                placeholder="Describe your background..."
                rows={3}
                className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-btn/40 transition-colors resize-none"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-black text-white/30 uppercase tracking-widest">What is your expected contribution?</label>
              <textarea
                required
                value={q3}
                onChange={(e) => setQ3(e.target.value)}
                placeholder="How will you help the idea grow?"
                rows={3}
                className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-btn/40 transition-colors resize-none"
              />
            </div>
          </div>

          {/* Cover Message */}
          <div className="space-y-2">
            <label className="text-xs font-black text-white/30 uppercase tracking-widest">Additional Message (Optional)</label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Anything else you'd like to say?"
              rows={2}
              className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-btn/40 transition-colors resize-none"
            />
          </div>

          {/* Resume Upload */}
          <div className="space-y-2">
            <label className="text-xs font-black text-white/30 uppercase tracking-widest">Resume / CV</label>
            <div className="relative group">
              <input
                type="file"
                accept=".pdf,.doc,.docx"
                onChange={handleFileChange}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
              />
              <div className={`p-8 border-2 border-dashed rounded-[2rem] flex flex-col items-center justify-center gap-3 transition-all ${
                fileName ? "border-success/40 bg-success/5" : "border-white/10 bg-white/2 group-hover:border-btn/30 group-hover:bg-btn/5"
              }`}>
                <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                  fileName ? "bg-success/20 text-success" : "bg-white/10 text-white/40"
                }`}>
                  <Upload className="w-6 h-6" />
                </div>
                <div className="text-center">
                  <p className={`text-sm font-bold ${fileName ? "text-success" : "text-white/60"}`}>
                    {fileName || "Upload your resume"}
                  </p>
                  <p className="text-[10px] text-white/20 uppercase tracking-widest mt-1">PDF, DOCX (Max 2MB)</p>
                </div>
              </div>
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={isPending}
            className="w-full py-5 rounded-[1.5rem] bg-btn text-btn-foreground font-black text-lg shadow-[0_10px_30px_rgba(234,237,135,0.2)] hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50 disabled:scale-100 flex items-center justify-center gap-3"
          >
            {isPending ? (
              <>
                <Loader2 className="w-6 h-6 animate-spin" /> Submitting Application...
              </>
            ) : (
              <>
                <Send className="w-5 h-5" /> Send Application
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  )
}
