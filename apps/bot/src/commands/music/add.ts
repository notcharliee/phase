import { EmbedBuilder } from "discord.js"
import { BotSubcommandBuilder } from "phasebot/builders"

import dedent from "dedent"

import { distubeClient } from "~/lib/clients/distube"
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

    const songName = interaction.options.getString("song", true)
    const member = interaction.member as GuildMember
    const channel = member.voice.channel

    if (!channel?.isVoiceBased()) {
      return void interaction.editReply(
        BotError.specificChannelOnlyCommand("voice").toJSON(),
      )
    }

    try {
      await distubeClient.play(channel, songName, { member })

      const queue = distubeClient.getQueue(channel.guildId)!
      const song = queue.songs[queue.songs.length - 1]!

      const songStartsPlaying = `<t:${Math.floor(Date.now() / 1000) + (queue.duration - song.duration)}:R>`
      const songFinishesPlaying = `<t:${Math.floor(Date.now() / 1000) + song.duration}:R>`

      void interaction.editReply({
        embeds: [
          new EmbedBuilder()
            .setColor(PhaseColour.Primary)
            .setAuthor({
              name: `Added by ${member.displayName}`,
              iconURL: member.displayAvatarURL(),
            })
            .setTitle(
              `${song.name ?? "Unknown Song"} - ${song.uploader.name ?? "Unknown Artist"}`,
            )
            .setURL(song.url ?? null)
            .setThumbnail(song.thumbnail ?? null)
            .setDescription(
              dedent`
              **Duration:** \`${song.formattedDuration}\`
              **Place in queue:** \`${queue.songs.length - 1}\`
              ${queue.songs.length > 1 ? `**Starts playing:** ${songStartsPlaying}` : `**Finishes playing:** ${songFinishesPlaying}`}
            `,
            )
            .setFooter({
              text: song.url ?? songName,
            }),
        ],
      })
    } catch (error) {
      console.error(error)

      return void interaction.editReply(
        BotError.unknown({
          channelId: channel.id,
          guildId: channel.guild.id,
          error: error as Error,
        }).toJSON(),
      )
    }
  })
