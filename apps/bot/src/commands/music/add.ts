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
      .setName("song")
      .setDescription("The song to add to the queue.")
      .setRequired(true),
  )
  .setMetadata({ dmPermission: false })
  .setExecute(async (interaction) => {
    await interaction.deferReply()

    const query = interaction.options.getString("song", true)
    const member = interaction.member as GuildMember
    const channel = member.voice.channel

    if (!channel) {
      return void interaction.editReply(
        BotError.specificChannelOnlyCommand("voice").toJSON(),
      )
    }

    try {
      const song = await interaction.client.music.play(channel, member, query)
      const queue = interaction.client.music.getQueue(channel.guildId)!

      const songStartsPlaying = `<t:${Math.floor(Date.now() / 1000) + (queue.duration - song.duration)}:R>`
      const songFinishesPlaying = `<t:${Math.floor(Date.now() / 1000) + song.duration}:R>`

      const duration = song.formattedDuration
      const placeInQueue = queue.songs.slice(0, queue.currentSongIndex!).length

      return void interaction.editReply({
        embeds: [
          new EmbedBuilder()
            .setColor(PhaseColour.Primary)
            .setAuthor({
              name: `Added by ${member.displayName}`,
              iconURL: member.displayAvatarURL(),
            })
            .setTitle(song.name)
            .setURL(song.url)
            .setThumbnail(song.thumbnail)
            .setDescription(
              dedent`
                **Duration:** \`${duration}\`
                **Place in queue:** \`${placeInQueue}\`
                ${placeInQueue >= 1 ? `**Starts playing:** ${songStartsPlaying}` : `**Finishes playing:** ${songFinishesPlaying}`}
              `,
            )
            .setFooter({ text: song.url }),
        ],
      })
    } catch (error) {
      if (error instanceof Error) {
        if (error.message === MusicError.InvalidQuery) {
          return await interaction.editReply(
            new BotError("Song not found").toJSON(),
          )
        } else if (error.message === MusicError.PlaylistsNotSupported) {
          return await interaction.editReply(
            new BotError("Playlists are not supported at this time").toJSON(),
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
