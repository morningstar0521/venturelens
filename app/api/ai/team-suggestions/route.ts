import { NextRequest, NextResponse } from "next/server"
import { getIdeaById } from "@/lib/db/ideas"
import { GoogleGenerativeAI } from "@google/generative-ai"
import Groq from "groq-sdk"

// ── Types ─────────────────────────────────────────────────────────────────────

export interface SuggestedRole {
  role: string
  category: "Tech" | "Marketing" | "Product" | "Ops" | "Design" | "Finance" | "Sales"
  priority: "High" | "Medium" | "Low"
  experience: "junior" | "mid" | "senior" | "lead"
  skills: string[]
  responsibilities: string[]
}

export interface TeamSuggestion {
  recommended_roles: SuggestedRole[]
  team_size: number
  hiring_order: string[]
}

// ── India-focused prompt ──────────────────────────────────────────────────────

function buildPrompt(idea: {
  title: string
  description: string
  industry: string | null
  stage: string
  problem_statement: string | null
  solution: string | null
}, existingRoles: string[] = [], singleRole = false) {
  const existingRoleText = existingRoles.length > 0
    ? `\nAlready posted roles to avoid duplicating: ${existingRoles.map(role => `"${role}"`).join(", ")}`
    : ""
  const countInstruction = singleRole
    ? "Suggest exactly ONE new role that complements the already posted roles."
    : "Suggest an ideal founding team structure."

  return `You are an expert startup advisor for Indian early-stage startups. Based on this startup idea, suggest an ideal founding team structure. Keep it practical and cost-effective for an Indian startup. Do NOT provide global-only suggestions.

Startup: "${idea.title}"
Industry: "${idea.industry ?? "General"}"
Stage: "${idea.stage}"
Problem: "${idea.problem_statement ?? idea.description}"
Solution: "${idea.solution ?? ""}"
${existingRoleText}

Indian context to consider:
- ${countInstruction}
- Do not recommend roles that are the same as or very similar to already posted roles
- Suggest roles that can be hired affordably in Indian talent markets (Bangalore, Pune, Hyderabad, remote)
- Prioritize lean team — early Indian startups run lean (3-7 people typically)
- Consider skills available in the Indian engineering/marketing talent pool
- Responsibilities should reflect Indian market execution realities

Respond ONLY with valid JSON (no markdown, no explanation):
{
  "recommended_roles": [
    {
      "role": "string (e.g. Co-founder & CTO)",
      "category": "Tech|Marketing|Product|Ops|Design|Finance|Sales",
      "priority": "High|Medium|Low",
      "experience": "junior|mid|senior|lead",
      "skills": ["skill1", "skill2", "skill3"],
      "responsibilities": ["responsibility1", "responsibility2"]
    }
  ],
  "team_size": number,
  "hiring_order": ["role1", "role2", "role3"]
}`
}

// ── Gemini call ───────────────────────────────────────────────────────────────

async function suggestWithGemini(idea: Parameters<typeof buildPrompt>[0], existingRoles: string[], singleRole: boolean): Promise<TeamSuggestion | null> {
  const apiKey = process.env.GEMINI_API_KEY
  if (!apiKey) return null
  try {
    const genAI = new GoogleGenerativeAI(apiKey)
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" })
    const result = await model.generateContent(buildPrompt(idea, existingRoles, singleRole))
    const text = result.response.text().trim().replace(/```json\n?/g, "").replace(/```\n?/g, "").trim()
    return JSON.parse(text) as TeamSuggestion
  } catch (err) {
    console.warn("[team-suggestions/Gemini] failed:", err)
    return null
  }
}

// ── Groq fallback ─────────────────────────────────────────────────────────────

async function suggestWithGroq(idea: Parameters<typeof buildPrompt>[0], existingRoles: string[], singleRole: boolean): Promise<TeamSuggestion | null> {
  const apiKey = process.env.GROQ_API_KEY
  if (!apiKey) return null
  try {
    const groq = new Groq({ apiKey })
    const completion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [{ role: "user", content: buildPrompt(idea, existingRoles, singleRole) }],
      temperature: 0.4,
      max_tokens: 1200,
    })
    const text = (completion.choices[0]?.message?.content ?? "").trim()
      .replace(/```json\n?/g, "").replace(/```\n?/g, "").trim()
    return JSON.parse(text) as TeamSuggestion
  } catch (err) {
    console.warn("[team-suggestions/Groq] failed:", err)
    return null
  }
}

// ── Rule-based fallback ───────────────────────────────────────────────────────

function roleKey(role: string) {
  return role.toLowerCase().replace(/[^a-z0-9]+/g, "")
}

function roleExists(role: string, existingRoles: string[]) {
  const key = roleKey(role)
  return existingRoles.some(existing => {
    const existingKey = roleKey(existing)
    return key.includes(existingKey) || existingKey.includes(key)
  })
}

