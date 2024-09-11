import {
  AuditLogEvent,
  AutoModerationRuleEventType,
  AutoModerationRuleTriggerType,
  ChannelType,
  EmbedBuilder,
  GuildDefaultMessageNotifications,
  GuildExplicitContentFilter,
  GuildMFALevel,
  GuildScheduledEventEntityType,
  GuildScheduledEventStatus,
  GuildVerificationLevel,
  IntegrationExpireBehavior,
  PermissionsBitField,
  StageInstancePrivacyLevel,
  StickerFormatType,
} from "discord.js"
import { BotEventBuilder } from "phasebot/builders"

import { ModuleId } from "@repo/config/phase/modules.ts"
import { capitalCase } from "change-case"
import dedent from "dedent"
import ms from "ms"

import { cache } from "~/lib/cache"
import { PhaseColour } from "~/lib/enums"
import { dateToTimestamp, truncateString, wrapText } from "~/lib/utils"

import type { GuildModules } from "~/lib/db"
import type {
  APIEmbedField,
  APIGuildForumDefaultReactionEmoji,
  APIGuildForumTag,
  APIOverwrite,
  APIRole,
  AuditLogOptionsType,
  AuditLogRuleTriggerType,
  GuildAuditLogsActionType,
  GuildAuditLogsEntryTargetField,
  GuildAuditLogsTargetType,
  GuildEmoji,
  GuildMember,
  GuildTextBasedChannel,
  Role,
  StageChannel,
  VoiceBasedChannel,
} from "discord.js"

/**
 * Maps audit log events to their corresponding category names in the dashboard.
 */
const AuditLogCategories: Record<
  AuditLogEvent,
  keyof GuildModules[ModuleId.AuditLogs]["channels"]
> = {
  [AuditLogEvent.GuildUpdate]: "server",
  [AuditLogEvent.ChannelCreate]: "server",
  [AuditLogEvent.ChannelUpdate]: "server",
  [AuditLogEvent.ChannelDelete]: "server",
  [AuditLogEvent.ChannelOverwriteCreate]: "server",
  [AuditLogEvent.ChannelOverwriteUpdate]: "server",
  [AuditLogEvent.ChannelOverwriteDelete]: "server",
  [AuditLogEvent.MemberKick]: "punishments",
  [AuditLogEvent.MemberPrune]: "members",
  [AuditLogEvent.MemberBanAdd]: "punishments",
  [AuditLogEvent.MemberBanRemove]: "punishments",
  [AuditLogEvent.MemberUpdate]: "members",
  [AuditLogEvent.MemberRoleUpdate]: "members",
  [AuditLogEvent.MemberMove]: "voice",
  [AuditLogEvent.MemberDisconnect]: "voice",
  [AuditLogEvent.BotAdd]: "members",
  [AuditLogEvent.RoleCreate]: "server",
  [AuditLogEvent.RoleUpdate]: "server",
  [AuditLogEvent.RoleDelete]: "server",
  [AuditLogEvent.InviteCreate]: "invites",
  [AuditLogEvent.InviteUpdate]: "invites",
  [AuditLogEvent.InviteDelete]: "invites",
  [AuditLogEvent.WebhookCreate]: "server",
  [AuditLogEvent.WebhookUpdate]: "server",
  [AuditLogEvent.WebhookDelete]: "server",
  [AuditLogEvent.EmojiCreate]: "server",
  [AuditLogEvent.EmojiUpdate]: "server",
  [AuditLogEvent.EmojiDelete]: "server",
  [AuditLogEvent.MessageDelete]: "messages",
  [AuditLogEvent.MessageBulkDelete]: "messages",
  [AuditLogEvent.MessagePin]: "messages",
  [AuditLogEvent.MessageUnpin]: "messages",
  [AuditLogEvent.IntegrationCreate]: "server",
  [AuditLogEvent.IntegrationUpdate]: "server",
  [AuditLogEvent.IntegrationDelete]: "server",
  [AuditLogEvent.StageInstanceCreate]: "voice",
  [AuditLogEvent.StageInstanceUpdate]: "voice",
  [AuditLogEvent.StageInstanceDelete]: "voice",
  [AuditLogEvent.StickerCreate]: "server",
  [AuditLogEvent.StickerUpdate]: "server",
  [AuditLogEvent.StickerDelete]: "server",
  [AuditLogEvent.GuildScheduledEventCreate]: "server",
  [AuditLogEvent.GuildScheduledEventUpdate]: "server",
  [AuditLogEvent.GuildScheduledEventDelete]: "server",
  [AuditLogEvent.ThreadCreate]: "server",
  [AuditLogEvent.ThreadUpdate]: "server",
  [AuditLogEvent.ThreadDelete]: "server",
  [AuditLogEvent.ApplicationCommandPermissionUpdate]: "server",
  [AuditLogEvent.AutoModerationRuleCreate]: "server",
  [AuditLogEvent.AutoModerationRuleUpdate]: "server",
  [AuditLogEvent.AutoModerationRuleDelete]: "server",
  [AuditLogEvent.AutoModerationBlockMessage]: "messages",
  [AuditLogEvent.AutoModerationFlagToChannel]: "server",
  [AuditLogEvent.AutoModerationUserCommunicationDisabled]: "punishments",
  [AuditLogEvent.CreatorMonetizationRequestCreated]: "server",
  [AuditLogEvent.CreatorMonetizationTermsAccepted]: "server",
  [AuditLogEvent.OnboardingPromptCreate]: "server",
  [AuditLogEvent.OnboardingPromptUpdate]: "server",
  [AuditLogEvent.OnboardingPromptDelete]: "server",
  [AuditLogEvent.OnboardingCreate]: "server",
  [AuditLogEvent.OnboardingUpdate]: "server",
}

