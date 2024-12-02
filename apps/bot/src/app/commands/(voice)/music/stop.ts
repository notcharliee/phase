import { EmbedBuilder } from "discord.js"
import { BotSubcommandBuilder } from "@phasejs/core/builders"

import { PhaseColour } from "~/lib/enums"

import { BotErrorMessage } from "~/structures/BotError"

import type { GuildMember } from "discord.js"

export default new BotSubcommandBuilder()
  .setName("stop")
  .setDescription("Clears all songs from the queue.")
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

    if (!queue) {
      return void interaction.editReply(
        new BotErrorMessage("No songs were found in the queue.").toJSON(),
      )
    }

    queue.delete()

    return void interaction.editReply({
      embeds: [
        new EmbedBuilder()
          .setColor(PhaseColour.Primary)
          .setAuthor({
            name: `Stopped by ${member.displayName}`,
            iconURL: member.displayAvatarURL(),
          })
          .setDescription(
            `Cleared **${queue.songs.length}** songs from the queue.`,
          ),
      ],
    })
  })
