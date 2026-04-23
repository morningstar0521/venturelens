"use client"

import { useState, useTransition } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Loader2 } from "lucide-react"
import { AuthCard } from "@/components/auth/AuthCard"
import { FormInput } from "@/components/ui/FormInput"
import { register } from "@/actions/auth/register"
import { login } from "@/actions/auth/login"
import { RegisterSchema, type RegisterInput } from "@/lib/validations"
import { cn } from "@/lib/utils"

export function RegisterForm() {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [formData, setFormData] = useState<RegisterInput>({
    name: "", email: "", password: "", confirmPassword: "",
  })
  const [errors, setErrors] = useState<Partial<Record<keyof RegisterInput, string>>>({})
  const [generalError, setGeneralError] = useState("")
  const [successMsg, setSuccessMsg] = useState("")

  const getStrengthScore = (pass: string) => {
    let score = 0
    if (pass.length > 7) score++
    if (pass.length > 10) score++
    if (/[A-Z]/.test(pass)) score++
    if (/[0-9]/.test(pass)) score++
    if (/[^A-Za-z0-9]/.test(pass)) score++
    return Math.min(4, score)
  }
  const strength = getStrengthScore(formData.password)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setErrors({})
    setGeneralError("")
    setSuccessMsg("")

    const parsed = RegisterSchema.safeParse(formData)
    if (!parsed.success) {
      const formattedErrors: any = {}
      parsed.error.issues.forEach((issue) => {
        formattedErrors[issue.path[0]] = issue.message
      })
      setErrors(formattedErrors)
      return
    }

    startTransition(async () => {
      const data = new FormData()
      data.append("name", formData.name)
      data.append("email", formData.email)
      data.append("password", formData.password)
      data.append("confirmPassword", formData.confirmPassword)

      const res = await register(data)
      if (res.error) {
        setGeneralError(res.error)
      } else {
        setSuccessMsg(res.success ?? "Account created successfully!")
        // Auto-login after registration
        const loginData = new FormData()
        loginData.append("email", formData.email)
        loginData.append("password", formData.password)
        const loginRes = await login(loginData)
        if (!loginRes.error) {
          router.push("/dashboard")
          router.refresh()
        }
      }
    })
  }

  return (
    <AuthCard title="Create Account" subtitle="Join us to get started">
      <form onSubmit={handleSubmit} className="space-y-4">
        {successMsg && (
          <div className="bg-success/10 text-success p-3 rounded-xl text-sm text-center border border-success/20 animate-in fade-in">
            {successMsg}
            <div className="mt-2 text-xs opacity-80 flex items-center justify-center gap-2">
              <Loader2 className="w-3 h-3 animate-spin" /> Logging you in...
            </div>
          </div>
        )}

        <div className="space-y-4" style={{ display: successMsg ? "none" : "block" }}>
          <FormInput
            label="Full Name"
            placeholder="John Doe"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            error={errors.name}
            disabled={isPending}
          />

          <FormInput
            label="Email Address"
            type="email"
            placeholder="you@example.com"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            error={errors.email}
            disabled={isPending}
          />

          <FormInput
            label="Password"
            type="password"
            placeholder="••••••••"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            error={errors.password}
            disabled={isPending}
          />

          {/* Password Strength Indicator */}
          {formData.password.length > 0 && (
            <div className="flex gap-1 h-1.5 w-full rounded-full overflow-hidden mt-1 px-1">
              {[...Array(4)].map((_, i) => (
                <div
                  key={i}
                  className={cn(
                    "h-full flex-1 transition-all duration-300",
                    i < strength
                      ? strength < 2 ? "bg-error" : strength < 3 ? "bg-btn" : "bg-success"
                      : "bg-white/10"
                  )}
                />
              ))}
            </div>
          )}

          <FormInput
            label="Confirm Password"
            type="password"
            placeholder="••••••••"
            value={formData.confirmPassword}
            onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
            error={errors.confirmPassword}
            disabled={isPending}
          />

          {generalError && (
            <div className="bg-error/10 text-error p-3 rounded-xl text-sm text-center border border-error/20 animate-in fade-in">
              {generalError}
            </div>
          )}

          <button
            type="submit"
            disabled={isPending}
            className="w-full mt-2 bg-btn hover:bg-btn-hover text-btn-text h-12 rounded-2xl font-bold transition-all hover:shadow-[0_0_20px_rgba(248,198,98,0.3)] active:scale-[0.98] flex items-center justify-center disabled:opacity-70 disabled:active:scale-100"
          >
            {isPending ? <Loader2 className="w-5 h-5 animate-spin" /> : "Create Account"}
          </button>

          <p className="text-center text-accent-muted text-sm pt-2">
            Already have an account?{" "}
            <Link href="/login" className="text-btn hover:underline font-semibold transition-colors">
              Sign in
            </Link>
          </p>
        </div>
      </form>
    </AuthCard>
  )
}
