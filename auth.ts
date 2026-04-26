import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"
import bcrypt from "bcryptjs"
import { getUserByEmail } from "@/lib/db/users"

// ─── Hardcoded Admin Credentials ─────────────────────────────────────────
// For production: move these to .env variables (already done in .env.local).
const ADMIN_EMAIL = process.env.ADMIN_EMAIL ?? "admin@venturelens.ai"
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD ?? "Admin@VL2024!"

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      credentials: {
        email:    { label: "Email",    type: "email"    },
        password: { label: "Password", type: "password" },
        role:     { label: "Role",     type: "text"     },
      },
      async authorize(credentials) {
        const email    = credentials?.email    != null ? String(credentials.email)    : undefined
        const password = credentials?.password != null ? String(credentials.password) : undefined
        const role     = credentials?.role     != null ? String(credentials.role)     : undefined

        if (!email || !password || !role) return null

        // ── Admin: hardcoded check (no DB) ──────────────────────────
        if (role === "admin") {
          if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
            return { id: "admin-1", name: "Administrator", email, role: "admin" }
          }
          return null
        }

        // ── Founder / Employee: DB lookup ───────────────────────────
        const user = await getUserByEmail(email)
        if (!user) return null

        // Ensure the role matches what the user signed up as
        if (user.role !== role) return null

        const passwordsMatch = await bcrypt.compare(password, user.password_hash)
        if (!passwordsMatch) return null

        return { id: user.id, name: user.name, email: user.email, role: user.role }
      },
    }),
  ],

  session: { strategy: "jwt" },

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id   = user.id as string
        token.role = (user.role ?? "founder") as string
      }
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id   = token.id   as string
        session.user.role = token.role as string
      }
      return session
    },
  },

  pages: {
    signIn: "/login",
  },
})
