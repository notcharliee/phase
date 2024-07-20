import mongoose from "mongoose"

import { defineModel } from "~/utils"

export interface Guild {
  /** The guild's ID. */
  id: string
  /** The user IDs of the guild's admins. */
  admins: string[]
  /** The permission data for the guild's commands. */
  commands: Record<string, GuildCommand> | undefined
  /** The module configurations for guild. */
  modules: Partial<GuildModules> | undefined
}

export interface GuildCommand {
  /** Whether or not the command is disabled. */
  disabled: boolean
  /** The users/roles allowed to use the command. */
  allow: (`user:${string}` | `role:${string}`)[]
  /** The users/roles denied to use the command. */
  deny: (`user:${string}` | `role:${string}`)[]
}

export interface GuildModules {
  /** The Audit Log module configuration. */
  AuditLogs: {
    /** Whether or not the module is enabled. */
    enabled: boolean
    /** The channels to send logs to. */
    channels: {
      /** The channel to send server logs to. */
      server?: string
      /** The channel to send message logs to. */
      messages?: string
      /** The channel to send voice logs to. */
      voice?: string
      /** The channel to send invite logs to. */
      invites?: string
      /** The channel to send member logs to. */
      members?: string
      /** The channel to send punishment logs to. */
      punishments?: string
    }
  }

  /** The Auto Messages module configuration. */
  AutoMessages: {
    /** Whether or not the module is enabled. */
    enabled: boolean
    /** The messages to send. */
    messages: {
      /** The name of the message. */
      name: string
      /** The channel to send the message to. */
      channel: string
      /** The message to send. */
      message: string
      /** The role to mention. */
      mention?: string
      /** The interval to send the message. */
      interval: number
    }[]
  }

  /** The Auto Roles module configuration. */
  AutoRoles: {
    /** Whether or not the module is enabled. */
    enabled: boolean
    /** The IDs of the roles to assign. */
    roles: string[]
  }

  /** The Bump Reminders module configuration. */
  BumpReminders: {
    /** Whether or not the module is enabled. */
    enabled: boolean
    /** The time to wait before sending the reminder. */
    time: number
    /** The message to send when a member bumps. */
    initialMessage: string
    /** The message to send when a member is reminded to bump. */
    reminderMessage: string
  }

  /** The Forms module configuration. */
  Forms: {
    /** Whether or not the module is enabled. */
    enabled: boolean
    /** The channel to send form responses to. */
    channel: string
    /** The form data. */
    forms: {
      /** The ID of the form trigger message. */
      id: string
      /** The name of the form. */
      name: string
      /** The channel ID of the form trigger message. */
      channel: string
      /** The questions in the form. */
      questions: string[]
    }[]
  }

  /** The Join to Create module configuration. */
  JoinToCreates: {
    /** Whether or not the module is enabled. */
    enabled: boolean
    /** The IDs of the active join-to-create channels. */
    active: string[]
    /** The ID of the trigger channel. */
    channel: string
    /** The ID of the category to create the temporary channels in. */
    category: string
  }

  /** The Levels module configuration. */
  Levels: {
    /** Whether or not the module is enabled. */
    enabled: boolean
    /** The channel to send level-up messages to.
     *
     * - If the value is "dm", send the message to the user who leveled up.
     * - If the value is "reply", reply to the message that triggered the level-up.
     * - If the value is an ID, send the message to the channel with the ID.
     */
    channel: string
    /** The message to send when a member levels up. */
    message: string
    /** Whether or not to ping the member when they level up. */
    mention: boolean
    /** The background image URL to use for the level-up card. */
    background?: string
    /** The roles to assign to members at a specific level. */
    roles: {
      /** The level to assign the role to. */
      level: number
      /** The ID of the role to assign. */
      role: string
    }[]
  }

  /** The Reaction Roles module configuration. */
  ReactionRoles: {
    /** Whether or not the module is enabled. */
    enabled: boolean
    /** The ID of the channel the reaction role message is in. */
    channel: string
    /** The ID of the reaction role message.
     *
     * @remarks Usually a key named `message` would mean message content, but this is a special case where it means message ID because I'm dumb.
     */
    message: string
    /** The reactions to assign roles for. */
    reactions: {
      /** The emoji to react with. */
      emoji: string
      /** The ID of the role to assign. */
      role: string
    }[]
  }

  /** The Tickets module configuration. */
  Tickets: {
    /** Whether or not the module is enabled. */
    enabled: boolean
    /** The ID of the channel the panel is in. */
    channel: string
    /** The maximum number of open tickets. */
    max_open?: number
    /** The tickets attached to the panel. */
    tickets: {
      /** The ID of the ticket. */
      id: string
      /** The name of the ticket. */
      name: string
      /** The message to send when the ticket is opened. */
      message: string
      /** The role to mention when the ticket is opened. */
      mention?: string
    }[]
  }

  /** The Twitch Notifications module configuration. */
  TwitchNotifications: {
    /** Whether or not the module is enabled. */
    enabled: boolean
    /** The streamers to receive notifications for. */
    streamers: {
      /** The twitch ID of the streamer. */
      id: string
      /** The ID of the channel to send the notifications to. */
      channel: string
      /** The events to listen for. */
      events: ("stream.online" | "stream.offline")[]
      /** The role to mention when the streamer goes live. */
      mention?: string
    }[]
  }

  /** The Warnings module configuration. */
  Warnings: {
    /** Whether or not the module is enabled. */
    enabled: boolean
    /** The IDs of the warning roles. */
    warnings: string[]
  }

