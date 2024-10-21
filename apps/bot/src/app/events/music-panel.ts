import { ButtonStyle, ModalBuilder, TextInputStyle } from "discord.js"
import { BotEventBuilder } from "phasebot/builders"

import { Emojis } from "~/lib/emojis"
import { wrapText } from "~/lib/utils"

import { createProgressBar } from "~/app/commands/(voice)/music/_utils"
import { BotErrorMessage } from "~/structures/BotError"
import { CustomActionRowBuilder } from "~/structures/CustomActionRowBuilder"
import { CustomEmbedBuilder } from "~/structures/CustomEmbedBuilder"
import { CustomMessageBuilder } from "~/structures/CustomMessageBuilder"
import { QueueRepeatMode } from "~/structures/music/Queue"

import type { Song } from "~/structures/music/Song"
import type {
  CustomIDWithAction,
  ExtractCustomIDAction,
  ExtractCustomIDParts,
} from "~/types/custom-ids"

const MUSIC_CUSTOM_IDS = [
  "music.stop",
  "music.previous",
  "music.pause",
  "music.resume",
  "music.skip",
  "music.repeat",
  "music.shuffle",
  "music.add",
  "music.add.query",
  "music.remove",
  "music.remove.position",
] as const satisfies CustomIDWithAction<"music">[]

type MusicCustomID = (typeof MUSIC_CUSTOM_IDS)[number]
type MusicCustomIDParts = ExtractCustomIDParts<MusicCustomID>
type MusicCustomIDAction = ExtractCustomIDAction<MusicCustomID>

export default new BotEventBuilder()
  .setName("interactionCreate")
  .setExecute(async (client, interaction) => {
    if (
      !interaction.inGuild() ||
      (!interaction.isButton() &&
        (!interaction.isModalSubmit() || !interaction.isFromMessage())) ||
      !MUSIC_CUSTOM_IDS.includes(interaction.customId)
    ) {
      return
    }

    const queue = client.music.queues.get(interaction.guildId)

    if (!queue) {
      return void interaction.reply(
        new BotErrorMessage("No queue found for this guild."),
      )
    }

    const channel = queue.voice.channel

    const member =
      "voice" in interaction.member
        ? interaction.member
        : await interaction.guild?.members.fetch(interaction.user.id)

    if (member?.voice.channelId !== channel.id) {
      return void interaction.reply(
        new BotErrorMessage(
          "You must be in the same voice channel as the bot to use this button.",
        ),
      )
    }

    const customId = interaction.customId as MusicCustomID
    const customIdParts = customId.split(".") as MusicCustomIDParts
    const customIdAction = customIdParts[1] satisfies MusicCustomIDAction

    switch (customIdAction) {
      case "stop": {
        void interaction.deferUpdate()
        return void queue.delete()
      }

      case "previous": {
        if (!queue.previousSong) {
          return void interaction.reply(
            new BotErrorMessage("No previous song was found."),
          )
        }

        const song = queue.playPreviousSong()!

        return void interaction.update(
          new CustomMessageBuilder()
            .setEmbeds(createPanelEmbed(song))
            .setComponents(createPanelButtons(song)),
        )
      }

      case "pause": {
        if (!queue?.currentSong) {
          return void interaction.reply(
            new BotErrorMessage("No songs were found in the queue."),
          )
        }

        if (queue.isPaused) {
          return void interaction.reply(
            new BotErrorMessage("This song is already paused."),
          )
        }

        queue.pause()

        const song = queue.currentSong

        return void interaction.update(
          new CustomMessageBuilder()
            .setEmbeds(() => {
              const embed = createPanelEmbed(song)

              const duration = wrapText(song.formattedDuration, "`")
              const playbackDuration = wrapText(
                song.formattedPlaybackDuration,
                "`",
              )

              const progressBar = createProgressBar(
                song.playbackDuration / song.duration,
                "paused",
              )

              embed.setAuthor({
                name: `Paused by ${member.displayName}`,
                iconURL: member.displayAvatarURL(),
              })

              embed.setDescription(
                `${playbackDuration} ${progressBar} ${duration}`,
              )

              return embed
            })
            .setComponents(createPanelButtons(song)),
        )
      }

      case "resume": {
        if (!queue?.currentSong) {
          return void interaction.reply(
            new BotErrorMessage("No songs were found in the queue."),
          )
        }

        if (!queue.isPaused) {
          return void interaction.reply(
            new BotErrorMessage("This song is not paused."),
          )
        }

        queue.resume()

        const song = queue.currentSong

        return void interaction.update(
          new CustomMessageBuilder()
            .setEmbeds(createPanelEmbed(song))
            .setComponents(createPanelButtons(song)),
        )
      }

      case "skip": {
        if (!queue?.currentSong) {
          return void interaction.reply(
            new BotErrorMessage("No songs were found in the queue."),
          )
        }

        queue.skip()

        const song = queue.currentSong

        return void interaction.update(
          new CustomMessageBuilder()
            .setEmbeds(createPanelEmbed(song))
            .setComponents(createPanelButtons(song)),
        )
      }

      case "repeat": {
        const repeatMode =
          queue.repeatMode === QueueRepeatMode.Disabled
            ? QueueRepeatMode.Song
            : QueueRepeatMode.Disabled

        const repeatModeStatus =
          repeatMode === QueueRepeatMode.Song ? "Enabled" : "Disabled"

        queue.setRepeatMode(repeatMode)

        return void interaction.reply(
          `Repeat mode is now ${wrapText(repeatModeStatus, "**")}.`,
        )
      }

      case "shuffle": {
        queue.shuffleSongs()

        return void interaction.reply(`Shuffled the queue.`)
      }

      case "add": {
        if (interaction.isButton()) {
          return void interaction.showModal(
            new ModalBuilder()
              .setCustomId("music.add")
              .setTitle("Search for a song")
              .addComponents([
                new CustomActionRowBuilder().addTextInput((input) => {
                  return input
                    .setCustomId("music.add.query")
                    .setLabel("Search Query")
                    .setStyle(TextInputStyle.Short)
                    .setPlaceholder("A song name or URL")
                    .setRequired(true)
                }),
              ]),
          )
        } else {
          const query = interaction.fields.getTextInputValue("music.add.query")
          await queue.music.play(channel, member, query)
          const song = queue.currentSong!

          return void interaction.update(
            new CustomMessageBuilder()
              .setEmbeds(createPanelEmbed(song))
              .setComponents(createPanelButtons(song)),
          )
        }
      }

      case "remove": {
        if (interaction.isButton()) {
          return void interaction.showModal(
            new ModalBuilder()
              .setCustomId("music.remove")
              .setTitle("Search for a song")
              .addComponents([
                new CustomActionRowBuilder().addTextInput((input) => {
                  return input
                    .setCustomId("music.remove.position")
                    .setLabel("Position")
                    .setStyle(TextInputStyle.Short)
                    .setPlaceholder(
                      "The position of the song you want to remove",
                    )
                    .setRequired(true)
                }),
              ]),
          )
        } else {
          const position = Number(
            interaction.fields.getTextInputValue("music.remove.position"),
          )

          const songToRemove = queue.songs[position - 1]!

          if (!songToRemove) {
            return void interaction.reply(
              new BotErrorMessage("No song at that position."),
            )
          }

          queue.removeSong(songToRemove)

          const song = queue.currentSong!

          return void interaction.update(
            new CustomMessageBuilder()
              .setEmbeds(createPanelEmbed(song))
              .setComponents(createPanelButtons(song)),
          )
        }
      }
    }
  })

