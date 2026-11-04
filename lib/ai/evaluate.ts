// ─── AI Evaluation Engine ─────────────────────────────────────────────────────
// Multi-model pipeline: Gemini (or Groq) → market potential, Groq → competition/risk
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

// ── Shared Helpers ────────────────────────────────────────────────────────────

// Override the first choice with GROQ_MODEL. Keep this list in sync with
// https://console.groq.com/docs/deprecations — the Llama 3.x models were shut
// down on 2026-08-16 and now return 404 model_not_found.
export const GROQ_CANDIDATE_MODELS = [
  "openai/gpt-oss-120b",
  "qwen/qwen3.8-27b",
  "openai/gpt-oss-20b",
]

// Reasoning models spend completion tokens on hidden reasoning before the JSON.
// With a small max_tokens budget the JSON is never written and Groq returns
// json_validate_failed with an empty failed_generation. Keep reasoning short
// and the budget generous.
export function groqModelOptions(model: string): Record<string, unknown> {
  return model.startsWith("openai/gpt-oss") ? { reasoning_effort: "low" } : {}
}

// Per-request timeout so a slow model cannot exhaust the serverless time budget.
export const AI_REQUEST_TIMEOUT_MS = 20_000

export const GEMINI_MODEL = process.env.GEMINI_MODEL || "gemini-2.5-flash"

export function parseJsonSafe<T>(text: string): T | null {
  try {
    let cleaned = text
      .replace(/<think>[\s\S]*?<\/think>/gi, "") // reasoning models
      .replace(/```json\n?/gi, "")
      .replace(/```\n?/g, "")
      .trim()
    // Keep only the outermost JSON object if the model added prose around it
    const start = cleaned.indexOf("{")
    const end = cleaned.lastIndexOf("}")
    if (start !== -1 && end > start) cleaned = cleaned.slice(start, end + 1)
    return JSON.parse(cleaned) as T
  } catch (err) {
    console.warn("[AI] Failed to parse JSON response:", err)
    return null
  }
}

// ── Output normalisation ──────────────────────────────────────────────────────
// LLMs return loosely-typed JSON ("medium", "72", a string instead of an array).
// The report UI expects exact shapes, so every field is coerced here and any
// missing piece is filled from the rule-based fallback.

type Level = "Low" | "Medium" | "High"
type Demand = MarketPotential["demandLevel"]

function toLevel(v: unknown, d: Level): Level {
  const s = String(v ?? "").trim().toLowerCase()
  if (!s) return d
  if (s.startsWith("h")) return "High"
  if (s.startsWith("l")) return "Low"
  return "Medium"
}

function toDemand(v: unknown, d: Demand): Demand {
  const s = String(v ?? "").trim().toLowerCase()
  if (!s) return d
  if (s.includes("very")) return "Very High"
  if (s.startsWith("h")) return "High"
  if (s.startsWith("l")) return "Low"
  return "Medium"
}

function toScore(v: unknown, d: number): number {
  const n = typeof v === "number" ? v : parseFloat(String(v ?? ""))
  return Number.isFinite(n) ? Math.round(Math.max(0, Math.min(100, n))) : d
}

function toText(v: unknown, d: string): string {
  return typeof v === "string" && v.trim() ? v.trim() : d
}

function toStrings(v: unknown, d: string[], max: number): string[] {
  const list = Array.isArray(v)
    ? v.map((x) => (typeof x === "string" ? x : x && typeof x === "object" ? Object.values(x).join(" - ") : String(x ?? "")))
    : typeof v === "string" ? [v] : []
  const clean = list.map((s) => s.trim()).filter(Boolean).slice(0, max)
  return clean.length ? clean : d
}

function obj(v: unknown): Record<string, unknown> {
  return v && typeof v === "object" && !Array.isArray(v) ? (v as Record<string, unknown>) : {}
}

