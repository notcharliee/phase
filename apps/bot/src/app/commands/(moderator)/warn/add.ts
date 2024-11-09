import { EmbedBuilder } from "discord.js"
import { BotSubcommandBuilder } from "phasebot/builders"

import { ModuleId } from "@repo/utils/modules"
import dedent from "dedent"

import { PhaseColour } from "~/lib/enums"
import { numberToOrdinal } from "~/lib/utils/formatting"

import { BotErrorMessage } from "~/structures/BotError"

import type { GuildMember, GuildTextBasedChannel } from "discord.js"

export default new BotSubcommandBuilder()
  .setName("add")
  .setDescription("Warns a member.")
  .addUserOption((option) =>
    option.setName("member").setDescription("Who to warn.").setRequired(true),
  )
  .addStringOption((option) =>
    option.setName("reason").setDescription("Add a reason.").setRequired(false),
  )
  .setExecute(async (interaction) => {
    const member = interaction.options.getMember("member") as GuildMember | null
    const reason = interaction.options.getString("reason", false) ?? undefined

    if (!member) {
      void interaction.reply(BotErrorMessage.memberNotFound().toJSON())
      return
    }

    const guildDoc = interaction.client.stores.guilds.get(interaction.guildId!)
    const warningsModule = guildDoc?.modules?.[ModuleId.Warnings]

    if (!warningsModule?.enabled) {
      return void interaction.reply(
        BotErrorMessage.moduleNotEnabled(ModuleId.Warnings).toJSON(),
      )
    }

    const punishmentLogChannelId =
      guildDoc!.modules![ModuleId.AuditLogs]?.channels.punishments

    const punishmentLogChannel = punishmentLogChannelId
      ? (interaction.client.channels.cache.get(punishmentLogChannelId) as
          | GuildTextBasedChannel
          | undefined)
      : undefined

    const memberWarnings = member.roles.cache.filter((role) =>
      warningsModule.warnings.includes(role.id),
    )

    if (memberWarnings.size === warningsModule.warnings.length) {
      void interaction.reply(
        new BotErrorMessage(
          "This member is already on their final warning.",
        ).toJSON(),
      )

      return
    }

    void member.roles.add(warningsModule.warnings[memberWarnings.size]!, reason)

    void interaction.reply({
      embeds: [
        new EmbedBuilder()
          .setColor(PhaseColour.Primary)
          .setTitle("Member warned")
          .setDescription(
            `<@${member.id}> is now on their **${memberWarnings.size + 1 !== warningsModule.warnings.length ? numberToOrdinal(memberWarnings.size + 1) : "final"}** warning.`,
          ),
      ],
    })

    if (punishmentLogChannel) {
      void punishmentLogChannel
        .send({
          embeds: [
            new EmbedBuilder()
              .setColor(PhaseColour.Primary)
              .setTitle("Member Warned")
              .setDescription(
                dedent`
                **Member:** ${member}
                **Mod:** ${interaction.member}
                **Warning:** ${memberWarnings.size + 1}/${warningsModule.warnings.length}
                
                **Reason:** ${reason ?? "None"}
              `,
              )
              .setTimestamp(),
          ],
        })
        .catch(() => null)
    }
  })
