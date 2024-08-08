import { EmbedBuilder } from "discord.js"
import { BotSubcommandBuilder } from "phasebot/builders"

import { ModuleId } from "@repo/config/phase/modules.ts"
import dedent from "dedent"

import { db } from "~/lib/db"
import { PhaseColour } from "~/lib/enums"
import { BotError } from "~/lib/errors"
import { getOrdinal } from "~/lib/utils"

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
      void interaction.reply(BotError.memberNotFound().toJSON())
      return
    }

    const guildSchema = await db.guilds.findOne({ id: interaction.guildId })
    const warningsModule = guildSchema?.modules?.[ModuleId.Warnings]

    if (!warningsModule?.enabled) {
      return void interaction.reply(
        BotError.moduleNotEnabled(ModuleId.Warnings).toJSON(),
      )
    }

    const punishmentLogChannelId =
      guildSchema!.modules![ModuleId.AuditLogs]?.channels.punishments

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
        new BotError("This member has no warnings.").toJSON(),
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
              ? `${member} is now on their **${getOrdinal(memberWarnings.size - 1)}** warning.`
              : `${member} now has no warnings.`,
          ),
      ],
    })

    if (punishmentLogChannel) {
      void punishmentLogChannel.send({
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
    }
  })
