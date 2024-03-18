import { botCommand, BotCommandBuilder } from "phasebot"

import { ReminderSchema } from "@repo/schemas"

import { PhaseColour, errorMessage, missingPermission } from "~/utils"

import { EmbedBuilder, PermissionFlagsBits } from "discord.js"

import ms from "ms"

export default botCommand(
  new BotCommandBuilder()
    .setName("reminder")
    .setDescription("Set a reminder")
    .setDMPermission(false)
    .addStringOption((option) =>
      option
        .setName("message")
        .setDescription("The message to remind you of")
        .setRequired(true),
    )
    .addStringOption((option) =>
      option
        .setName("time")
        .setDescription("The time to remind you (e.g. 1d, 1h, 1m, 1s)")
        .setRequired(true),
    )
    .addRoleOption((option) =>
      option
        .setName("role")
        .setDescription(
          "The role to remind (must have 'Mention Everyone' permission)",
        )
        .setRequired(false),
    ),
  async (client, interaction) => {
    const message = interaction.options.getString("message", true)
    const time = interaction.options.getString("time", true)
    const role = interaction.options.getRole("role", false)

    if (
      role &&
      !interaction.memberPermissions?.has(PermissionFlagsBits.MentionEveryone)
    ) {
      return interaction.reply(
        missingPermission(PermissionFlagsBits.MentionEveryone),
      )
    }

    let msTime: number | undefined

    try {
      msTime = ms(time)
    } catch (error) {
      // do nothing
    } finally {
      if (!msTime) {
        return interaction.reply(
          errorMessage({
            title: "Invalid time",
            description: "The time you provided is invalid.",
          }),
        )
      }

      await new ReminderSchema({
        guild: interaction.guildId,
        message,
        channel: interaction.channelId,
        time: msTime,
        user: interaction.user.id,
        role: role?.id,
        created: new Date(),
      }).save()

      return interaction.reply({
        embeds: [
          new EmbedBuilder()
            .setTitle("Reminder Set")
            .setDescription(
              `I will remind you in ${ms(msTime, { long: true })}.`,
            )
            .setColor(PhaseColour.Primary),
        ],
      })
    }
  },
)
