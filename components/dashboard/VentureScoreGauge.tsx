"use client"

import React from "react"

interface VentureScoreGaugeProps {
  score: number // 0-100
  size?: number
}

function scoreColor(score: number): string {
  if (score >= 70) return "#6bcb77" // green (success)
  if (score >= 50) return "#F8C662" // yellow (btn)
  return "#ff6b6b"                  // red (error)
}

function scoreLabel(score: number): string {
  if (score >= 80) return "Exceptional"
  if (score >= 70) return "Strong"
  if (score >= 60) return "Promising"
  if (score >= 50) return "Moderate"
  if (score >= 35) return "Needs Work"
  return "Early Stage"
}

export function VentureScoreGauge({ score, size = 220 }: VentureScoreGaugeProps) {
  const clampedScore = Math.max(0, Math.min(100, score))
  const color = scoreColor(clampedScore)
  const label = scoreLabel(clampedScore)

  // SVG arc parameters
  const cx = size / 2
  const cy = size / 2 + 10
  const radius = (size / 2) * 0.78
  const strokeWidth = size * 0.085

  // Arc goes from 210° to 330° (240° sweep) — half-circle at bottom
  const startAngle = 210
  const sweepAngle = 240
  const endAngle = startAngle + sweepAngle * (clampedScore / 100)

  function polarToCartesian(angle: number) {
    const rad = ((angle - 90) * Math.PI) / 180
    return {
      x: cx + radius * Math.cos(rad),
      y: cy + radius * Math.sin(rad),
    }
  }

  function arcPath(startDeg: number, endDeg: number) {
    const start = polarToCartesian(startDeg)
    const end = polarToCartesian(endDeg)
    const sweep = endDeg - startDeg
    const largeArc = sweep > 180 ? 1 : 0
    return `M ${start.x} ${start.y} A ${radius} ${radius} 0 ${largeArc} 1 ${end.x} ${end.y}`
  }

  const trackPath = arcPath(startAngle, startAngle + sweepAngle)
  const fillPath  = clampedScore > 0 ? arcPath(startAngle, endAngle) : ""

  return (
    <div className="flex flex-col items-center gap-3">
      <svg width={size} height={size * 0.72} viewBox={`0 0 ${size} ${size * 0.72}`} className="overflow-visible">
        {/* Track */}
        <path
          d={trackPath}
          fill="none"
          stroke="rgba(255,255,255,0.07)"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
        />

        {/* Tick marks */}
        {[0, 25, 50, 70, 100].map((tick) => {
          const angle = startAngle + sweepAngle * (tick / 100)
          const rad = ((angle - 90) * Math.PI) / 180
          const inner = radius - strokeWidth * 0.8
          const outer = radius + strokeWidth * 0.1
          return (
            <line
              key={tick}
              x1={cx + inner * Math.cos(rad)}
              y1={cy + inner * Math.sin(rad)}
              x2={cx + outer * Math.cos(rad)}
              y2={cy + outer * Math.sin(rad)}
              stroke="rgba(255,255,255,0.2)"
              strokeWidth={1.5}
              strokeLinecap="round"
            />
          )
        })}

        {/* Fill arc */}
        {fillPath && (
          <path
            d={fillPath}
            fill="none"
            stroke={color}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            style={{
              filter: `drop-shadow(0 0 ${strokeWidth * 0.6}px ${color}80)`,
              transition: "stroke 0.5s ease",
            }}
          />
        )}

        {/* Score text */}
        <text
          x={cx}
          y={cy - 4}
          textAnchor="middle"
          dominantBaseline="middle"
          fontSize={size * 0.22}
          fontWeight="bold"
          fill={color}
          style={{ transition: "fill 0.5s ease", fontFamily: "var(--font-sans, sans-serif)" }}
        >
          {clampedScore}
        </text>
        <text
          x={cx}
          y={cy + size * 0.14}
          textAnchor="middle"
          dominantBaseline="middle"
          fontSize={size * 0.07}
          fill="rgba(255,255,255,0.4)"
          style={{ fontFamily: "var(--font-sans, sans-serif)" }}
        >
          / 100
        </text>
      </svg>

      <div className="text-center">
        <div
          className="text-lg font-bold tracking-wide"
          style={{ color }}
        >
          {label}
        </div>
        <div className="text-xs text-white/40 mt-0.5">Venture Score</div>
      </div>
    </div>
  )
}
