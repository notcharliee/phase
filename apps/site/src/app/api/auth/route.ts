import { NextResponse, type NextRequest } from "next/server"

import { API } from "@discordjs/core/http-only"
import { REST } from "@discordjs/rest"

import { env } from "@/lib/env"

const discordREST = new REST().setToken(env.DISCORD_TOKEN)
const discordAPI = new API(discordREST)

export const GET = (request: NextRequest) => {
  const prompt =
    request.nextUrl.searchParams.get("prompt") == "consent"
      ? "consent"
      : request.cookies.has("user")
        ? "none"
        : "consent"

  const authorizationURL = discordAPI.oauth2.generateAuthorizationURL({
    client_id: env.DISCORD_ID,
    redirect_uri: request.nextUrl.origin + "/api/auth/callback",
    response_type: "code",
    scope: "identify guilds",
    prompt,
  })

  return NextResponse.redirect(authorizationURL)
}
