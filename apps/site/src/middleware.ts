import { NextResponse, type NextRequest } from "next/server"
import { kv } from "@vercel/kv"

import { env } from "@/lib/env"
import type { User } from "@/types/auth"

const devMode = !!(
  env.NODE_ENV == "development" &&
  env.NEXT_MIDDLEWARE_AUTH_ID &&
  env.NEXT_MIDDLEWARE_USER_ID &&
  env.NEXT_MIDDLEWARE_USER_TOKEN
)

export async function middleware(request: NextRequest) {
  const headers = new Headers(request.headers)

  if (devMode) {
    headers.set("x-auth-id", env.NEXT_MIDDLEWARE_AUTH_ID!)
    headers.set("x-user-id", env.NEXT_MIDDLEWARE_USER_ID!)
    headers.set("x-user-token", env.NEXT_MIDDLEWARE_USER_TOKEN!)

    return NextResponse.next({
      request: { headers },
    })
  }

  const userCookie = request.cookies.get("user")
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
  const user = (
    userCookie ? await kv.get(`user:${userCookie.value}`) : null
  ) as User | null

  if (!user || user.expires_timestamp < (Date.now() + 1000 * 60 * 15) / 1000)
    return NextResponse.redirect(new URL("/api/auth", request.url))

  headers.set("x-auth-id", user.id)
  headers.set("x-user-id", user.discord_id)
  headers.set("x-user-token", user.discord_token)

  return NextResponse.next({
    request: { headers },
  })
}

export const config = {
  matcher: "/dashboard/:path*",
}