function normalizeMarket(raw: unknown, fb: MarketPotential): MarketPotential {
  const r = obj(raw)
  return {
    tam:               toText(r.tam, fb.tam),
    demandLevel:       toDemand(r.demandLevel, fb.demandLevel),
    growthTrends:      toText(r.growthTrends, fb.growthTrends),
    customerNeedLevel: toText(r.customerNeedLevel, fb.customerNeedLevel),
    score:             toScore(r.score, fb.score),
  }
}

function normalizeCompetition(raw: unknown, fb: CompetitionAnalysis): CompetitionAnalysis {
  const r = obj(raw)
  return {
    directCompetitors:   toStrings(r.directCompetitors, fb.directCompetitors, 4),
    indirectCompetitors: toStrings(r.indirectCompetitors, fb.indirectCompetitors, 3),
    differentiationGaps: toStrings(r.differentiationGaps, fb.differentiationGaps, 3),
    score:               toScore(r.score, fb.score),
  }
}

function normalizeRisks(raw: unknown, fb: RiskFactors): RiskFactors {
  const r = obj(raw)
  const one = (key: "execution" | "funding" | "market" | "legal") => {
    const item = obj(r[key])
    // Some models return just "High" instead of { level, detail }
    const level = typeof r[key] === "string" ? r[key] : item.level
    return {
      level:  toLevel(level, fb[key].level),
      detail: toText(item.detail, fb[key].detail),
    }
  }
  return {
    execution: one("execution"),
    funding:   one("funding"),
    market:    one("market"),
    legal:     one("legal"),
    score:     toScore(r.score, fb.score),
  }
}

function normalizeFeasibility(raw: unknown, fb: FeasibilityAnalysis): FeasibilityAnalysis {
  const r = obj(raw)
  return {
    analysis: toText(r.analysis, fb.analysis),
    score:    toScore(r.score, fb.score),
  }
}

/**
 * Makes any stored report safe to render. Used when reading `ai_report` from
 * the DB so reports saved before normalisation existed no longer crash the UI.
 */
export function normalizeStoredReport(raw: unknown, idea: IdeaContext): EvaluationReport {
  const fb = ruleBased(idea)
  const r = obj(raw)
  const parts = {
    marketPotential: normalizeMarket(r.marketPotential, fb.marketPotential),
    competition:     normalizeCompetition(r.competition, fb.competition),
    risks:           normalizeRisks(r.risks, fb.risks),
    feasibility:     normalizeFeasibility(r.feasibility, fb.feasibility),
    suggestions:     toStrings(r.suggestions, fb.suggestions, 5),
  }
  return {
    ...parts,
    ventureScore: toScore(r.ventureScore, computeVentureScore(parts)),
    modelUsed:    toText(r.modelUsed, "Rule-based engine"),
  }
}

async function callGroqWithFallback(
  prompt: string,
  maxTokens = 2000
): Promise<{ content: string; model: string } | null> {
  const apiKey = process.env.GROQ_API_KEY
  if (!apiKey) return null

  const groq = new Groq({ apiKey, timeout: AI_REQUEST_TIMEOUT_MS, maxRetries: 0 })
  const models = [
    process.env.GROQ_MODEL,
    ...GROQ_CANDIDATE_MODELS,
  ].filter((m): m is string => Boolean(m && m.trim()))

  const tried = new Set<string>()

  for (const model of models) {
    if (tried.has(model)) continue
    tried.add(model)
    try {
      const completion = await groq.chat.completions.create({
        model,
        messages: [{ role: "user", content: prompt }],
        temperature: 0.4,
        max_tokens: maxTokens,
        response_format: { type: "json_object" },
        ...groqModelOptions(model),
      })
      const text = completion.choices[0]?.message?.content?.trim() ?? ""
      if (text) {
        return { content: text, model }
      }
    } catch (err) {
      console.warn(`[AI/Groq] Model ${model} failed, trying next candidate:`, err instanceof Error ? err.message : err)
    }
  }

  return null
}

