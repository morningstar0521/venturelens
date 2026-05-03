import { auth } from "@/auth"
import { redirect } from "next/navigation"
import { Sidebar } from "@/components/dashboard/Sidebar"
import { LayoutDashboard, Users, Lightbulb, AlertTriangle } from "lucide-react"

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
    <div className="min-h-screen bg-bg-secondary/60 flex">
      <Sidebar role="admin" email={session.user.email!} links={links} />
      
      <main className="flex-1 lg:pl-64 flex flex-col min-h-screen">
        <div className="flex-1 p-6 lg:p-10 max-w-7xl mx-auto w-full animate-in fade-in duration-500">
          {children}
        </div>
      </main>
    </div>
  )
}
