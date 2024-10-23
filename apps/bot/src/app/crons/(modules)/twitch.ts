import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  Collection,
  EmbedBuilder,
} from "discord.js"
import { BotCronBuilder } from "phasebot/builders"

import { ModuleId } from "@repo/utils/modules"

import { twitchAPI } from "~/lib/clients/twitch"
import { PhaseColour } from "~/lib/enums"

import type { GuildTextBasedChannel } from "discord.js"

export default new BotCronBuilder()
  .setPattern("* * * * *")
  .setExecute(async (client) => {
    const guildDocs = client.stores.guilds.filter(
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
        const existingStreamer = acc.get(streamer.id)

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
    }, new Collection<string, Streamer>())

    for (const [id, streamer] of streamers.entries()) {
      const stream = await twitchAPI.streams.getStreamByUserId(id)

      const isLiveNow = !!stream
      const wasLiveBefore = client.stores.twitchStatuses.has(id)

      if (!isLiveNow && wasLiveBefore) {
        client.stores.twitchStatuses.delete(id)
      } else if (!wasLiveBefore && isLiveNow) {
        client.stores.twitchStatuses.set(id, true)

        for (const notification of streamer.notifications) {
          const channel = client.channels.cache.get(
            notification.channelId,
          ) as GuildTextBasedChannel | null

          if (!channel) continue

          void channel
            .send({
              content: notification.mention,
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
