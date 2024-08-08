// export enum ModuleId {
//   AuditLogs = "2uA4lWg9gW",
//   AutoMessages = "2Cwqwmk84t",
//   AutoRoles = "56Fd2OVE6Q",
//   BumpReminders = "7ImdmYll1t",
//   Counters = "5QvEVG03KK",
//   Forms = "1uWxuEkesd",
//   JoinToCreates = "67NXpiGedU",
//   Levels = "23OmPKCPG0",
//   ReactionRoles = "3MOVeYkTa1",
//   Tickets = "7i5YEGu2Fj",
//   TwitchNotifications = "1q4EDddac2",
//   Warnings = "3aqDA1m91r",
//   WelcomeMessages = "44Xaf7KFo1",
// }

export enum ModuleId {
  AuditLogs = "AuditLogs",
  AutoMessages = "AutoMessages",
  AutoRoles = "AutoRoles",
  BumpReminders = "BumpReminders",
  Counters = "Counters",
  Forms = "Forms",
  JoinToCreates = "JoinToCreates",
  Levels = "Levels",
  ReactionRoles = "ReactionRoles",
  Tickets = "Tickets",
  TwitchNotifications = "TwitchNotifications",
  Warnings = "Warnings",
  WelcomeMessages = "WelcomeMessages",
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
  // "2uA4lWg9gW":
  AuditLogs: {
    name: "Audit Logs",
    description: `Logs audit log events in the channel of your choice.`,
    tags: ["Moderation"],
  },
  // "2Cwqwmk84t":
  AutoMessages: {
    name: "Auto Messages",
    description: `Sends a message to a channel at a set interval.`,
    tags: ["Utility"],
  },
  // "56Fd2OVE6Q":
  AutoRoles: {
    name: "Auto Roles",
    description: `Assigns roles to new members of your server as soon as they join.`,
    tags: ["Utility"],
  },
  // "7ImdmYll1t":
  BumpReminders: {
    name: "Bump Reminders",
    description: `Reminds members to re-bump your server after a set period.`,
    tags: ["Engagement"],
  },
  // "5QvEVG03KK":
  Counters: {
    name: "Counters",
    description: `Displays server statistics directly in your channel names.`,
    tags: ["Utility", "New"],
  },
  // "1uWxuEkesd":
  Forms: {
    name: "Forms",
    description: `Adds dynamic application forms within the bot's DMs.`,
    tags: ["Utility"],
  },
  // "67NXpiGedU":
  JoinToCreates: {
    name: "Join to Creates",
    description: `Creates a temporary voice channel, then deletes it once all members have left.`,
    tags: ["Utility"],
  },
  // "23OmPKCPG0":
  Levels: {
    name: "Levels",
    description: `Rewards activity with XP and level-ups as members reach milestones.`,
    tags: ["Engagement"],
  },
  // "3MOVeYkTa1":
  ReactionRoles: {
    name: "Reaction Roles",
    description: `Lets members self-assign roles by reacting to a message.`,
    tags: ["Utility"],
  },
  // "7i5YEGu2Fj":
  Tickets: {
    name: "Tickets",
    description: `Lets members create individualised staff assistance channels.`,
    tags: ["Utility"],
  },
  // "1q4EDddac2":
  TwitchNotifications: {
    name: "Twitch Notifications",
    description: `Notifies your server when a Twitch streamer goes live.`,
    tags: ["Notifications"],
  },
  // "3aqDA1m91r":
  Warnings: {
    name: "Warnings",
    description: `Helps moderators add, remove, and track member warnings.`,
    tags: ["Moderation"],
  },
  // "44Xaf7KFo1":
  WelcomeMessages: {
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
