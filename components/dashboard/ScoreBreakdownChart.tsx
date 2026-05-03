"use client"

import React from "react"

interface Category {
  label: string
  score: number
  weight: string
  color: string
}

interface ScoreBreakdownChartProps {
  marketScore:      number
  competitionScore: number
  feasibilityScore: number
  riskScore:        number
  ventureScore:     number
}

function barColor(score: number): string {
  if (score >= 70) return "bg-success"
  if (score >= 50) return "bg-btn"
  return "bg-error"
}

export function ScoreBreakdownChart({
  marketScore,
  competitionScore,
  feasibilityScore,
  riskScore,
  ventureScore,
}: ScoreBreakdownChartProps) {
  const innovationScore = Math.min(100, Math.round((marketScore * 0.4 + feasibilityScore * 0.6) - 5))

  const categories: Category[] = [
    { label: "Market Potential",       score: marketScore,      weight: "30%",  color: barColor(marketScore) },
    { label: "Competition Advantage",  score: competitionScore, weight: "20%",  color: barColor(competitionScore) },
    { label: "Feasibility",            score: feasibilityScore, weight: "25%",  color: barColor(feasibilityScore) },
    { label: "Risk Factor",            score: riskScore,        weight: "15%",  color: barColor(riskScore) },
    { label: "Innovation",             score: innovationScore,  weight: "10%",  color: barColor(innovationScore) },
  ]

  return (
    <div className="space-y-4">
      {categories.map((cat) => (
        <div key={cat.label} className="space-y-1.5">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium text-white/80">{cat.label}</span>
            <div className="flex items-center gap-2">
              <span className="text-xs text-white/30">{cat.weight}</span>
              <span className="text-sm font-bold text-white">{cat.score}</span>
            </div>
          </div>
          <div className="h-2.5 bg-white/5 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-1000 ease-out ${cat.color}`}
              style={{ width: `${cat.score}%` }}
            />
          </div>
        </div>
      ))}

      {/* Final score bar */}
      <div className="mt-6 pt-4 border-t border-white/5">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-bold text-accent-yellow">Venture Score (Composite)</span>
          <span className="text-lg font-black text-accent-yellow">{ventureScore}/100</span>
        </div>
        <div className="h-4 bg-white/5 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-1000 ease-out ${barColor(ventureScore)} shadow-lg`}
            style={{ width: `${ventureScore}%` }}
          />
        </div>
      </div>
    </div>
  )
}
