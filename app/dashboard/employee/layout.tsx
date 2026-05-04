import { auth } from "@/auth"
import { redirect } from "next/navigation"
import { Sidebar } from "@/components/dashboard/Sidebar"
import { LayoutDashboard, Compass, Send, User } from "lucide-react"

export default async function EmployeeDashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await auth()

  if (!session?.user) redirect("/login")
  if (session.user.role !== "employee") redirect("/dashboard")

  const links = [
    { label: "Overview", href: "/dashboard/employee", icon: <LayoutDashboard className="w-5 h-5" />, exact: true },
    { label: "Browse Ideas", href: "/dashboard/employee/browse", icon: <Compass className="w-5 h-5" /> },
    { label: "My Applications", href: "/dashboard/employee/applications", icon: <Send className="w-5 h-5" /> },
    { label: "Profile", href: "/dashboard/employee/profile", icon: <User className="w-5 h-5" /> },
  ]

  return (
    <div className="min-h-screen bg-background flex">
      <Sidebar role="employee" userName={session.user.name ?? session.user.email!} links={links} />
      
      <main className="flex-1 lg:pl-64 flex flex-col min-h-screen">
        <div className="flex-1 p-6 lg:p-10 max-w-6xl mx-auto w-full animate-in fade-in duration-500">
          {children}
        </div>
      </main>
    </div>
  )
}
