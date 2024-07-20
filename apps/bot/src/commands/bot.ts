import crypto from "node:crypto"

import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  EmbedBuilder,
} from "discord.js"
import { BotCommandBuilder } from "phasebot/builders"

import { db } from "~/lib/db"
import { PhaseColour, PhaseURL } from "~/lib/enums"
import { env } from "~/lib/env"
import { BotError } from "~/lib/errors"

export default new BotCommandBuilder()
  .setName("bot")
  .setDescription("bot")
  .addSubcommandGroup((subcommand) =>
    subcommand
      .setName("admins")
      .setDescription("admins")
      .addSubcommand((subcommand) =>
        subcommand
          .setName("add")
          .setDescription("Grants a member dashboard access.")
          .addUserOption((option) =>
            option
              .setName("user")
              .setDescription("The member to add.")
              .setRequired(true),
          ),
      )
      .addSubcommand((subcommand) =>
        subcommand
          .setName("remove")
          .setDescription("Revokes a member's dashboard access.")
          .addUserOption((option) =>
            option
              .setName("user")
              .setDescription("The member to remove.")
              .setRequired(true),
          ),
      )
      .addSubcommand((subcommand) =>
        subcommand
          .setName("list")
          .setDescription("Lists the members that have dashboard access."),
      ),
  )
  .addSubcommand((subcommand) =>
    subcommand
      .setName("help")
      .setDescription("Links to the bot's docs and support discord."),
  )
  .addSubcommand((subcommand) =>
    subcommand
      .setName("invite")
      .setDescription("Generates an invite link for the bot."),
  )
  .addSubcommand((subcommand) =>
    subcommand
      .setName("login")
      .setDescription("Generates a dashboard login code."),
  )
  .addSubcommand((subcommand) =>
    subcommand
      .setName("ping")
      .setDescription("Calculates the current bot latency."),
  )
  .addSubcommand((subcommand) =>
    subcommand
      .setName("report")
      .setDescription("Reports a bug to the developers."),
  )
  .setExecute(async (interaction) => {
    const defferedReply = await interaction.deferReply({
      ephemeral: true,
      fetchReply: true,
    })

    const commandName = [
      interaction.options.getSubcommandGroup(false) ?? "",
      interaction.options.getSubcommand(true),
    ]
      .join(" ")
      .trim() as
      | "admins add"
      | "admins remove"
      | "admins list"
      | "help"
      | "invite"
      | "login"
      | "ping"
      | "report"

    const serverOnlyCommands = [
      "admins add",
      "admins remove",
      "admins list",
      "login",
    ]

    if (serverOnlyCommands.includes(commandName) && !interaction.guild) {
      void interaction.editReply(BotError.serverOnlyCommand().toJSON())

      return
    }

    switch (commandName) {
      case "admins add":
        {
          if (interaction.guild!.ownerId !== interaction.user.id) {
            void interaction.editReply(BotError.userNotOwner().toJSON())

            return
          }

          const user = interaction.options.getUser("user", true)

          const guildDoc = (await db.guilds.findOne({
            id: interaction.guildId!,
          }))!

          if (user.bot) {
            void interaction.editReply(
              new BotError(`${user} is a bot, not a regular user.`).toJSON(),
            )

            return
          }

          if (guildDoc.admins.includes(user.id)) {
            void interaction.editReply(
              new BotError(`${user} already has dashboard access.`).toJSON(),
            )

            return
          }

          guildDoc.admins.push(user.id)
          await guildDoc.save()

          void interaction.editReply(
            `${user} has been granted dashboard access.`,
          )
        }
        break

      case "admins remove":
        {
          if (interaction.guild!.ownerId !== interaction.user.id) {
            void interaction.editReply(BotError.userNotOwner().toJSON())

            return
          }

          const user = interaction.options.getUser("user", true)

          if (user.id === interaction.user.id) {
            void interaction.editReply(
              new BotError(
                "You can't remove yourself from the dashboard.",
              ).toJSON(),
            )

            return
          }

          const guildDoc = (await db.guilds.findOne({
            id: interaction.guildId!,
          }))!

          if (!guildDoc.admins.includes(user.id)) {
            void interaction.editReply(
              new BotError(`${user} does not have dashboard access.`).toJSON(),
            )

            return
          }

          guildDoc.admins.splice(guildDoc.admins.indexOf(user.id), 1)
          await guildDoc.save()

          void interaction.editReply(
            `${user} has had dashboard access revoked.`,
          )
        }
        break

      case "admins list":
        {
          if (interaction.guild!.ownerId !== interaction.user.id) {
            void interaction.editReply(BotError.userNotOwner().toJSON())

            return
          }

          const guildDoc = (await db.guilds.findOne({
            id: interaction.guildId!,
          }))!

          void interaction.editReply({
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

      case "help": {
        void interaction.editReply({
          embeds: [
            new EmbedBuilder()
              .setColor(PhaseColour.Primary)
              .setTitle("Help")
              .setDescription(
                "You can read our docs or ask the team directly using the buttons below!",
              ),
          ],
          components: [
            new ActionRowBuilder<ButtonBuilder>().setComponents(
              new ButtonBuilder()
                .setLabel("Documentation")
                .setStyle(ButtonStyle.Link)
                .setURL(PhaseURL.PhaseDocs),
              new ButtonBuilder()
                .setLabel("Support Discord")
                .setStyle(ButtonStyle.Link)
                .setURL(PhaseURL.PhaseSupport),
            ),
          ],
        })

        break
      }

      case "invite":
        {
          const inviteUrl = (
            await fetch("https://phasebot.xyz/redirect/invite", {
              redirect: "manual",
            })
          ).headers.get("Location")!

          void interaction.editReply({
            embeds: [
              new EmbedBuilder()
                .setColor(PhaseColour.Primary)
                .setTitle("Invite Link")
                .setDescription(
                  `[Click here](${inviteUrl}) to invite the bot to your server.`,
                )
                .setFooter({ text: "Thanks for using Phase! 🤍" }),
            ],
          })
        }
        break

      case "login":
        {
          const guildDoc = await db.guilds.findOne({
            id: interaction.guildId!,
            admins: { $in: interaction.user.id },
          })

          if (!guildDoc) {
            void interaction.editReply(BotError.userNotAdmin().toJSON())

            return
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
        }
        break

      case "ping":
        {
          const commandLatency =
            defferedReply.createdTimestamp - interaction.createdTimestamp
          const apiLatency = interaction.client.ws.ping
          const rebootTimestamp = `<t:${Math.floor(interaction.client.readyTimestamp / 1000)}:R>`

          void interaction.editReply({
            embeds: [
              new EmbedBuilder()
                .setColor(PhaseColour.Primary)
                .setTitle("Pong! 🏓")
                .setDescription(
                  `Command Latency: ${commandLatency}ms\nDiscord API Latency: ${apiLatency}ms\n\nLast Reboot: ${rebootTimestamp}`,
                ),
            ],
          })
        }
        break

      case "report":
        {
          void interaction.editReply({
            embeds: [
              new EmbedBuilder()
                .setColor(PhaseColour.Primary)
                .setTitle("Bug Report")
                .setDescription(
                  `[Click here](https://phasebot.xyz/contact/bug-report) to send a bug report to the developers.`,
                )
                .setFooter({
                  text: "Thanks for taking the time to do this! 🤍",
                }),
            ],
          })
        }
        break
    }
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
