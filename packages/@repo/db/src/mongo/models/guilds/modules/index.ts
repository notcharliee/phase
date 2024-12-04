import { ModuleId } from "@repo/utils/modules"
import { Schema } from "mongoose"

import { auditLogsSchema } from "~/mongo/models/guilds/modules/audit-logs"
import { autoMessagesSchema } from "~/mongo/models/guilds/modules/auto-messages"
import { autoRolesSchema } from "~/mongo/models/guilds/modules/auto-roles"
import { bumpRemindersSchema } from "~/mongo/models/guilds/modules/bump-reminders"
import { countersSchema } from "~/mongo/models/guilds/modules/counters"
import { formsSchema } from "~/mongo/models/guilds/modules/forms"
import { joinToCreatesSchema } from "~/mongo/models/guilds/modules/join-to-creates"
import { levelsSchema } from "~/mongo/models/guilds/modules/levels"
import { reactionRolesSchema } from "~/mongo/models/guilds/modules/reaction-roles"
import { selfRolesSchema } from "~/mongo/models/guilds/modules/self-roles"
import { ticketsSchema } from "~/mongo/models/guilds/modules/tickets"
import { twitchNotificationsSchema } from "~/mongo/models/guilds/modules/twitch-notifications"
import { warningsSchema } from "~/mongo/models/guilds/modules/warnings"
import { welcomeMessagesSchema } from "~/mongo/models/guilds/modules/welcome-messages"

import type { AuditLogs } from "~/mongo/models/guilds/modules/audit-logs"
import type { AutoMessages } from "~/mongo/models/guilds/modules/auto-messages"
import type { AutoRoles } from "~/mongo/models/guilds/modules/auto-roles"
import type { BumpReminders } from "~/mongo/models/guilds/modules/bump-reminders"
import type { Counters } from "~/mongo/models/guilds/modules/counters"
import type { Forms } from "~/mongo/models/guilds/modules/forms"
import type { JoinToCreates } from "~/mongo/models/guilds/modules/join-to-creates"
import type { Levels } from "~/mongo/models/guilds/modules/levels"
import type { ReactionRoles } from "~/mongo/models/guilds/modules/reaction-roles"
import type { SelfRoles } from "~/mongo/models/guilds/modules/self-roles"
import type { Tickets } from "~/mongo/models/guilds/modules/tickets"
import type { TwitchNotifications } from "~/mongo/models/guilds/modules/twitch-notifications"
import type { Warnings } from "~/mongo/models/guilds/modules/warnings"
import type { WelcomeMessages } from "~/mongo/models/guilds/modules/welcome-messages"

export type {
  AuditLogs,
  AutoMessages,
  AutoRoles,
  BumpReminders,
  Counters,
  Forms,
  JoinToCreates,
  Levels,
  ReactionRoles,
  SelfRoles,
  Tickets,
  TwitchNotifications,
  Warnings,
  WelcomeMessages,
}

export interface GuildModules {
  [ModuleId.AuditLogs]: AuditLogs
  [ModuleId.AutoMessages]: AutoMessages
  [ModuleId.AutoRoles]: AutoRoles
  [ModuleId.BumpReminders]: BumpReminders
  [ModuleId.Counters]: Counters
  [ModuleId.Forms]: Forms
  [ModuleId.JoinToCreates]: JoinToCreates
  [ModuleId.Levels]: Levels
  [ModuleId.ReactionRoles]: ReactionRoles
  [ModuleId.SelfRoles]: SelfRoles
  [ModuleId.Tickets]: Tickets
  [ModuleId.TwitchNotifications]: TwitchNotifications
  [ModuleId.Warnings]: Warnings
  [ModuleId.WelcomeMessages]: WelcomeMessages
}

export const modulesSchema = new Schema<GuildModules>(
  {
    [ModuleId.AuditLogs]: auditLogsSchema,
    [ModuleId.AutoMessages]: autoMessagesSchema,
    [ModuleId.AutoRoles]: autoRolesSchema,
    [ModuleId.BumpReminders]: bumpRemindersSchema,
    [ModuleId.Counters]: countersSchema,
    [ModuleId.Forms]: formsSchema,
    [ModuleId.JoinToCreates]: joinToCreatesSchema,
    [ModuleId.Levels]: levelsSchema,
    [ModuleId.ReactionRoles]: reactionRolesSchema,
    [ModuleId.SelfRoles]: selfRolesSchema,
    [ModuleId.Tickets]: ticketsSchema,
    [ModuleId.TwitchNotifications]: twitchNotificationsSchema,
    [ModuleId.Warnings]: warningsSchema,
    [ModuleId.WelcomeMessages]: welcomeMessagesSchema,
  },
  { _id: false },
)
