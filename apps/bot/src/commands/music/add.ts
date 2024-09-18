import { EmbedBuilder } from "discord.js"
import { BotSubcommandBuilder } from "phasebot/builders"

import { MusicError } from "@repo/music"
import dedent from "dedent"

import { PhaseColour } from "~/lib/enums"
import { BotError } from "~/lib/errors"

import type { GuildMember } from "discord.js"

export default new BotSubcommandBuilder()
  .setName("add")
  .setDescription("Adds a song to the queue.")
  .addStringOption((option) =>
    option
      .setName("query")
      .setDescription("The search query or URL for a song or playlist.")
      .setRequired(true),
  )
  .setMetadata({ dmPermission: false })
  .setExecute(async (interaction) => {
    await interaction.deferReply()

    const query = interaction.options.getString("query", true)
    const member = interaction.member as GuildMember
    const channel = member.voice.channel

    if (!channel) {
      return void interaction.editReply(
        BotError.specificChannelOnlyCommand("voice").toJSON(),
      )
    }

    try {
      const songs = await interaction.client.music.play(channel, member, query)
      const firstSong = songs[0]!

      const queue = firstSong.queue

      const songStartsPlaying = `<t:${Math.floor(Date.now() / 1000) + (queue.duration - firstSong.duration)}:R>`
      const songFinishesPlaying = `<t:${Math.floor(Date.now() / 1000) + firstSong.duration}:R>`

      const duration = firstSong.formattedDuration
      const placeInQueue = queue.songs.slice(queue.currentSongIndex! + 1).length

      return void interaction.editReply({
        embeds: [
          new EmbedBuilder()
            .setColor(PhaseColour.Primary)
            .setAuthor({
              name: `Added by ${member.displayName}`,
              iconURL: member.displayAvatarURL(),
            })
            .setTitle(firstSong.name)
            .setURL(firstSong.url)
            .setThumbnail(firstSong.thumbnail)
            .setDescription(
              dedent`
                **Duration:** \`${duration}\`
                **Place in queue:** \`${placeInQueue}\`
                ${placeInQueue >= 1 ? `**Starts playing:** ${songStartsPlaying}` : `**Finishes playing:** ${songFinishesPlaying}`}
              `,
            )
            .setFooter({ text: firstSong.url }),
        ],
      })
    } catch (error) {
      if (error instanceof Error) {
        if (error.message === (MusicError.InvalidQuery as string)) {
          return await interaction.editReply(
            new BotError("Song not found").toJSON(),
          )
        }
      }

      return void interaction.editReply(
        BotError.unknown({
          channelId: channel.id,
          guildId: channel.guild.id,
          error: error as Error,
        }).toJSON(),
      )
    }
  })
