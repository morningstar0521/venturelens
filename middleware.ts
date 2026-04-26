import { auth } from "@/auth"
import { NextResponse } from "next/server"

export default auth((req) => {
  const isLoggedIn = !!req.auth
  const role = req.auth?.user?.role
  const { pathname } = req.nextUrl

  const isAuthPage =
    pathname.startsWith("/login") || pathname.startsWith("/register")

  const isProtectedPage =
    pathname.startsWith("/dashboard") ||
    pathname.startsWith("/profile") ||
    pathname.startsWith("/settings")

  const isAdminPage = pathname.startsWith("/admin/dashboard")

  // Redirect logged-in users away from auth pages
  if (isAuthPage && isLoggedIn) {
    const dest = role === "admin" ? "/admin/dashboard" : "/dashboard"
    return NextResponse.redirect(new URL(dest, req.url))
  }

  // Guard admin dashboard — only admins allowed
  if (isAdminPage) {
    if (!isLoggedIn) {
      return NextResponse.redirect(new URL("/login/admin", req.url))
    }
    if (role !== "admin") {
      return NextResponse.redirect(new URL("/dashboard", req.url))
    }
  }

  // Guard general protected pages
  if (isProtectedPage && !isLoggedIn) {
    const loginUrl = new URL("/login", req.url)
    loginUrl.searchParams.set("callbackUrl", pathname)
    return NextResponse.redirect(loginUrl)
  }

  return NextResponse.next()
})

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
}
