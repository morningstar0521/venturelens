import { auth } from "@/auth"
import { redirect } from "next/navigation"

export default async function DashboardRedirect() {
  const session = await auth()
  
  if (!session?.user) {
    redirect("/login")
  }

  if (session.user.role === "founder") {
    redirect("/dashboard/founder")
  } else if (session.user.role === "employee") {
    redirect("/dashboard/employee")
  } else if (session.user.role === "admin") {
    redirect("/admin/dashboard")
  }

  // Fallback
  redirect("/login")
}
