import { BotEventBuilder } from "phasebot/builders"

import { BotError } from "~/lib/errors"

import type { Team } from "discord.js"

export default new BotEventBuilder()
  .setName("interactionCreate")
  .setExecute(async (client, interaction) => {
    if (!interaction.isButton() || !interaction.customId.startsWith("phase.")) {
      return
    }

    const botTeamMembers = Array.from(
      (client.application!.owner as Team).members.keys(),
    )

    if (!botTeamMembers.includes(interaction.user.id)) {
      void interaction.reply(BotError.userNotBotAdmin("button").toJSON())
      return
    }

    const [, category, id, action] = interaction.customId.split(".")

    if (category === "guilds" && action === "remove_bot") {
      const guild =
        client.guilds.cache.get(id) ?? (await client.guilds.fetch(id))

      void guild.leave()
    } else {
      void interaction.reply(new BotError("Unknown button").toJSON())
    }
  })