function getMarketPrompt(idea: IdeaContext): string {
  return `You are an Indian startup market analyst with deep knowledge of the Indian economy. Analyze the market potential of the following startup idea STRICTLY for the Indian market. Use India-specific data, real Indian consumer behavior, and India-centric growth trends. Do NOT provide global or generic answers.

Startup: "${idea.title}"
Problem: "${idea.problemStatement || idea.description}"
Solution: "${idea.solution || ""}"
Target Audience: "${idea.targetAudience || ""}"
Industry: "${idea.industry || "General"}"
Stage: "${idea.stage}"

IMPORTANT: Consider Indian-specific factors:
- Indian consumer price sensitivity and tier 2/3 city adoption
- TAM/SAM in INR (Indian Rupees) for the Indian market only
- UPI, wallets, COD payment behaviour
- Government schemes: Startup India, Digital India, GST, PLI
- Rural vs urban internet penetration and infrastructure
- Language diversity and regional trust barriers

Respond with this exact JSON structure (no markdown, no explanation):
{
  "tam": "India-specific TAM estimate in INR or USD with Indian market context",
  "demandLevel": "Low|Medium|High|Very High",
  "growthTrends": "1-2 sentences on Indian market growth trends with local data points",
  "customerNeedLevel": "1 sentence on urgency of customer need specifically in India",
  "score": number between 0 and 100
}`
}

// ── Gemini: Market Potential ──────────────────────────────────────────────────

async function analyzeMarketWithGemini(idea: IdeaContext): Promise<MarketPotential | null> {
  const apiKey = process.env.GEMINI_API_KEY
  if (!apiKey) return null

  try {
    const genAI = new GoogleGenerativeAI(apiKey)
    const model = genAI.getGenerativeModel({
      model: GEMINI_MODEL,
      generationConfig: { responseMimeType: "application/json", temperature: 0.4 },
    })
    const result = await model.generateContent(getMarketPrompt(idea), { timeout: AI_REQUEST_TIMEOUT_MS })
    const text = result.response.text().trim()
    const parsed = parseJsonSafe<MarketPotential>(text)
    if (!parsed || parsed.score === undefined || !parsed.tam) return null
    return parsed
  } catch (err) {
    console.warn("[AI/Gemini] Market analysis failed:", err)
    return null
  }
}

// ── Groq: Market Potential Fallback ──────────────────────────────────────────

async function analyzeMarketWithGroq(idea: IdeaContext): Promise<{ data: MarketPotential; model: string } | null> {
  const prompt = getMarketPrompt(idea)
  const res = await callGroqWithFallback(prompt, 2000)
  if (!res) return null

  const parsed = parseJsonSafe<MarketPotential>(res.content)
  if (!parsed || parsed.score === undefined || !parsed.tam) {
    return null
  }
  return { data: parsed, model: res.model }
}

async function analyzeMarket(idea: IdeaContext): Promise<{ data: MarketPotential; model: string } | null> {
  // 1. Try Gemini first if key is present
  const geminiResult = await analyzeMarketWithGemini(idea)
  if (geminiResult) {
    return { data: geminiResult, model: `Gemini (${GEMINI_MODEL})` }
  }

  // 2. Fall back to Groq if Gemini is absent or fails
  const groqResult = await analyzeMarketWithGroq(idea)
  if (groqResult) {
    return { data: groqResult.data, model: `Groq (${groqResult.model})` }
  }

  return null
}

// ── Groq: Competition + Risk ──────────────────────────────────────────────────

