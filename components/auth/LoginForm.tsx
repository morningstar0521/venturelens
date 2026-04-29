"use client"

import { useState, useTransition } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Loader2 } from "lucide-react"
import { AuthCard } from "@/components/auth/AuthCard"
import { FormInput } from "@/components/ui/FormInput"
import { login } from "@/actions/auth/login"
import { LoginSchema, type LoginInput } from "@/lib/validations"

export function LoginForm() {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [formData, setFormData] = useState<LoginInput>({ email: "", password: "", role: "founder" })
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({})
  const [generalError, setGeneralError] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setErrors({})
    setGeneralError("")

    const parsed = LoginSchema.safeParse(formData)
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
      data.append("email", formData.email)
      data.append("password", formData.password)

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
    <AuthCard title="Welcome Back" subtitle="Sign in to your account">
      <form onSubmit={handleSubmit} className="space-y-5">
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

        {generalError && (
          <div className="bg-error/10 text-error p-3 rounded-xl text-sm text-center border border-error/20 animate-in fade-in">
            {generalError}
          </div>
        )}

        <button
          type="submit"
          disabled={isPending}
          className="w-full bg-btn hover:bg-btn-hover text-btn-text h-12 rounded-2xl font-bold transition-all hover:shadow-[0_0_20px_rgba(248,198,98,0.3)] active:scale-[0.98] flex items-center justify-center disabled:opacity-70 disabled:active:scale-100"
        >
          {isPending ? <Loader2 className="w-5 h-5 animate-spin" /> : "Sign In"}
        </button>

        <p className="text-center text-accent-muted text-sm pt-2">
          Don't have an account?{" "}
          <Link href="/register" className="text-btn hover:underline font-semibold transition-colors">
            Sign up
          </Link>
        </p>
      </form>
    </AuthCard>
  )
}
