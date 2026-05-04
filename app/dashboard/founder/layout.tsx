import { requireFounderSession } from "@/lib/auth/guards"
import { Sidebar } from "@/components/dashboard/Sidebar"
import { LayoutDashboard, Lightbulb, Users, PlusCircle, Briefcase } from "lucide-react"

export default async function FounderDashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await requireFounderSession()

  const links = [
    { label: "Overview",      href: "/dashboard/founder",              icon: <LayoutDashboard className="w-5 h-5" />, exact: true },
    { label: "My Ideas",      href: "/dashboard/founder/ideas",        icon: <Lightbulb className="w-5 h-5" /> },
    { label: "Submit Idea",   href: "/dashboard/founder/ideas/new",    icon: <PlusCircle className="w-5 h-5" /> },
    { label: "Team Builder",  href: "/dashboard/founder/team",         icon: <Briefcase className="w-5 h-5" /> },
    { label: "Applicants",    href: "/dashboard/founder/applicants",   icon: <Users className="w-5 h-5" /> },
  ]

  return (
    <div className="min-h-screen bg-background flex">
      <Sidebar role="founder" userName={session.user.name ?? session.user.email!} links={links} />
      
      <main className="flex-1 lg:pl-64 flex flex-col min-h-screen">
        <div className="flex-1 p-6 lg:p-10 max-w-6xl mx-auto w-full animate-in fade-in duration-500">
          {children}
        </div>
      </main>
    </div>
  )
}
