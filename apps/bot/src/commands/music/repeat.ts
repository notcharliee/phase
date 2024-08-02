import { EmbedBuilder } from "discord.js"
import { BotSubcommandBuilder } from "phasebot/builders"

import { distubeClient } from "~/lib/clients/distube"
import { PhaseColour } from "~/lib/enums"
import { BotError } from "~/lib/errors"

import type { GuildMember } from "discord.js"

export default new BotSubcommandBuilder()
  .setName("repeat")
  .setDescription("Sets the repeat mode of the song or queue.")
  .addStringOption((option) =>
    option
      .setName("repeat")
      .setDescription("The type of repeat mode (defaults to no repeat).")
      .setRequired(true)
      .addChoices(
        {
          name: "Queue",
          value: "2",
        },
        {
          name: "Current song",
          value: "1",
        },
        {
          name: "No repeat",
          value: "0",
        },
      ),
  )
  .setMetadata({ dmPermission: false })
  .setExecute(async (interaction) => {
    await interaction.deferReply()

    const repeat = +interaction.options.getString("repeat", true)
    const member = interaction.member as GuildMember
    const channel = member.voice.channel

    if (!channel?.isVoiceBased()) {
      return void interaction.editReply(
        BotError.specificChannelOnlyCommand("voice").toJSON(),
      )
    }

    const queue = distubeClient.getQueue(interaction.guildId!)

    if (!queue) {
      return void interaction.editReply(
        new BotError("No songs were found in the queue.").toJSON(),
      )
    }

    if (queue.repeatMode === repeat) {
      return void interaction.editReply(
        new BotError("Repeat mode is already set to that state.").toJSON(),
      )
    }

    queue.repeatMode = repeat

    void interaction.editReply({
      embeds: [
        new EmbedBuilder()
          .setColor(PhaseColour.Primary)
          .setAuthor({
            name: `Set by ${member.displayName}`,
            iconURL: member.displayAvatarURL(),
          })
          .setDescription(
            repeat === 0
              ? "Repeat mode is now disabled for this queue."
              : repeat === 1
                ? "Repeat mode is now enabled for the current song."
                : "Repeat mode is now enabled for this queue.",
          ),
      ],
    })
  })
