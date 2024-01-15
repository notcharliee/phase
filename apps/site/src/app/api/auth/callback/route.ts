import { randomUUID } from "crypto"

import { NextResponse, NextRequest } from "next/server"
import { cookies } from "next/headers"
import { kv } from "@vercel/kv"

import { API } from "@discordjs/core/http-only"
import { REST } from "@discordjs/rest"

import { User } from "@/lib/types"
import { env } from "@/lib/env"


const discordREST = new REST().setToken(env.DISCORD_TOKEN)
const discordAPI = new API(discordREST)


export const GET = async (request: NextRequest) => {
  const code = request.nextUrl.searchParams.get("code")
  const sessionCookie = request.cookies.get("session")

  if (!code) return NextResponse.json({
    error: "Bad Request",
    message: "Provide a valid token exchange code.",
  }, { status: 400 })

  const token = await discordAPI.oauth2.tokenExchange({
    client_id: env.DISCORD_ID,
    client_secret: env.DISCORD_SECRET,
    grant_type: "authorization_code",
    redirect_uri: env.NEXT_PUBLIC_BASE_URL + "/api/auth/callback",
    code,
  })

  const userREST = new REST({ authPrefix: "Bearer" }).setToken(token.access_token)
  const userAPI = new API(userREST)
  const user = await userAPI.users.getCurrent()

  const updatedUser = {
    user_id: user.id,
    session_id: randomUUID(),
    access_token: token.access_token,
    refresh_token: token.refresh_token,
    created_timestamp: Math.floor(Date.now() / 1000),
    expires_timestamp: Math.floor(Date.now() / 1000) + 604800,
  } satisfies User

  if (sessionCookie) await kv.rename("auth:" + sessionCookie.value, "auth:" + updatedUser.session_id)
  await kv.set("auth:" + updatedUser.session_id, updatedUser)

  cookies().set("session", updatedUser.session_id, {
    httpOnly: true,
    sameSite: true,
    secure: true,
    expires: new Date("Tue, 19 Jan 2038 04:14:07 GMT"),
  })

  return NextResponse.redirect(new URL("/dashboard", request.url))
}
