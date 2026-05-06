import { requireFounderSession } from "@/lib/auth/guards"
import { DashboardShell } from "@/components/dashboard/DashboardShell"
import { getIdeasByFounder } from "@/lib/db/ideas"
import { getApplicationsForFounder } from "@/lib/db/applications"
import { LayoutDashboard, Lightbulb, Users, PlusCircle, Briefcase, UserCheck } from "lucide-react"

export default async function FounderDashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await requireFounderSession()
  const ideas = await getIdeasByFounder(session.user.id)
  const applications = await getApplicationsForFounder(ideas.map(idea => idea.id))
  const hasAcceptedMembers = applications.some(app => app.status === "accepted")

  const links = [
    { label: "Overview",      href: "/dashboard/founder",              icon: <LayoutDashboard className="w-5 h-5" />, exact: true },
    { label: "My Ideas",      href: "/dashboard/founder/ideas",        icon: <Lightbulb className="w-5 h-5" /> },
    { label: "Submit Idea",   href: "/dashboard/founder/ideas/new",    icon: <PlusCircle className="w-5 h-5" /> },
    { label: "Team Builder",  href: "/dashboard/founder/team",         icon: <Briefcase className="w-5 h-5" /> },
    { label: "Applicants",    href: "/dashboard/founder/applicants",   icon: <Users className="w-5 h-5" /> },
  ]

  if (hasAcceptedMembers) {
    links.push({
      label: "My Team",
      href: "/dashboard/founder/my-team",
      icon: <UserCheck className="w-5 h-5" />,
    })
  }

  return (
    <DashboardShell
      role="founder"
      userName={session.user.name ?? session.user.email!}
      links={links}
      maxWidth="max-w-6xl"
    >
      {children}
    </DashboardShell>
  )
}
