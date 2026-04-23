import { auth, signOut } from "@/auth"
import { redirect } from "next/navigation"

export const metadata = {
  title: "Dashboard - Minor Project"
}

export default async function DashboardPage() {
  const session = await auth()
  
  if (!session?.user) {
    redirect("/login")
  }

  return (
    <div className="min-h-screen bg-bg-primary text-white p-8">
      <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in zoom-in-95 duration-500">
        <header className="flex justify-between items-center glass-panel rounded-3xl p-6">
          <h1 className="text-2xl font-bold text-accent-yellow">Dashboard</h1>
          <form
            action={async () => {
              "use server"
              await signOut({ redirectTo: "/login" })
            }}
          >
            <button
              type="submit"
              className="bg-error/10 hover:bg-error/20 text-error px-6 py-2 rounded-xl font-semibold transition-colors outline-none focus:ring-2 focus:ring-error focus:ring-offset-2 focus:ring-offset-bg-primary"
            >
              Sign Out
            </button>
          </form>
        </header>

        <main className="glass-panel p-8 rounded-3xl space-y-6">
          <h2 className="text-xl text-accent-muted">Welcome back, {session.user.name || "User"}!</h2>
          <div className="bg-bg-secondary p-6 rounded-2xl border border-border-subtle">
            <h3 className="font-semibold text-accent-yellow mb-2 tracking-wide text-sm uppercase">Session Details</h3>
            <pre className="text-sm bg-black/40 p-4 rounded-xl overflow-x-auto text-accent-muted">
              {JSON.stringify(session.user, null, 2)}
            </pre>
          </div>
        </main>
      </div>
    </div>
  )
}
