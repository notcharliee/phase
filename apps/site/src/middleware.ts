import { NextResponse, NextRequest } from "next/server"
import { kv } from "@vercel/kv"

import { User, UserSchema } from "@/lib/types"
import { env } from "@/lib/env"

import type { RESTPostOAuth2AccessTokenResult } from "discord-api-types/v10"


export async function middleware(request: NextRequest) {
  const sessionCookie = request.cookies.get("session")

  if (!sessionCookie)
    return NextResponse.redirect(env.NEXT_PUBLIC_BASE_URL + "/api/auth")

  const userData = await kv.get("auth:" + sessionCookie.value)
  const userDataParsed = UserSchema.safeParse(userData)
  const user = userDataParsed.success ? userDataParsed.data : null

  if (!user)
    return NextResponse.redirect(env.NEXT_PUBLIC_BASE_URL + "/api/auth")
  
  const headers = new Headers(request.headers)

  if (user.expires_timestamp < (Math.floor(Date.now() / 1000) + (1000 * 60 * 15))) {
    const token = await fetch("https://discord.com/api/v10/oauth2/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        client_id: env.DISCORD_ID,
        client_secret: env.DISCORD_SECRET,
        grant_type: "refresh_token",
        refresh_token: user.refresh_token,
      }),
    }).then(response => response.json()) as RESTPostOAuth2AccessTokenResult

    const updatedUser = {
      user_id: user.user_id,
      session_id: user.session_id,
      access_token: token.access_token,
      refresh_token: token.refresh_token,
      created_timestamp: user.created_timestamp,
      expires_timestamp: Math.floor(Date.now() / 1000) + 604800,
    } satisfies User

    await kv.set("auth:" + updatedUser.session_id, updatedUser)

    headers.set("x-user-id", updatedUser.user_id)
    headers.set("x-user-token", updatedUser.access_token)
    headers.set("x-user-session", updatedUser.session_id)
  } else {
    headers.set("x-user-id", user.user_id)
    headers.set("x-user-token", user.access_token)
    headers.set("x-user-session", user.session_id)
  }

  return NextResponse.next({
    request: {
      headers,
    },
  })
}

export const config = {
  matcher: "/dashboard/:path*",
}
