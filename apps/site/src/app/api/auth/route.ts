import { NextResponse, NextRequest } from "next/server"
import { API } from "@discordjs/core/http-only"
import { REST } from "@discordjs/rest"
import { env } from '@/env'

export const GET = (request: NextRequest) => {
  const discordREST = new REST().setToken(env.DISCORD_TOKEN)
  const discordAPI = new API(discordREST)

  try {
    const authorizationURL = discordAPI.oauth2.generateAuthorizationURL({
      client_id: env.DISCORD_ID!,
      redirect_uri: env.NEXT_PUBLIC_BASE_URL + "/api/auth/callback",
      response_type: "code",
      scope: "identify guilds",
    })

    return NextResponse.redirect(authorizationURL)
  } catch (error) {
    console.log(error)

    return NextResponse.json(error, { status: 500 })
  }
}
