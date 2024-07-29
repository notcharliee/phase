import { NextResponse } from "next/server"

import { API } from "@discordjs/core/http-only"
import { REST } from "@discordjs/rest"
import { StatusCodes } from "http-status-codes"

import { database } from "@/lib/db"
import { env } from "@/lib/env"
import { twitchClient } from "~/lib/twitch"

import { challengeResponse } from "../challengeResponse"
import { getHmac, getHmacMessage, verifyHmac } from "../verifyHmac"

import type { APIEmbed } from "@discordjs/core/http-only"
import type { NextRequest } from "next/server"

const discordREST = new REST().setToken(env.DISCORD_TOKEN)
const discordAPI = new API(discordREST)

/**
 * Handles the POST request for the Twitch EventSub route.
 * Verifies the signature, handles different message types, and performs actions based on the event.
 * @param request - The NextRequest object representing the incoming request.
 * @returns A NextResponse object with the appropriate response based on the request.
 */
export const POST = async (request: NextRequest) => {
  const db = await database.init()

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

    const guilds = await db.guilds.find({
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
    const streamerId = body.subscription.condition.broadcaster_user_id

    const guilds = await db.guilds.find({
      "modules.TwitchNotifications.enabled": true,
      "modules.TwitchNotifications.streamers.id": streamerId,
    })

    for (const guild of guilds) {
      const moduleConfig = guild.modules!.TwitchNotifications!.streamers.find(
        (streamer) => streamer.id === streamerId,
      )!

      const streamer = (await twitchClient.users.getUserById(streamerId))!

      if (
        body.subscription.type === "stream.online" &&
        moduleConfig.events.includes("stream.online")
      ) {
        const stream =
          (await twitchClient.streams.getStreamByUserId(streamerId))!

        const embed = {
          color: parseInt("f8f8f8", 16),
          author: {
            name: `${streamer.displayName} is live on Twitch!`,
            url: `https://twitch.tv/${streamer.name}`,
            icon_url: streamer.profilePictureUrl,
          },
          title: stream.title,
          url: `https://twitch.tv/${stream.userName}`,
          fields: [
            {
              name: "Game",
              value: stream.gameName,
              inline: true,
            },
            {
              name: "Viewers",
              value: stream.viewers.toString(),
              inline: true,
            },
          ],
          image: {
            url: stream.getThumbnailUrl(400, 225) + `?t=${Date.now()}`,
          },
          footer: {
            text: "phasebot.xyz",
          },
          timestamp: stream.startDate.toISOString(),
        } satisfies APIEmbed

        const messageAlreadySent = !!(
          await discordAPI.channels.getMessages(moduleConfig.channel, {
            limit: 3,
          })
        ).find(
          (message) =>
            // if bot sent message
            message.author.id === env.DISCORD_ID &&
            // and embed titles match
            message.embeds?.[0]?.title === embed.title &&
            // and it was sent in last 5 minutes
            Date.parse(message.timestamp) > Date.now() - 5 * 60 * 1000,
        )

        if (messageAlreadySent) continue

        await discordAPI.channels.createMessage(moduleConfig.channel, {
          content: moduleConfig.mention && `<@&${moduleConfig.mention}>`,
          embeds: [embed],
          components: [
            {
              type: 1,
              components: [
                {
                  type: 2,
                  label: "Watch Stream",
                  style: 5,
                  url: `https://twitch.tv/${stream.userName}`,
                },
              ],
            },
          ],
        })
      }

      if (
        body.subscription.type === "stream.offline" &&
        moduleConfig.events.includes("stream.offline")
      ) {
        const embed = {
          color: parseInt("f8f8f8", 16),
          author: {
            name: `${streamer.displayName} is now offline`,
            icon_url: streamer.profilePictureUrl,
          },
          title: "Thanks for watching!",
          footer: {
            text: "phasebot.xyz",
          },
          timestamp: new Date().toISOString(),
        } satisfies APIEmbed

        const messageAlreadySent = !!(
          await discordAPI.channels.getMessages(moduleConfig.channel, {
            limit: 3,
          })
        ).find(
          (message) =>
            // if bot sent message
            message.author.id === env.DISCORD_ID &&
            // and embed titles match
            message.embeds?.[0]?.title === embed.title &&
            // and it was sent in last 5 minutes
            Date.parse(message.timestamp) > Date.now() - 5 * 60 * 1000,
        )

        if (messageAlreadySent) continue

        await discordAPI.channels.createMessage(moduleConfig.channel, {
          embeds: [embed],
        })
      }
    }
  }

  return new Response(undefined, { status: StatusCodes.NO_CONTENT })
}