function filterExistingRoles(suggestion: TeamSuggestion, existingRoles: string[], singleRole: boolean): TeamSuggestion {
  const recommendedRoles = suggestion.recommended_roles.filter(role => !roleExists(role.role, existingRoles))
  const roles = singleRole ? recommendedRoles.slice(0, 1) : recommendedRoles

  return {
    recommended_roles: roles,
    team_size: roles.length,
    hiring_order: roles.map(role => role.role),
  }
}

function ruleBased(idea: Parameters<typeof buildPrompt>[0], existingRoles: string[] = [], singleRole = false): TeamSuggestion {
  const industry = (idea.industry ?? "").toLowerCase()
  const isTech = industry.includes("tech") || industry.includes("saas") || industry.includes("ai")
  const isConsumer = industry.includes("consumer") || industry.includes("d2c") || industry.includes("edtech")

  const roles: SuggestedRole[] = [
    {
      role: "Co-founder & CTO",
      category: "Tech",
      priority: "High",
      experience: "senior",
      skills: ["System Design", "Node.js / Python", "AWS / GCP", "Team Leadership"],
      responsibilities: ["Build and own the technical roadmap", "Lead the MVP development", "Hire and mentor developers"],
    },
    {
      role: isTech ? "Full-stack Developer" : "Product Manager",
      category: isTech ? "Tech" : "Product",
      priority: "High",
      experience: "mid",
      skills: isTech
        ? ["React", "Next.js", "PostgreSQL", "REST APIs"]
        : ["Product Roadmap", "User Research", "Agile", "Figma"],
      responsibilities: isTech
        ? ["Implement frontend features", "Integrate third-party APIs", "Maintain code quality"]
        : ["Define product requirements", "Prioritise backlog", "Coordinate between tech and business"],
    },
    {
      role: "Growth & Marketing Lead",
      category: "Marketing",
      priority: "High",
      experience: "mid",
      skills: ["Performance Marketing", "SEO/ASO", "WhatsApp / Social Media", "Content Strategy"],
      responsibilities: ["Drive user acquisition at low CAC", "Run India-specific campaigns (Tier 2/3)", "Own retention and referral loops"],
    },
    ...(isConsumer ? [{
      role: "Operations Manager",
      category: "Ops" as const,
      priority: "Medium" as const,
      experience: "mid" as const,
      skills: ["Supply Chain", "Vendor Management", "Logistics", "Excel / Sheets"],
      responsibilities: ["Manage delivery / fulfilment", "Coordinate with vendors", "Build SOPs for scale"],
    }] : []),
    {
      role: "Business Development Executive",
      category: "Sales",
      priority: "Medium",
      experience: "junior",
      skills: ["B2B Sales", "CRM Tools", "Cold Outreach", "Hindi / Regional Language"],
      responsibilities: ["Acquire first 100 customers", "Build partnerships with SMEs", "Represent brand at Indian startup events"],
    },
  ]

  return filterExistingRoles({
    recommended_roles: roles,
    team_size: roles.length,
    hiring_order: roles.map(r => r.role),
  }, existingRoles, singleRole)
}

// ── Route handler ─────────────────────────────────────────────────────────────

export async function POST(req: NextRequest) {
  try {
    const { ideaId, existingRoles = [], singleRole = false } = await req.json()
    if (!ideaId) return NextResponse.json({ error: "ideaId required" }, { status: 400 })

    const idea = await getIdeaById(ideaId)
    if (!idea) return NextResponse.json({ error: "Idea not found" }, { status: 404 })
    if ((idea.venture_score ?? 0) < 70) {
      return NextResponse.json({ error: "Venture Score must be ≥ 70" }, { status: 403 })
    }

    const ctx = {
      title: idea.title,
      description: idea.description,
      industry: idea.industry,
      stage: idea.stage,
      problem_statement: idea.problem_statement,
      solution: idea.solution,
    }

    const excludedRoles = Array.isArray(existingRoles)
      ? existingRoles.filter((role): role is string => typeof role === "string")
      : []

    const aiSuggestion =
      (await suggestWithGemini(ctx, excludedRoles, Boolean(singleRole))) ??
      (await suggestWithGroq(ctx, excludedRoles, Boolean(singleRole)))
    const suggestion = aiSuggestion
      ? filterExistingRoles(aiSuggestion, excludedRoles, Boolean(singleRole))
      : ruleBased(ctx, excludedRoles, Boolean(singleRole))

    return NextResponse.json({ suggestion, modelUsed: aiSuggestion ? "AI" : "rule-based" })
  } catch (err) {
    console.error("[team-suggestions]", err)
    return NextResponse.json({ error: "Internal error" }, { status: 500 })
  }
}
