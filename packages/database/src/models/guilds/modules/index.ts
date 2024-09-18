import { ModuleId } from "@repo/config/phase/modules.ts"
import { Schema } from "mongoose"

import { auditLogsSchema } from "~/models/guilds/modules/audit-logs"
import { autoMessagesSchema } from "~/models/guilds/modules/auto-messages"
import { autoRolesSchema } from "~/models/guilds/modules/auto-roles"
import { bumpRemindersSchema } from "~/models/guilds/modules/bump-reminders"
import { countersSchema } from "~/models/guilds/modules/counters"
import { formsSchema } from "~/models/guilds/modules/forms"
import { joinToCreatesSchema } from "~/models/guilds/modules/join-to-creates"
import { levelsSchema } from "~/models/guilds/modules/levels"
import { reactionRolesSchema } from "~/models/guilds/modules/reaction-roles"
import { selfRolesSchema } from "~/models/guilds/modules/self-roles"
import { ticketsSchema } from "~/models/guilds/modules/tickets"
import { twitchNotificationsSchema } from "~/models/guilds/modules/twitch-notifications"
import { warningsSchema } from "~/models/guilds/modules/warnings"
import { welcomeMessagesSchema } from "~/models/guilds/modules/welcome-messages"

import type { AuditLogs } from "~/models/guilds/modules/audit-logs"
import type { AutoMessages } from "~/models/guilds/modules/auto-messages"
import type { AutoRoles } from "~/models/guilds/modules/auto-roles"
import type { BumpReminders } from "~/models/guilds/modules/bump-reminders"
import type { Counters } from "~/models/guilds/modules/counters"
import type { Forms } from "~/models/guilds/modules/forms"
import type { JoinToCreates } from "~/models/guilds/modules/join-to-creates"
import type { Levels } from "~/models/guilds/modules/levels"
import type { ReactionRoles } from "~/models/guilds/modules/reaction-roles"
import type { SelfRoles } from "~/models/guilds/modules/self-roles"
import type { Tickets } from "~/models/guilds/modules/tickets"
import type { TwitchNotifications } from "~/models/guilds/modules/twitch-notifications"
import type { Warnings } from "~/models/guilds/modules/warnings"
import type { WelcomeMessages } from "~/models/guilds/modules/welcome-messages"

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
