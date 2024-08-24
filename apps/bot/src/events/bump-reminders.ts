import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  EmbedBuilder,
} from "discord.js"
import { BotEventBuilder } from "phasebot/builders"

import { ModuleId } from "@repo/config/phase/modules.ts"

import { cache } from "~/lib/cache"
import { db } from "~/lib/db"
import { PhaseColour } from "~/lib/enums"
import { BotError } from "~/lib/errors"

export default new BotEventBuilder()
  .setName("messageCreate")
  .setExecute(async (_, message) => {
    if (message.interaction?.commandName !== "bump") return

    const guildDoc = await cache.guilds.get(message.guildId!)
    const moduleConfig = guildDoc?.modules?.[ModuleId.BumpReminders]

    if (!guildDoc || !moduleConfig?.enabled) return

    const reminder = await db.reminders.create({
      name: "Bump Reminder",
      guild: message.guildId,
      channel: message.channelId,
      content: moduleConfig.reminderMessage,
      delay: moduleConfig.time,
      mention: `${message.interaction.user}`,
    })

    const reply = await message.reply({
      embeds: [
        new EmbedBuilder()
          .setColor(PhaseColour.Primary)
          .setTitle("Bump Reminder")
          .setDescription(moduleConfig.initialMessage)
          .setFooter({
            text: "Cancellation window will close after 1 minute.",
          }),
      ],
      components: [
        new ActionRowBuilder<ButtonBuilder>().addComponents(
          new ButtonBuilder()
            .setCustomId(`bump-reminder.cancel`)
            .setLabel("Cancel Reminder")
            .setStyle(ButtonStyle.Danger),
        ),
      ],
    })

    reply
      .createMessageComponentCollector({
        filter: (interaction) => {
          return (
            interaction.isButton() &&
            interaction.customId === `bump-reminder.cancel`
          )
        },
        time: 60_000,
      })
      .on("collect", async (interaction) => {
        await interaction.deferReply({
          ephemeral: true,
        })

        if (interaction.user.id !== message.interaction?.user.id) {
          return void interaction.editReply(
            new BotError("You can't cancel someone else's reminder.").toJSON(),
          )
        }

        void reminder.deleteOne()

        void reply.edit({
          embeds: reply.embeds,
          components: [
            new ActionRowBuilder<ButtonBuilder>().addComponents(
              new ButtonBuilder()
                .setCustomId(`bumpreminder.cancel.${message.author.id}`)
                .setLabel("Cancel Reminder")
                .setStyle(ButtonStyle.Danger)
                .setDisabled(true),
            ),
          ],
        })

        void interaction.editReply("Your reminder has been cancelled.")
      })
      .on("end", (collected) => {
        if (collected.size !== 0) return

        const updatedEmbed = new EmbedBuilder(
          reply.embeds[0]!.toJSON(),
        ).setFooter({ text: "Cancellation window has closed." })

        void reply.edit({
          embeds: [updatedEmbed],
          components: [
            new ActionRowBuilder<ButtonBuilder>().addComponents(
              new ButtonBuilder()
                .setCustomId(`bump-reminder.cancel`)
                .setLabel("Cancel Reminder")
                .setStyle(ButtonStyle.Danger)
                .setDisabled(true),
            ),
          ],
        })
      })
  })
