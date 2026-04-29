"use client"

import { ChevronDown } from "lucide-react"
import React from "react"

interface SelectOption { value: string; label: string }

interface SelectInputProps {
  label: string
  name?: string
  value?: string
  onChange?: (value: string) => void
  options: SelectOption[]
  placeholder?: string
  error?: string
  disabled?: boolean
  required?: boolean
  defaultValue?: string
}

// ─── Styled select input matching the glass design system ─────────────────
export function SelectInput({ label, name, value, onChange, options, placeholder = "Select an option", error, disabled, required, defaultValue }: SelectInputProps) {
  return (
    <div className="space-y-1.5">
      <label className="block text-sm font-medium text-accent-muted pl-1">{label}</label>
      <div className="relative">
        <select
          name={name}
          value={value}
          defaultValue={defaultValue ?? ""}
          onChange={onChange ? (e) => onChange(e.target.value) : undefined}
          disabled={disabled}
          required={required}
          className={`w-full h-12 rounded-2xl px-4 pr-10 appearance-none
            bg-bg-secondary/50 border backdrop-blur-md text-sm transition-all duration-300 outline-none text-white
            ${error
              ? "border-error focus:border-error"
              : "border-border-subtle focus:border-focus focus:ring-1 focus:ring-focus"
            }
            ${disabled ? "opacity-60 cursor-not-allowed" : "cursor-pointer"}`}
        >
          <option value="" disabled>{placeholder}</option>
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
