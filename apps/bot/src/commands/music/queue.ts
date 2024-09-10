import { EmbedBuilder } from "discord.js"
import { BotSubcommandBuilder } from "phasebot/builders"

import dedent from "dedent"

import { PhaseColour } from "~/lib/enums"
import { BotError } from "~/lib/errors"

import type { GuildMember } from "discord.js"

export default new BotSubcommandBuilder()
  .setName("queue")
  .setDescription("Lists the songs in the queue.")
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

    const queue = interaction.client.distube.getQueue(channel.guildId)

    if (!queue) {
      return void interaction.editReply(
        new BotError("No songs were found in the queue.").toJSON(),
      )
    }

    void interaction.editReply({
      embeds: [
        new EmbedBuilder()
          .setColor(PhaseColour.Primary)
          .setTitle(
            `**${queue.songs.length}** songs in the queue (${queue.formattedDuration})`,
          )
          .setDescription(
            queue.songs
              .map((song, index) => {
                const songStartsPlaying = `<t:${Math.floor(
                  Date.now() / 1000 +
                    queue.songs
                      .slice(0, index) // Get all songs before the current one
                      .reduce(
                        (prev, curr) => prev + curr.duration,
                        0, // Start the sum at 0
                      ) -
                    queue.currentTime, // Subtract the current time
                )}:R>`

                const songFinishesPlaying = `<t:${Math.floor(Date.now() / 1000 + (song.duration - queue.currentTime))}:R>`

                return dedent`
                  ${index + 1}\. **[${song.name} - ${song.uploader.name}](${song.url})**
                  **Duration:** \`${song.formattedDuration}\`
                  ${index !== 0 ? `**Starts playing:** ${songStartsPlaying}` : `**Finishes playing:** ${songFinishesPlaying}`}
                  **Added by:** <@${song.member?.id ?? "unknown"}>
                `
              })
              .join("\n\n"),
          ),
      ],
    })
  })
