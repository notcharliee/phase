import { ButtonStyle } from "discord.js"
import { BotCronBuilder } from "@phasejs/core/builders"

import { isSendableChannel } from "~/lib/utils/guards"

import { MessageBuilder } from "~/structures/builders"

export default new BotCronBuilder()
  .setPattern("* * * * *")
  .setExecute(async (client) => {
    // get a before snapshot of the streamers store
    const oldStreamers = client.stores.streamers.clone()

    // refresh the streamers store
    await client.stores.streamers.refreshStreamers()

    // loop through the streamers store
    for (const [id, streamer] of client.stores.streamers) {
      // cross-reference the stream status with the old values
      const isLiveNow = !!streamer.stream
      const wasLiveBefore = !!oldStreamers.get(id)?.stream

      // if the streamer is now live, send a notification
      if (!wasLiveBefore && isLiveNow) {
        const stream = streamer.stream!
        const baseMessage = new MessageBuilder()

        // construct the message embed
        baseMessage.setEmbeds((embed) => {
          return embed
            .setColor("Primary")
            .setAuthor({
              name: `${streamer.displayName} is now live on Twitch!`,
              iconURL: streamer.avatarUrl,
              url: stream.url,
            })
            .setTitle(stream.title)
            .setURL(stream.url)
            .setFields([
              {
                name: "Category",
                value: stream.game,
                inline: true,
              },
              {
                name: "Viewers",
                value: stream.viewerCount.toLocaleString(),
                inline: true,
              },
            ])
            .setImage(stream.thumbnailUrl)
            .setTimestamp()
        })

        // construct the message action row
        baseMessage.setComponents((actionrow) => {
          return actionrow.addButton((button) => {
            return button
              .setStyle(ButtonStyle.Link)
              .setLabel("Watch Stream")
              .setURL(stream.url)
          })
        })

        // loop through the streamer's notifications
        for (const notification of streamer.notifications) {
          const message = new MessageBuilder(baseMessage)

          // get the guild and channel
          const guild = client.guilds.cache.get(notification.guildId)!
          const channel = guild.channels.cache.get(notification.channelId)

          // if the channel is not sendable, skip it
          if (!channel || !isSendableChannel(channel)) {
            continue
          }

          // add a mention if applicable
          if (notification.mention) {
            message.setContent(notification.mention)
          }

          try {
            // send the message
            await channel.send(message)
          } catch (error) {
            // log any errors
            const err = `Failed to send Twitch notification to channel ${channel.id} in guild ${guild.id}:`
            console.error(err)
            console.error(error)
          }
        }
      }
    }
  })
