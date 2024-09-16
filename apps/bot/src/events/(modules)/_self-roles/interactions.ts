import { GuildMember } from "discord.js"
import { BotEventBuilder } from "phasebot/builders"

import { ModuleId } from "@repo/config/phase/modules.ts"

import { BotError } from "~/lib/errors"

import type { UUID } from "node:crypto"

type MethodType = "reaction" | "button" | "dropdown"
type CustomIdParts = ["selfroles", UUID, MethodType, UUID]

const methodNotFoundError = new BotError(
  "The self role method associated with this component no longer exists.",
).toJSON()

export default new BotEventBuilder()
  .setName("interactionCreate")
  .setExecute(async (client, interaction) => {
    if (!interaction.inGuild()) return
    if (!interaction.isMessageComponent()) return
    if (!interaction.customId.startsWith("selfroles")) return

    const guildDoc = client.store.guilds.get(interaction.guildId)
    const moduleConfig = guildDoc?.modules?.[ModuleId.SelfRoles]

    if (!moduleConfig?.enabled) {
      return void interaction.reply(
        BotError.moduleNotEnabled(ModuleId.SelfRoles).toJSON(),
      )
    }

    const customIdParts = interaction.customId.split(".") as CustomIdParts

    const messageId = customIdParts[1]
    const methodId = customIdParts[3]

    const message = moduleConfig.messages.find(({ id }) => id === messageId)
    const method = message?.methods.find(({ id }) => id === methodId)

    if (!message || !method) {
      return void interaction.reply(methodNotFoundError)
    }

    const member =
      interaction.member instanceof GuildMember
        ? interaction.member
        : await interaction.guild!.members.fetch(interaction.user.id)

    const updateRoles = (roles: { id: string; action: "add" | "remove" }[]) => {
      const rolesToAdd = roles.filter((role) => role.action === "add")
      const rolesToRemove = roles.filter((role) => role.action === "remove")

      if (rolesToAdd.length) {
        member.roles.add(rolesToAdd.map(({ id }) => id)).catch(() => null)
      }

      if (rolesToRemove.length) {
        member.roles.remove(rolesToRemove.map(({ id }) => id)).catch(() => null)
      }
    }

    switch (method.type) {
      case "button": {
        if (!interaction.isButton()) {
          return void interaction.reply(methodNotFoundError)
        }

        updateRoles(method.roles)

        return void interaction.deferUpdate()
      }

      case "dropdown": {
        if (!interaction.isStringSelectMenu()) {
          return void interaction.reply(methodNotFoundError)
        }

        const roles = method.options.reduce(
          (acc, option) =>
            interaction.values.includes(option.id)
              ? [...acc, ...option.roles]
              : acc,
          [] as (typeof method.options)[number]["roles"],
        )

        updateRoles(roles)

        return void interaction.deferUpdate()
      }

      default: {
        return void interaction.reply(methodNotFoundError)
      }
    }
  })
