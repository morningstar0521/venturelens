import { auth } from "@/auth"
import { redirect } from "next/navigation"
import { DashboardShell } from "@/components/dashboard/DashboardShell"
import { LayoutDashboard, Users, Lightbulb } from "lucide-react"

export default async function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await auth()

  if (!session?.user) redirect("/login/admin")
  if (session.user.role !== "admin") redirect("/dashboard")

  const links = [
    { label: "Overview", href: "/admin/dashboard", icon: <LayoutDashboard className="w-5 h-5" />, exact: true },
    { label: "Users", href: "/admin/dashboard/users", icon: <Users className="w-5 h-5" /> },
    { label: "Ideas", href: "/admin/dashboard/ideas", icon: <Lightbulb className="w-5 h-5" /> },
  ]

  return (
    <DashboardShell 
      role="admin" 
      userName={session.user.name ?? session.user.email!} 
      links={links}
    >
      {children}
    </DashboardShell>
  )
}
