import { NextResponse } from "next/server"

import { kv } from "@vercel/kv"

import { env } from "@/lib/env"

import type { User } from "@/types/auth"
import type { NextMiddleware } from "next/server"

export const middleware: NextMiddleware = async (request) => {
  // If the user is going to the dashboard, send them to the modules page.

  if (request.nextUrl.pathname === "/dashboard") {
    return NextResponse.redirect(new URL("/dashboard/modules", request.url))
  }

  // If the user is trying to sign out, delete their session and redirect them to the home page.

  if (request.nextUrl.pathname === "/dashboard/signout") {
    if (request.cookies.has("session")) {
      const cookie = request.cookies.get("session")!.value

      await kv.del(`session:${cookie}`)
      request.cookies.delete("session")
    }

    return NextResponse.redirect(new URL("/?signedOut=true", request.url))
  }

  const headers = new Headers(request.headers)

  // If the user is already signed in, set the user ID and guild ID headers.

  if (env.NEXT_MIDDLEWARE_USER_ID && env.NEXT_MIDDLEWARE_GUILD_ID) {
    headers.set("x-user-id", env.NEXT_MIDDLEWARE_USER_ID)
    headers.set("x-guild-id", env.NEXT_MIDDLEWARE_GUILD_ID)
  } else {
    const cookie = request.cookies.get("session")
    if (!cookie) return NextResponse.redirect(new URL("/login", request.url))

    const user = (await kv
      .get(`session:${cookie.value}`)
      .catch(() => null)) as User | null

    if (!user) return NextResponse.redirect(new URL("/login", request.url))

    headers.set("x-user-id", user.user_id)
    headers.set("x-guild-id", user.guild_id)
  }

  return NextResponse.next({
    request: { headers },
  })
}

export const config = {
  matcher: "/dashboard/:path*",
}
