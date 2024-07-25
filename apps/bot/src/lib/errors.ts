import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  EmbedBuilder,
  PermissionFlagsBits,
} from "discord.js"

import { env } from "~/lib/env"

import type { GuildModules } from "~/lib/db"

type BotErrorMessage =
  | string
  | {
      title?: string
      description?: string
      footer?: string
      buttons?: {
        bugReport: {
          url: string
        }
      }
    }

class BotErrorClass {
  public message: BotErrorMessage = "An error occurred."
  public ephemeral: boolean = true

  constructor(message?: BotErrorMessage, ephemeral?: boolean) {
    if (message) this.message = message
    if (ephemeral) this.ephemeral = ephemeral
  }

  toJSON() {
    if (typeof this.message === "string") {
      return {
        content: this.message,
        ephemeral: this.ephemeral,
      }
    } else {
      const embed = new EmbedBuilder()
        .setColor("Red")
        .setTitle(this.message.title ?? null)
        .setDescription(this.message.description ?? null)
        .setFooter(this.message.footer ? { text: this.message.footer } : null)

      const components = this.message.buttons?.bugReport
        ? [
            new ActionRowBuilder<ButtonBuilder>().setComponents(
              new ButtonBuilder()
                .setURL(this.message.buttons?.bugReport.url)
                .setLabel("Report a Bug")
                .setStyle(ButtonStyle.Link)
                .setEmoji("📩"),
            ),
          ]
        : []

      return {
        embeds: [embed],
        components,
        ephemeral: this.ephemeral,
      }
    }
  }
}

export const BotError = Object.assign(BotErrorClass, {
  userMissingPermission: (permission?: keyof typeof PermissionFlagsBits) =>
    new BotErrorClass({
      title: "Missing permissions",
      description: `You do not have the ${
        permission
          ? `permission **\`"${permission
              .replace(/([A-Z])/g, "_$1")
              .trimStart()
              .toUpperCase()}"\`** permission, which is required`
          : `required permissions`
      } to do this.`,
    }),
  userNotAdmin: () =>
    new BotErrorClass({
      title: "Missing permissions",
      description: `Only dashboard admins can use this command. To become a dashboard admin, ask the server owner to run the \`/bot admins add\` command.`,
    }),
  userNotOwner: () =>
    new BotErrorClass({
      title: "Missing permissions",
      description: `Only the server owner can use this command.`,
    }),
  memberNotFound: () =>
    new BotErrorClass({
      title: "Member not found",
      description: "Make sure they are in this server, then try again.",
    }),
  moduleNotEnabled: (module: keyof GuildModules) =>
    new BotErrorClass({
      title: "Module not enabled",
      description: `The \`${module.replace(/([A-Z])/g, " $1").trimStart()}\` module is not enabled, which is required to use this command.`,
    }),
  botMissingPermission: (
    permission?: keyof typeof PermissionFlagsBits,
    channelSpecific?: boolean,
  ) =>
    new BotErrorClass({
      title: "Missing permissions",
      description: `I do not have the ${
        permission
          ? `**\`"${permission
              .replace(/([A-Z])/g, "_$1")
              .trimStart()
              .toUpperCase()}"\`** permission ${channelSpecific ? "in this channel" : ""}, which is required`
          : `required permissions ${channelSpecific ? "in this channel" : ""}`
      } to do this.`,
    }),

  serverOnlyCommand: () =>
    new BotError("This command can only be used in servers."),
  unknown: (data: Parameters<typeof generateBugReportURL>[0]) =>
    new BotErrorClass({
      title: "Unknown error",
      description: `Something went wrong, and we don't know why. To make sure this doesn't happen again, please press the button below to send a bug report to the developers.`,
      footer: `The report has been filled in for you, so all you have to do is send it.`,
      buttons: {
        bugReport: {
          url: generateBugReportURL(data),
        },
      },
    }),
})

const generateBugReportURL = (data: {
  error: Error
  commandName?: string
  moduleName?: string
  guildId?: string
  channelId?: string
}) => {
  const url = new URL(
    `${env.NODE_ENV !== "production" ? "http://localhost:3000" : "https://phasebot.xyz"}/contact/bug-report`,
  )

  const message =
    (data.commandName ?? data.moduleName)
      ? `An error occurred while running the ${data.commandName ? `\`/${data.commandName}\` command` : `\`${data.moduleName}\` module`}.`
      : "An error occurred."

  if (data.guildId) url.searchParams.set("guildId", data.guildId)
  if (data.channelId) url.searchParams.set("channelId", data.channelId)

  url.searchParams.set("subject", `Unknown error: "${data.error.message}"`)
  url.searchParams.set("urgency", "low")
  url.searchParams.set("body", `${message}\n\n\`\`\`${data.error.stack}\`\`\``)

  return url.toString()
}
