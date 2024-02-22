interface ModulesConfig {
  name: string,
  description: string,
  label?: string,
  path?: string,
  disabled?: boolean,
}


export const modulesConfig: ModulesConfig[] = [
  {
    name: "Audit Logs",
    description: "Sends a log of all server events to the channel of your choice.",
    path: "/audit-logs",
  },
  {
    name: "Auto Partners",
    description: "Manages adverts and tracks invite stats across your partnered servers.",
    path: "/auto-partners",
    disabled: true,
  },
  {
    name: "Auto Roles",
    description: "Automatically assigns roles to new members of your server as soon as they join.",
    path: "/auto-roles",
  },
  {
    name: "Join to Create",
    description: "Creates a temporary voice channel, then deletes it once all members have left.",
    path: "/join-to-create",
  },
  {
    name: "Levels",
    description: "Rewards activity with XP and level-ups as members reach milestones.",
    path: "/levels",
    disabled: true,
  },
  {
    name: "Reaction Roles",
    description: "Lets members self-assign roles by reacting to a message.",
    path: "/reaction-roles",
  },
  {
    name: "Tickets",
    description: "Lets members create individualised staff assistance channels.",
    path: "/tickets",
    disabled: true,
  },
]
