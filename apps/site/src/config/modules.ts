interface ModulesConfig {
  name: string
  description: string
  path: string
}

export const modulesConfig = [
  {
    name: "Audit Logs",
    description:
      "Sends a log of all server events to the channel of your choice.",
    path: "/audit-logs",
  },
  {
    name: "Auto Messages",
    description: "Sends a message to a channel at a set interval.",
    path: "/auto-messages",
  },
  {
    name: "Auto Roles",
    description:
      "Automatically assigns roles to new members of your server as soon as they join.",
    path: "/auto-roles",
  },
  {
    name: "Bump Reminders",
    description: "Reminds members to re-bump your server after a set period.",
    path: "/bump-reminders",
  },
  {
    name: "Forms",
    description:
      "Adds dynamic application forms within the bot's direct messages.",
    path: "/forms",
  },
  {
    name: "Join to Creates",
    description:
      "Creates a temporary voice channel, then deletes it once all members have left.",
    path: "/join-to-create",
  },
  {
    name: "Levels",
    description:
      "Rewards activity with XP and level-ups as members reach milestones.",
    path: "/levels",
  },
  {
    name: "Reaction Roles",
    description: "Lets members self-assign roles by reacting to a message.",
    path: "/reaction-roles",
  },
  {
    name: "Tickets",
    description:
      "Lets members create individualised staff assistance channels.",
    path: "/tickets",
  },
  {
    name: "Twitch Notifications",
    description: "Notifies your server when a Twitch streamer goes live.",
    path: "/twitch-notifications",
  },
  {
    name: "Warnings",
    description: "Helps moderators add, remove, and track member warnings.",
    path: "/warnings",
  },
  {
    name: "Welcome Messages",
    description: "Gives new members a warm welcome to your server.",
    path: "/welcome-messages",
  },
] as const satisfies ModulesConfig[]
