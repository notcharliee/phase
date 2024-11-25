import { EmbedBuilder } from "discord.js"
import { BotSubcommandBuilder } from "@phasejs/core/builders"

import { QueueRepeatMode } from "@plugin/music"
import dedent from "dedent"

import { PhaseColour } from "~/lib/enums"
import {
  dateToTimestamp,
  numberToDuration,
  wrapText,
} from "~/lib/utils/formatting"

import { BotErrorMessage } from "~/structures/BotError"

import type { GuildMember } from "discord.js"

export default new BotSubcommandBuilder()
  .setName("queue")
  .setDescription("Lists the songs in the queue.")
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

    const now = Date.now() / 1000

    const totalPlaybackDuration = numberToDuration(
      queue.songs
        .slice(0, queue.currentSongIndex)
        .reduce(
          (acc, song) => acc + song.duration,
          queue.currentSong.playbackDuration,
        ),
    )

    return void interaction.editReply({
      embeds: [
        new EmbedBuilder()
          .setColor(PhaseColour.Primary)
          .setTitle(
            `${queue.songs.length} song${queue.songs.length > 1 ? "s" : ""} in the queue`,
          ).setDescription(dedent`
            **Songs played:** \`${queue.currentSongIndex!}/${queue.songs.length}\`
            **Duration played:** \`${totalPlaybackDuration}/${queue.formattedDuration}\`
            **Repeat mode:** \`${QueueRepeatMode[queue.repeatMode]}\`

            ${queue.songs
              .map((song, index) => {
                const isPlayed = index < queue.currentSongIndex!
                const isPlaying = index === queue.currentSongIndex!

                const songsToBePlayedDurations = queue.songs
                  .slice(queue.currentSongIndex, index)
                  .reduce((prev, curr) => prev + curr.duration, 0)

                const songStartsPlaying = `<t:${Math.floor(now + songsToBePlayedDurations - queue.currentSong!.playbackDuration)}:R>`
                const songFinishesPlaying = `<t:${Math.floor(now + (queue.duration - queue.currentSong!.playbackDuration))}:R>`

                const status = wrapText(
                  isPlayed ? "Played" : isPlaying ? "Playing" : "Queued",
                  "`",
                )

                const duration = wrapText(song.formattedDuration, "`")
                const addedAt = dateToTimestamp(song.submittedAt, "shortTime")
                const addedBy = `<@${song.submittedBy.id}>`

                return [
                  `**${index + 1}\\. [${song.name}](${song.url})**`,
                  `**Status:** ${status}`,
                  `**Duration:** ${duration}`,
                  !isPlayed
                    ? isPlaying
                      ? `**Finishes playing:** ${songFinishesPlaying}`
                      : `**Starts playing:** ${songStartsPlaying}`
                    : "",
                  `**Added at:** ${addedAt}`,
                  `**Added by:** ${addedBy}`,
                ].join("\n")
              })
              .join("\n\n")}
          `),
      ],
    })
  })
