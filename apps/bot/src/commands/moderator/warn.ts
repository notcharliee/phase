import { EmbedBuilder, GuildMember, GuildTextBasedChannel } from "discord.js"
import { BotCommandBuilder } from "phasebot/builders"

import { db } from "~/lib/db"
import { PhaseColour } from "~/lib/enums"
import {
  errorMessage,
  getOrdinal,
  memberNotFound,
  moduleNotEnabled,
} from "~/lib/utils"

export default new BotCommandBuilder()
  .setName("warn")
  .setDescription("Warn a member.")
  .setDMPermission(false)
  .addSubcommand((subcommand) =>
    subcommand
      .setName("add")
      .setDescription("Add a warning.")
      .addUserOption((option) =>
        option
          .setName("member")
          .setDescription("Who to warn.")
          .setRequired(true),
      )
      .addStringOption((option) =>
        option
          .setName("reason")
          .setDescription("Add a reason.")
          .setRequired(false),
      ),
  )
  .addSubcommand((subcommand) =>
    subcommand
      .setName("remove")
      .setDescription("Remove a warning.")
      .addUserOption((option) =>
        option
          .setName("member")
          .setDescription("Who to unwarn.")
          .setRequired(true),
      )
      .addStringOption((option) =>
        option
          .setName("reason")
          .setDescription("Add a reason.")
          .setRequired(false),
      ),
  )
  .setExecute(async (interaction) => {
    const member = interaction.options.getMember("member") as GuildMember | null
    const reason = interaction.options.getString("reason", false) ?? undefined

    if (!member) {
      return interaction.reply(memberNotFound(true))
    }

    const guildSchema = await db.guilds.findOne({ id: interaction.guildId })

    const warningsModule = guildSchema?.modules?.Warnings

    if (!warningsModule || !warningsModule.enabled) {
      return interaction.reply(moduleNotEnabled("Warnings"))
    }

    const warningsLogChannelId =
      guildSchema?.modules?.AuditLogs?.channels.punishments

    switch (interaction.options.getSubcommand()) {
      case "add":
        {
          const memberWarnings = member.roles.cache.filter((role) =>
            warningsModule.warnings.includes(role.id),
          )

          if (memberWarnings.size === warningsModule.warnings.length) {
            return interaction.reply(
              errorMessage({
                title: "Failed to warn",
                description:
                  "The member is already on their final warning and cannot be warned again.",
                ephemeral: true,
              }),
            )
          }

          member.roles.add(warningsModule.warnings[memberWarnings.size], reason)

          interaction.reply({
            embeds: [
              new EmbedBuilder()
                .setTitle("Member warned")
                .setDescription(
                  `${member} is now on their ${memberWarnings.size + 1 !== warningsModule.warnings.length ? getOrdinal(memberWarnings.size + 1) : "**final**"} warning.`,
                )
                .setColor(PhaseColour.Primary),
            ],
          })

          if (warningsLogChannelId) {
            const logChannel = interaction.client.channels.cache.get(
              warningsLogChannelId,
            ) as GuildTextBasedChannel | undefined

            if (!logChannel) return

            logChannel.send({
              embeds: [
                new EmbedBuilder()
                  .setTitle("Member Warned")
                  .setDescription(
                    `**Member:** ${member}\n**Mod:** ${interaction.member}\n**Warning:** ${memberWarnings.size + 1}/${warningsModule.warnings.length}\n\n**Reason:** ${reason ?? "None"}`,
                  )
                  .setColor(PhaseColour.Primary),
              ],
            })
          }
        }
        break

      case "remove":
        {
          const memberWarnings = member.roles.cache.filter((role) =>
            warningsModule.warnings.includes(role.id),
          )

          if (memberWarnings.size === 0) {
            return interaction.reply(
              errorMessage({
                title: "Failed to warn",
                description: "The member has no warnings.",
                ephemeral: true,
              }),
            )
          }

          member.roles.remove(
            warningsModule.warnings[memberWarnings.size - 1],
            reason,
          )

          interaction.reply({
            embeds: [
              new EmbedBuilder()
                .setTitle("Member unwarned")
                .setDescription(
                  memberWarnings.size - 1 !== 0
                    ? `${member} is now on their ${getOrdinal(memberWarnings.size - 1)} warning.`
                    : `${member} now has 0 warnings.`,
                )
                .setColor(PhaseColour.Primary),
            ],
          })

          if (warningsLogChannelId) {
            const logChannel = interaction.client.channels.cache.get(
              warningsLogChannelId,
            ) as GuildTextBasedChannel | undefined

            if (!logChannel) return

            logChannel.send({
              embeds: [
                new EmbedBuilder()
                  .setTitle("Member Unwarned")
                  .setDescription(
                    `**Member:** ${member}\n**Mod:** ${interaction.member}\n**Warning:** ${memberWarnings.size - 1}/${warningsModule.warnings.length}\n\n**Reason:** ${reason ?? "None"}`,
                  )
                  .setColor(PhaseColour.Primary),
              ],
            })
          }
        }
        break
    }
  })
