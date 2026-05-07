"use client"

import { forwardRef, useState } from "react"
import { Eye, EyeOff } from "lucide-react"
import { cn } from "@/lib/utils"

interface FormInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string
  error?: string
}

export const FormInput = forwardRef<HTMLInputElement, FormInputProps>(
  ({ label, error, type = "text", className, ...props }, ref) => {
    const [showPassword, setShowPassword] = useState(false)
    const isPassword = type === "password"
    const inputType = isPassword ? (showPassword ? "text" : "password") : type

    return (
      <div className="space-y-1.5 flex flex-col w-full">
        <label className="text-sm font-bold text-accent-muted pl-1">
          {label}
        </label>
        <div className="relative">
          <input
            {...props}
            type={inputType}
            ref={ref}
            className={cn(
              "glass-input w-full rounded-2xl px-4 py-3.5 text-white placeholder:text-accent-muted/45 outline-none",
              isPassword && "pr-12",
              error && "border-error focus:ring-error focus:border-error animate-shake",
              className
            )}
          />
          {isPassword && (
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-accent-muted hover:text-accent-yellow transition-colors"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          )}
        </div>
        {error && (
          <p className="text-error text-xs font-medium pl-1 animate-in slide-in-from-top-1">
            {error}
          </p>
        )}
      </div>
    )
  }
)
FormInput.displayName = "FormInput"
