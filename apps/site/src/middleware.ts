import { NextResponse } from "next/server"

import { verifyCookie } from "~/lib/auth"

import type { MiddlewareConfig, NextMiddleware } from "next/server"

export const middleware: NextMiddleware = async (request) => {
  const pathname = request.nextUrl.pathname
  const session = request.cookies.get("session")

  // If the user is trying to sign out, delete their session.
  if (pathname === "/auth/logout") {
    const response = NextResponse.next()
    if (session) response.cookies.delete("session")
    return response
  }

  // If the user is going to the dashboard, run some checks.
  if (pathname.startsWith("/dashboard")) {
    if (!session) {
      // If the user is not signed in, redirect them to the login page.
      return NextResponse.redirect(new URL("/auth/login", request.url))
    }

    try {
      // Attempt to verify the session.
      const { userId, guildId } = verifyCookie(session.value)

      // If the session is valid, set the user ID and guild ID headers.
      const response = NextResponse.next()

      response.headers.set("x-user-id", userId)
      response.headers.set("x-guild-id", guildId)

      return response
    } catch {
      // If the session is invalid, redirect them to the login page.
      return NextResponse.redirect(new URL("/auth/login", request.url))
    }
  }
}

export const config: MiddlewareConfig = {
  matcher: ["/dashboard/:path*", "/auth/logout"],
}
