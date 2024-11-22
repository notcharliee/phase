import { EmbedBuilder } from "discord.js"
import { BotSubcommandBuilder } from "@phasejs/core/builders"

import { ModuleId } from "@repo/utils/modules"
import dedent from "dedent"

import { PhaseColour } from "~/lib/enums"
import { numberToOrdinal } from "~/lib/utils/formatting"

import { BotErrorMessage } from "~/structures/BotError"

import type { GuildMember, GuildTextBasedChannel } from "discord.js"

export default new BotSubcommandBuilder()
  .setName("remove")
  .setDescription("Unwarns a member.")
  .addUserOption((option) =>
    option.setName("member").setDescription("Who to unwarn.").setRequired(true),
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

    if (memberWarnings.size === 0) {
      void interaction.reply(
        new BotErrorMessage("This member has no warnings.").toJSON(),
      )

      return
    }

    void member.roles.remove(
      warningsModule.warnings[memberWarnings.size - 1]!,
      reason,
    )

    void interaction.reply({
      embeds: [
        new EmbedBuilder()
          .setColor(PhaseColour.Primary)
          .setTitle("Member unwarned")
          .setDescription(
            memberWarnings.size - 1 !== 0
              ? `<@${member.id}> is now on their **${numberToOrdinal(memberWarnings.size - 1)}** warning.`
              : `<@${member.id}> now has no warnings.`,
          ),
      ],
    })

    if (punishmentLogChannel) {
      void punishmentLogChannel
        .send({
          embeds: [
            new EmbedBuilder()
              .setColor(PhaseColour.Primary)
              .setTitle("Member Unwarned")
              .setDescription(
                dedent`
                **Member:** ${member}
                **Mod:** ${interaction.member}
                **Warning:** ${memberWarnings.size - 1}/${warningsModule.warnings.length}
                
                **Reason:** ${reason ?? "None"}
              `,
              )
              .setTimestamp(),
          ],
        })
        .catch(() => null)
    }
  })
