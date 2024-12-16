import { BotEventBuilder } from "@phasejs/builders"
import {
  ActionRowBuilder,
  ModalBuilder,
  TextInputBuilder,
  TextInputStyle,
} from "discord.js"

import { db } from "~/lib/db"

export default new BotEventBuilder()
  .setName("interactionCreate")
  .setExecute(async (_, interaction) => {
    if (
      !("customId" in interaction) ||
      !interaction.customId.startsWith("phase")
    ) {
      return
    }

    const statusModal = new ModalBuilder()
      .setCustomId("phase.status.submit")
      .setTitle("Change Status")
      .setComponents([
        new ActionRowBuilder<TextInputBuilder>().setComponents([
          new TextInputBuilder()
            .setCustomId("phase.status.submit.type")
            .setLabel("Status Type")
            .setPlaceholder("Example: online | idle | dnd")
            .setStyle(TextInputStyle.Short)
            .setRequired(true),
        ]),
        new ActionRowBuilder<TextInputBuilder>().setComponents([
          new TextInputBuilder()
            .setCustomId("phase.status.submit.text")
            .setLabel("Status Text")
            .setPlaceholder("Example: 🔗 phasebot.xyz")
            .setStyle(TextInputStyle.Short)
            .setRequired(true),
        ]),
      ])

    switch (interaction.customId) {
      case "phase.status": {
        if (!interaction.isButton()) return
        await interaction.showModal(statusModal)
        return
      }
      case "phase.status.submit": {
        if (!interaction.isModalSubmit()) return

        const type = interaction.fields.getTextInputValue(
          "phase.status.submit.type",
        )
        const text = interaction.fields.getTextInputValue(
          "phase.status.submit.text",
        )

        if (!["online", "idle", "dnd"].includes(type)) {
          return void interaction.reply({
            content: "Invalid status type",
            ephemeral: true,
          })
        }

        await db.configs.findOneAndUpdate(
          {},
          { $set: { status: { type, text } } },
        )

        return void interaction.reply({
          content: "Status updated successfully!",
          ephemeral: true,
        })
      }
    }
  })
