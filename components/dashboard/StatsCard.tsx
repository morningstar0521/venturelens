import React from "react"

export function StatsCard({ 
  icon: Icon, 
  label, 
  value, 
  color = "btn",
  trend
}: { 
  icon: React.ElementType
  label: string
  value: string | number
  color?: string
  trend?: { value: string; positive: boolean }
}) {
  return (
    <div className="glass-panel rounded-3xl p-6 border border-white/5 space-y-3">
      <div className={`w-10 h-10 rounded-xl bg-${color}/10 border border-${color}/20 flex items-center justify-center`}>
        <Icon className={`w-5 h-5 text-${color}`} />
      </div>
      <div>
        <div className="flex items-baseline gap-2">
          <div className="text-2xl font-extrabold text-accent-yellow">{value}</div>
          {trend && (
            <span className={`text-xs font-semibold ${trend.positive ? 'text-success' : 'text-error'}`}>
              {trend.positive ? '↑' : '↓'} {trend.value}
            </span>
          )}
        </div>
        <div className="text-xs text-accent-muted mt-0.5">{label}</div>
      </div>
    </div>
  )
}
