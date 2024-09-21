import { EmbedBuilder } from "discord.js"
import { BotSubcommandBuilder } from "phasebot/builders"

import { PhaseColour } from "~/lib/enums"
import { BotErrorMessage } from "~/structures/BotError"

import type { GuildMember } from "discord.js"

export default new BotSubcommandBuilder()
  .setName("remove")
  .setDescription("Removes a song from the queue.")
  .addStringOption((option) =>
    option
      .setName("position")
      .setDescription("The position of the song to remove.")
      .setRequired(true),
  )
  .setMetadata({ dmPermission: false })
  .setExecute(async (interaction) => {
    await interaction.deferReply()

    const position = +interaction.options.getString("position", true)
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

    const song = queue.songs[position - 1]

    if (!song) {
      return void interaction.editReply(
        new BotErrorMessage("No song at that position.").toJSON(),
      )
    }

    queue.removeSong(song)

    return void interaction.editReply({
      embeds: [
        new EmbedBuilder()
          .setColor(PhaseColour.Primary)
          .setAuthor({
            name: `Removed by ${member.displayName}`,
            iconURL: member.displayAvatarURL(),
          })
          .setDescription(
            `Removed **[${song.name}](${song.url})** from the queue.`,
          )
          .setFooter({ text: song.url }),
      ],
    })
  })
