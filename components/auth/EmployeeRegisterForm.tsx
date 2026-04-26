"use client"

import { useState, useTransition } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Loader2, Briefcase } from "lucide-react"
import { AuthCard } from "@/components/auth/AuthCard"
import { FormInput } from "@/components/ui/FormInput"
import { TagInput } from "@/components/ui/TagInput"
import { SelectInput } from "@/components/ui/SelectInput"
import { registerEmployee } from "@/actions/auth/register"
import { login } from "@/actions/auth/login"
import { EmployeeRegisterSchema, type EmployeeRegisterInput } from "@/lib/validations"
import { cn } from "@/lib/utils"

const EXPERIENCE_OPTIONS = [
  { value: "junior", label: "Junior (0–2 years)" },
  { value: "mid",    label: "Mid-level (2–5 years)" },
  { value: "senior", label: "Senior (5–10 years)" },
  { value: "lead",   label: "Lead / Principal (10+ years)" },
]

// ─── Employee Registration Form ────────────────────────────────────────────
export function EmployeeRegisterForm() {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [formData, setFormData] = useState({
    name: "", email: "", password: "", confirmPassword: "", experience: "",
  })
  const [skills, setSkills] = useState<string[]>([])
  const [errors, setErrors] = useState<Partial<Record<keyof EmployeeRegisterInput, string>>>({})
  const [generalError, setGeneralError] = useState("")
  const [successMsg, setSuccessMsg] = useState("")

  const getStrength = (p: string) => {
    let s = 0
    if (p.length > 7) s++; if (p.length > 10) s++
    if (/[A-Z]/.test(p)) s++; if (/[0-9]/.test(p)) s++
    return Math.min(4, s)
  }
  const strength = getStrength(formData.password)

  const set = (k: keyof typeof formData) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setFormData((prev) => ({ ...prev, [k]: e.target.value }))

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setErrors({}); setGeneralError("")

    const parsed = EmployeeRegisterSchema.safeParse({ ...formData, skills })
    if (!parsed.success) {
      const errs: Record<string, string> = {}
      parsed.error.issues.forEach((i) => { errs[i.path[0] as string] = i.message })
      setErrors(errs); return
    }

    startTransition(async () => {
      const data = new FormData()
      Object.entries(formData).forEach(([k, v]) => data.append(k, v))
      data.append("skills", skills.join(","))

      const res = await registerEmployee(data)
      if (res.error) { setGeneralError(res.error); return }

      setSuccessMsg(res.success!)
      const loginData = new FormData()
      loginData.append("email", formData.email)
      loginData.append("password", formData.password)
      loginData.append("role", "employee")
      const loginRes = await login(loginData)
      if (!loginRes.error) { router.push("/dashboard"); router.refresh() }
    })
  }

  return (
    <AuthCard title="Contributor Registration" subtitle="Join as a skilled contributor"
      icon={<Briefcase className="w-6 h-6 text-btn" />}>
      <form onSubmit={handleSubmit} className="space-y-4">
        {successMsg && (
          <div className="bg-success/10 text-success p-3 rounded-xl text-sm text-center border border-success/20 animate-in fade-in flex items-center justify-center gap-2">
            <Loader2 className="w-4 h-4 animate-spin" /> {successMsg}
          </div>
        )}

        <div className={successMsg ? "hidden" : "space-y-4"}>
          <FormInput label="Full Name" placeholder="Alex Kumar" value={formData.name}
            onChange={set("name")} error={errors.name} disabled={isPending} />
          <FormInput label="Email Address" type="email" placeholder="alex@example.com"
            value={formData.email} onChange={set("email")} error={errors.email} disabled={isPending} />

          <TagInput label="Skills" value={skills} onChange={setSkills}
            error={errors.skills} disabled={isPending}
            placeholder="e.g. React, Python, UI/UX..." />

          <SelectInput label="Experience Level" value={formData.experience}
            onChange={(v) => setFormData((p) => ({ ...p, experience: v }))}
            options={EXPERIENCE_OPTIONS} placeholder="Select experience level"
            error={errors.experience} disabled={isPending} />

          <FormInput label="Password" type="password" placeholder="••••••••"
            value={formData.password} onChange={set("password")} error={errors.password} disabled={isPending} />

          {formData.password.length > 0 && (
            <div className="flex gap-1 h-1.5 w-full rounded-full overflow-hidden px-1">
              {[...Array(4)].map((_, i) => (
                <div key={i} className={cn("h-full flex-1 rounded-full transition-all duration-300",
                  i < strength
                    ? strength < 2 ? "bg-error" : strength < 3 ? "bg-btn" : "bg-success"
                    : "bg-white/10"
                )} />
              ))}
            </div>
          )}

          <FormInput label="Confirm Password" type="password" placeholder="••••••••"
            value={formData.confirmPassword} onChange={set("confirmPassword")}
            error={errors.confirmPassword} disabled={isPending} />

          {generalError && (
            <div className="bg-error/10 text-error p-3 rounded-xl text-sm text-center border border-error/20 animate-in fade-in">
              {generalError}
            </div>
          )}

          <button type="submit" disabled={isPending}
            className="w-full bg-btn hover:bg-btn-hover text-btn-text h-12 rounded-2xl font-bold transition-all hover:shadow-[0_0_20px_rgba(248,198,98,0.3)] active:scale-[0.98] flex items-center justify-center disabled:opacity-70 mt-2">
            {isPending ? <Loader2 className="w-5 h-5 animate-spin" /> : "Create Contributor Account"}
          </button>

          <p className="text-center text-accent-muted text-sm pt-2">
            Already have an account?{" "}
            <Link href="/login/employee" className="text-btn hover:underline font-semibold">Sign in</Link>
          </p>
          <p className="text-center text-accent-muted text-xs">
            <Link href="/register" className="hover:text-accent-yellow transition-colors">← Switch role</Link>
          </p>
        </div>
      </form>
    </AuthCard>
  )
}
