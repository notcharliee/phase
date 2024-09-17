import { ModuleId } from "@repo/config/phase/modules.ts"

import { AuditLogs } from "~/app/dashboard/modules/_forms/audit-logs"
import { AutoMessages } from "~/app/dashboard/modules/_forms/auto-messages"
import { AutoRoles } from "~/app/dashboard/modules/_forms/auto-roles"
import { BumpReminders } from "~/app/dashboard/modules/_forms/bump-reminders"
import { Counters } from "~/app/dashboard/modules/_forms/counters"
import { Forms } from "~/app/dashboard/modules/_forms/forms"
import { JoinToCreates } from "~/app/dashboard/modules/_forms/join-to-creates"
import { Levels } from "~/app/dashboard/modules/_forms/levels"
import { ReactionRoles } from "~/app/dashboard/modules/_forms/reaction-roles"
import { SelfRoles } from "~/app/dashboard/modules/_forms/self-roles"
import { Tickets } from "~/app/dashboard/modules/_forms/tickets"
import { TwitchNotifications } from "~/app/dashboard/modules/_forms/twitch-notifications"
import { Warnings } from "~/app/dashboard/modules/_forms/warnings"
import { WelcomeMessages } from "~/app/dashboard/modules/_forms/welcome-messages"

export const moduleFormItems = {
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
