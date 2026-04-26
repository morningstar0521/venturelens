"use client"

import { useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import { Loader2, ShieldCheck } from "lucide-react"
import { FormInput } from "@/components/ui/FormInput"
import { login } from "@/actions/auth/login"

// ─── Admin Login Form (hardcoded credentials, dark variant) ───────────────
export function AdminLoginForm() {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [formData, setFormData] = useState({ email: "", password: "" })
  const [generalError, setGeneralError] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setGeneralError("")

    if (!formData.email || !formData.password) {
      setGeneralError("Please enter your credentials.")
      return
    }

    startTransition(async () => {
      const data = new FormData()
      data.append("email", formData.email)
      data.append("password", formData.password)
      data.append("role", "admin")

      const res = await login(data)
      if (res.error) {
        setGeneralError("Access denied. Invalid admin credentials.")
      } else {
        router.push("/admin/dashboard")
        router.refresh()
      }
    })
  }

  return (
    <div className="w-full max-w-md mx-auto">
      {/* Admin card — darker variant */}
      <div className="bg-card/80 backdrop-blur-2xl border-2 border-border-subtle rounded-3xl p-9 shadow-[0_8px_64px_rgba(0,0,0,0.55),0_0_0_1px_rgba(255,107,107,0.07)] ring-1 ring-white/5 space-y-8">
        {/* Header */}
        <div className="text-center space-y-3">
          <div className="inline-flex w-16 h-16 rounded-2xl bg-error/10 border border-error/20 items-center justify-center mx-auto">
            <ShieldCheck className="w-8 h-8 text-error" />
          </div>
          <div>
            <h1 className="text-2xl font-extrabold text-accent-yellow">Admin Portal</h1>
            <p className="text-sm text-accent-muted mt-1">Restricted access — authorised personnel only</p>
          </div>
        </div>

        {/* Divider */}
        <div className="h-px bg-gradient-to-r from-transparent via-error/20 to-transparent" />

        <form onSubmit={handleSubmit} className="space-y-5">
          <FormInput
            label="Admin Email"
            type="email"
            placeholder="admin@venturelens.ai"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            disabled={isPending}
          />
          <FormInput
            label="Password"
            type="password"
            placeholder="••••••••••••"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            disabled={isPending}
          />

          {generalError && (
            <div className="bg-error/10 text-error p-3 rounded-xl text-sm text-center border border-error/20 animate-in fade-in flex items-center gap-2 justify-center">
              <ShieldCheck className="w-4 h-4 flex-shrink-0" />
              {generalError}
            </div>
          )}

          <button
            type="submit"
            disabled={isPending}
            className="w-full bg-error/80 hover:bg-error text-white h-12 rounded-2xl font-bold transition-all hover:shadow-[0_0_20px_rgba(255,107,107,0.3)] active:scale-[0.98] flex items-center justify-center disabled:opacity-70 mt-2"
          >
            {isPending ? <Loader2 className="w-5 h-5 animate-spin" /> : "Secure Sign In"}
          </button>
        </form>

        <p className="text-center text-xs text-accent-muted pt-2 border-t border-white/5">
          Not an admin?{" "}
          <a href="/login" className="text-btn hover:underline">Return to main login</a>
        </p>
      </div>
    </div>
  )
}