/**
 * Maps audit log events to their corresponding embed titles.
 */
// prettier-ignore
const AuditLogTitles: Record<AuditLogEvent, string> = {
  [AuditLogEvent.GuildUpdate]: "Server Updated",
  [AuditLogEvent.ChannelCreate]: "Channel Created",
  [AuditLogEvent.ChannelUpdate]: "Channel Updated",
  [AuditLogEvent.ChannelDelete]: "Channel Deleted",
  [AuditLogEvent.ChannelOverwriteCreate]: "Channel Overwrite Created",
  [AuditLogEvent.ChannelOverwriteUpdate]: "Channel Overwrite Updated",
  [AuditLogEvent.ChannelOverwriteDelete]: "Channel Overwrite Deleted",
  [AuditLogEvent.MemberKick]: "Member Kicked",
  [AuditLogEvent.MemberPrune]: "Member Pruned",
  [AuditLogEvent.MemberBanAdd]: "Member Banned",
  [AuditLogEvent.MemberBanRemove]: "Member Unbanned",
  [AuditLogEvent.MemberUpdate]: "Member Updated",
  [AuditLogEvent.MemberRoleUpdate]: "Member Roles Updated",
  [AuditLogEvent.MemberMove]: "Member Moved",
  [AuditLogEvent.MemberDisconnect]: "Member Disconnected",
  [AuditLogEvent.BotAdd]: "Bot Added",
  [AuditLogEvent.RoleCreate]: "Role Created",
  [AuditLogEvent.RoleUpdate]: "Role Updated",
  [AuditLogEvent.RoleDelete]: "Role Deleted",
  [AuditLogEvent.InviteCreate]: "Invite Created",
  [AuditLogEvent.InviteUpdate]: "Invite Updated",
  [AuditLogEvent.InviteDelete]: "Invite Deleted",
  [AuditLogEvent.WebhookCreate]: "Webhook Created",
  [AuditLogEvent.WebhookUpdate]: "Webhook Updated",
  [AuditLogEvent.WebhookDelete]: "Webhook Deleted",
  [AuditLogEvent.EmojiCreate]: "Emoji Created",
  [AuditLogEvent.EmojiUpdate]: "Emoji Updated",
  [AuditLogEvent.EmojiDelete]: "Emoji Deleted",
  [AuditLogEvent.MessageDelete]: "Message Deleted",
  [AuditLogEvent.MessageBulkDelete]: "Messages Bulk Deleted",
  [AuditLogEvent.MessagePin]: "Message Pinned",
  [AuditLogEvent.MessageUnpin]: "Message Unpinned",
  [AuditLogEvent.IntegrationCreate]: "Integration Created",
  [AuditLogEvent.IntegrationUpdate]: "Integration Updated",
  [AuditLogEvent.IntegrationDelete]: "Integration Deleted",
  [AuditLogEvent.StageInstanceCreate]: "Stage Instance Created",
  [AuditLogEvent.StageInstanceUpdate]: "Stage Instance Updated",
  [AuditLogEvent.StageInstanceDelete]: "Stage Instance Deleted",
  [AuditLogEvent.StickerCreate]: "Sticker Created",
  [AuditLogEvent.StickerUpdate]: "Sticker Updated",
  [AuditLogEvent.StickerDelete]: "Sticker Deleted",
  [AuditLogEvent.GuildScheduledEventCreate]: "Scheduled Event Created",
  [AuditLogEvent.GuildScheduledEventUpdate]: "Scheduled Event Updated",
  [AuditLogEvent.GuildScheduledEventDelete]: "Scheduled Event Deleted",
  [AuditLogEvent.ThreadCreate]: "Thread Created",
  [AuditLogEvent.ThreadUpdate]: "Thread Updated",
  [AuditLogEvent.ThreadDelete]: "Thread Deleted",
  [AuditLogEvent.ApplicationCommandPermissionUpdate]: "Bot Command Updated",
  [AuditLogEvent.AutoModerationRuleCreate]: "Automod Rule Created",
  [AuditLogEvent.AutoModerationRuleUpdate]: "Automod Rule Updated",
  [AuditLogEvent.AutoModerationRuleDelete]: "Automod Rule Deleted",
  [AuditLogEvent.AutoModerationBlockMessage]: "Automod Blocked Message",
  [AuditLogEvent.AutoModerationFlagToChannel]: "Automod Flagged Message",
  [AuditLogEvent.AutoModerationUserCommunicationDisabled]: "Automod Timed Out Member",
  [AuditLogEvent.CreatorMonetizationRequestCreated]: "Creator Monetization Request Created",
  [AuditLogEvent.CreatorMonetizationTermsAccepted]: "Creator Monetization Terms Accepted",
  [AuditLogEvent.OnboardingPromptCreate]: "Onboarding Prompt Created",
  [AuditLogEvent.OnboardingPromptUpdate]: "Onboarding Prompt Updated",
  [AuditLogEvent.OnboardingPromptDelete]: "Onboarding Prompt Deleted",
  [AuditLogEvent.OnboardingCreate]: "Onboarding Created",
  [AuditLogEvent.OnboardingUpdate]: "Onboarding Updated",
}

