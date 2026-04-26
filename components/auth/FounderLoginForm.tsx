"use client"

import { useState, useTransition } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Loader2, Rocket } from "lucide-react"
import { AuthCard } from "@/components/auth/AuthCard"
import { FormInput } from "@/components/ui/FormInput"
import { login } from "@/actions/auth/login"
import { LoginSchema } from "@/lib/validations"

// ─── Founder Login Form ────────────────────────────────────────────────────
export function FounderLoginForm() {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [formData, setFormData] = useState({ email: "", password: "" })
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({})
  const [generalError, setGeneralError] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setErrors({})
    setGeneralError("")

    const parsed = LoginSchema.safeParse({ ...formData, role: "founder" })
    if (!parsed.success) {
      const errs: Record<string, string> = {}
      parsed.error.issues.forEach((i) => { errs[i.path[0] as string] = i.message })
      setErrors(errs)
      return
    }

    startTransition(async () => {
      const data = new FormData()
      data.append("email", formData.email)
      data.append("password", formData.password)
      data.append("role", "founder")

      const res = await login(data)
      if (res.error) {
        setGeneralError(res.error)
      } else {
        router.push("/dashboard")
        router.refresh()
      }
    })
  }

  return (
    <AuthCard
      title="Founder Login"
      subtitle="Sign in to your founder account"
      icon={<Rocket className="w-6 h-6 text-btn" />}
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        <FormInput
          label="Email Address"
          type="email"
          placeholder="you@startup.com"
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

        <div className="flex justify-end">
          <Link href="/forgot-password" className="text-xs text-accent-muted hover:text-btn transition-colors">
            Forgot password?
          </Link>
        </div>

        {generalError && (
          <div className="bg-error/10 text-error p-3 rounded-xl text-sm text-center border border-error/20 animate-in fade-in">
            {generalError}
          </div>
        )}

        <button
          type="submit"
          disabled={isPending}
          className="w-full bg-btn hover:bg-btn-hover text-btn-text h-12 rounded-2xl font-bold transition-all hover:shadow-[0_0_20px_rgba(248,198,98,0.3)] active:scale-[0.98] flex items-center justify-center disabled:opacity-70"
        >
          {isPending ? <Loader2 className="w-5 h-5 animate-spin" /> : "Sign In as Founder"}
        </button>

        <p className="text-center text-accent-muted text-sm pt-2">
          Don&apos;t have an account?{" "}
          <Link href="/register/founder" className="text-btn hover:underline font-semibold">
            Register as Founder
          </Link>
        </p>
        <p className="text-center text-accent-muted text-xs">
          <Link href="/login" className="hover:text-accent-yellow transition-colors">
            ← Switch role
          </Link>
        </p>
      </form>
    </AuthCard>
  )
}
