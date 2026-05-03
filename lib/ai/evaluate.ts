// ─── AI Evaluation Engine ─────────────────────────────────────────────────────
// Multi-model pipeline: Gemini → market potential, Groq → competition/risk
// Falls back to rule-based scoring if APIs are unavailable.

import { GoogleGenerativeAI } from "@google/generative-ai"
import Groq from "groq-sdk"

// ── Types ─────────────────────────────────────────────────────────────────────

export interface MarketPotential {
  tam: string
  demandLevel: "Low" | "Medium" | "High" | "Very High"
  growthTrends: string
  customerNeedLevel: string
  score: number // 0-100
}

export interface CompetitionAnalysis {
  directCompetitors: string[]
  indirectCompetitors: string[]
  differentiationGaps: string[]
  score: number // 0-100 (higher = better competitive position)
}

export interface RiskFactors {
  execution: { level: "Low" | "Medium" | "High"; detail: string }
  funding: { level: "Low" | "Medium" | "High"; detail: string }
  market: { level: "Low" | "Medium" | "High"; detail: string }
  legal: { level: "Low" | "Medium" | "High"; detail: string }
  score: number // 0-100 (higher = lower risk)
}

export interface FeasibilityAnalysis {
  analysis: string
  score: number // 0-100
}

export interface EvaluationReport {
  marketPotential: MarketPotential
  competition: CompetitionAnalysis
  risks: RiskFactors
  feasibility: FeasibilityAnalysis
  suggestions: string[]
  ventureScore: number // 0-100 weighted composite
  modelUsed: string
}

// ── Venture Score Weighting ───────────────────────────────────────────────────

function computeVentureScore(report: Omit<EvaluationReport, "ventureScore" | "modelUsed">): number {
  const marketWeight      = 0.30
  const competitionWeight = 0.20
  const feasibilityWeight = 0.25
  const riskWeight        = 0.15
  const innovationWeight  = 0.10

  // Innovation proxy: average of all other scores minus a small penalty
  const innovationScore = Math.min(
    100,
    (report.marketPotential.score * 0.4 + report.feasibility.score * 0.6) - 5
  )

  const raw =
    report.marketPotential.score * marketWeight +
    report.competition.score     * competitionWeight +
    report.feasibility.score     * feasibilityWeight +
    report.risks.score           * riskWeight +
    innovationScore              * innovationWeight

  return Math.round(Math.max(0, Math.min(100, raw)))
}

// ── Gemini: Market Potential ──────────────────────────────────────────────────

async function analyzeMarketWithGemini(idea: IdeaContext): Promise<MarketPotential | null> {
  const apiKey = process.env.GEMINI_API_KEY
  if (!apiKey) return null

  try {
    const genAI = new GoogleGenerativeAI(apiKey)
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" })

    const prompt = `You are a startup market analyst. Analyze the market potential of the following startup idea and respond ONLY with valid JSON.

Startup: "${idea.title}"
Problem: "${idea.problemStatement || idea.description}"
Solution: "${idea.solution || ""}"
Target Audience: "${idea.targetAudience || ""}"
Industry: "${idea.industry || "General"}"
Stage: "${idea.stage}"

Respond with this exact JSON structure (no markdown, no explanation):
{
  "tam": "string describing Total Addressable Market size estimate",
  "demandLevel": "Low|Medium|High|Very High",
  "growthTrends": "1-2 sentences on market growth trends",
  "customerNeedLevel": "1 sentence on urgency of customer need",
  "score": number between 0 and 100
}`

    const result = await model.generateContent(prompt)
    const text = result.response.text().trim()
    const jsonText = text.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim()
    return JSON.parse(jsonText) as MarketPotential
  } catch (err) {
    console.warn("[AI/Gemini] Market analysis failed:", err)
    return null
  }
}

// ── Groq: Competition + Risk ──────────────────────────────────────────────────

async function analyzeCompetitionWithGroq(idea: IdeaContext): Promise<{
  competition: CompetitionAnalysis
  risks: RiskFactors
  suggestions: string[]
  feasibility: FeasibilityAnalysis
} | null> {
  const apiKey = process.env.GROQ_API_KEY
  if (!apiKey) return null

  try {
    const groq = new Groq({ apiKey })

    const prompt = `You are a startup investment analyst. Analyze competition, risks, feasibility, and improvements for this startup idea. Respond ONLY with valid JSON.

Startup: "${idea.title}"
Problem: "${idea.problemStatement || idea.description}"
Solution: "${idea.solution || ""}"
Revenue Model: "${idea.revenueModel || ""}"
Industry: "${idea.industry || "General"}"

Respond with this exact JSON (no markdown):
{
  "competition": {
    "directCompetitors": ["max 4 real company names"],
    "indirectCompetitors": ["max 3 real company names"],
    "differentiationGaps": ["max 3 specific gaps this startup can exploit"],
    "score": number 0-100 representing competitive advantage
  },
  "risks": {
    "execution": { "level": "Low|Medium|High", "detail": "one sentence" },
    "funding": { "level": "Low|Medium|High", "detail": "one sentence" },
    "market": { "level": "Low|Medium|High", "detail": "one sentence" },
    "legal": { "level": "Low|Medium|High", "detail": "one sentence" },
    "score": number 0-100 where 100 means very low risk
  },
  "feasibility": {
    "analysis": "2-3 sentences on technical and operational feasibility",
    "score": number 0-100
  },
  "suggestions": ["max 5 specific actionable improvement suggestions"]
}`

    const completion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.4,
      max_tokens: 1200,
    })

    const text = completion.choices[0]?.message?.content?.trim() ?? ""
    const jsonText = text.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim()
    return JSON.parse(jsonText)
  } catch (err) {
    console.warn("[AI/Groq] Competition/risk analysis failed:", err)
    return null
  }
}

