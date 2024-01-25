import { randomUUID } from "crypto"

import { NextResponse, NextRequest } from "next/server"
import { cookies } from "next/headers"
import { kv } from "@vercel/kv"

import { API } from "@discordjs/core/http-only"
import { REST } from "@discordjs/rest"

import { User } from "@/types/auth"
import { env } from "@/lib/env"


const discordREST = new REST().setToken(env.DISCORD_TOKEN)
const discordAPI = new API(discordREST)


export const GET = async (request: NextRequest) => {
  const code = request.nextUrl.searchParams.get("code")
  const error = request.nextUrl.searchParams.get("error")

  if (error == "access_denied") return NextResponse.redirect("/")

  if (!code) return NextResponse.json({
    error: "Bad Request",
    message: "Provide a valid token exchange code.",
  }, { status: 400 })

  const token = await discordAPI.oauth2.tokenExchange({
    client_id: env.DISCORD_ID,
    client_secret: env.DISCORD_SECRET,
    grant_type: "authorization_code",
    redirect_uri: request.nextUrl.origin + "/api/auth/callback",
    code,
  })

  const userREST = new REST({ authPrefix: "Bearer" }).setToken(token.access_token)
  const userAPI = new API(userREST)
  const user = await userAPI.users.getCurrent()

  const userObject = {
    id: randomUUID(),
    discord_id: user.id,
    discord_token: token.access_token,
    created_timestamp: Math.floor(Date.now() / 1000),
    expires_timestamp: Math.floor(Date.now() / 1000) + 604800,
  } satisfies User

  cookies().set("user", userObject.id, {
    expires: new Date("2038/1/19"),
    httpOnly: true,
    sameSite: true,
    secure: true,
  })

  await kv.set(`user:${userObject.id}`, userObject, { exat: userObject.expires_timestamp })

  return NextResponse.redirect(new URL("/dashboard", request.url))
}