/**
 * Serializes a permissions bitfield into an array of permission names.
 */
function serializePermissions(bitfield: bigint) {
  return Object.entries(new PermissionsBitField(bitfield).serialize()).reduce(
    (acc, [key, value]) => {
      if (value) acc.push(key.replace(/([A-Z])/g, " $1").trim())
      return acc
    },
    [] as string[],
  )
}

/**
 * A reducer function for formatting permissions overwrites.
 */
function formatOverwrites(acc: string[], overwrite: APIOverwrite) {
  const roleOrUserId = overwrite.id

  const allowBitfield = BigInt(overwrite.allow)
  const denyBitfield = BigInt(overwrite.deny)

  const allowedPermissions = serializePermissions(allowBitfield)
  const deniedPermissions = serializePermissions(denyBitfield)

  acc.push(dedent`
    **\`•\`** <@${roleOrUserId}>
    **\`│\`** *${allowedPermissions.length} new allowed permissions*
    **\`└\`** *${deniedPermissions.length} new denied permissions*
  `)

  return acc
}

/**
 * A map of target field types to their corresponding types.
 */
type TargetFieldTypeMap = {
  [K in keyof GuildAuditLogsEntryTargetField<GuildAuditLogsActionType>]: GuildAuditLogsEntryTargetField<GuildAuditLogsActionType>[K]
} & {
  All: unknown
  Unknown: unknown
  Role: Role
  Emoji: GuildEmoji | { id: string }
}

/**
 * A map of extra field types to their corresponding types.
 */
type ExtraFieldTypeMap = {
  Channel:
    | Role
    | GuildMember
    | { id: string; name: string; type: AuditLogOptionsType.Role }
    | { id: string; type: AuditLogOptionsType.Member }
  User:
    | { integrationType: string }
    | { removed: number; days: number }
    | { channel: VoiceBasedChannel | { id: string }; count: number }
    | { channel: GuildTextBasedChannel | { id: string }; count: number }
    | { channel: GuildTextBasedChannel | { id: string }; messageId: string }
    | { count: number }
  Message:
    | { channel: GuildTextBasedChannel | { id: string }; count: number }
    | { channel: GuildTextBasedChannel | { id: string }; messageId: string }
  Integration: { applicationId: string }
  StageInstance: StageChannel | { id: string }
  ApplicationCommand: { applicationId: string }
  AutoModerationRule: {
    autoModerationRuleName: string
    autoModerationRuleTriggerType: AuditLogRuleTriggerType
    channel: GuildTextBasedChannel | { id: string }
  }
}

