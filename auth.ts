import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"
import bcrypt from "bcryptjs"
import { getUserByEmail } from "@/lib/db/users"
import { authConfig } from "./auth.config"

export const { handlers, signIn, signOut, auth } = NextAuth({
  ...authConfig,
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

        const user = await getUserByEmail(email)
        if (!user) return null

        if (user.role !== role) return null

        const passwordsMatch = await bcrypt.compare(password, user.password_hash)
        if (!passwordsMatch) return null

        return { id: user.id, name: user.name, email: user.email, role: user.role }
      },
    }),
  ],
  session: { strategy: "jwt" },
})
