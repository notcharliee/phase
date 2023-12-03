import { NextResponse, NextRequest } from "next/server"
import { cookies } from "next/headers"
import { API } from "@discordjs/core/http-only"
import { REST } from "@discordjs/rest"
import { Redis } from "@upstash/redis"
import { randomUUID } from "crypto"
import { env } from "@/env"


export const GET = async (request: NextRequest) => {
  const discordREST = new REST().setToken(env.DISCORD_TOKEN)
  const discordAPI = new API(discordREST)

  const redis = new Redis({
    url: env.UPSTASH_URL,
    token: env.UPSTASH_TOKEN,
  })

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
    client_id: env.DISCORD_ID,
    client_secret: env.DISCORD_SECRET,
    code: tokenExchangeCode,
    grant_type: "authorization_code",
    redirect_uri: env.NEXT_PUBLIC_BASE_URL + "/api/auth/callback",
  })

  const discordUserREST = new REST({ authPrefix: "Bearer" }).setToken(
    discordUserAccessToken.access_token,
  )
  const discordUserAPI = new API(discordUserREST)
  const discordUserIdentity = await discordUserAPI.users.getCurrent()

  const discordUserData = {
    id: discordUserIdentity.id,
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

  await redis.set(`auth:${discordUserData.session}`, discordUserData)

  return NextResponse.redirect(env.NEXT_PUBLIC_BASE_URL + "/dashboard")
}
