"use client"

import { ChevronDown } from "lucide-react"

interface SelectOption { value: string; label: string }

interface SelectInputProps {
  label: string
  value: string
  onChange: (value: string) => void
  options: SelectOption[]
  placeholder?: string
  error?: string
  disabled?: boolean
}

// ─── Styled select input matching the glass design system ─────────────────
export function SelectInput({ label, value, onChange, options, placeholder = "Select an option", error, disabled }: SelectInputProps) {
  return (
    <div className="space-y-1.5">
      <label className="block text-sm font-medium text-accent-yellow/90">{label}</label>
      <div className="relative">
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          disabled={disabled}
          className={`w-full h-12 rounded-2xl px-4 pr-10 appearance-none
            bg-bg-secondary/50 border backdrop-blur-md text-sm transition-all duration-300 outline-none
            ${!value ? "text-white/30" : "text-white"}
            ${error
              ? "border-error focus:border-error"
              : "border-border-subtle focus:border-focus focus:ring-1 focus:ring-focus"
            }
            ${disabled ? "opacity-60 cursor-not-allowed" : "cursor-pointer"}`}
        >
          <option value="" disabled hidden>{placeholder}</option>
          {options.map((opt) => (
            <option key={opt.value} value={opt.value} className="bg-card text-white">
              {opt.label}
            </option>
          ))}
        </select>
        <ChevronDown className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
      </div>
      {error && <p className="text-xs text-error mt-1">{error}</p>}
    </div>
  )
}
