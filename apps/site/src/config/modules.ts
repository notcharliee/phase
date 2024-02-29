interface ModulesConfig {
  name: string
  description: string
  path: string
  disabled: boolean
}

export const modulesConfig = [
  {
    name: "Audit Logs",
    description:
      "Sends a log of all server events to the channel of your choice.",
    path: "/audit-logs",
    disabled: false,
  },
  {
    name: "Auto Roles",
    description:
      "Automatically assigns roles to new members of your server as soon as they join.",
    path: "/auto-roles",
    disabled: false,
  },
  {
    name: "Forms",
    description: "Adds dynamic application forms within the bot's direct messages.",
    path: "/forms",
    disabled: false,
  },
  {
    name: "Join to Create",
    description:
      "Creates a temporary voice channel, then deletes it once all members have left.",
    path: "/join-to-create",
    disabled: false,
  },
  {
    name: "Levels",
    description:
      "Rewards activity with XP and level-ups as members reach milestones.",
    path: "/levels",
    disabled: false,
  },
  {
    name: "Reaction Roles",
    description: "Lets members self-assign roles by reacting to a message.",
    path: "/reaction-roles",
    disabled: false,
  },
  {
    name: "Tickets",
    description:
      "Lets members create individualised staff assistance channels.",
    path: "/tickets",
    disabled: false,
  },
  {
    name: "Warnings",
    description: "Helps moderators add, remove, and track member warnings.",
    path: "/warnings",
    disabled: false,
  },
  {
    name: "Welcome Messages",
    description: "Gives new members a warm welcome to your server.",
    path: "/welcome-messages",
    disabled: false,
  },
] as const satisfies ModulesConfig[]
