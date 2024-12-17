import { ModuleId } from "@repo/utils/modules"

import { AuditLogs } from "~/app/dashboard/guilds/[id]/modules/_forms/audit-logs"
import { AutoMessages } from "~/app/dashboard/guilds/[id]/modules/_forms/auto-messages"
import { AutoRoles } from "~/app/dashboard/guilds/[id]/modules/_forms/auto-roles"
import { BumpReminders } from "~/app/dashboard/guilds/[id]/modules/_forms/bump-reminders"
import { Counters } from "~/app/dashboard/guilds/[id]/modules/_forms/counters"
import { Forms } from "~/app/dashboard/guilds/[id]/modules/_forms/forms"
import { JoinToCreates } from "~/app/dashboard/guilds/[id]/modules/_forms/join-to-creates"
import { Levels } from "~/app/dashboard/guilds/[id]/modules/_forms/levels"
import { ReactionRoles } from "~/app/dashboard/guilds/[id]/modules/_forms/reaction-roles"
import { SelfRoles } from "~/app/dashboard/guilds/[id]/modules/_forms/self-roles"
import { Tickets } from "~/app/dashboard/guilds/[id]/modules/_forms/tickets"
import { TwitchNotifications } from "~/app/dashboard/guilds/[id]/modules/_forms/twitch-notifications"
import { Warnings } from "~/app/dashboard/guilds/[id]/modules/_forms/warnings"
import { WelcomeMessages } from "~/app/dashboard/guilds/[id]/modules/_forms/welcome-messages"

export const moduleFormFields = {
  [ModuleId.AuditLogs]: AuditLogs,
  [ModuleId.AutoMessages]: AutoMessages,
  [ModuleId.AutoRoles]: AutoRoles,
  [ModuleId.BumpReminders]: BumpReminders,
  [ModuleId.Counters]: Counters,
  [ModuleId.Forms]: Forms,
  [ModuleId.JoinToCreates]: JoinToCreates,
  [ModuleId.Levels]: Levels,
  [ModuleId.ReactionRoles]: ReactionRoles,
  [ModuleId.SelfRoles]: SelfRoles,
  [ModuleId.Tickets]: Tickets,
  [ModuleId.TwitchNotifications]: TwitchNotifications,
  [ModuleId.Warnings]: Warnings,
  [ModuleId.WelcomeMessages]: WelcomeMessages,
}
