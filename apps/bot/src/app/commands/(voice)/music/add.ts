import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  EmbedBuilder,
} from "discord.js"
import { BotSubcommandBuilder } from "phasebot/builders"

import dedent from "dedent"

import { Emojis } from "~/lib/emojis.ts"
import { PhaseColour } from "~/lib/enums"

import { BotErrorMessage } from "~/structures/BotError"
import { MusicError } from "~/structures/music/Music"

import type { GuildMember } from "discord.js"

export default new BotSubcommandBuilder()
  .setName("add")
  .setDescription("Adds a song to the queue.")
  .addStringOption((option) =>
    option
      .setName("query")
      .setDescription("The search query or URL for a song or playlist.")
      .setRequired(true),
  )
  .setMetadata({ dmPermission: false })
  .setExecute(async (interaction) => {
    await interaction.deferReply()

    const query = interaction.options.getString("query", true)
    const member = interaction.member as GuildMember
    const channel = member.voice.channel

    if (!channel) {
      return void interaction.editReply(
        BotErrorMessage.specificChannelOnlyCommand("voice").toJSON(),
      )
    }

    try {
      const songs = await interaction.client.music.play(channel, member, query)
      const firstSong = songs[0]!

      const queue = firstSong.queue

      const songStartsPlaying = `<t:${Math.floor(Date.now() / 1000) + (queue.duration - firstSong.duration)}:R>`
      const songFinishesPlaying = `<t:${Math.floor(Date.now() / 1000) + firstSong.duration}:R>`

      const duration = firstSong.formattedDuration
      const placeInQueue = queue.songs.slice(queue.currentSongIndex! + 1).length

      if (queue.songs.length === 1) {
        await channel.send({
          content: firstSong.submittedBy.toString(),
          embeds: [
            new EmbedBuilder()
              .setColor(PhaseColour.Primary)
              .setAuthor({
                name: `Started playing by ${firstSong.submittedBy.displayName}`,
                iconURL: firstSong.submittedBy.displayAvatarURL(),
              })
              .setTitle(firstSong.name)
              .setURL(firstSong.url)
              .setImage(firstSong.thumbnail),
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
      }

      return void interaction.editReply({
        embeds: [
          new EmbedBuilder()
            .setColor(PhaseColour.Primary)
            .setAuthor({
              name: `Added by ${member.displayName}`,
              iconURL: member.displayAvatarURL(),
            })
            .setTitle(firstSong.name)
            .setURL(firstSong.url)
            .setThumbnail(firstSong.thumbnail)
            .setDescription(
              dedent`
                **Duration:** \`${duration}\`
                **Place in queue:** \`${placeInQueue}\`
                ${placeInQueue >= 1 ? `**Starts playing:** ${songStartsPlaying}` : `**Finishes playing:** ${songFinishesPlaying}`}
              `,
            )
            .setFooter({ text: firstSong.url }),
        ],
      })
    } catch (error) {
      if (error instanceof Error) {
        if (error.message === (MusicError.InvalidQuery as string)) {
          return await interaction.editReply(
            new BotErrorMessage("Song not found").toJSON(),
          )
        }
      }

      return void interaction.editReply(
        BotErrorMessage.unknown({
          channelId: channel.id,
          guildId: channel.guild.id,
          error: error as Error,
        }).toJSON(),
      )
    }
  })
