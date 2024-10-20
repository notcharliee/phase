import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  EmbedBuilder,
  ModalBuilder,
  TextInputBuilder,
  TextInputStyle,
} from "discord.js"
import { BotEventBuilder } from "phasebot/builders"

import { Emojis } from "~/lib/emojis.ts"
import { PhaseColour } from "~/lib/enums.ts"

import { BotErrorMessage } from "~/structures/BotError.ts"
import { QueueRepeatMode } from "~/structures/music/Queue.ts"

import type { GuildMember } from "discord.js"

export default new BotEventBuilder()
  .setName("interactionCreate")
  .setExecute(async (client, interaction) => {
    if (!interaction.isButton() || !interaction.customId.startsWith("music"))
      return

    const queue = client.music.queues.get(interaction.guildId!)
    if (!queue) return

    const channel = queue.voice.channel

    const member = interaction.member as GuildMember

    if (member.voice.channelId !== channel.id) {
      return void interaction.reply({
        content:
          "You must be in the same voice channel as the bot to use this command.",
        ephemeral: true,
      })
    }

    const action = interaction.customId.split(".")[1]

    if (!["add", "remove"].includes(action!))
      await interaction.deferReply({ ephemeral: true })

    switch (action) {
      case "stop": {
        queue.delete()

        await interaction.editReply({
          content: `Cleared **${queue.songs.length}** songs from the queue.`,
        })

        await interaction.message.delete().catch(() => undefined)
        break
      }

      case "previous": {
        const previousSong = queue.previousSong

        if (!previousSong) {
          return void interaction.editReply(
            new BotErrorMessage("No previous song was found.").toJSON(),
          )
        }

        queue.playPreviousSong()

        await interaction.editReply({
          content: `Playing **${previousSong.name}**.`,
        })

        await interaction.message.edit({
          embeds: [
            new EmbedBuilder()
              .setColor(PhaseColour.Primary)
              .setAuthor({
                name: `Started playing by ${member.displayName}`,
                iconURL: member.displayAvatarURL(),
              })
              .setTitle(previousSong.name)
              .setURL(previousSong.url)
              .setImage(previousSong.thumbnail),
          ],
        })

        break
      }

      case "pause": {
        if (!queue?.currentSong) {
          return void interaction.editReply(
            new BotErrorMessage("No songs were found in the queue.").toJSON(),
          )
        }

        if (queue.isPaused) {
          return void interaction.editReply(
            new BotErrorMessage("This song is already paused.").toJSON(),
          )
        }

        queue.pause()

        await interaction.editReply({
          content: `Paused **${queue.currentSong.name}**.`,
        })

        await interaction.message.edit({
          embeds: [
            new EmbedBuilder()
              .setColor(PhaseColour.Primary)
              .setAuthor({
                name: `Paused by ${member.displayName}`,
                iconURL: member.displayAvatarURL(),
              })
              .setTitle(queue.currentSong.name)
              .setURL(queue.currentSong.url)
              .setImage(queue.currentSong.thumbnail),
          ],
          components: [
            new ActionRowBuilder<ButtonBuilder>().addComponents([
              new ButtonBuilder()
                .setCustomId("music.stop")
                .setEmoji(Emojis.Stop)
                .setStyle(ButtonStyle.Secondary),

              new ButtonBuilder()
                .setCustomId("music.previous")
                .setEmoji(Emojis.Previous)
                .setStyle(ButtonStyle.Secondary),

              new ButtonBuilder()
                .setCustomId("music.resume")
                .setEmoji(Emojis.Pause)
                .setStyle(ButtonStyle.Secondary),

              new ButtonBuilder()
                .setCustomId("music.skip")
                .setEmoji(Emojis.Skip)
                .setStyle(ButtonStyle.Secondary),
            ]),

            new ActionRowBuilder<ButtonBuilder>().addComponents([
              new ButtonBuilder()
                .setCustomId("music.repeat")
                .setEmoji(Emojis.Repeat)
                .setStyle(ButtonStyle.Secondary),

              new ButtonBuilder()
                .setCustomId("music.shuffle")
                .setEmoji(Emojis.Shuffle)
                .setStyle(ButtonStyle.Secondary),

              new ButtonBuilder()
                .setCustomId("music.add")
                .setEmoji(Emojis.Add)
                .setStyle(ButtonStyle.Secondary),

              new ButtonBuilder()
                .setCustomId("music.remove")
                .setEmoji(Emojis.Remove)
                .setStyle(ButtonStyle.Secondary),
            ]),
          ],
        })

        break
      }

      case "resume": {
        if (!queue?.currentSong) {
          return void interaction.editReply(
            new BotErrorMessage("No songs were found in the queue.").toJSON(),
          )
        }

        if (!queue.isPaused) {
          return void interaction.editReply(
            new BotErrorMessage("This song is not paused.").toJSON(),
          )
        }

        queue.resume()

        await interaction.editReply({
          content: `Resumed **${queue.currentSong.name}**.`,
        })

        await interaction.message.edit({
          embeds: [
            new EmbedBuilder()
              .setColor(PhaseColour.Primary)
              .setAuthor({
                name: `Resumed by ${member.displayName}`,
                iconURL: member.displayAvatarURL(),
              })
              .setTitle(queue.currentSong.name)
              .setURL(queue.currentSong.url)
              .setImage(queue.currentSong.thumbnail),
          ],
          components: [
            new ActionRowBuilder<ButtonBuilder>().addComponents([
              new ButtonBuilder()
                .setCustomId("music.stop")
                .setEmoji(Emojis.Stop)
                .setStyle(ButtonStyle.Secondary),

              new ButtonBuilder()
                .setCustomId("music.previous")
                .setEmoji(Emojis.Previous)
                .setStyle(ButtonStyle.Secondary),

              new ButtonBuilder()
                .setCustomId("music.pause")
                .setEmoji(Emojis.Pause)
                .setStyle(ButtonStyle.Secondary),

              new ButtonBuilder()
                .setCustomId("music.skip")
                .setEmoji(Emojis.Skip)
                .setStyle(ButtonStyle.Secondary),
            ]),

            new ActionRowBuilder<ButtonBuilder>().addComponents([
              new ButtonBuilder()
                .setCustomId("music.repeat")
                .setEmoji(Emojis.Repeat)
                .setStyle(ButtonStyle.Secondary),

              new ButtonBuilder()
                .setCustomId("music.shuffle")
                .setEmoji(Emojis.Shuffle)
                .setStyle(ButtonStyle.Secondary),

              new ButtonBuilder()
                .setCustomId("music.add")
                .setEmoji(Emojis.Add)
                .setStyle(ButtonStyle.Secondary),

              new ButtonBuilder()
                .setCustomId("music.remove")
                .setEmoji(Emojis.Remove)
                .setStyle(ButtonStyle.Secondary),
            ]),
          ],
        })

        break
      }

      case "skip": {
        if (!queue?.currentSong) {
          return void interaction.editReply(
            new BotErrorMessage("No songs were found in the queue.").toJSON(),
          )
        }

        queue.skip()

        await interaction.editReply({
          content: `Skipped **${queue.currentSong.name}**.`,
        })

        await interaction.message.edit({
          embeds: [
            new EmbedBuilder()
              .setColor(PhaseColour.Primary)
              .setAuthor({
                name: `Skipped by ${member.displayName}`,
                iconURL: member.displayAvatarURL(),
              })
              .setTitle(queue.currentSong.name)
              .setURL(queue.currentSong.url)
              .setImage(queue.currentSong.thumbnail),
          ],
        })

        break
      }

      case "repeat": {
        const updateMode =
          queue.repeatMode === QueueRepeatMode.Disabled
            ? QueueRepeatMode.Song
            : QueueRepeatMode.Disabled

        queue.setRepeatMode(updateMode)

        await interaction.editReply({
          content: `Repeat mode is now **${updateMode === QueueRepeatMode.Song ? "Enabled" : "Disabled"}**.`,
        })

        break
      }

      case "shuffle": {
        queue.shuffleSongs()

        await interaction.editReply({
          content: `Shuffled the queue.`,
        })

        break
      }

      case "add": {
        const modal = new ModalBuilder()
          .setCustomId("music.search")
          .setTitle("Search for a song")
          .addComponents([
            new ActionRowBuilder<TextInputBuilder>().addComponents([
              new TextInputBuilder()
                .setCustomId("query")
                .setLabel("Search Query")
                .setStyle(TextInputStyle.Short)
                .setPlaceholder("Enter a song name or URL")
                .setRequired(true),
            ]),
          ])

        await interaction.showModal(modal)

        const collected = await interaction.awaitModalSubmit({ time: 60000 })

        if (collected) {
          const query = collected.fields.getTextInputValue("query")

          const songs = await interaction.client.music.play(
            channel,
            member,
            query,
          )

          const detail = songs[songs.length - 1]

          await collected.reply({
            content: `Added **${detail?.name}** to the queue.`,
            ephemeral: true,
          })
        }

        break
      }

      case "remove": {
        const modal = new ModalBuilder()
          .setCustomId("music.search")
          .setTitle("Search for a song")
          .addComponents([
            new ActionRowBuilder<TextInputBuilder>().addComponents([
              new TextInputBuilder()
                .setCustomId("position")
                .setLabel("Position")
                .setStyle(TextInputStyle.Short)
                .setPlaceholder("Enter the song position you want to remove")
                .setRequired(true),
            ]),
          ])

        await interaction.showModal(modal)

        const collected = await interaction.awaitModalSubmit({ time: 60000 })

        if (collected) {
          const position = Number(
            collected.fields.getTextInputValue("position"),
          )

          const song = queue.songs[position - 1]

          if (!song) {
            return void collected.reply({
              content: "No song at that position.",
            })
          }

          queue.removeSong(song)

          await collected.reply({
            content: `Removed **${song.name}** from the queue.`,
            ephemeral: true,
          })
        }
      }
    }
  })
