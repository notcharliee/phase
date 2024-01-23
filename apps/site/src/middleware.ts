import { NextResponse, NextRequest } from "next/server"
import { kv } from "@vercel/kv"

import type { User } from "@/lib/types"


export async function middleware(request: NextRequest) {
  const userCookie = request.cookies.get("user")

  console.log(request.cookies.getAll())

  const user = userCookie ? await kv.get(`user:${userCookie.value}`) as User | null : null

  if (!user || (user.expires_timestamp < (Date.now() + (1000 * 60 * 15)) / 1000))
    return NextResponse.redirect(new URL("/api/auth", request.url))

  const headers = new Headers(request.headers)
  
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
