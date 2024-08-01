import { AuditLogs } from "~/app/dashboard/modules/_forms/audit-logs"
import { AutoMessages } from "~/app/dashboard/modules/_forms/auto-messages"
import { AutoRoles } from "~/app/dashboard/modules/_forms/auto-roles"
import { BumpReminders } from "~/app/dashboard/modules/_forms/bump-reminders"
import { Counters } from "~/app/dashboard/modules/_forms/counters"
import { Forms } from "~/app/dashboard/modules/_forms/forms"
import { JoinToCreates } from "~/app/dashboard/modules/_forms/join-to-creates"
import { Levels } from "~/app/dashboard/modules/_forms/levels"
import { ReactionRoles } from "~/app/dashboard/modules/_forms/reaction-roles"
import { Tickets } from "~/app/dashboard/modules/_forms/tickets"
import { TwitchNotifications } from "~/app/dashboard/modules/_forms/twitch-notifications"
import { Warnings } from "~/app/dashboard/modules/_forms/warnings"
import { WelcomeMessages } from "~/app/dashboard/modules/_forms/welcome-messages"

export const moduleForms = {
  AuditLogs,
  AutoMessages,
  AutoRoles,
  BumpReminders,
  Counters,
  Forms,
  JoinToCreates,
  Levels,
  ReactionRoles,
  Tickets,
  TwitchNotifications,
  Warnings,
  WelcomeMessages,
} as const