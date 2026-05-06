import { auth } from "@/auth"
import { getPublicIdeas } from "@/lib/db/ideas"
import { getRolesByIdea } from "@/lib/db/roles"
import { getApplicationsByEmployee } from "@/lib/db/applications"
import { Briefcase, Zap, Users, ChevronRight, ArrowUpRight, CheckCircle2 } from "lucide-react"
import { DbRole } from "@/lib/db/roles"
import Link from "next/link"

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
  const session = await auth()
  const ideas = await getPublicIdeas()
  const userApps = await getApplicationsByEmployee(session!.user.id)
  
  // Create sets for fast lookup
  const appliedRoleIds = new Set(userApps.map(a => a.role_requirement_id).filter(Boolean))
  const ideasWithGeneralApp = new Set(userApps.filter(a => !a.role_requirement_id).map(a => a.idea_id))

  // Fetch roles for each idea and enrich
  const ideasWithRoles = await Promise.all(
    ideas.map(async idea => {
      const allRoles = await getRolesByIdea(idea.id).catch(() => [] as DbRole[])
      return {
        ...idea,
        roles: allRoles,
        hasGeneralApp: ideasWithGeneralApp.has(idea.id)
      }
    })
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
          {ideasWithRoles.map(idea => {
            const openRoles = idea.roles.filter(r => !appliedRoleIds.has(r.id))
            const appliedRolesInThisIdea = idea.roles.filter(r => appliedRoleIds.has(r.id))

            return (
              <div key={idea.id} className="glass-panel rounded-[2rem] border border-white/10 overflow-hidden shadow-lg hover:shadow-accent-yellow/5 transition-all duration-500">
                {/* Idea header */}
                <div className="p-8 border-b border-white/5 bg-white/2">
                  <div className="flex items-start justify-between gap-6 flex-wrap">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 flex-wrap mb-3">
                        {idea.venture_score !== null && (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-success/10 border border-success/20 text-success text-[11px] font-black">
                            <Zap className="w-3.5 h-3.5 fill-success" /> {idea.venture_score} SCORE
                          </span>
                        )}
                        {idea.industry && (
                          <span className="text-[10px] font-black uppercase tracking-widest text-white/40 px-2.5 py-1 bg-white/5 border border-white/10 rounded-lg">{idea.industry}</span>
                        )}
                        <span className="text-[10px] font-black uppercase tracking-widest text-white/30 px-2.5 py-1 bg-white/5 border border-white/10 rounded-lg">{idea.stage}</span>
                      </div>
                      <h2 className="text-2xl font-black text-white leading-tight tracking-tight">{idea.title}</h2>
                      <p className="text-sm text-white/50 mt-2.5 line-clamp-2 leading-relaxed">{idea.description}</p>
                    </div>
                    <div className="flex flex-col items-end gap-3 shrink-0">
                      <span className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-[11px] font-black border tracking-widest uppercase ${
                        idea.roles.length > 0
                          ? "bg-btn/10 text-btn border-btn/20"
                          : "bg-white/5 text-white/40 border-white/10"
                      }`}>
                        <Users className="w-3.5 h-3.5" />
                        {idea.roles.length} role{idea.roles.length !== 1 ? "s" : ""} open
                      </span>
                      {idea.roles.length === 0 && (
                        idea.hasGeneralApp ? (
                          <div className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-success/10 border border-success/20 text-success text-sm font-black">
                            <CheckCircle2 className="w-4 h-4" /> Applied
                          </div>
                        ) : (
                          <Link 
                            href={`/dashboard/employee/browse/apply?ideaId=${idea.id}`}
                            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-btn text-btn-foreground text-sm font-black hover:scale-[1.02] active:scale-95 transition-all shadow-lg"
                          >
                            Apply to Join <ArrowUpRight className="w-4 h-4" />
                          </Link>
                        )
                      )}
                    </div>
                  </div>
                </div>

                {/* Roles */}
                {(openRoles.length > 0 || appliedRolesInThisIdea.length > 0) && (
                  <div className="p-8 space-y-6 bg-black/20">
                    <div className="flex items-center justify-between">
                      <h3 className="text-[11px] font-black text-white/30 uppercase tracking-[0.3em] flex items-center gap-2">
                        <Briefcase className="w-4 h-4" /> Hiring Now
                      </h3>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Show Open Roles First */}
                      {openRoles.map(role => (
                        <div key={role.id} className="group rounded-[1.5rem] border border-white/5 bg-white/2 p-6 hover:bg-white/5 hover:border-white/10 transition-all duration-300 flex flex-col justify-between h-full">
                          <div className="space-y-4">
                            <div className="flex items-start gap-4">
                              <div className="w-12 h-12 rounded-2xl bg-btn/10 border border-btn/20 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                                <Briefcase className="w-5 h-5 text-btn" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 flex-wrap mb-1">
                                  <span className="font-bold text-base text-white">{role.role_title}</span>
                                  {role.ai_suggested && (
                                    <span className="px-1.5 py-0.5 rounded-full bg-btn/10 text-btn text-[9px] font-black border border-btn/20 tracking-tighter uppercase italic">✨ AI</span>
                                  )}
                                </div>
                                <div className="flex items-center gap-2 flex-wrap">
                                  <span className={`px-2 py-0.5 rounded-lg border text-[10px] font-black uppercase tracking-wider ${CATEGORY_COLORS[role.category] ?? "bg-white/5 text-white/40 border-white/10"}`}>
                                    {role.category}
                                  </span>
                                  <span className="text-xs text-white/40 font-medium">{EXP_LABELS[role.experience_level] ?? role.experience_level}</span>
                                </div>
                              </div>
                            </div>
                            {role.description && <p className="text-sm text-white/30 line-clamp-2 leading-relaxed">{role.description}</p>}
                          </div>
                          <div className="pt-6 mt-6 border-t border-white/5">
                            <Link 
                              href={`/dashboard/employee/browse/apply?ideaId=${idea.id}&roleId=${role.id}`}
                              className="w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl bg-white/5 border border-white/10 text-white text-sm font-black hover:bg-btn hover:text-btn-foreground hover:border-transparent transition-all"
                            >
                              Apply for Role <ChevronRight className="w-4 h-4" />
                            </Link>
                          </div>
                        </div>
                      ))}

                      {/* Show Applied Roles as smaller/faded versions */}
                      {appliedRolesInThisIdea.map(role => (
                        <div key={role.id} className="rounded-[1.5rem] border border-success/10 bg-success/2 p-6 flex flex-col justify-between h-full opacity-60">
                          <div className="space-y-4">
                            <div className="flex items-start gap-4">
                              <div className="w-12 h-12 rounded-2xl bg-success/10 border border-success/20 flex items-center justify-center shrink-0">
                                <CheckCircle2 className="w-5 h-5 text-success" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <h4 className="font-bold text-base text-white/80">{role.role_title}</h4>
                                <span className="text-[10px] font-black text-success uppercase tracking-widest">Application Sent</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

