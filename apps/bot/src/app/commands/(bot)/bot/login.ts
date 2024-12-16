import { createHmac } from "node:crypto"

import { BotSubcommandBuilder } from "@phasejs/builders"
import { bold, ButtonStyle } from "discord.js"

import { db } from "~/lib/db"
import { env } from "~/lib/env"
import { dateToTimestamp } from "~/lib/utils/formatting"

import { BotErrorMessage } from "~/structures/BotError"
import { MessageBuilder } from "~/structures/builders"

export default new BotSubcommandBuilder()
  .setName("login")
  .setDescription("Generates a dashboard login code.")
  .setMetadata({ dmPermission: false })
  .setExecute(async (interaction) => {
    await interaction.deferReply({ ephemeral: true })

    const guildDoc = interaction.client.stores.guilds.get(interaction.guildId!)

    if (!guildDoc?.admins.includes(interaction.user.id)) {
      const errorMessage = BotErrorMessage.userNotAdmin()
      return await interaction.editReply(errorMessage)
    }

    const { value, signature, expiresAt } = await generateLoginCode()

    await db.otps.create({
      userId: interaction.user.id,
      guildId: interaction.guildId,
      otp: signature,
    })

    return await interaction.editReply(
      new MessageBuilder()
        .setEmbeds((embed) => {
          embed.setTitle("Dashboard Login Code")
          embed.setColor("Primary")
          embed.setDescription(`
            Your login code is ${bold(value)}
            This will expire in ${dateToTimestamp(expiresAt)}
          `)
          return embed
        })
        .setComponents((actionrow) => {
          return actionrow.addButton((button) => {
            return button
              .setURL("https://phasebot.xyz/auth/signin")
              .setLabel("Login page")
              .setStyle(ButtonStyle.Link)
          })
        }),
    )
  })

async function generateLoginCode() {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"

  let value = ""
  for (let i = 0; i < 6; i++) {
    value += chars.charAt(Math.floor(Math.random() * chars.length))
  }

  const signature = createHmac("sha256", env.AUTH_OTP_SECRET)
    .update(value)
    .digest("hex")

  if (await db.otps.exists({ otp: signature })) {
    return await generateLoginCode()
  }

  const expiresAt = new Date(Date.now() + 60_000)

  return {
    value,
    signature,
    expiresAt,
  }
}
