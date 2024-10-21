import { BotSubcommandBuilder } from "phasebot/builders"

import { createPanelButtons, createPanelEmbed } from "~/app/events/music-panel"
import { BotErrorMessage } from "~/structures/BotError"
import { CustomMessageBuilder } from "~/structures/CustomMessageBuilder"

export default new BotSubcommandBuilder()
  .setName("panel")
  .setDescription("Opens the music panel.")
  .setMetadata({ dmPermission: false })
  .setExecute(async (interaction) => {
    const member =
      interaction.member && "voice" in interaction.member
        ? interaction.member
        : await interaction.guild?.members.fetch(interaction.user.id)

    const channel = member?.voice.channel

    if (!channel) {
      return void interaction.reply(
        BotErrorMessage.specificChannelOnlyCommand("voice"),
      )
    }

    const queue = interaction.client.music.queues.get(channel.guildId)

    if (!queue) {
      return void interaction.reply(
        new BotErrorMessage("No queue found for this guild."),
      )
    }

    const song = queue.currentSong

    if (!song) {
      return void interaction.reply(
        new BotErrorMessage("No songs were found in the queue."),
      )
    }

    return void interaction.reply(
      new CustomMessageBuilder()
        .setEmbeds(createPanelEmbed(song))
        .setComponents(createPanelButtons(song)),
    )
  })
