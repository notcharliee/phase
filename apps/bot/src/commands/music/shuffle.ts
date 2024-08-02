import { EmbedBuilder } from "discord.js"
import { BotSubcommandBuilder } from "phasebot/builders"

import { distubeClient } from "~/lib/clients/distube"
import { PhaseColour } from "~/lib/enums"
import { BotError } from "~/lib/errors"

import type { GuildMember } from "discord.js"

export default new BotSubcommandBuilder()
  .setName("shuffle")
  .setDescription("Shuffles the songs in the queue.")
  .setMetadata({ dmPermission: false })
  .setExecute(async (interaction) => {
    await interaction.deferReply()

    const member = interaction.member as GuildMember
    const channel = member.voice.channel

    if (!channel?.isVoiceBased()) {
      return void interaction.editReply(
        BotError.specificChannelOnlyCommand("voice").toJSON(),
      )
    }

    const queue = distubeClient.getQueue(channel.guildId)

    if (!queue) {
      return void interaction.editReply(
        new BotError("No songs were found in the queue.").toJSON(),
      )
    }

    void queue.shuffle()

    void interaction.editReply({
      embeds: [
        new EmbedBuilder()
          .setColor(PhaseColour.Primary)
          .setAuthor({
            name: `Shuffled by ${member.displayName}`,
            iconURL: member.displayAvatarURL(),
          })
          .setDescription(
            `Shuffled **${queue.songs.length}** songs in the queue.`,
          ),
      ],
    })
  })
