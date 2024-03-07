import { type NextRequest, NextResponse } from "next/server"
import { StatusCodes } from "http-status-codes"

import { env } from "@/lib/env"
import { absoluteURL } from "@/lib/utils"

import { getAppAccessToken } from "./getAppAccessToken"

/**
 * Handles the POST request for the Twitch route.
 *
 * @param request - The NextRequest object representing the incoming request.
 * @returns A NextResponse object representing the response to be sent back.
 */
export const POST = async (request: NextRequest) => {
  const authorization = request.headers.get("authorization")
  const body = (await request.json()) as object

  if (authorization !== `Bearer ${env.TWITCH_CLIENT_SECRET}`) {
    return NextResponse.json(
      { error: "Invalid authorization" },
      { status: StatusCodes.UNAUTHORIZED },
    )
  }

  if (!("channelId" in body && typeof body.channelId === "string")) {
    return NextResponse.json(
      { error: "Invalid body" },
      { status: StatusCodes.BAD_REQUEST },
    )
  }

  const channelId = body.channelId

  const events = [
    {
      type: "stream.online",
      version: "1",
      condition: {
        broadcaster_user_id: channelId,
      },
      transport: {
        method: "webhook",
        callback: absoluteURL(`/api/twitch/eventsub`),
        secret: env.TWITCH_CLIENT_SECRET,
      },
    },
    {
      type: "stream.offline",
      version: "1",
      condition: {
        broadcaster_user_id: channelId,
      },
      transport: {
        method: "webhook",
        callback: absoluteURL(`/api/twitch/eventsub`),
        secret: env.TWITCH_CLIENT_SECRET,
      },
    },
  ]

  const accessToken = await getAppAccessToken()

  const res1 = await fetch("https://api.twitch.tv/helix/eventsub/subscriptions", {
    method: "POST",
    headers: {
      "Client-ID": env.TWITCH_CLIENT_ID,
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(events[0]),
  })

  const res2 = await fetch("https://api.twitch.tv/helix/eventsub/subscriptions", {
    method: "POST",
    headers: {
      "Client-ID": env.TWITCH_CLIENT_ID,
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(events[1]),
  })

  if (!res1.ok || !res2.ok) {
    console.log(await res1.json())
    console.log(await res2.json())

    return NextResponse.json(
      { error: "Failed to create subscription" },
      { status: StatusCodes.INTERNAL_SERVER_ERROR },
    )
  }

  return new Response(undefined, { status: StatusCodes.NO_CONTENT })
}