  /** The Welcome Messages module configuration. */
  WelcomeMessages: {
    /** Whether or not the module is enabled. */
    enabled: boolean
    /** The ID of the channel to send welcome messages to. */
    channel: string
    /** The message to send when a new member joins. */
    message: string
    /** Whether or not to ping the member when they join. */
    mention: boolean
    /** The welcome card configuration. */
    card: {
      /** Whether or not the welcome card is enabled. */
      enabled: boolean
      /** The background image URL to use for the welcome card. */
      background?: string
    }
  }
}

export const guilds = defineModel(
  "Guilds",
  new mongoose.Schema<Guild>({
    id: { type: String, required: true },
    admins: { type: [String], required: true },
    commands: {
      type: Map,
      of: new mongoose.Schema<GuildCommand>({
        disabled: { type: Boolean, required: true },
        allow: { type: [String], required: true },
        deny: { type: [String], required: true },
      }),
    },
    modules: {
      type: new mongoose.Schema<GuildModules>({
        AuditLogs: {
          type: new mongoose.Schema<GuildModules["AuditLogs"]>({
            enabled: { type: Boolean, required: true },
            channels: {
              type: new mongoose.Schema<GuildModules["AuditLogs"]["channels"]>({
                server: String,
                messages: String,
                voice: String,
                invites: String,
                members: String,
                punishments: String,
              }),
              required: true,
            },
          }),
        },
        AutoMessages: {
          type: new mongoose.Schema<GuildModules["AutoMessages"]>({
            enabled: { type: Boolean, required: true },
            messages: {
              type: [
                new mongoose.Schema<
                  GuildModules["AutoMessages"]["messages"][number]
                >({
                  name: { type: String, required: true },
                  channel: { type: String, required: true },
                  message: { type: String, required: true },
                  mention: String,
                  interval: { type: Number, required: true },
                }),
              ],
              required: true,
            },
          }),
        },
        AutoRoles: {
          type: new mongoose.Schema<GuildModules["AutoRoles"]>({
            enabled: { type: Boolean, required: true },
            roles: { type: [String], required: true },
          }),
        },
        BumpReminders: {
          type: new mongoose.Schema<GuildModules["BumpReminders"]>({
            enabled: { type: Boolean, required: true },
            time: { type: Number, required: true },
            initialMessage: { type: String, required: true },
            reminderMessage: { type: String, required: true },
          }),
        },
        Forms: {
          type: new mongoose.Schema<GuildModules["Forms"]>({
            enabled: { type: Boolean, required: true },
            channel: { type: String, required: true },
            forms: {
              type: [
                new mongoose.Schema<GuildModules["Forms"]["forms"][number]>({
                  id: { type: String, required: true },
                  name: { type: String, required: true },
                  channel: { type: String, required: true },
                  questions: { type: [String], required: true },
                }),
              ],
              required: true,
            },
          }),
        },
        JoinToCreates: {
          type: new mongoose.Schema<GuildModules["JoinToCreates"]>({
            enabled: { type: Boolean, required: true },
            active: { type: [String], required: true },
            channel: { type: String, required: true },
            category: { type: String, required: true },
          }),
        },
        Levels: {
          type: new mongoose.Schema<GuildModules["Levels"]>({
            enabled: { type: Boolean, required: true },
            channel: { type: String, required: true },
            message: { type: String, required: true },
            mention: { type: Boolean, required: true },
            background: { type: String, required: true },
            roles: {
              type: [
                new mongoose.Schema<GuildModules["Levels"]["roles"][number]>({
                  level: { type: Number, required: true },
                  role: { type: String, required: true },
                }),
              ],
              required: true,
            },
          }),
        },
        ReactionRoles: {
          type: new mongoose.Schema<GuildModules["ReactionRoles"]>({
            enabled: { type: Boolean, required: true },
            channel: { type: String, required: true },
            message: { type: String, required: true },
            reactions: {
              type: [
                new mongoose.Schema<
                  GuildModules["ReactionRoles"]["reactions"][number]
                >({
                  emoji: { type: String, required: true },
                  role: { type: String, required: true },
                }),
              ],
              required: true,
            },
          }),
        },
        Tickets: {
          type: new mongoose.Schema<GuildModules["Tickets"]>({
            enabled: { type: Boolean, required: true },
            channel: { type: String, required: true },
            max_open: { type: Number, required: true },
            tickets: {
              type: [
                new mongoose.Schema<GuildModules["Tickets"]["tickets"][number]>(
                  {
                    id: { type: String, required: true },
                    name: { type: String, required: true },
                    message: { type: String, required: true },
                    mention: String,
                  },
                ),
              ],
              required: true,
            },
          }),
        },
        TwitchNotifications: {
          type: new mongoose.Schema<GuildModules["TwitchNotifications"]>({
            enabled: { type: Boolean, required: true },
            streamers: {
              type: [
                new mongoose.Schema<
                  GuildModules["TwitchNotifications"]["streamers"][number]
                >({
                  id: { type: String, required: true },
                  channel: { type: String, required: true },
                  events: {
                    type: [String],
                    required: true,
                  },
                  mention: String,
                }),
              ],
              required: true,
            },
          }),
        },
        Warnings: {
          type: new mongoose.Schema<GuildModules["Warnings"]>({
            enabled: { type: Boolean, required: true },
            warnings: { type: [String], required: true },
          }),
        },
        WelcomeMessages: {
          type: new mongoose.Schema<GuildModules["WelcomeMessages"]>({
            enabled: { type: Boolean, required: true },
            channel: { type: String, required: true },
            message: { type: String, required: true },
            mention: { type: Boolean, required: true },
            card: {
              type: new mongoose.Schema<
                GuildModules["WelcomeMessages"]["card"]
              >({
                enabled: { type: Boolean, required: true },
                background: String,
              }),
              required: true,
            },
          }),
        },
      }),
    },
  }),
)
