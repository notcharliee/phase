import { EmbedBuilder } from "discord.js"
import { BotSubcommandBuilder } from "phasebot/builders"

import { PhaseColour } from "~/lib/enums"
import { BotErrorMessage } from "~/structures/BotError"
import { wrapText } from "~/lib/utils/formatting"

import { createProgressBar } from "./_utils"

import type { GuildMember } from "discord.js"

export default new BotSubcommandBuilder()
  .setName("resume")
  .setDescription("Resumes the currently paused song.")
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

    queue.resume()

    const song = queue.currentSong

    const progressBar = createProgressBar(
      song.playbackDuration / song.duration,
      "resumed",
    )

    const duration = wrapText(song.formattedDuration, "`")
    const playbackDuration = wrapText(song.formattedPlaybackDuration, "`")

    return void interaction.editReply({
      embeds: [
        new EmbedBuilder()
          .setColor(PhaseColour.Primary)
          .setAuthor({
            name: `Resumed by ${member.displayName}`,
            iconURL: member.displayAvatarURL(),
          })
          .setTitle(song.name)
          .setDescription(`${playbackDuration} ${progressBar} ${duration}`)
          .setFooter({ text: song.url }),
      ],
    })
  })
