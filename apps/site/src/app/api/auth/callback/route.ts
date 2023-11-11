import { NextResponse, NextRequest } from "next/server"
import { cookies } from "next/headers"

import { API } from "@discordjs/core/http-only"
import { REST } from "@discordjs/rest"

import { redisClient } from "utils/redis"

import { randomUUID } from "crypto"

export const GET = async (request: NextRequest) => {
  const discordREST = new REST().setToken(process.env.DISCORD_TOKEN!)
  const discordAPI = new API(discordREST)

  const redis = redisClient(
    process.env.UPSTASH_URL!,
    process.env.UPSTASH_TOKEN!,
  )

  const tokenExchangeCode = request.nextUrl.searchParams.get("code")

  if (!tokenExchangeCode)
    return NextResponse.json(
      {
        error: "Bad Request",
        message: "Provide a valid token exchange code.",
      },
      { status: 400 },
    )

  const discordUserAccessToken = await discordAPI.oauth2.tokenExchange({
    client_id: process.env.DISCORD_ID!,
    client_secret: process.env.DISCORD_SECRET!,
    code: tokenExchangeCode,
    grant_type: "authorization_code",
    redirect_uri: process.env.BASE_URL + "/api/auth/callback",
  })

  const discordUserREST = new REST({ authPrefix: "Bearer" }).setToken(
    discordUserAccessToken.access_token,
  )
  const discordUserAPI = new API(discordUserREST)

  const discordUserIdentity = await discordUserAPI.users.getCurrent()
  const discordUserGuilds = await discordUserAPI.users.getGuilds()

  const discordUserData = {
    identity: discordUserIdentity,
    guilds: discordUserGuilds,
    session: randomUUID(),
    token: discordUserAccessToken,
    timestamp: new Date().toISOString(),
  }

  if (cookies().get("auth_session")?.value)
    await redis.del(`auth:${cookies().get("auth_session")?.value}`)

  cookies().set("auth_session", discordUserData.session, {
    sameSite: true,
    secure: true,
  })
  cookies().set("auth_id", discordUserData.identity.id, {
    sameSite: true,
    secure: true,
  })

  await redis.set(`auth:${discordUserData.session}`, discordUserData)

  return NextResponse.redirect(process.env.BASE_URL + "/dashboard")
}
