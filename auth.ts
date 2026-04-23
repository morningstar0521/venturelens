import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"
import bcrypt from "bcryptjs"
import { LoginSchema } from "@/lib/validations"

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      async authorize(credentials) {
        // Validate incoming credentials shape with Zod
        const parsed = LoginSchema.safeParse(credentials)
        if (!parsed.success) return null

        const { email, password } = parsed.data

        // ─── TODO (Phase 2): Replace with Supabase query ─────────────
        // const user = await prisma.user.findUnique({ where: { email } })
        // if (!user || !user.password) return null
        // const passwordsMatch = await bcrypt.compare(password, user.password)
        // if (!passwordsMatch) return null
        // return { id: user.id, name: user.name, email: user.email, role: user.role }
        // ─────────────────────────────────────────────────────────────

        // MOCK: test@example.com / password123
        if (email === "test@example.com") {
          const MOCK_HASH = await bcrypt.hash("password123", 10)
          const match = await bcrypt.compare(password, MOCK_HASH)
          if (match) {
            return { id: "mock-user-1", name: "Test User", email, role: "user" }
          }
        }

        return null
      },
    }),
  ],

  session: { strategy: "jwt" },

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id as string
        token.role = (user.role ?? "user") as string
      }
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id
        session.user.role = token.role
      }
      return session
    },
  },

  pages: {
    signIn: "/login",
  },
})
