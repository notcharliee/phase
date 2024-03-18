import { botEvent } from "phasebot"

import { GuildSchema, ReminderSchema } from "@repo/schemas"

import { PhaseColour, errorMessage } from "~/utils"

import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  EmbedBuilder,
} from "discord.js"

export default botEvent("messageCreate", async (client, message) => {
  if (message.interaction?.commandName !== "bump") return

  const guild = await GuildSchema.findOne({ id: message.guildId })
  if (!guild || !guild.modules?.BumpReminders?.enabled) return

  const moduleConfig = guild.modules.BumpReminders

  const reminder = await new ReminderSchema({
    guild: message.guildId,
    name: "Bump Reminder",
    message: moduleConfig.reminderMessage,
    channel: message.channelId,
    time: moduleConfig.time,
    loop: false,
    user: message.interaction.user.id,
    created: Date.now()
  }).save()

  const reply = await message.reply({
    embeds: [
      new EmbedBuilder()
        .setColor(PhaseColour.Primary)
        .setTitle("Bump Reminder")
        .setDescription(moduleConfig.initialMessage)
        .setFooter({
          text: "Cancellation button will expire in 1 minute.",
        }),
    ],
    components: [
      new ActionRowBuilder<ButtonBuilder>().addComponents(
        new ButtonBuilder()
          .setCustomId(`bumpreminder.cancel.${message.author.id}`)
          .setLabel("Cancel Reminder")
          .setStyle(ButtonStyle.Secondary),
      ),
    ],
  })

  reply
    .createMessageComponentCollector({
      filter: (interaction) => {
        return (
          interaction.isButton() &&
          interaction.customId === `bumpreminder.cancel.${message.author.id}`
        )
      },
      time: 1000 * 60 * 1,
    })
    .on("collect", async (interaction) => {
      await interaction.deferReply()

      if (interaction.user.id !== message.interaction?.user.id) {
        await interaction.editReply(
          errorMessage({
            title: "Invalid User",
            description: "You cannot cancel someone else's reminder.",
          })
        )

        return
      }

      await reminder.deleteOne()

      await reply.edit({
        embeds: [
          new EmbedBuilder()
            .setColor(PhaseColour.Primary)
            .setTitle("Bump Reminder")
            .setDescription(moduleConfig.initialMessage)
            .setFooter({
              text: "Reminder has been cancelled.",
            }),
        ],
        components: [
          new ActionRowBuilder<ButtonBuilder>().addComponents(
            new ButtonBuilder()
              .setCustomId(`bumpreminder.cancel.${message.author.id}`)
              .setLabel("Cancel Reminder")
              .setStyle(ButtonStyle.Secondary)
              .setDisabled(true),
          ),
        ],
      })

      interaction.editReply({
        embeds: [
          new EmbedBuilder()
            .setColor(PhaseColour.Primary)
            .setTitle("Bump Reminder")
            .setDescription("Bump reminder cancelled.")
            .setTimestamp(),
        ],
      })
    })
    .on("end", (collected) => {
      if (collected.size !== 0) return

      reply.edit({
        embeds: [
          new EmbedBuilder()
            .setColor(PhaseColour.Primary)
            .setTitle("Bump Reminder")
            .setDescription(moduleConfig.initialMessage)
            .setFooter({
              text: "Reminder cancellation window has expired.",
            }),
        ],
        components: [
          new ActionRowBuilder<ButtonBuilder>().addComponents(
            new ButtonBuilder()
              .setCustomId(`bumpreminder.cancel.${message.author.id}`)
              .setLabel("Cancel Reminder")
              .setStyle(ButtonStyle.Secondary)
              .setDisabled(true),
          ),
        ],
      })
    })
})
