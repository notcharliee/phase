import { EmbedBuilder } from "discord.js"
import { BotSubcommandBuilder } from "phasebot/builders"

import { distubeClient } from "~/lib/clients/distube"
import { PhaseColour } from "~/lib/enums"
import { BotError } from "~/lib/errors"

import type { GuildMember } from "discord.js"

export default new BotSubcommandBuilder()
  .setName("volume")
  .setDescription("Sets the volume of the music.")
  .addNumberOption((option) =>
    option
      .setName("volume")
      .setDescription("The volume percentage.")
      .setMinValue(0)
      .setMaxValue(100)
      .setRequired(true),
  )
  .setMetadata({ dmPermission: false })
  .setExecute(async (interaction) => {
    await interaction.deferReply()

    const volume = interaction.options.getNumber("volume", true)
    const member = interaction.member as GuildMember
    const channel = member.voice.channel

    if (!channel?.isVoiceBased()) {
      return void interaction.editReply(
        BotError.specificChannelOnlyCommand("voice").toJSON(),
      )
    }

    distubeClient.setVolume(interaction.guildId!, volume)

    void interaction.editReply({
      embeds: [
        new EmbedBuilder()
          .setColor(PhaseColour.Primary)
          .setAuthor({
            name: `Set by ${member.displayName}`,
            iconURL: member.displayAvatarURL(),
          })
          .setDescription(`Volume is now set to **${volume}%**.`),
      ],
    })
  })
