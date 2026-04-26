"use client"

import { useState, KeyboardEvent } from "react"
import { X } from "lucide-react"

interface TagInputProps {
  label: string
  value: string[]
  onChange: (tags: string[]) => void
  error?: string
  disabled?: boolean
  placeholder?: string
}

// ─── Multi-tag input for skills ────────────────────────────────────────────
export function TagInput({ label, value, onChange, error, disabled, placeholder = "Type a skill and press Enter" }: TagInputProps) {
  const [input, setInput] = useState("")

  const addTag = () => {
    const trimmed = input.trim()
    if (trimmed && !value.includes(trimmed)) {
      onChange([...value, trimmed])
    }
    setInput("")
  }

  const handleKey = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault()
      addTag()
    }
    if (e.key === "Backspace" && !input && value.length > 0) {
      onChange(value.slice(0, -1))
    }
  }

  const removeTag = (tag: string) => onChange(value.filter((t) => t !== tag))

  return (
    <div className="space-y-1.5">
      <label className="block text-sm font-medium text-accent-yellow/90">{label}</label>
      <div
        className={`min-h-[48px] w-full rounded-2xl px-3 py-2 flex flex-wrap gap-2 items-center
          bg-bg-secondary/50 border backdrop-blur-md transition-all duration-300
          ${error ? "border-error focus-within:border-error" : "border-border-subtle focus-within:border-focus focus-within:ring-1 focus-within:ring-focus"}
          ${disabled ? "opacity-60 cursor-not-allowed" : "cursor-text"}`}
      >
        {value.map((tag) => (
          <span key={tag} className="flex items-center gap-1 bg-btn/20 text-btn text-xs font-semibold px-2.5 py-1 rounded-xl border border-btn/30">
            {tag}
            {!disabled && (
              <button type="button" onClick={() => removeTag(tag)} className="hover:text-white transition-colors ml-0.5">
                <X className="w-3 h-3" />
              </button>
            )}
          </span>
        ))}
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKey}
          onBlur={addTag}
          disabled={disabled}
          placeholder={value.length === 0 ? placeholder : ""}
          className="flex-1 min-w-[140px] bg-transparent outline-none text-sm text-white placeholder:text-white/30"
        />
      </div>
      {error && <p className="text-xs text-error mt-1">{error}</p>}
      <p className="text-xs text-white/30">Press Enter or comma to add a skill</p>
    </div>
  )
}