// ── Rule-Based Fallback ────────────────────────────────────────────────────────

function ruleBased(idea: IdeaContext): EvaluationReport {
  const descLen = (idea.description?.length ?? 0) + (idea.problemStatement?.length ?? 0)
  const hasSolution = (idea.solution?.length ?? 0) > 20
  const hasRevenue = (idea.revenueModel?.length ?? 0) > 10
  const hasAudience = (idea.targetAudience?.length ?? 0) > 10
  const stageBonus = idea.stage === "growth" ? 15 : idea.stage === "mvp" ? 8 : 0

  const marketScore = Math.min(100, 45 + (descLen > 200 ? 10 : 0) + (hasAudience ? 15 : 0) + stageBonus)
  const competitionScore = Math.min(100, 50 + (hasSolution ? 15 : 0) + (hasRevenue ? 10 : 0))
  const feasibilityScore = Math.min(100, 55 + (hasSolution ? 15 : 0) + stageBonus)
  const riskScore = Math.min(100, 60 + (hasRevenue ? 10 : 0) + (hasAudience ? 5 : 0))

  const report: Omit<EvaluationReport, "ventureScore" | "modelUsed"> = {
    marketPotential: {
      tam: "Estimated $1B–$10B based on industry benchmarks",
      demandLevel: marketScore > 70 ? "High" : marketScore > 50 ? "Medium" : "Low",
      growthTrends: "Market analysis based on idea depth and completeness. Add more details for a refined estimate.",
      customerNeedLevel: hasAudience ? "Well-defined customer segment identified." : "Customer need could be more precisely defined.",
      score: marketScore,
    },
    competition: {
      directCompetitors: ["Established players in the industry"],
      indirectCompetitors: ["Adjacent market solutions"],
      differentiationGaps: [
        hasSolution ? "Clear solution differentiation identified" : "Solution differentiation needs refinement",
        hasRevenue ? "Revenue model defined" : "Revenue model needs more clarity",
      ],
      score: competitionScore,
    },
    risks: {
      execution: { level: idea.stage === "idea" ? "High" : "Medium", detail: "Execution risk depends on team capability and MVP timeline." },
      funding: { level: "Medium", detail: "Funding risk is moderate; a clear revenue model helps investor confidence." },
      market: { level: marketScore > 65 ? "Low" : "Medium", detail: "Market risk varies with demand and competition." },
      legal: { level: "Low", detail: "No obvious regulatory red flags identified from the idea description." },
      score: riskScore,
    },
    feasibility: {
      analysis: `This idea shows ${feasibilityScore > 70 ? "strong" : "moderate"} feasibility. ${hasSolution ? "A clear solution is defined." : "The solution needs more detail."} ${hasRevenue ? "Revenue model is present." : "A revenue model should be added."}`,
      score: feasibilityScore,
    },
    suggestions: [
      !hasSolution ? "Define your solution in more detail — what exactly will you build?" : "Refine your solution's unique value proposition.",
      !hasRevenue ? "Add a clear revenue model (SaaS, marketplace fees, advertising, etc.)" : "Validate revenue assumptions with potential customers.",
      !hasAudience ? "Define your target audience more precisely (demographics, pain points, size)" : "Conduct user interviews with your target audience.",
      "Identify your top 3 direct competitors and articulate why you win.",
      "Define your first 90-day roadmap to reach your first paying customer.",
    ].filter(Boolean).slice(0, 5),
  }

  return {
    ...report,
    ventureScore: computeVentureScore(report),
    modelUsed: "rule-based",
  }
}

// ── Idea Context Type ─────────────────────────────────────────────────────────

export interface IdeaContext {
  title: string
  description: string
  problemStatement?: string | null
  solution?: string | null
  targetAudience?: string | null
  revenueModel?: string | null
  industry?: string | null
  stage: string
}

// ── Main Evaluation Function ──────────────────────────────────────────────────

export async function evaluateIdea(idea: IdeaContext): Promise<EvaluationReport> {
  // Run both API calls in parallel
  const [marketResult, groqResult] = await Promise.all([
    analyzeMarketWithGemini(idea),
    analyzeCompetitionWithGroq(idea),
  ])

  const fallback = ruleBased(idea)
  const modelUsed: string[] = []

  const marketPotential = marketResult ?? fallback.marketPotential
  if (marketResult) modelUsed.push("Gemini 1.5 Flash")

  const competition  = groqResult?.competition  ?? fallback.competition
  const risks        = groqResult?.risks        ?? fallback.risks
  const feasibility  = groqResult?.feasibility  ?? fallback.feasibility
  const suggestions  = groqResult?.suggestions  ?? fallback.suggestions
  if (groqResult) modelUsed.push("Groq Llama-3.3-70b")

  if (modelUsed.length === 0) modelUsed.push("Rule-based engine")

  const report: Omit<EvaluationReport, "ventureScore" | "modelUsed"> = {
    marketPotential,
    competition,
    risks,
    feasibility,
    suggestions,
  }

  return {
    ...report,
    ventureScore: computeVentureScore(report),
    modelUsed: modelUsed.join(" + "),
  }
}
