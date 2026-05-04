import { auth } from "@/auth"
import { getPublicIdeas } from "@/lib/db/ideas"
import { getRolesByIdea } from "@/lib/db/roles"
import { applyToRoleAction, applyToIdeaAction } from "@/actions/applications"
import { Briefcase, Zap, Users, ChevronRight, Tag } from "lucide-react"
import { DbRole } from "@/lib/db/roles"

export const metadata = { title: "Browse Ideas — VentureLens" }

const CATEGORY_COLORS: Record<string, string> = {
  Tech:      "bg-blue-500/10 text-blue-300 border-blue-400/20",
  Marketing: "bg-orange-500/10 text-orange-300 border-orange-400/20",
  Product:   "bg-purple-500/10 text-purple-300 border-purple-400/20",
  Ops:       "bg-yellow-500/10 text-yellow-300 border-yellow-400/20",
  Design:    "bg-pink-500/10 text-pink-300 border-pink-400/20",
  Finance:   "bg-green-500/10 text-green-300 border-green-400/20",
  Sales:     "bg-cyan-500/10 text-cyan-300 border-cyan-400/20",
}

const EXP_LABELS: Record<string, string> = {
  junior: "Junior",
  mid: "Mid-level",
  senior: "Senior",
  lead: "Lead / Head",
}

export default async function BrowseIdeasPage() {
  const ideas = await getPublicIdeas()

  // Fetch roles for each idea
  const ideasWithRoles = await Promise.all(
    ideas.map(async idea => ({
      ...idea,
      roles: await getRolesByIdea(idea.id).catch(() => [] as DbRole[]),
    }))
  )

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-accent-yellow">Browse Ideas</h1>
        <p className="text-sm text-accent-muted mt-1">
          Explore approved startup concepts and apply to contribute.
        </p>
      </div>

      {ideasWithRoles.length === 0 ? (
        <div className="glass-panel rounded-2xl p-10 text-center border border-white/5">
          <p className="text-accent-muted">No ideas available right now. Check back later!</p>
        </div>
      ) : (
        <div className="space-y-8">
          {ideasWithRoles.map(idea => (
            <div key={idea.id} className="glass-panel rounded-3xl border border-white/5 overflow-hidden">
              {/* Idea header */}
              <div className="p-6 border-b border-white/5">
                <div className="flex items-start justify-between gap-4 flex-wrap">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 flex-wrap mb-2">
                      {idea.venture_score !== null && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-success/10 border border-success/20 text-success text-xs font-bold">
                          <Zap className="w-3 h-3" /> {idea.venture_score}
                        </span>
                      )}
                      {idea.industry && (
                        <span className="text-xs text-white/40 px-2 py-1 bg-white/5 rounded-lg">{idea.industry}</span>
                      )}
                      <span className="text-xs text-white/30 capitalize">{idea.stage}</span>
                    </div>
                    <h2 className="text-xl font-bold text-accent-yellow">{idea.title}</h2>
                    <p className="text-sm text-white/60 mt-1.5 line-clamp-2">{idea.description}</p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold border ${
                      idea.roles.length > 0
                        ? "bg-btn/10 text-btn border-btn/20"
                        : "bg-white/5 text-white/40 border-white/10"
                    }`}>
                      <Briefcase className="w-3 h-3" />
                      {idea.roles.length} role{idea.roles.length !== 1 ? "s" : ""} open
                    </span>
                  </div>
                </div>
              </div>

              {/* Roles */}
              {idea.roles.length > 0 ? (
                <div className="p-6 space-y-4">
                  <h3 className="text-xs font-bold text-white/40 uppercase tracking-widest flex items-center gap-2">
                    <Users className="w-3.5 h-3.5" /> Open Positions
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {idea.roles.map(role => {
                      async function applyRole(formData: FormData) {
                        "use server"
                        await applyToRoleAction(idea.id, role.id, formData)
                      }

                      return (
                        <div key={role.id} className="rounded-2xl border border-white/8 bg-white/2 p-4 space-y-3">
                          {/* Role header */}
                          <div className="flex items-start gap-3">
                            <div className="w-9 h-9 rounded-lg bg-btn/10 border border-btn/20 flex items-center justify-center shrink-0">
                              <Briefcase className="w-4 h-4 text-btn" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 flex-wrap mb-0.5">
                                <span className="font-bold text-sm text-white">{role.role_title}</span>
                                {role.ai_suggested && (
                                  <span className="px-1.5 py-0.5 rounded-full bg-btn/10 text-btn text-[9px] font-bold border border-btn/20">✨ AI</span>
                                )}
                              </div>
                              <div className="flex items-center gap-2 flex-wrap">
                                <span className={`px-2 py-0.5 rounded-md border text-[10px] font-bold ${CATEGORY_COLORS[role.category] ?? "bg-white/5 text-white/40 border-white/10"}`}>
                                  {role.category}
                                </span>
                                <span className="text-xs text-white/40">{EXP_LABELS[role.experience_level] ?? role.experience_level}</span>
                                <span className="text-xs text-white/30">{role.openings} opening{role.openings !== 1 ? "s" : ""}</span>
                              </div>
                            </div>
                          </div>

                          {/* Skills */}
                          {role.skills.length > 0 && (
                            <div className="flex flex-wrap gap-1.5">
                              {role.skills.map(s => (
                                <span key={s} className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-white/5 border border-white/8 text-white/50 text-[11px]">
                                  <Tag className="w-2.5 h-2.5" /> {s}
                                </span>
                              ))}
                            </div>
                          )}

                          {/* Description */}
                          {role.description && (
                            <p className="text-xs text-white/40 line-clamp-2">{role.description}</p>
                          )}

                          {/* Apply form */}
                          <form action={applyRole} className="space-y-2 pt-1 border-t border-white/5">
                            <textarea
                              name="message"
                              placeholder="Why are you a great fit for this role? (optional)"
                              rows={2}
                              className="w-full bg-black/20 border border-white/10 rounded-xl px-3 py-2 text-xs text-white placeholder:text-white/25 focus:outline-none focus:border-btn/40 resize-none"
                            />
                            <button
                              type="submit"
                              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-btn text-btn-foreground text-sm font-bold hover:bg-btn/90 transition-all"
                            >
                              Apply for this Role <ChevronRight className="w-4 h-4" />
                            </button>
                          </form>
                        </div>
                      )
                    })}
                  </div>
                </div>
              ) : (
                /* Generic apply if no roles posted */
                <div className="p-6 border-t border-white/5">
                  <GenericApplyForm ideaId={idea.id} />
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

function GenericApplyForm({ ideaId }: { ideaId: string }) {
  async function apply(formData: FormData) {
    "use server"
    await applyToIdeaAction(ideaId, formData)
  }

  return (
    <form action={apply} className="space-y-3">
      <p className="text-xs text-white/40">No specific roles posted yet — send a general application.</p>
      <textarea
        name="message"
        placeholder="Tell the founder why you want to contribute…"
        rows={2}
        required
        minLength={10}
        className="w-full bg-black/20 border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white placeholder:text-white/25 focus:outline-none focus:border-btn/40 resize-none"
      />
      <button
        type="submit"
        className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-btn text-btn-foreground text-sm font-bold hover:bg-btn/90 transition-all"
      >
        Apply to Join <ChevronRight className="w-4 h-4" />
      </button>
    </form>
  )
}
