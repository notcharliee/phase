import { auditLogs } from "~/modules/constants/definitions/audit-logs"
import { autoMessages } from "~/modules/constants/definitions/auto-messages"
import { autoRoles } from "~/modules/constants/definitions/auto-roles"
import { bumpReminders } from "~/modules/constants/definitions/bump-reminders"
import { counters } from "~/modules/constants/definitions/counters"
import { forms } from "~/modules/constants/definitions/forms"
import { joinToCreates } from "~/modules/constants/definitions/join-to-creates"
import { levels } from "~/modules/constants/definitions/levels"
import { reactionRoles } from "~/modules/constants/definitions/reaction-roles"
import { selfRoles } from "~/modules/constants/definitions/self-roles"
import { tickets } from "~/modules/constants/definitions/tickets"
import { twitchNotifications } from "~/modules/constants/definitions/twitch-notifications"
import { warnings } from "~/modules/constants/definitions/warnings"
import { welcomeMessages } from "~/modules/constants/definitions/welcome-messages"
import { ModuleId } from "~/modules/constants/ids"

export const ModuleDefinitions = {
  [ModuleId.AuditLogs]: auditLogs,
  [ModuleId.AutoMessages]: autoMessages,
  [ModuleId.AutoRoles]: autoRoles,
  [ModuleId.BumpReminders]: bumpReminders,
  [ModuleId.Counters]: counters,
  [ModuleId.Forms]: forms,
  [ModuleId.JoinToCreates]: joinToCreates,
  [ModuleId.Levels]: levels,
  [ModuleId.ReactionRoles]: reactionRoles,
  [ModuleId.SelfRoles]: selfRoles,
  [ModuleId.Tickets]: tickets,
  [ModuleId.TwitchNotifications]: twitchNotifications,
  [ModuleId.Warnings]: warnings,
  [ModuleId.WelcomeMessages]: welcomeMessages,
} as const