export default new BotEventBuilder()
  .setName("guildAuditLogEntryCreate")
  .setExecute(async (client, entry, guild) => {
    const guildDoc = await cache.guilds.get(guild.id)
    if (!guildDoc) return

    const moduleConfig = guildDoc.modules?.[ModuleId.AuditLogs]
    if (!moduleConfig || !moduleConfig.enabled) return

    const categoryName = AuditLogCategories[entry.action]

    const logsChannelId = moduleConfig.channels[categoryName]
    if (!logsChannelId) return

    const logsChannel = client.channels.cache.get(logsChannelId)
    if (!logsChannel || logsChannel.type !== ChannelType.GuildText) return

    if (!logsChannel.permissionsFor(guild.members.me!).has("SendMessages")) {
      return
    }

    const { action, actionType, changes, executorId, target, reason } = entry

    const executor = executorId
      ? await client.users.fetch(executorId).catch(() => null)
      : null

    const embed = new EmbedBuilder()
      .setColor(PhaseColour.Primary)
      .setTitle(AuditLogTitles[action])
      .setTimestamp()

    if (executor) {
      embed.setAuthor({
        name: executor.username,
        iconURL: executor.displayAvatarURL(),
      })

      embed.setFooter({
        text: `Executor ID: ${executor.id}`,
      })
    }

    const checkTargetType = <T extends GuildAuditLogsTargetType>(
      _target: unknown,
      expectedType: T,
    ): _target is TargetFieldTypeMap[T] => entry.targetType === expectedType

    // target fields //

    if (checkTargetType(target, "ApplicationCommand")) {
      const applicationCommandOrIntegrationId = target.id

      const applicationCommand = await guild.commands
        .fetch(applicationCommandOrIntegrationId)
        .catch(() => null)

      const integrations = await guild.fetchIntegrations().catch(() => null)

      const integration = integrations?.get(
        applicationCommand?.applicationId ?? applicationCommandOrIntegrationId,
      )

      const botUser = integration?.application?.bot

      if (botUser) {
        embed.addFields({
          name: "Bot User",
          value: `<@${botUser.id}>`,
          inline: true,
        })
      } else {
        embed.addFields({
          name: "Application ID",
          value: wrapText(applicationCommandOrIntegrationId, "`"),
          inline: true,
        })
      }

      if (applicationCommand) {
        embed.addFields({
          name: "Command",
          value: `</${applicationCommand.name}:${applicationCommand.id}>`,
          inline: true,
        })
      }
    }

    if (checkTargetType(target, "Channel")) {
      const channel = target

      const channelTag =
        actionType !== "Delete"
          ? `<#${channel.id}>`
          : wrapText(`#${channel.name ?? "unknown"}`, "`")

      embed.addFields(
        {
          name: "Channel",
          value: channelTag,
          inline: true,
        },
        {
          name: "Channel ID",
          value: wrapText(channel.id ?? "unknown", "`"),
          inline: true,
        },
      )
    }

    if (checkTargetType(target, "Thread")) {
      const thread = target

      const threadTag =
        actionType !== "Delete"
          ? `<#${thread.id}>`
          : wrapText(`#${thread?.name ?? "unknown"}`, "`")

      embed.addFields(
        {
          name: "Thread",
          value: threadTag,
          inline: true,
        },
        {
          name: "Thread ID",
          value: wrapText(thread.id, "`"),
          inline: true,
        },
      )
    }

    if (checkTargetType(target, "StageInstance")) {
      const stage = target

      const stageTag =
        actionType !== "Delete"
          ? `<#${stage.channelId}>`
          : wrapText(`#${stage.channel?.name ?? "unknown"}`, "`")

      embed.addFields(
        {
          name: "Stage",
          value: stageTag,
          inline: true,
        },
        {
          name: "Stage ID",
          value: wrapText(stage.channelId ?? "unknown", "`"),
          inline: true,
        },
      )
    }

    if (checkTargetType(target, "User")) {
      const user = target

      const userTag =
        actionType !== "Delete"
          ? user
            ? `<@${user.id}>`
            : wrapText("@unknown", "`")
          : wrapText(`@${user?.username ?? "unknown"}`, "`")

      embed.addFields(
        {
          name: "User",
          value: userTag,
          inline: true,
        },
        {
          name: "User ID",
          value: wrapText(user?.id ?? "unknown", "`"),
          inline: true,
        },
      )
    }

    if (checkTargetType(target, "Role")) {
      const role = target

      const roleTag =
        actionType !== "Delete"
          ? role
            ? `<@&${role.id}>`
            : wrapText("@unknown", "`")
          : wrapText(`@${role?.name ?? "unknown"}`, "`")

      embed.addFields(
        {
          name: "Role",
          value: roleTag,
          inline: true,
        },
        {
          name: "Role ID",
          value: wrapText(role?.id ?? "unknown", "`"),
          inline: true,
        },
      )
    }

    if (checkTargetType(target, "Webhook")) {
      const webhook = target

      if (actionType !== "Create") {
        embed.addFields({
          name: "Webhook",
          value: webhook.name,
          inline: true,
        })
      }
    }

    if (checkTargetType(target, "Integration")) {
      const integration = target

      if (actionType !== "Create") {
        embed.addFields({
          name: "Integration",
          value: integration.name,
          inline: true,
        })
      }
    }

    if (checkTargetType(target, "AutoModerationRule")) {
      const rule = target

      if (actionType !== "Create") {
        embed.addFields({
          name: "Rule",
          value: rule.name,
          inline: true,
        })
      }
    }

    if (checkTargetType(target, "GuildScheduledEvent")) {
      const event = target

      if (actionType !== "Create") {
        embed.addFields({
          name: "Event",
          value: event.name,
          inline: true,
        })
      }
    }

    if (checkTargetType(target, "Message")) {
      const extra = entry.extra as ExtraFieldTypeMap["Message"]

      if (action === AuditLogEvent.MessageBulkDelete)
        extra.channel.id = target.id

      const channelField: APIEmbedField = {
        name: "Channel",
        value: `<#${extra.channel.id}>`,
        inline: true,
      }

      if ("count" in extra) {
        if (extra.count === 1) {
          embed.addFields(channelField, {
            name: "Author",
            value: `<@${target.id}>`,
            inline: true,
          })
        } else {
          embed.addFields(channelField, {
            name: "Count",
            value: wrapText(extra.count.toString(), "`"),
            inline: true,
          })
        }
      } else {
        embed.addFields(channelField, {
          name: "Message",
          value: `https://discord.com/channels/${guild.id}/${extra.channel.id}/${extra.messageId}`,
          inline: true,
        })
      }
    }

    if (checkTargetType(target, "Emoji")) {
      const emoji = guild.emojis.cache.get(target.id)
      const emojiURL = `https://cdn.discordapp.com/emojis/${target.id}.webp?size=128`

      embed.setThumbnail(emojiURL)

      const emojiTag = emoji
        ? `<${emoji.animated ? "a" : ""}:${emoji.identifier}>`
        : `[${target.id}.webp](https://cdn.discordapp.com/emojis/${target.id}.webp)`

      embed.addFields({
        name: "Emoji",
        value: emojiTag,
        inline: true,
      })
    }

    if (checkTargetType(target, "Sticker")) {
      const sticker = target

      embed.setThumbnail(sticker.url)

      embed.addFields({
        name: "Sticker",
        value: `[${sticker.name}](${sticker.url})`,
        inline: true,
      })
    }

    if (checkTargetType(target, "Invite")) {
      const invite = target

      if (actionType !== "Create") {
        embed.addFields(
          {
            name: "Code",
            value: wrapText(invite.code, "`"),
            inline: true,
          },
          {
            name: "Created By",
            value: `<@${invite.inviter?.id}>`,
            inline: true,
          },
        )
      }
    }

    // changes fields //

    if (actionType !== "Delete" && changes.length) {
      for (const change of changes) {
        if ([...change.key].every((key) => Number.isInteger(key))) {
          const oldOverwrites = change.old as APIOverwrite[] | undefined
          const newOverwrites = change.new as APIOverwrite[] | undefined

          const addedOverwrites = newOverwrites
            ?.filter((overwrite) => !oldOverwrites?.includes(overwrite))
            .reduce(formatOverwrites, [])

          const removedOverwrites = oldOverwrites
            ?.filter((overwrite) => !newOverwrites?.includes(overwrite))
            .reduce(formatOverwrites, [])

          const changedOverwrites = [
            ...(addedOverwrites ?? []),
            ...(removedOverwrites ?? []),
          ]

          const value = truncateString(changedOverwrites.join("\n"), 1024)

          embed.addFields({
            name: `Permission Overwrites`,
            value: value.length ? value : "None",
          })

          continue
        }

        switch (change.key) {
          // Channel related cases
          case "channel_id": {
            embed.addFields({
              name: "Channel",
              value: `<#${change.new}>`,
            })

            break
          }
          case "afk_channel_id":
          case "rules_channel_id":
          case "public_updates_channel_id":
          case "system_channel_id":
          case "widget_channel_id": {
            const values: string[] = []

            if (change.old) {
              values.push(`**\`-\`** <#${change.old}>`)
            }

            if (change.new) {
              values.push(`**\`+\`** <#${change.new}>`)
            }

            embed.addFields({
              name: `${capitalCase(change.key.replace("_id", ""))}`,
              value: values.join("\n"),
            })

            break
          }
          case "type": {
            embed.addFields({
              name: "Type",
              value: capitalCase(
                ChannelType[change.new as ChannelType].replace("Guild", ""),
              ),
            })

            break
          }
          case "rate_limit_per_user":
          case "default_thread_rate_limit_per_user": {
            const values: string[] = []
            if (change.old) {
              values.push(
                `**\`-\`** ${ms((change.old as number) * 1000, { long: true })}`,
              )
            }

            if (change.new) {
              values.push(
                `**\`+\`** ${ms((change.new as number) * 1000, { long: true })}`,
              )
            }

            embed.addFields({
              name:
                change.key === "rate_limit_per_user"
                  ? "Rate Limit"
                  : "Default Rate Limit",
              value: values.length ? values.join("\n") : "None",
            })

            break
          }
          case "permission_overwrites": {
            const oldOverwrites = change.old as APIOverwrite[] | undefined
            const newOverwrites = change.new as APIOverwrite[] | undefined

            const removedOverwrites = oldOverwrites
              ?.filter((overwrite) => !newOverwrites?.includes(overwrite))
              .reduce(formatOverwrites, [])

            const addedOverwrites = newOverwrites
              ?.filter((overwrite) => !oldOverwrites?.includes(overwrite))
              .reduce(formatOverwrites, [])

            const changedOverwrites = [
              ...(removedOverwrites ?? []),
              ...(addedOverwrites ?? []),
            ]

            const value = truncateString(changedOverwrites.join("\n"), 1024)

            embed.addFields({
              name: `Permission Overwrites`,
              value: value.length ? value : "None",
            })

            break
          }
          case "exempt_channels": {
            const oldChannelIds = change.old as string[] | undefined
            const newChannelIds = change.new as string[] | undefined

            const removedChannels = oldChannelIds
              ?.filter((channelId) => !newChannelIds?.includes(channelId))
              .map((channelId) => `**\`-\`** <#${channelId}>`)

            const addedChannels = newChannelIds
              ?.filter((channelId) => !oldChannelIds?.includes(channelId))
              .map((channelId) => `**\`+\`** <#${channelId}>`)

            const changedChannels = [
              ...(removedChannels ?? []),
              ...(addedChannels ?? []),
            ]

            const value = truncateString(changedChannels.join("\n"), 1024)

            embed.addFields({
              name: `Exempt Channels`,
              value: value.length ? value : "None",
            })

            break
          }

          // Role related cases
          case "color": {
            if (actionType === "Create") {
              embed.addFields({
                name: "Colour",
                value: `#${change.new === 0 ? "000000" : change.new!.toString(16)}`,
              })
            } else {
              embed.addFields({
                name: "Colour",
                value: dedent`
                  **\`-\`** #${change.old === 0 ? "000000" : change.old!.toString(16)} 
                  **\`+\`** #${change.new === 0 ? "000000" : change.new!.toString(16)}
                `,
              })
            }

            break
          }
          case "$add": {
            const oldRoles = change.old as APIRole[] | undefined
            const newRoles = change.new as APIRole[] | undefined

            const addedRoles = newRoles
              ?.filter((role) => !oldRoles?.includes(role))
              .map((role) => `<@&${role.id}>`)

            embed.addFields({
              name: `Roles Added (${addedRoles?.length ?? 0})`,
              value: truncateString(addedRoles?.join(", ") ?? "None", 1024),
            })

            break
          }
          case "$remove": {
            const oldRoles = change.old as APIRole[] | undefined
            const newRoles = change.new as APIRole[] | undefined

            const removedRoles = newRoles
              ?.filter((role) => !oldRoles?.includes(role))
              .map((role) => `<@&${role.id}>`)

            embed.addFields({
              name: `Roles Removed (${removedRoles?.length ?? 0})`,
              value: truncateString(removedRoles?.join(", ") ?? "None", 1024),
            })

            break
          }
          case "exempt_roles": {
            const oldRoleIds = change.old as string[] | undefined
            const newRoleIds = change.new as string[] | undefined

            const removedRoles = oldRoleIds
              ?.filter((roleId) => !newRoleIds?.includes(roleId))
              .map((roleId) => `<@&${roleId}>`)

            const addedRoles = newRoleIds
              ?.filter((roleId) => !oldRoleIds?.includes(roleId))
              .map((roleId) => `<@&${roleId}>`)

            const changedRoles = [
              ...(removedRoles ?? []),
              ...(addedRoles ?? []),
            ]

            const value = truncateString(changedRoles.join("\n"), 1024)

            embed.addFields({
              name: `Exempt Roles`,
              value: value.length ? value : "None",
            })

            break
          }

          // Permission related cases
          case "permissions":
          case "allow":
          case "deny": {
            const oldBitfield = BigInt(change.old as string)
            const newBitfield = BigInt(change.new as string)

            const oldPermissions = serializePermissions(oldBitfield)
            const newPermissions = serializePermissions(newBitfield)

            const removedPermissions = oldPermissions
              .filter((permission) => !newPermissions.includes(permission))
              .map((permission) => `**\`-\`** \`${permission}\``)

            const addedPermissions = newPermissions
              .filter((permission) => !oldPermissions.includes(permission))
              .map((permission) => `**\`+\`** \`${permission}\``)

            const changedPermissions = [
              ...removedPermissions,
              ...addedPermissions,
            ]

            const value = truncateString(changedPermissions.join("\n"), 1024)

            embed.addFields({
              name: capitalCase(change.key),
              value: value.length ? value : "None",
            })

            break
          }

          // Server settings related cases
          case "mfa_level":
          case "verification_level":
          case "explicit_content_filter":
          case "default_message_notifications": {
            const values: string[] = []

            if (change.old) {
              values.push(
                `**\`-\`** ${capitalCase(
                  change.key === "mfa_level"
                    ? GuildMFALevel[change.old as GuildMFALevel]
                    : change.key === "verification_level"
                      ? GuildVerificationLevel[
                          change.old as GuildVerificationLevel
                        ]
                      : change.key === "explicit_content_filter"
                        ? GuildExplicitContentFilter[
                            change.old as GuildExplicitContentFilter
                          ]
                        : GuildDefaultMessageNotifications[
                            change.old as GuildDefaultMessageNotifications
                          ],
                )}`,
              )
            }

            if (change.new) {
              values.push(
                `**\`+\`** ${capitalCase(
                  change.key === "mfa_level"
                    ? GuildMFALevel[change.new as GuildMFALevel]
                    : change.key === "verification_level"
                      ? GuildVerificationLevel[
                          change.new as GuildVerificationLevel
                        ]
                      : change.key === "explicit_content_filter"
                        ? GuildExplicitContentFilter[
                            change.new as GuildExplicitContentFilter
                          ]
                        : GuildDefaultMessageNotifications[
                            change.new as GuildDefaultMessageNotifications
                          ],
                )}`,
              )
            }

            embed.addFields({
              name: capitalCase(change.key),
              value: values.join("\n"),
            })

            break
          }
          case "system_channel_flags": {
            break
          }

          // Event related cases
          case "event_type":
          case "entity_type":
          case "status": {
            if (actionType === "Create") {
              embed.addFields({
                name: capitalCase(change.key),
                value: capitalCase(
                  change.key === "event_type"
                    ? AutoModerationRuleEventType[
                        change.new as AutoModerationRuleEventType
                      ]
                    : change.key === "entity_type"
                      ? GuildScheduledEventEntityType[
                          change.new as GuildScheduledEventEntityType
                        ]
                      : GuildScheduledEventStatus[
                          change.new as GuildScheduledEventStatus
                        ],
                ),
              })
            } else {
              embed.addFields({
                name: capitalCase(change.key),
                value: dedent`
                  **\`-\`** ${capitalCase(
                    change.key === "event_type"
                      ? AutoModerationRuleEventType[
                          change.old as AutoModerationRuleEventType
                        ]
                      : change.key === "entity_type"
                        ? GuildScheduledEventEntityType[
                            change.old as GuildScheduledEventEntityType
                          ]
                        : GuildScheduledEventStatus[
                            change.old as GuildScheduledEventStatus
                          ],
                  )}
                  **\`+\`** ${capitalCase(
                    change.key === "event_type"
                      ? AutoModerationRuleEventType[
                          change.new as AutoModerationRuleEventType
                        ]
                      : change.key === "entity_type"
                        ? GuildScheduledEventEntityType[
                            change.new as GuildScheduledEventEntityType
                          ]
                        : GuildScheduledEventStatus[
                            change.new as GuildScheduledEventStatus
                          ],
                  )}
                `,
              })
            }

            break
          }

          // Moderation related cases
          case "trigger_type": {
            if (actionType === "Create") {
              embed.addFields({
                name: "Trigger Type",
                value: capitalCase(
                  AutoModerationRuleTriggerType[
                    change.new as AutoModerationRuleTriggerType
                  ],
                ),
              })
            } else {
              embed.addFields({
                name: "Trigger Type",
                value: dedent`
                  **\`-\`** ${capitalCase(AutoModerationRuleTriggerType[change.old as AutoModerationRuleTriggerType])}
                  **\`+\`** ${capitalCase(AutoModerationRuleTriggerType[change.new as AutoModerationRuleTriggerType])}
                `,
              })
            }

            break
          }
          case "communication_disabled_until": {
            const values: string[] = []

            if (change.old) {
              values.push(
                `**\`-\`** ${dateToTimestamp(new Date(change.old as string))}`,
              )
            }

            if (change.new) {
              values.push(
                `**\`+\`** ${dateToTimestamp(new Date(change.new as string))}`,
              )
            }

            embed.addFields({
              name: "Timeout End Date",
              value: values.length ? values.join("\n") : "None",
            })

            break
          }

          // Emoji and sticker related cases
          case "default_reaction_emoji": {
            const oldEmoji = change.old as
              | APIGuildForumDefaultReactionEmoji
              | undefined

            const newEmoji = change.new as
              | APIGuildForumDefaultReactionEmoji
              | undefined

            const values: string[] = []

            if (oldEmoji) {
              const emojiData = oldEmoji.emoji_id
                ? guild.emojis.cache.get(oldEmoji.emoji_id!)!
                : oldEmoji.emoji_name!

              const emoji =
                typeof emojiData === "string"
                  ? emojiData
                  : `<${emojiData.animated ? "a" : ""}:${emojiData.name}:${emojiData.id}>`

              values.push(`**\`-\`** ${emoji}`)
            }

            if (newEmoji) {
              const emojiData = newEmoji.emoji_id
                ? guild.emojis.cache.get(newEmoji.emoji_id!)!
                : newEmoji.emoji_name!

              const emoji =
                typeof emojiData === "string"
                  ? emojiData
                  : `<${emojiData.animated ? "a" : ""}:${emojiData.name}:${emojiData.id}>`

              values.push(`**\`+\`** ${emoji}`)
            }

            embed.addFields({
              name: "Default Reaction Emoji",
              value: values.join("\n"),
            })

            break
          }
          case "format_type": {
            if (actionType === "Create") {
              embed.addFields({
                name: "Format Type",
                value: capitalCase(
                  StickerFormatType[change.new as StickerFormatType],
                ),
              })
            } else {
              embed.addFields({
                name: "Format Type",
                value: dedent`
                  **\`-\`** ${capitalCase(StickerFormatType[change.old as StickerFormatType])}
                  **\`+\`** ${capitalCase(StickerFormatType[change.new as StickerFormatType])}
                `,
              })
            }

            break
          }

          // Invite related cases
          case "inviter_id": {
            embed.addFields({
              name: "Created By",
              value: `<@${change.new}>`,
            })

            break
          }
          case "uses": {
            if (actionType === "Update") {
              const values: string[] = []

              if (change.old) {
                values.push(`**\`-\`** \`${change.old}\``)
              }

              if (change.new) {
                values.push(`**\`+\`** \`${change.new}\``)
              }

              embed.addFields({
                name: "Uses",
                value: values.join("\n"),
              })
            }

            break
          }
          case "temporary": {
            embed.addFields({
              name: "Temporary Membership",
              value: wrapText(change.new!.toString(), "`"),
            })

            break
          }
          case "max_age": {
            embed.addFields({
              name: "Expires",
              value:
                change.new === undefined
                  ? wrapText("false", "`")
                  : dateToTimestamp(
                      new Date(Date.now() + (change.new as number) * 1000),
                    ),
            })

            break
          }
          case "max_uses": {
            if (change.new !== 0) {
              embed.addFields({
                name: "Max Uses",
                value: wrapText(change.new!.toString(), "`"),
              })
            }

            break
          }

          // Misc cases
          case "actions": {
            break
          }
          case "flags": {
            break
          }
          case "available_tags": {
            const oldTags = change.old as APIGuildForumTag[] | undefined
            const newTags = change.new as APIGuildForumTag[] | undefined

            const removedTags = oldTags
              ?.filter((tag) => !newTags?.includes(tag))
              .map((tag) => `**\`-\`** \`${tag.name}\``)

            const addedTags = newTags
              ?.filter((tag) => !oldTags?.includes(tag))
              .map((tag) => `**\`+\`** \`${tag.name}\``)

            const changedTags = [...(removedTags ?? []), ...(addedTags ?? [])]
            const value = truncateString(changedTags.join("\n"), 1024)

            embed.addFields({
              name: `Available Tags (${changedTags.length})`,
              value: value.length ? value : "None",
            })

            break
          }
          case "expire_behavior": {
            embed.addFields({
              name: "Expire Behavior",
              value: capitalCase(
                IntegrationExpireBehavior[
                  change.new as IntegrationExpireBehavior
                ],
              ),
            })

            break
          }
          case "owner_id": {
            embed.addFields({
              name: "Owner",
              value: `**\`-\`** <@${change.old}>\n**\`+\`** <@${change.new}>`,
            })

            break
          }
          case "privacy_level": {
            if (actionType === "Create") {
              embed.addFields({
                name: "Privacy Level",
                value: capitalCase(
                  StageInstancePrivacyLevel[
                    change.new as StageInstancePrivacyLevel
                  ],
                ),
              })
            } else {
              embed.addFields({
                name: "Privacy Level",
                value: dedent`
                  **\`-\`** ${capitalCase(StageInstancePrivacyLevel[change.old as StageInstancePrivacyLevel])}
                  **\`+\`** ${capitalCase(StageInstancePrivacyLevel[change.new as StageInstancePrivacyLevel])}
                `,
              })
            }

            break
          }

          // Default case
          default: {
            const shouldWrapInCode =
              change.key.endsWith("id") ||
              change.key.endsWith("hash") ||
              change.key.endsWith("code") ||
              typeof change.old === "number" ||
              typeof change.new === "number" ||
              typeof change.old === "boolean" ||
              typeof change.new === "boolean"

            const formattedKey = !change.key.includes(" ")
              ? capitalCase(change.key)
                  .replace(" Id", " ID")
                  .replace("Afk ", "AFK ")
              : change.key

            const formattedOldValue = change.old?.toString().length
              ? shouldWrapInCode
                ? wrapText(change.old.toString(), "`")
                : change.old.toString()
              : null

            const formattedNewValue = change.new?.toString().length
              ? shouldWrapInCode
                ? wrapText(change.new.toString(), "`")
                : change.new.toString()
              : null

            if (actionType === "Create") {
              embed.addFields({
                name: formattedKey,
                value: formattedNewValue!,
              })
            } else {
              const values: string[] = []

              if (formattedOldValue) {
                values.push(`**\`-\`** ${formattedOldValue}`)
              }

              if (formattedNewValue) {
                values.push(`**\`+\`** ${formattedNewValue}`)
              }

              embed.addFields({
                name: formattedKey,
                value: truncateString(values.join("\n"), 1024),
              })
            }

            break
          }
        }
      }
    }

    if (reason) {
      embed.addFields({
        name: "Reason",
        value: truncateString(reason, 1024),
      })
    }

    try {
      await logsChannel.send({ embeds: [embed] })
    } catch (error) {
      console.error(
        `Failed to send audit log entry to channel ${logsChannel.id} in guild ${guild.id}:`,
        error,
      )
    }
  })
