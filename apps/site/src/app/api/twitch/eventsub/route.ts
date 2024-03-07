import { type NextRequest, NextResponse } from "next/server"
import { StatusCodes } from "http-status-codes"

import { GuildSchema } from "@repo/schemas"

import { dbConnect } from "@/lib/db"

import { challengeResponse } from "../challengeResponse"
import { getHmac, getHmacMessage, verifyHmac } from "../verifyHmac"

/**
 * Handles the POST request for the Twitch EventSub route.
 * Verifies the signature, handles different message types, and performs actions based on the event.
 * @param request - The NextRequest object representing the incoming request.
 * @returns A NextResponse object with the appropriate response based on the request.
 */
export const POST = async (request: NextRequest) => {
  await dbConnect()

  const body = (await request.json()) as object

  const message = getHmacMessage(request.headers, body)
  const hmac = getHmac(message)
  const sig = request.headers.get("twitch-eventsub-message-signature")

  if (!sig || !verifyHmac(hmac, sig)) {
    return NextResponse.json(
      { error: "Invalid signature" },
      { status: StatusCodes.UNAUTHORIZED },
    )
  }

  const messageType = request.headers.get("twitch-eventsub-message-type")

  if (messageType === "webhook_callback_verification") {
    return challengeResponse(body)
  }

  if (
    !(
      "subscription" in body &&
      typeof body.subscription === "object" &&
      "type" in body.subscription! &&
      typeof body.subscription.type === "string" &&
      "condition" in body.subscription &&
      typeof body.subscription.condition === "object" &&
      "broadcaster_user_id" in body.subscription.condition! &&
      typeof body.subscription.condition.broadcaster_user_id === "string"
    )
  ) {
    return NextResponse.json(
      { error: "Invalid body" },
      { status: StatusCodes.BAD_REQUEST },
    )
  }

  if (messageType === "revocation") {
    const channelId = body.subscription.condition.broadcaster_user_id

    const guilds = await GuildSchema.find({
      "modules.TwitchNotifications.streamers.$.id": channelId,
    })

    for (const guild of guilds) {
      guild.modules!.TwitchNotifications!.streamers =
        guild.modules!.TwitchNotifications!.streamers.filter(
          (streamer) => streamer.id !== channelId,
        )

      await guild.save()

      return new Response(undefined, { status: StatusCodes.NO_CONTENT })
    }
  }

  if (messageType === "notification") {
    const channelId = body.subscription.condition.broadcaster_user_id

    const guilds = await GuildSchema.find({
      "modules.TwitchNotifications.streamers.id": channelId,
    })

    for (const guild of guilds) {
      const streamer = guild.modules!.TwitchNotifications!.streamers.find(
        (streamer) => streamer.id === channelId,
      )!

      if (!("event" in body && typeof body.event === "object")) {
        return NextResponse.json(
          { error: "Invalid body" },
          { status: StatusCodes.BAD_REQUEST },
        )
      }

      if (body.subscription.type === "stream.online") {
        const event = body.event as {
          id: "9001"
          broadcaster_user_id: string
          broadcaster_user_login: string
          broadcaster_user_name: string
          type: "live"
          started_at: string
        }

        console.log("Stream is online", streamer, event)
      }

      if (body.subscription.type === "stream.offline") {
        const event = body.event as {
          broadcaster_user_id: string
          broadcaster_user_login: string
          broadcaster_user_name: string
        }

        console.log("Stream is offline", streamer, event)
      }
    }
  }

  return new Response(undefined, { status: StatusCodes.NO_CONTENT })
}
