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

    const prompt = `You are an Indian startup market analyst with deep knowledge of the Indian economy. Analyze the market potential of the following startup idea STRICTLY for the Indian market. Use India-specific data, real Indian consumer behavior, and India-centric growth trends. Do NOT provide global or generic answers.

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
