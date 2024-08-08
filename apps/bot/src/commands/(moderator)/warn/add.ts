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

    if (memberWarnings.size === warningsModule.warnings.length) {
      void interaction.reply(
        new BotError("This member is already on their final warning.").toJSON(),
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
            `${member} is now on their **${memberWarnings.size + 1 !== warningsModule.warnings.length ? getOrdinal(memberWarnings.size + 1) : "final"}** warning.`,
          ),
      ],
    })

    if (punishmentLogChannel) {
      void punishmentLogChannel.send({
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
    }
  })
