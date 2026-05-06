"use client"

import React from "react"
import { EvaluationReport } from "@/lib/ai/evaluate"
import { VentureScoreGauge } from "./VentureScoreGauge"
import { ScoreBreakdownChart } from "./ScoreBreakdownChart"
import {
  TrendingUp, Swords, ShieldAlert, Cpu, Lightbulb, CheckCircle2,
  AlertTriangle, XCircle, Users, DollarSign, Globe, Scale,
  Lock, Unlock, ChevronRight
} from "lucide-react"
import Link from "next/link"

interface EvaluationReportProps {
  report: EvaluationReport
  ideaId?: string
  hasPostedRoles?: boolean
}

function RiskLevel({ level }: { level: "Low" | "Medium" | "High" }) {
  const cfg = {
    Low:    { icon: CheckCircle2, color: "text-success", bg: "bg-success/10 border-success/20" },
    Medium: { icon: AlertTriangle, color: "text-btn",    bg: "bg-btn/10 border-btn/20" },
    High:   { icon: XCircle,      color: "text-error",   bg: "bg-error/10 border-error/20" },
  }[level]
  const Icon = cfg.icon
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold border ${cfg.bg} ${cfg.color}`}>
      <Icon className="w-3 h-3" />
      {level}
    </span>
  )
}

function SectionCard({ icon: Icon, title, children, className = "" }: {
  icon: React.ElementType
  title: string
  children: React.ReactNode
  className?: string
}) {
  return (
    <div className={`glass-panel rounded-2xl p-6 border border-white/5 ${className}`}>
      <div className="flex items-center gap-3 mb-5">
        <div className="w-9 h-9 rounded-xl bg-btn/10 border border-btn/20 flex items-center justify-center shrink-0">
          <Icon className="w-4.5 h-4.5 text-btn" />
        </div>
        <h2 className="text-base font-bold text-accent-yellow">{title}</h2>
      </div>
      {children}
    </div>
  )
}

export function EvaluationReportView({ report, ideaId, hasPostedRoles = false }: EvaluationReportProps) {
  const isUnlocked = report.ventureScore >= 70
  const contributorHref = hasPostedRoles || !ideaId
    ? "/dashboard/founder/applicants"
    : `/dashboard/founder/team/${ideaId}`
  const contributorCta = hasPostedRoles ? "View & Manage Applicants" : "Build Team"
  const { marketPotential: mp, competition: comp, risks, feasibility, suggestions } = report

  return (
    <div className="space-y-6">
      {/* Hero: Gauge + Score Breakdown side by side */}
      <div className="glass-panel rounded-3xl p-8 border border-white/5">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          {/* Gauge */}
          <div className="flex flex-col items-center gap-4">
            <VentureScoreGauge score={report.ventureScore} size={200} />
            <div className="text-xs text-white/30 text-center">
              Evaluated by {report.modelUsed}
            </div>
          </div>

          {/* Score breakdown */}
          <div>
            <h3 className="text-sm font-bold text-white/50 uppercase tracking-widest mb-4">Score Breakdown</h3>
            <ScoreBreakdownChart
              marketScore={mp.score}
              competitionScore={comp.score}
              feasibilityScore={feasibility.score}
              riskScore={risks.score}
              ventureScore={report.ventureScore}
            />
          </div>
        </div>
      </div>

      {/* Main report grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Market Potential */}
        <SectionCard icon={TrendingUp} title="Market Potential">
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-white/5 rounded-xl p-3">
                <div className="text-xs text-white/40 mb-1">TAM Estimate</div>
                <div className="text-sm font-semibold text-white">{mp.tam}</div>
              </div>
              <div className="bg-white/5 rounded-xl p-3">
                <div className="text-xs text-white/40 mb-1">Demand Level</div>
                <div className="text-sm font-bold text-accent-yellow">{mp.demandLevel}</div>
              </div>
            </div>
            <div>
              <div className="text-xs text-white/40 mb-1.5 flex items-center gap-1">
                <Globe className="w-3 h-3" /> Growth Trends
              </div>
              <p className="text-sm text-white/70 leading-relaxed">{mp.growthTrends}</p>
            </div>
            <div>
              <div className="text-xs text-white/40 mb-1.5 flex items-center gap-1">
                <Users className="w-3 h-3" /> Customer Need
              </div>
              <p className="text-sm text-white/70 leading-relaxed">{mp.customerNeedLevel}</p>
            </div>
          </div>
        </SectionCard>

        {/* Competition */}
        <SectionCard icon={Swords} title="Competition Analysis">
          <div className="space-y-4">
            <div>
              <div className="text-xs text-white/40 mb-2">Direct Competitors</div>
              <div className="flex flex-wrap gap-2">
                {comp.directCompetitors.map((c) => (
                  <span key={c} className="px-2.5 py-1 rounded-lg bg-error/10 border border-error/20 text-xs text-error font-medium">
                    {c}
                  </span>
                ))}
              </div>
            </div>
            <div>
              <div className="text-xs text-white/40 mb-2">Indirect Competitors</div>
              <div className="flex flex-wrap gap-2">
                {comp.indirectCompetitors.map((c) => (
                  <span key={c} className="px-2.5 py-1 rounded-lg bg-white/5 border border-white/10 text-xs text-white/60 font-medium">
                    {c}
                  </span>
                ))}
              </div>
            </div>
            <div>
              <div className="text-xs text-white/40 mb-2">Differentiation Gaps</div>
              <ul className="space-y-1.5">
                {comp.differentiationGaps.map((gap) => (
                  <li key={gap} className="flex items-start gap-2 text-sm text-white/70">
                    <ChevronRight className="w-3.5 h-3.5 text-btn shrink-0 mt-0.5" />
                    {gap}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </SectionCard>

        {/* Risk Factors */}
        <SectionCard icon={ShieldAlert} title="Risk Factors">
          <div className="space-y-3">
            {([
              { key: "execution", label: "Execution Risk",   icon: Cpu },
              { key: "funding",   label: "Funding Risk",     icon: DollarSign },
              { key: "market",    label: "Market Risk",      icon: Globe },
              { key: "legal",     label: "Legal/Regulatory", icon: Scale },
            ] as const).map(({ key, label, icon: Icon }) => {
              const risk = risks[key]
              return (
                <div key={key} className="flex items-start gap-3 p-3 rounded-xl bg-white/3 border border-white/5">
                  <Icon className="w-4 h-4 text-white/40 shrink-0 mt-0.5" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="text-xs font-semibold text-white/70">{label}</span>
                      <RiskLevel level={risk.level} />
                    </div>
                    <p className="text-xs text-white/50 leading-relaxed">{risk.detail}</p>
                  </div>
                </div>
              )
            })}
          </div>
        </SectionCard>

        {/* Feasibility */}
        <SectionCard icon={Cpu} title="Feasibility Assessment">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-white/60">Feasibility Score</span>
              <span className="text-2xl font-black text-accent-yellow">{feasibility.score}<span className="text-sm text-white/30">/100</span></span>
            </div>
            <div className="h-2 bg-white/5 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full bg-btn transition-all duration-1000"
                style={{ width: `${feasibility.score}%` }}
              />
            </div>
            <p className="text-sm text-white/70 leading-relaxed">{feasibility.analysis}</p>
          </div>
        </SectionCard>
      </div>

      {/* Suggestions */}
      <SectionCard icon={Lightbulb} title="Recommendations to Improve">
        <ul className="space-y-3">
          {suggestions.map((s, i) => (
            <li key={i} className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-btn/10 border border-btn/20 flex items-center justify-center shrink-0 text-xs font-bold text-btn">
                {i + 1}
              </div>
              <p className="text-sm text-white/75 leading-relaxed pt-0.5">{s}</p>
            </li>
          ))}
        </ul>
      </SectionCard>

      {/* Contributor Unlock */}
      {isUnlocked ? (
        <div className="glass-panel rounded-2xl p-6 border border-success/20 bg-success/5">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-success/10 border border-success/20 flex items-center justify-center">
              <Unlock className="w-5 h-5 text-success" />
            </div>
            <div>
              <h2 className="font-bold text-success">Contributors Unlocked!</h2>
              <p className="text-xs text-success/70">Your Venture Score of {report.ventureScore} qualifies this idea for contributors.</p>
            </div>
          </div>
          <Link
            href={contributorHref}
            className="inline-flex items-center gap-2 bg-success/10 hover:bg-success/20 border border-success/20 text-success px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200"
          >
            <Users className="w-4 h-4" />
            {contributorCta}
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
      ) : (
        <div className="glass-panel rounded-2xl p-6 border border-white/5">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center">
              <Lock className="w-5 h-5 text-white/40" />
            </div>
            <div>
              <h2 className="font-bold text-white/60">Contributors Locked</h2>
              <p className="text-xs text-white/40">
                Reach a Venture Score of 70+ to unlock hiring access.{" "}
                <span className="text-btn">You need {70 - report.ventureScore} more points.</span>
              </p>
            </div>
          </div>
          <div className="space-y-2">
            <p className="text-xs font-semibold text-white/40 uppercase tracking-wider">Improvements needed:</p>
            {suggestions.slice(0, 3).map((s, i) => (
              <div key={i} className="flex items-start gap-2 text-sm text-white/50">
                <ChevronRight className="w-3.5 h-3.5 text-btn/50 shrink-0 mt-0.5" />
                {s}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
