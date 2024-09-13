import { EmbedBuilder } from "discord.js"
import { BotSubcommandBuilder } from "phasebot/builders"

import { QueueRepeatMode } from "@repo/music"

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
          value: `${QueueRepeatMode.Queue}`,
        },
        {
          name: "Current song",
          value: `${QueueRepeatMode.Song}`,
        },
        {
          name: "No repeat",
          value: `${QueueRepeatMode.Disabled}`,
        },
      ),
  )
  .setMetadata({ dmPermission: false })
  .setExecute(async (interaction) => {
    await interaction.deferReply()

    const repeat = +interaction.options.getString("repeat", true)
    const member = interaction.member as GuildMember
    const channel = member.voice.channel

    if (!channel) {
      return void interaction.editReply(
        BotError.specificChannelOnlyCommand("voice").toJSON(),
      )
    }

    const queue = interaction.client.music.getQueue(interaction.guildId!)

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

    queue.setRepeatMode(repeat as QueueRepeatMode)

    return void interaction.editReply({
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
