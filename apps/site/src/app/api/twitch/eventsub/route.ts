import { type NextRequest, NextResponse } from "next/server"
import { StatusCodes } from "http-status-codes"

import { GuildSchema } from "@repo/schemas"

import { challengeResponse } from "../challengeResponse"
import { getHmac, getHmacMessage, verifyHmac } from "../verifyHmac"

/**
 * Handles the POST request for the Twitch EventSub route.
 * Verifies the signature, handles different message types, and performs actions based on the event.
 * @param request - The NextRequest object representing the incoming request.
 * @returns A NextResponse object with the appropriate response based on the request.
 */
export const POST = async (request: NextRequest) => {
  const json = (await request.json()) as object

  const message = getHmacMessage(request.headers, json)
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
    return challengeResponse(request)
  }

  if (
    !(
      "subscription" in json &&
      typeof json.subscription === "object" &&
      "type" in json.subscription! &&
      typeof json.subscription.type === "string" &&
      "condition" in json.subscription &&
      typeof json.subscription.condition === "object" &&
      "broadcaster_user_id" in json.subscription.condition! &&
      typeof json.subscription.condition.broadcaster_user_id === "string"
    )
  ) {
    return NextResponse.json(
      { error: "Invalid body" },
      { status: StatusCodes.BAD_REQUEST },
    )
  }

  if (messageType === "revocation") {
    const channelId = json.subscription.condition.broadcaster_user_id

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
    const channelId = json.subscription.condition.broadcaster_user_id

    const guilds = await GuildSchema.find({
      "modules.TwitchNotifications.streamers.$.id": channelId,
    })

    for (const guild of guilds) {
      const streamer = guild.modules!.TwitchNotifications!.streamers.find(
        (streamer) => streamer.id === channelId,
      )!

      if (!("event" in json && typeof json.event === "object")) {
        return NextResponse.json(
          { error: "Invalid body" },
          { status: StatusCodes.BAD_REQUEST },
        )
      }

      if (json.subscription.type === "stream.online") {
        const event = json.event as {
          id: "9001"
          broadcaster_user_id: string
          broadcaster_user_login: string
          broadcaster_user_name: string
          type: "live"
          started_at: string
        }

        console.log("Stream is online", streamer, event)
      }

      if (json.subscription.type === "stream.offline") {
        const event = json.event as {
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
