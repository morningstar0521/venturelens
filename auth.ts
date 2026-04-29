import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"
import bcrypt from "bcryptjs"
import { getUserByEmail } from "@/lib/db/users"

// Admin credentials are now stored in the database

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

        // ── Database lookup for all roles ───────────────────────────
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
