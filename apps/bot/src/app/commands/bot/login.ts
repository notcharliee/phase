import crypto from "node:crypto"

import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  EmbedBuilder,
} from "discord.js"
import { BotSubcommandBuilder } from "phasebot/builders"

import { db } from "~/lib/db"
import { PhaseColour } from "~/lib/enums"
import { env } from "~/lib/env"
import { BotError } from "~/lib/errors"

export default new BotSubcommandBuilder()
  .setName("login")
  .setDescription("Generates a dashboard login code.")
  .setExecute(async (interaction) => {
    await interaction.deferReply({
      ephemeral: true,
    })

    if (!interaction.guild) {
      void interaction.editReply(BotError.serverOnlyCommand().toJSON())
      return
    }

    const guildDoc = interaction.client.store.guilds.get(interaction.guildId!)

    if (!guildDoc?.admins.includes(interaction.user.id)) {
      return void interaction.editReply(BotError.userNotAdmin().toJSON())
    }

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

    void db.otps.create({
      userId: interaction.user.id,
      guildId: interaction.guildId,
      otp: signature,
    })
  })

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

  if (await db.otps.findOne({ otp: signature })) {
    return await generateOTP()
  }

  return {
    value,
    signature,
  }
}
