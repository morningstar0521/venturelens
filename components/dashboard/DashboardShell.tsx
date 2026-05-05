"use client"

import { useState } from "react"
import { Sidebar, NavLink } from "./Sidebar"

interface DashboardShellProps {
  role: "admin" | "founder" | "employee"
  userName: string
  links: NavLink[]
  children: React.ReactNode
  maxWidth?: string
}

export function DashboardShell({
  role,
  userName,
  links,
  children,
  maxWidth = "max-w-7xl"
}: DashboardShellProps) {
  const [isCollapsed, setIsCollapsed] = useState(false)

  return (
    <div className="min-h-screen bg-bg-secondary/60 flex">
      <Sidebar
        role={role}
        userName={userName}
        links={links}
        isCollapsed={isCollapsed}
        onToggle={() => setIsCollapsed(!isCollapsed)}
      />

      <main className={`
        flex-1 flex flex-col min-h-screen transition-all duration-300
        ${isCollapsed ? "lg:pl-20" : "lg:pl-64"}
      `}>
        <div className={`flex-1 p-6 lg:p-10 ${maxWidth} mx-auto w-full animate-in fade-in duration-500`}>
          {children}
        </div>
      </main>
    </div>
  )
}