async function analyzeCompetitionWithGroq(idea: IdeaContext): Promise<{
  data: {
    competition: CompetitionAnalysis
    risks: RiskFactors
    suggestions: string[]
    feasibility: FeasibilityAnalysis
  }
  model: string
} | null> {
  const apiKey = process.env.GROQ_API_KEY
  if (!apiKey) return null

  const prompt = `You are an Indian startup investment analyst with expertise in the Indian ecosystem. Analyze competition, risks, feasibility, and improvements for this startup idea STRICTLY within the Indian market context. Do NOT suggest global companies as primary competitors — focus on Indian startups and local players.

Startup: "${idea.title}"
Problem: "${idea.problemStatement || idea.description}"
Solution: "${idea.solution || ""}"
Revenue Model: "${idea.revenueModel || ""}"
Industry: "${idea.industry || "General"}"

IMPORTANT — India-specific context to factor in:
- Identify Indian competitors (Indian startups, local incumbents, Bharat-focused apps)
- Risk from Indian regulations: RBI guidelines (if fintech), TRAI, IT Act, GST compliance
- Funding risks: Indian VC landscape, angel networks (Mumbai/Bangalore/Delhi), government grants
- Market risk: tier 2/3 city penetration, vernacular user adoption, seasonal demand patterns
- Feasibility in Indian infrastructure context: logistics (Delhivery, Shiprocket), payments (UPI/Razorpay), cloud (AWS Mumbai region)
- Suggestions must be practical for bootstrapped Indian founders

Respond with this exact JSON (no markdown):
{
  "competition": {
    "directCompetitors": ["max 4 Indian company or startup names"],
    "indirectCompetitors": ["max 3 Indian company or adjacent solution names"],
    "differentiationGaps": ["max 3 specific gaps this startup can exploit in the Indian market"],
    "score": number 0-100 representing competitive advantage in India
  },
  "risks": {
    "execution": { "level": "Low|Medium|High", "detail": "one sentence specific to Indian execution challenges" },
    "funding": { "level": "Low|Medium|High", "detail": "one sentence on Indian funding landscape risk" },
    "market": { "level": "Low|Medium|High", "detail": "one sentence on Indian market adoption risk" },
    "legal": { "level": "Low|Medium|High", "detail": "one sentence on Indian regulatory/legal risk" },
    "score": number 0-100 where 100 means very low risk in Indian context
  },
  "feasibility": {
    "analysis": "2-3 sentences on feasibility given Indian infrastructure, talent pool, and cost structures",
    "score": number 0-100
  },
  "suggestions": ["max 5 actionable suggestions tailored for Indian market entry and growth"]
}`

  const res = await callGroqWithFallback(prompt, 3000)
  if (!res) return null

  const parsed = parseJsonSafe<{
    competition: CompetitionAnalysis
    risks: RiskFactors
    feasibility: FeasibilityAnalysis
    suggestions: string[]
  }>(res.content)

  if (!parsed || !parsed.competition || !parsed.risks || !parsed.feasibility) {
    return null
  }

  return { data: parsed, model: res.model }
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
      tam: "Estimated ₹500 Cr–₹5,000 Cr Indian addressable market based on industry benchmarks",
      demandLevel: marketScore > 70 ? "High" : marketScore > 50 ? "Medium" : "Low",
      growthTrends: "India's digital economy is growing at 15–20% YoY driven by tier 2/3 city expansion and UPI adoption. Add more idea details for a refined India-specific estimate.",
      customerNeedLevel: hasAudience
        ? "A customer segment is identified — validate demand in tier 2/3 Indian cities for maximum reach."
        : "Customer need should be validated for Indian price sensitivity and regional language preferences.",
      score: marketScore,
    },
    competition: {
      directCompetitors: ["Indian incumbents in the sector", "Bharat-focused startups"],
      indirectCompetitors: ["Jugaad / informal alternatives", "WhatsApp-based local solutions"],
      differentiationGaps: [
        hasSolution ? "Solution differentiation identified — localise for regional Indian markets" : "Define differentiation vs Indian competitors",
        hasRevenue ? "Revenue model defined — consider UPI/COD for Indian payment preferences" : "Add a revenue model suitable for Indian price points (freemium, subscription ₹99–₹499)",
        "Vernacular language support could unlock tier 2/3 city adoption",
      ],
      score: competitionScore,
    },
    risks: {
      execution: {
        level: idea.stage === "idea" ? "High" : "Medium",
        detail: idea.stage === "idea"
          ? "Early-stage execution risk is high in India — build a lean MVP and test with a pilot city first."
          : "Execution risk is moderate; leverage India's deep engineering talent pool at competitive salaries.",
      },
      funding: {
        level: "Medium",
        detail: "Indian angel networks (Mumbai/Bangalore/Delhi) and govt schemes (Startup India seed fund) can bridge early rounds.",
      },
      market: {
        level: marketScore > 65 ? "Low" : "Medium",
        detail: marketScore > 65
          ? "Healthy Indian market demand — focus on Bharat (tier 2/3) for faster growth at lower CAC."
          : "Adoption risk is moderate; India's price-sensitive users require a compelling free or freemium entry.",
      },
      legal: {
        level: "Low",
        detail: "Ensure GST registration, IT Act compliance, and sector-specific licenses (RBI for fintech, FSSAI for food).",
      },
      score: riskScore,
    },
    feasibility: {
      analysis: `This idea shows ${feasibilityScore > 70 ? "strong" : "moderate"} feasibility for the Indian market. ${hasSolution ? "A clear solution is defined — prioritise lightweight delivery suited to Indian mobile-first users." : "The solution needs more detail; focus on low-bandwidth and offline-capable features for rural India."} ${hasRevenue ? "A revenue model is present — validate pricing against Indian willingness-to-pay benchmarks." : "Add a revenue model; micro-subscription (₹99–₹299/month) or transaction fee models work well in India."}`,
      score: feasibilityScore,
    },
    suggestions: [
      !hasSolution
        ? "Define your core solution for an Indian user — keep it mobile-first and low-data-usage friendly."
        : "Localise your solution for regional Indian languages to unlock tier 2/3 city markets.",
      !hasRevenue
        ? "Add a revenue model: consider ₹99–₹499/month SaaS, transaction fees via UPI, or freemium with premium upgrades."
        : "Validate your pricing against Indian consumer willingness-to-pay; run A/B tests in 2–3 cities.",
      !hasAudience
        ? "Define your Indian target audience — segment by city tier, age group, and income bracket (SEC A/B/C)."
        : "Map your audience to Indian digital behaviour — WhatsApp reach, YouTube discovery, Indic language preference.",
      "Identify 3–5 Indian competitors (startups + incumbents) and articulate your differentiation for Bharat users.",
      "Design a 90-day pilot: launch in 1 city, acquire first 100 paying customers, then expand using referral/word-of-mouth.",
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
  // Run both analysis pipelines in parallel. allSettled: one pipeline throwing
  // must never discard the other's result.
  const [marketSettled, groqSettled] = await Promise.allSettled([
    analyzeMarket(idea),
    analyzeCompetitionWithGroq(idea),
  ])
  const marketResult = marketSettled.status === "fulfilled" ? marketSettled.value : null
  const groqResult   = groqSettled.status   === "fulfilled" ? groqSettled.value   : null
  if (marketSettled.status === "rejected") console.warn("[AI] Market pipeline failed:", marketSettled.reason)
  if (groqSettled.status === "rejected")   console.warn("[AI] Competition pipeline failed:", groqSettled.reason)

  const fallback = ruleBased(idea)
  const modelsUsed: string[] = []

  const marketPotential = normalizeMarket(marketResult?.data, fallback.marketPotential)
  if (marketResult) modelsUsed.push(marketResult.model)

  const competition  = normalizeCompetition(groqResult?.data.competition, fallback.competition)
  const risks        = normalizeRisks(groqResult?.data.risks, fallback.risks)
  const feasibility  = normalizeFeasibility(groqResult?.data.feasibility, fallback.feasibility)
  const suggestions  = toStrings(groqResult?.data.suggestions, fallback.suggestions, 5)
  if (groqResult) modelsUsed.push(`Groq (${groqResult.model})`)

  const uniqueModels = Array.from(new Set(modelsUsed))
  const modelUsedString = uniqueModels.length > 0 ? uniqueModels.join(" + ") : "Rule-based engine"

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
    modelUsed: modelUsedString,
  }
}
