import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  EmbedBuilder,
} from "discord.js"
import { BotCronBuilder } from "phasebot/builders"

import { ModuleId } from "@repo/config/phase/modules.ts"

import { cache } from "~/lib/cache"
import { twitchAPI } from "~/lib/clients/twitch"
import { PhaseColour } from "~/lib/enums"
import { isSnowflake } from "~/lib/utils"

import type { GuildTextBasedChannel } from "discord.js"

export default new BotCronBuilder()
  .setPattern("*/1 * * * *")
  .setExecute(async (client) => {
    const guildDocs = (await cache.guilds.values()).filter(
      (guildDoc) => guildDoc.modules?.[ModuleId.TwitchNotifications]?.enabled,
    )

    interface Streamer {
      id: string
      notifications: {
        guildId: string
        channelId: string
        mention?: string
      }[]
    }

    const streamers = guildDocs.reduce((acc, guildDoc) => {
      const streamers =
        guildDoc.modules![ModuleId.TwitchNotifications]!.streamers

      streamers.forEach((streamer) => {
        let existingStreamer = acc.get(streamer.id)

        if (existingStreamer) {
          existingStreamer.notifications.push({
            guildId: guildDoc.id,
            channelId: streamer.channel,
            mention: streamer.mention,
          })
        } else {
          acc.set(streamer.id, {
            id: streamer.id,
            notifications: [
              {
                guildId: guildDoc.id,
                channelId: streamer.channel,
                mention: streamer.mention,
              },
            ],
          })
        }
      })

      return acc
    }, new Map<string, Streamer>())

    const oldStreamStatuses = await cache.twitchStreamStatuses.entries()

    for (const [id, streamer] of streamers.entries()) {
      const oldStreamStatus = oldStreamStatuses.find(([key]) => key === id)?.[1]
      const stream = await twitchAPI.streams.getStreamByUserId(id)

      if (oldStreamStatus && !stream) {
        await cache.twitchStreamStatuses.delete(id)
      } else if (!oldStreamStatus && stream) {
        await cache.twitchStreamStatuses.set(id, true)

        for (const notification of streamer.notifications) {
          const channel = client.channels.cache.get(
            notification.channelId,
          ) as GuildTextBasedChannel | null

          if (!channel) continue

          void channel
            .send({
              content: notification.mention
                ? isSnowflake(notification.mention)
                  ? `<@&${notification.mention}>`
                  : notification.mention
                : undefined,
              embeds: [
                new EmbedBuilder()
                  .setColor(PhaseColour.Primary)
                  .setAuthor({
                    name: `${stream.userDisplayName} is now live on Twitch!`,
                    url: `https://twitch.tv/${stream.userName}`,
                  })
                  .setTitle(stream.title)
                  .setURL(`https://twitch.tv/${stream.userName}`)
                  .setFields([
                    {
                      name: "Category",
                      value: stream.gameName,
                      inline: true,
                    },
                    {
                      name: "Viewers",
                      value: stream.viewers.toLocaleString(),
                      inline: true,
                    },
                  ])
                  .setImage(
                    stream.getThumbnailUrl(400, 225) + `?t=${Date.now()}`,
                  )
                  .setTimestamp(),
              ],
              components: [
                new ActionRowBuilder<ButtonBuilder>().addComponents([
                  new ButtonBuilder()
                    .setStyle(ButtonStyle.Link)
                    .setLabel("Watch Stream")
                    .setURL(`https://twitch.tv/${stream.userName}`),
                ]),
              ],
            })
            .catch(() => null)
        }
      }
    }
  })
