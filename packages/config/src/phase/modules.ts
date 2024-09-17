export enum ModuleId {
  AuditLogs = "2uA4lWg9gW",
  AutoMessages = "2Cwqwmk84t",
  AutoRoles = "56Fd2OVE6Q",
  BumpReminders = "7ImdmYll1t",
  Counters = "5QvEVG03KK",
  Forms = "1uWxuEkesd",
  JoinToCreates = "67NXpiGedU",
  Levels = "23OmPKCPG0",
  ReactionRoles = "3MOVeYkTa1",
  SelfRoles = "5pZqVNWucH",
  Tickets = "7i5YEGu2Fj",
  TwitchNotifications = "1q4EDddac2",
  Warnings = "3aqDA1m91r",
  WelcomeMessages = "44Xaf7KFo1",
}

export const moduleTags = [
  "Moderation",
  "Engagement",
  "Utility",
  "Notifications",
  "New",
  "Beta",
] as const

export const modules = {
  [ModuleId.AuditLogs]: {
    name: "Audit Logs",
    description: `Logs audit log events in the channel of your choice.`,
    tags: ["Moderation"],
  },
  [ModuleId.AutoMessages]: {
    name: "Auto Messages",
    description: `Sends a message to a channel at a set interval.`,
    tags: ["Utility"],
  },
  [ModuleId.AutoRoles]: {
    name: "Auto Roles",
    description: `Assigns roles to new members of your server as soon as they join.`,
    tags: ["Utility"],
  },
  [ModuleId.BumpReminders]: {
    name: "Bump Reminders",
    description: `Reminds members to re-bump your server after a set period.`,
    tags: ["Engagement"],
  },
  [ModuleId.Counters]: {
    name: "Counters",
    description: `Displays server statistics directly in your channel names.`,
    tags: ["Utility"],
  },
  [ModuleId.Forms]: {
    name: "Forms",
    description: `Adds dynamic application forms within the bot's DMs.`,
    tags: ["Utility"],
  },
  [ModuleId.JoinToCreates]: {
    name: "Join to Creates",
    description: `Creates a temporary voice channel, then deletes it once all members have left.`,
    tags: ["Utility"],
  },
  [ModuleId.Levels]: {
    name: "Levels",
    description: `Rewards activity with XP and level-ups as members reach milestones.`,
    tags: ["Engagement"],
  },
  [ModuleId.ReactionRoles]: {
    name: "Reaction Roles",
    description: `Lets members self-assign roles by reacting to a message.`,
    tags: ["Utility"],
  },
  [ModuleId.SelfRoles]: {
    name: "Self Roles",
    description: `Lets members self-assign roles through buttons, dropdowns, and reactions.`,
    tags: ["Utility", "Beta"],
  },
  [ModuleId.Tickets]: {
    name: "Tickets",
    description: `Lets members create individualised staff assistance channels.`,
    tags: ["Utility"],
  },
  [ModuleId.TwitchNotifications]: {
    name: "Twitch Notifications",
    description: `Notifies your server when a Twitch streamer goes live.`,
    tags: ["Notifications"],
  },
  [ModuleId.Warnings]: {
    name: "Warnings",
    description: `Helps moderators add, remove, and track member warnings.`,
    tags: ["Moderation"],
  },
  [ModuleId.WelcomeMessages]: {
    name: "Welcome Messages",
    description: `Gives new members a warm welcome to your server.`,
    tags: ["Engagement"],
  },
} as const satisfies Record<
  string,
  {
    name: string
    description: string
    tags?: (typeof moduleTags)[number][]
  }
>