export function createPanelEmbed(song: Song) {
  const songFinishesPlaying = `<t:${Math.floor(Date.now() / 1000) + song.duration}:R>`
  const songPosition = `[${song.queue.currentSongIndex! + 1}/${song.queue.songs.length}]`

  return new CustomEmbedBuilder()
    .setColor("Primary")
    .setAuthor({
      name: `Added by ${song.submittedBy.displayName}`,
      iconURL: song.submittedBy.displayAvatarURL(),
    })
    .setTitle(`${songPosition} ${song.name}`)
    .setURL(song.url)
    .setDescription(
      `
          **Duration:** \`${song.formattedDuration}\`
          **Finishes playing:** ${songFinishesPlaying}
        `,
    )
    .setImage(song.thumbnail)
    .setFooter({ text: song.url })
}

export function createPanelButtons(song: Song) {
  const isPaused = song.queue.isPaused

  return [
    new CustomActionRowBuilder()
      .addButton((button) => {
        return button
          .setCustomId("music.stop")
          .setEmoji(Emojis.Stop)
          .setStyle(ButtonStyle.Secondary)
      })
      .addButton((button) => {
        return button
          .setCustomId("music.previous")
          .setEmoji(Emojis.Previous)
          .setStyle(ButtonStyle.Secondary)
      })
      .addButton((button) => {
        return button
          .setCustomId(isPaused ? "music.resume" : "music.pause")
          .setEmoji(isPaused ? Emojis.Resume : Emojis.Pause)
          .setStyle(ButtonStyle.Secondary)
      })
      .addButton((button) => {
        return button
          .setCustomId("music.skip")
          .setEmoji(Emojis.Skip)
          .setStyle(ButtonStyle.Secondary)
      }),
    new CustomActionRowBuilder()
      .addButton((button) => {
        return button
          .setCustomId("music.repeat")
          .setEmoji(Emojis.Repeat)
          .setStyle(ButtonStyle.Secondary)
      })
      .addButton((button) => {
        return button
          .setCustomId("music.shuffle")
          .setEmoji(Emojis.Shuffle)
          .setStyle(ButtonStyle.Secondary)
      })
      .addButton((button) => {
        return button
          .setCustomId("music.add")
          .setEmoji(Emojis.Add)
          .setStyle(ButtonStyle.Secondary)
      })
      .addButton((button) => {
        return button
          .setCustomId("music.remove")
          .setEmoji(Emojis.Remove)
          .setStyle(ButtonStyle.Secondary)
      }),
  ]
}
