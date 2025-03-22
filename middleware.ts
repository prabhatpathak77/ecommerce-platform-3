import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { getToken } from "next-auth/jwt"

export async function middleware(request: NextRequest) {
  const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET })

  // Check if user is trying to access admin pages
  if (request.nextUrl.pathname.startsWith("/admin")) {
    // If not logged in, redirect to login
    if (!token) {
      return NextResponse.redirect(new URL("/auth/login?callbackUrl=/admin", request.url))
    }

    // If not an admin, redirect to user dashboard
    if (token.role !== "ADMIN") {
      return NextResponse.redirect(new URL("/dashboard", request.url))
    }
  }

  // Check if user is trying to access dashboard
  if (request.nextUrl.pathname.startsWith("/dashboard")) {
    // If not logged in, redirect to login
    if (!token) {
      return NextResponse.redirect(new URL("/auth/login?callbackUrl=/dashboard", request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/admin/:path*", "/dashboard/:path*"],
}

