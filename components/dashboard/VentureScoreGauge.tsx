"use client"

import React from "react"

interface VentureScoreGaugeProps {
  score: number // 0-100
  size?: number
}

function scoreColor(score: number): string {
  if (score >= 70) return "#6bcb77"
  if (score >= 50) return "#F8C662"
  return "#ff6b6b"
}

function scoreLabel(score: number): string {
  if (score >= 80) return "Exceptional"
  if (score >= 70) return "Strong"
  if (score >= 60) return "Promising"
  if (score >= 50) return "Moderate"
  if (score >= 35) return "Needs Work"
  return "Early Stage"
}

function r(n: number) {
  return Math.round(n * 1e4) / 1e4
}

export function VentureScoreGauge({ score, size = 220 }: VentureScoreGaugeProps) {
  const clampedScore = Math.max(0, Math.min(100, score))
  const color = scoreColor(clampedScore)
  const label = scoreLabel(clampedScore)

  const cx = size / 2
  const cy = size / 2 // FIX: removed +16 shift
  const radius = (size / 2) * 0.75
  const strokeWidth = size * 0.08

  const startAngle = 210
  const sweepAngle = 240
  const endAngle = startAngle + sweepAngle * (clampedScore / 100)

  function polarToCartesian(angle: number) {
    const rad = ((angle - 90) * Math.PI) / 180
    return {
      x: r(cx + radius * Math.cos(rad)),
      y: r(cy + radius * Math.sin(rad)),
    }
  }

  function arcPath(startDeg: number, endDeg: number) {
    const start = polarToCartesian(startDeg)
    const end = polarToCartesian(endDeg)
    const largeArc = (endDeg - startDeg) > 180 ? 1 : 0
    return `M ${start.x} ${start.y} A ${r(radius)} ${r(radius)} 0 ${largeArc} 1 ${end.x} ${end.y}`
  }

  const trackPath = arcPath(startAngle, startAngle + sweepAngle)
  const fillPath = clampedScore > 0 ? arcPath(startAngle, endAngle) : ""

  // FIX: increase SVG height so arc doesn't clip or overlap text
  const svgHeight = size * 0.85

  // FIX: reposition text safely inside arc
  const scoreY = cy - radius * 0.1
  const subY = scoreY + size * 0.12

  return (
    <div className="flex flex-col items-center gap-3">
      <svg
        width={size}
        height={svgHeight}
        viewBox={`0 0 ${size} ${svgHeight}`}
        className="overflow-visible"
      >
        {/* Track */}
        <path
          d={trackPath}
          fill="none"
          stroke="rgba(255,255,255,0.07)"
          strokeWidth={r(strokeWidth)}
          strokeLinecap="round"
        />

        {/* Tick marks */}
        {[0, 25, 50, 70, 100].map((tick) => {
          const angle = startAngle + sweepAngle * (tick / 100)
          const rad = ((angle - 90) * Math.PI) / 180
          const inner = radius - strokeWidth * 0.75
          const outer = radius + strokeWidth * 0.05
          return (
            <line
              key={tick}
              x1={r(cx + inner * Math.cos(rad))}
              y1={r(cy + inner * Math.sin(rad))}
              x2={r(cx + outer * Math.cos(rad))}
              y2={r(cy + outer * Math.sin(rad))}
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
            strokeWidth={r(strokeWidth)}
            strokeLinecap="round"
            style={{
              filter: `drop-shadow(0 0 ${r(strokeWidth * 0.55)}px ${color}80)`,
              transition: "stroke 0.5s ease",
            }}
          />
        )}

        {/* Score */}
        <text
          x={cx}
          y={scoreY}
          textAnchor="middle"
          dominantBaseline="middle"
          fontSize={size * 0.2}
          fontWeight="bold"
          fill={color}
        >
          {clampedScore}
        </text>

        {/* /100 */}
        <text
          x={cx}
          y={subY}
          textAnchor="middle"
          dominantBaseline="middle"
          fontSize={size * 0.065}
          fill="rgba(255,255,255,0.35)"
        >
          / 100
        </text>
      </svg>

      <div className="text-center">
        <div className="text-lg font-bold tracking-wide" style={{ color }}>
          {label}
        </div>
        <div className="text-xs text-white/40 mt-0.5">Venture Score</div>
      </div>
    </div>
  )
}