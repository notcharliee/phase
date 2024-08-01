import type { GuildModules } from "~/lib/db"

export const modulesConfig = {
  AuditLogs: {
    name: "Audit Logs",
    description:
      "Sends a log of all server events to the channel of your choice.",
    path: "/audit-logs",
  },
  AutoMessages: {
    name: "Auto Messages",
    description: "Sends a message to a channel at a set interval.",
    path: "/auto-messages",
  },
  AutoRoles: {
    name: "Auto Roles",
    description:
      "Automatically assigns roles to new members of your server as soon as they join.",
    path: "/auto-roles",
  },
  BumpReminders: {
    name: "Bump Reminders",
    description: "Reminds members to re-bump your server after a set period.",
    path: "/bump-reminders",
  },
  Counters: {
    name: "Counters",
    description: "Displays server statistics directly in your channel names.",
    path: "/counters",
    tags: ["New"],
  },
  Forms: {
    name: "Forms",
    description:
      "Adds dynamic application forms within the bot's direct messages.",
    path: "/forms",
  },
  JoinToCreates: {
    name: "Join to Creates",
    description:
      "Creates a temporary voice channel, then deletes it once all members have left.",
    path: "/join-to-create",
  },
  Levels: {
    name: "Levels",
    description:
      "Rewards activity with XP and level-ups as members reach milestones.",
    path: "/levels",
  },
  ReactionRoles: {
    name: "Reaction Roles",
    description: "Lets members self-assign roles by reacting to a message.",
    path: "/reaction-roles",
  },
  Tickets: {
    name: "Tickets",
    description:
      "Lets members create individualised staff assistance channels.",
    path: "/tickets",
  },
  TwitchNotifications: {
    name: "Twitch Notifications",
    description: "Notifies your server when a Twitch streamer goes live.",
    path: "/twitch-notifications",
  },
  Warnings: {
    name: "Warnings",
    description: "Helps moderators add, remove, and track member warnings.",
    path: "/warnings",
  },
  WelcomeMessages: {
    name: "Welcome Messages",
    description: "Gives new members a warm welcome to your server.",
    path: "/welcome-messages",
  },
} satisfies {
  [key in keyof GuildModules]: {
    name: string
    description: string
    path: string
    tags?: string[]
  }
}
