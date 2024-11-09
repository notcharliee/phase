import { ButtonStyle, ModalBuilder, TextInputStyle } from "discord.js"
import { BotEventBuilder } from "phasebot/builders"

import { Emojis } from "~/lib/emojis"
import { wrapText } from "~/lib/utils/formatting"

import { createProgressBar } from "~/app/commands/(voice)/music/_utils"
import { BotErrorMessage } from "~/structures/BotError"
import { ActionRowBuilder } from "~/structures/builders/ActionRowBuilder"
import { EmbedBuilder } from "~/structures/builders/EmbedBuilder"
import { MessageBuilder } from "~/structures/builders/MessageBuilder"
import { QueueRepeatMode } from "~/structures/music/Queue"

import type { Song } from "~/structures/music/Song"
import type { ExtractCustomIDParts } from "~/types/custom-ids"

enum MusicCustomID {
  Pause = "music.pause",
  Resume = "music.resume",
  Stop = "music.stop",
  Repeat = "music.repeat",
  Shuffle = "music.shuffle",
  NextTrack = "music.next-track",
  PreviousTrack = "music.previous-track",
  AddSong = "music.add",
  AddSongInput = "music.add.query",
  RemoveSong = "music.remove",
  RemoveSongInput = "music.remove.position",
}

type MusicCustomIDParts = ExtractCustomIDParts<MusicCustomID>

export default new BotEventBuilder()
  .setName("interactionCreate")
  .setExecute(async (client, interaction) => {
    if (
      !interaction.inGuild() ||
      (!interaction.isButton() && !interaction.isModalSubmit()) ||
      (interaction.isModalSubmit() && !interaction.isFromMessage()) ||
      !Object.values(MusicCustomID).includes(interaction.customId)
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
    const customIdAction = customIdParts[1]

    switch (customIdAction) {
      case "stop": {
        void interaction.deferUpdate()
        return void queue.delete()
      }

      case "previous-track": {
        if (!queue.previousSong) {
          return void interaction.reply(
            new BotErrorMessage("No previous song was found."),
          )
        }

        const song = queue.playPreviousSong()!

        return void interaction.update(
          new MessageBuilder()
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
          new MessageBuilder()
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
          new MessageBuilder()
            .setEmbeds(createPanelEmbed(song))
            .setComponents(createPanelButtons(song)),
        )
      }

      case "next-track": {
        if (!queue?.currentSong) {
          return void interaction.reply(
            new BotErrorMessage("No songs were found in the queue."),
          )
        }

        queue.skip()

        const song = queue.currentSong

        return void interaction.update(
          new MessageBuilder()
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
              .setCustomId(MusicCustomID.AddSong)
              .setTitle("Search for a song")
              .addComponents([
                new ActionRowBuilder().addTextInput((input) => {
                  return input
                    .setCustomId(MusicCustomID.AddSongInput)
                    .setLabel("Search Query")
                    .setStyle(TextInputStyle.Short)
                    .setPlaceholder("A song name or URL")
                    .setRequired(true)
                }),
              ]),
          )
        } else {
          const query = interaction.fields.getTextInputValue(
            MusicCustomID.AddSongInput,
          )
          await queue.music.play(channel, member, query)
          const song = queue.currentSong!

          return void interaction.update(
            new MessageBuilder()
              .setEmbeds(createPanelEmbed(song))
              .setComponents(createPanelButtons(song)),
          )
        }
      }

      case "remove": {
        if (interaction.isButton()) {
          return void interaction.showModal(
            new ModalBuilder()
              .setCustomId(MusicCustomID.RemoveSong)
              .setTitle("Search for a song")
              .addComponents([
                new ActionRowBuilder().addTextInput((input) => {
                  return input
                    .setCustomId(MusicCustomID.RemoveSongInput)
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
            interaction.fields.getTextInputValue(MusicCustomID.RemoveSongInput),
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
            new MessageBuilder()
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

  return new EmbedBuilder()
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
    new ActionRowBuilder()
      .addButton((button) => {
        return button
          .setCustomId(MusicCustomID.PreviousTrack)
          .setEmoji(Emojis.PreviousTrack)
          .setStyle(ButtonStyle.Secondary)
      })
      .addButton((button) => {
        return button
          .setCustomId(isPaused ? MusicCustomID.Resume : MusicCustomID.Pause)
          .setEmoji(isPaused ? Emojis.Play : Emojis.Pause)
          .setStyle(ButtonStyle.Secondary)
      })
      .addButton((button) => {
        return button
          .setCustomId(MusicCustomID.NextTrack)
          .setEmoji(Emojis.NextTrack)
          .setStyle(ButtonStyle.Secondary)
      })
      .addButton((button) => {
        return button
          .setCustomId(MusicCustomID.AddSong)
          .setEmoji(Emojis.Plus)
          .setStyle(ButtonStyle.Secondary)
      }),
    new ActionRowBuilder()
      .addButton((button) => {
        return button
          .setCustomId(MusicCustomID.Shuffle)
          .setEmoji(Emojis.Shuffle)
          .setStyle(ButtonStyle.Secondary)
      })
      .addButton((button) => {
        return button
          .setCustomId(MusicCustomID.Stop)
          .setEmoji(Emojis.Stop)
          .setStyle(ButtonStyle.Secondary)
      })
      .addButton((button) => {
        return button
          .setCustomId(MusicCustomID.Repeat)
          .setEmoji(Emojis.Repeat)
          .setStyle(ButtonStyle.Secondary)
      })
      .addButton((button) => {
        return button
          .setCustomId(MusicCustomID.RemoveSong)
          .setEmoji(Emojis.Minus)
          .setStyle(ButtonStyle.Secondary)
      }),
  ]
}
