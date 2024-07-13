import crypto from "node:crypto"

import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  EmbedBuilder,
} from "discord.js"
import { BotCommandBuilder } from "phasebot/builders"

import { GuildSchema, OtpSchema } from "@repo/schemas"

import { env } from "~/env"
import { missingPermission, PhaseColour } from "~/utils"

async function generateOTP() {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"

  let value = ""
  for (let i = 0; i < 6; i++) {
    value += chars.charAt(Math.floor(Math.random() * chars.length))
  }

  const signature = crypto
    .createHmac("sha256", env.AUTH_OTP_SECRET)
    .update(value)
    .digest("hex")

  if (await OtpSchema.findOne({ otp: signature })) {
    return await generateOTP()
  }

  return {
    value,
    signature,
  }
}

export default new BotCommandBuilder()
  .setName("dashboard")
  .setDescription("dashboard")
  .setDMPermission(false)
  .addSubcommand((subcommand) =>
    subcommand.setName("login").setDescription("Login to the dashboard."),
  )
  .addSubcommandGroup((subcommandgroup) =>
    subcommandgroup
      .setName("admins")
      .setDescription("admins")
      .addSubcommand((subcommand) =>
        subcommand
          .setName("add")
          .setDescription("Grant a user dashboard access.")
          .addUserOption((option) =>
            option
              .setName("user")
              .setDescription("The user to add.")
              .setRequired(true),
          ),
      )
      .addSubcommand((subcommand) =>
        subcommand
          .setName("remove")
          .setDescription("Revoke a user's dashboard access.")
          .addUserOption((option) =>
            option
              .setName("user")
              .setDescription("The user to remove.")
              .setRequired(true),
          ),
      )
      .addSubcommand((subcommand) =>
        subcommand
          .setName("list")
          .setDescription("List the users that have dashboard access."),
      ),
  )
  .setExecute(async (interaction) => {
    await interaction.deferReply({
      ephemeral: true,
    })

    const guildDoc = await GuildSchema.findOne({
      id: interaction.guildId!,
      admins: { $in: interaction.user.id },
    })

    if (!guildDoc) {
      await interaction.editReply(missingPermission())
      return
    }

    const commandName = [
      interaction.options.getSubcommandGroup(false),
      interaction.options.getSubcommand(true),
    ]
      .join(" ")
      .trim()

    switch (commandName) {
      case "login":
        {
          const { value, signature } = await generateOTP()

          void interaction.editReply({
            embeds: [
              new EmbedBuilder()
                .setTitle("Dashboard Login Code")
                .setDescription(
                  `Your login code is **${value}**\nThis will expire in <t:${Math.floor(Date.now() / 1000) + 60}:R>`,
                )
                .setColor(PhaseColour.Primary),
            ],
            components: [
              new ActionRowBuilder<ButtonBuilder>().setComponents(
                new ButtonBuilder()
                  .setLabel("Login page")
                  .setStyle(ButtonStyle.Link)
                  .setURL("https://phasebot.xyz/auth/login"),
              ),
            ],
          })

          void new OtpSchema({
            userId: interaction.user.id,
            guildId: interaction.guildId,
            otp: signature,
          }).save()
        }
        break

      case "admins add":
        {
          if (interaction.guild?.ownerId !== interaction.user.id) {
            await interaction.editReply(missingPermission("OWNER"))
            return
          }

          const user = interaction.options.getUser("user", true)

          if (user.bot) {
            interaction.editReply({
              embeds: [
                new EmbedBuilder()
                  .setTitle("Failed to add")
                  .setDescription(`${user} is a bot, not a regular user.`)
                  .setColor(PhaseColour.Primary),
              ],
            })

            return
          }

          if (guildDoc.admins.includes(user.id)) {
            interaction.editReply({
              embeds: [
                new EmbedBuilder()
                  .setTitle("Failed to add")
                  .setDescription(`${user} already has dashboard access.`)
                  .setColor(PhaseColour.Primary),
              ],
            })

            return
          }

          guildDoc.admins.push(user.id)
          await guildDoc.save()

          interaction.editReply({
            embeds: [
              new EmbedBuilder()
                .setTitle("Admin Added")
                .setDescription(`${user} has been granted dashboard access.`)
                .setColor(PhaseColour.Primary),
            ],
          })
        }
        break

      case "admins remove":
        {
          if (interaction.guild?.ownerId !== interaction.user.id) {
            await interaction.editReply(missingPermission("OWNER"))
            return
          }

          const user = interaction.options.getUser("user", true)

          if (!guildDoc.admins.includes(user.id)) {
            interaction.editReply({
              embeds: [
                new EmbedBuilder()
                  .setTitle("Failed to remove")
                  .setDescription(`${user} does not have dashboard access.`)
                  .setColor(PhaseColour.Primary),
              ],
            })

            return
          }

          guildDoc.admins.splice(guildDoc.admins.indexOf(user.id), 1)
          await guildDoc.save()

          interaction.editReply({
            embeds: [
              new EmbedBuilder()
                .setTitle("Admin Removed")
                .setDescription(`${user} has had dashboard access revoked.`)
                .setColor(PhaseColour.Primary),
            ],
          })
        }
        break

      case "admins list":
        {
          interaction.editReply({
            embeds: [
              new EmbedBuilder()
                .setTitle("Dashboard Admins")
                .setDescription(
                  guildDoc.admins
                    .map((adminId, index) => `${index + 1}. <@!${adminId}>`)
                    .join("\n"),
                )
                .setColor(PhaseColour.Primary),
            ],
          })
        }
        break
    }
  })
