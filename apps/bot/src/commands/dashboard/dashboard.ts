import bcrypt from "bcrypt"
import crypto from "crypto"

import { GuildSchema, OtpSchema } from "@repo/schemas"

import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  EmbedBuilder,
} from "discord.js"

import { BotCommandBuilder } from "phasebot/builders"

import { PhaseColour, errorMessage, missingPermission } from "~/utils"

function generateOTP(): string {
  const randomBytes = crypto.randomBytes(3) // 3 bytes = 24 bits
  const otp = parseInt(randomBytes.toString("hex"), 16) % 1000000 // Ensure it's a 6-digit number
  return otp.toString().padStart(6, "0") // Ensure leading zeros if necessary
}

export default new BotCommandBuilder()
  .setName("dashboard")
  .setDescription("dashboard")
  .setDMPermission(false)
  .addSubcommand((subcommand) =>
    subcommand.setName("login").setDescription("Login to the dashboard."),
  )
  .setExecute(async (_, interaction) => {
    switch (
      [
        interaction.options.getSubcommandGroup(false),
        interaction.options.getSubcommand(true),
      ]
        .join(" ")
        .trim()
    ) {
      case "login":
        {
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

          const otp = generateOTP()
          const hashedOtp = await bcrypt.hash(otp, 10)

          await interaction.user
            .send({
              embeds: [
                new EmbedBuilder()
                  .setTitle("Dashboard Login Code")
                  .setDescription(
                    `Your login code is **${otp}**\nThis will expire in <t:${Math.floor(Date.now() / 1000) + 60}:R>`,
                  )
                  .setColor(PhaseColour.Primary),
              ],
              components: [
                new ActionRowBuilder<ButtonBuilder>().setComponents(
                  new ButtonBuilder()
                    .setLabel("Login page")
                    .setStyle(ButtonStyle.Link)
                    .setURL(`https://phasebot.xyz/login?userId=${interaction.user.id}&guildId=${interaction.guildId}`),
                ),
              ],
            })
            .catch(() => {
              interaction.editReply(
                errorMessage({
                  title: "Failed to send login code",
                  description: "Please make sure your DMs are open.",
                }),
              )

              return
            })

          await new OtpSchema({
            userId: interaction.user.id,
            guildId: interaction.guildId,
            otp: hashedOtp,
          }).save()

          await interaction.editReply({
            embeds: [
              new EmbedBuilder()
                .setTitle("Login Code Sent")
                .setDescription("Please check your DMs.")
                .setColor(PhaseColour.Primary),
            ],
          })
        }
        break
    }
  })
