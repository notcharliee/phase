// This middleware is designed to handle requests to routes matching
// "/dashboard/:path*" by checking authentication cookies, validating
// them against Redis, and adding user-related headers to the request.
// If authentication fails at any step, it redirects the user to the
// authentication endpoint.

import { NextResponse, NextRequest } from "next/server"
import { Redis } from "@upstash/redis"
import { AuthorisedUser } from "@/types"
import { env } from "@/env"


export async function middleware(request: NextRequest) {
  const authSessionCookie = request.cookies.get("auth_session")

  if (!authSessionCookie)
    return NextResponse.redirect(new URL("/api/auth", request.url))

  const redis = new Redis({
    url: env.UPSTASH_URL!,
    token: env.UPSTASH_TOKEN!,
  })

  const validAuth = await redis.get(`auth:${authSessionCookie.value}`) as AuthorisedUser | undefined

  if (!validAuth)
    return NextResponse.redirect(new URL("/api/auth", request.url))

  const requestHeaders = new Headers(request.headers)
  requestHeaders.set("x-user-token", validAuth.token.access_token)
  requestHeaders.set("x-user-session", validAuth.session)
  requestHeaders.set("x-user-id", validAuth.id)

  return NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  })
}

export const config = {
  matcher: "/dashboard/:path*",
}
