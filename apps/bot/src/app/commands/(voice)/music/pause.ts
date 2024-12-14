import { BotSubcommandBuilder } from "@phasejs/core/builders"
import { EmbedBuilder } from "discord.js"

import { PhaseColour } from "~/lib/enums"
import { wrapText } from "~/lib/utils/formatting"

import { BotErrorMessage } from "~/structures/BotError"
import { createProgressBar } from "./_utils"

import type { GuildMember } from "discord.js"

export default new BotSubcommandBuilder()
  .setName("pause")
  .setDescription("Pauses the currently playing song.")
  .setMetadata({ dmPermission: false })
  .setExecute(async (interaction) => {
    await interaction.deferReply()

    const member = interaction.member as GuildMember
    const channel = member.voice.channel

    if (!channel) {
      return void interaction.editReply(
        BotErrorMessage.specificChannelOnlyCommand("voice").toJSON(),
      )
    }

    const queue = interaction.client.music.getQueue(channel.guildId)

    if (!queue?.currentSong) {
      return void interaction.editReply(
        new BotErrorMessage("No songs were found in the queue.").toJSON(),
      )
    }

    if (queue.isPaused) {
      return void interaction.editReply(
        new BotErrorMessage("This song is already paused.").toJSON(),
      )
    }

    queue.pause()

    const song = queue.currentSong

    const progressBar = createProgressBar(
      song.playbackDuration / song.duration,
      "paused",
    )

    const duration = wrapText(song.formattedDuration, "`")
    const playbackDuration = wrapText(song.formattedPlaybackDuration, "`")

    return void interaction.editReply({
      embeds: [
        new EmbedBuilder()
          .setColor(PhaseColour.Primary)
          .setAuthor({
            name: `Paused by ${member.displayName}`,
            iconURL: member.displayAvatarURL(),
          })
          .setTitle(song.name)
          .setDescription(`${playbackDuration} ${progressBar} ${duration}`)
          .setFooter({ text: song.url }),
      ],
    })
  })
