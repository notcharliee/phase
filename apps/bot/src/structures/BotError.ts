import { moduleDefinitions } from "@repo/utils/modules"
import { constantCase } from "change-case"

import { CustomMessageBuilder } from "~/lib/builders/message"

import type { ModuleId } from "@repo/utils/modules"
import type { ChannelTypeName } from "~/types/utils"
import type { APIEmbed, ChannelType, PermissionFlagsBits } from "discord.js"

export class BotErrorMessage extends CustomMessageBuilder {
  readonly ephemeral: boolean

  constructor(
    message?: string | Pick<APIEmbed, "title" | "description" | "footer">,
    ephemeral = true,
  ) {
    super()

    if (message) {
      if (typeof message === "string") {
        this.setContent(message)
      } else {
        this.setEmbeds((embed) => {
          return embed
            .setColor("Red")
            .setTitle(message.title ?? null)
            .setDescription(message.description ?? null)
            .setFooter(message.footer ?? null)
        })
      }
    }

    this.ephemeral = ephemeral
  }

  setEphemeral(ephemeral: boolean) {
    Reflect.set(this, "ephemeral", ephemeral)
    return this
  }

  static userMissingPermission(permission?: keyof typeof PermissionFlagsBits) {
    return new this({
      title: "Missing permissions",
      description: `You do not have the ${
        permission
          ? `**\`"${constantCase(permission)}"\`** permission, which is required`
          : `required permissions`
      } to do this.`,
    })
  }

  static userNotAdmin(type: "command" | "button" | "action" = "command") {
    return new this(
      `Only the server admins can ${type === "action" ? "perform this action" : `use this ${type}`}.`,
    )
  }

  static userNotBotAdmin(type: "command" | "button" | "action" = "command") {
    return new this(
      `Only the Phase admins can ${type === "action" ? "perform this action" : `use this ${type}`}.`,
    )
  }

  static userNotOwner(type: "command" | "button" | "action" = "command") {
    return new this(
      `Only the server owner can ${type === "action" ? "perform this action" : `use this ${type}`}.`,
    )
  }

  static memberNotFound() {
    return new this({
      title: "Member not found",
      description: "Make sure they are in this server, then try again.",
    })
  }

  static moduleNotEnabled(moduleId: ModuleId) {
    return new this({
      title: "Module not enabled",
      description: `The \`${moduleDefinitions[moduleId].name.replace(/([A-Z])/g, " $1").trimStart()}\` module is not enabled, which is required to use this command.`,
    })
  }

  static moduleNotConfigured(moduleId: ModuleId) {
    return new this({
      title: "Module not configured",
      description: `The \`${moduleDefinitions[moduleId].name.replace(/([A-Z])/g, " $1").trimStart()}\` module is not configured.`,
    })
  }

  static botMissingPermission(
    permission?: keyof typeof PermissionFlagsBits,
    channelSpecific?: boolean,
  ) {
    return new this({
      title: "Missing permissions",
      description: `I do not have the ${
        permission
          ? `**\`"${constantCase(permission)}"\`** permission ${channelSpecific ? "in this channel" : ""}, which is required`
          : `required permissions ${channelSpecific ? "in this channel" : ""}`
      } to do this.`,
    })
  }

  static serverOnlyCommand() {
    return new this("This command can only be used in servers.")
  }

  static specificChannelOnlyCommand(
    channelType: ChannelTypeName<
      keyof Omit<typeof ChannelType, "DM" | "GroupDM" | "GuildCategory">
    >,
  ) {
    return new this(
      `This command can only be used ${channelType.endsWith("voice") ? "when you're in a" : "in"} ${channelType + (channelType.endsWith("thread") ? "s" : channelType.endsWith("voice") ? " channel" : " channels")}.`,
    )
  }

  static unknown(data: Parameters<typeof generateBugReportURL>[0]) {
    return new this({
      title: "Unknown error",
      description: `Something went wrong, and we don't know why. To make sure this doesn't happen again, please [send this bug report](${generateBugReportURL(data)}).`,
      footer: {
        text: `The report has been filled in for you, so all you have to do is send it.`,
      },
    })
  }
}

function generateBugReportURL(data: {
  error: Error
  commandName?: string
  moduleName?: string
  guildId?: string
  channelId?: string
}) {
  const url = new URL("https://phasebot.xyz/contact/bug-report")

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
