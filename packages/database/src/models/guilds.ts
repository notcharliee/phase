import { ModuleId } from "@repo/config/phase/modules.ts"
import mongoose from "mongoose"

import { defineModel } from "~/utils"

// commands (subdocument) //

export interface GuildCommand {
  disabled: boolean
  allow: (`user:${string}` | `role:${string}`)[]
  deny: (`user:${string}` | `role:${string}`)[]
}

const commandSchema = new mongoose.Schema<GuildCommand>(
  {
    disabled: { type: Boolean, required: true },
    allow: { type: [String], required: true },
    deny: { type: [String], required: true },
  },
  { _id: false },
)

// modules (subdocument) //

export interface GuildModules {
  [ModuleId.AuditLogs]: {
    enabled: boolean
    channels: {
      server?: string
      messages?: string
      voice?: string
      invites?: string
      members?: string
      punishments?: string
    }
  }
  [ModuleId.AutoMessages]: {
    enabled: boolean
    messages: {
      name: string
      channel: string
      message: string
      interval: number
      mention?: string
    }[]
  }
  [ModuleId.AutoRoles]: {
    enabled: boolean
    roles: {
      id: string
      target: "everyone" | "members" | "bots"
    }[]
  }
  [ModuleId.BumpReminders]: {
    enabled: boolean
    time: number
    initialMessage: string
    reminderMessage: string
    mention?: string
  }
  [ModuleId.Counters]: {
    enabled: boolean
    counters: {
      name: string
      channel: string
      content: string
    }[]
  }
  [ModuleId.Forms]: {
    enabled: boolean
    channel: string
    forms: {
      id: string
      name: string
      channel: string
      questions: (string | {
        label: string
        type: "string" | "number" | "boolean"
        required: boolean
        choices?: string[]
        min?: number
        max?: number
      })[]
    }[]
  }
  [ModuleId.JoinToCreates]: {
    enabled: boolean
    channel: string
    category: string
    active: string[]
  }
  [ModuleId.Levels]: {
    enabled: boolean
    /**
     * @remarks
     * - If the value is `"dm"`, the message is sent directly to the user who leveled up.
     * - If the value is `"reply"`, the message replies to the message that triggered the level-up.
     * - If the value is a channel ID, the message is sent to the channel with that ID.
     */
    channel: string
    message: string
    mention: boolean
    background?: string
    roles: {
      level: number
      role: string
    }[]
  }
  [ModuleId.ReactionRoles]: {
    enabled: boolean
    channel: string
    /**
     * @remarks Usually a key named `message` would mean message content, but in this case it means message ID because I'm dumb.
     */
    message: string
    reactions: {
      emoji: string
      role: string
    }[]
  }
  [ModuleId.Tickets]: {
    enabled: boolean
    channel: string
    max_open?: number
    tickets: {
      id: string
      name: string
      message: string
      mention?: string
    }[]
  }
  [ModuleId.TwitchNotifications]: {
    enabled: boolean
    streamers: {
      id: string
      channel: string
      mention?: string
    }[]
  }
  [ModuleId.Warnings]: {
    enabled: boolean
    warnings: string[]
  }
  [ModuleId.WelcomeMessages]: {
    enabled: boolean
    channel: string
    message: string
    mention: boolean
    card: {
      enabled: boolean
      background?: string
    }
  }
}

const modulesSchema = new mongoose.Schema<GuildModules>(
  {
    [ModuleId.AuditLogs]: new mongoose.Schema(
      {
        enabled: { type: Boolean, required: true },
        channels: {
          type: new mongoose.Schema(
            {
              server: String,
              messages: String,
              voice: String,
              invites: String,
              members: String,
              punishments: String,
            },
            { _id: false },
          ),
          required: true,
        },
      },
      { _id: false },
    ),

    [ModuleId.AutoMessages]: new mongoose.Schema(
      {
        enabled: { type: Boolean, required: true },
        messages: {
          type: [
            new mongoose.Schema(
              {
                name: { type: String, required: true },
                channel: { type: String, required: true },
                message: { type: String, required: true },
                interval: { type: Number, required: true },
                mention: String,
              },
              { _id: false },
            ),
          ],
          required: true,
        },
      },
      { _id: false },
    ),

    [ModuleId.AutoRoles]: new mongoose.Schema(
      {
        enabled: { type: Boolean, required: true },
        roles: {
          type: [
            new mongoose.Schema(
              {
                id: { type: String, required: true },
                target: { type: String, required: true },
              },
              { _id: false },
            ),
          ],
          required: true,
        },
      },
      { _id: false },
    ),

    [ModuleId.BumpReminders]: new mongoose.Schema(
      {
        enabled: { type: Boolean, required: true },
        time: { type: Number, required: true },
        initialMessage: { type: String, required: true },
        reminderMessage: { type: String, required: true },
        mention: { type: String },
      },
      { _id: false },
    ),

    [ModuleId.Counters]: new mongoose.Schema(
      {
        enabled: { type: Boolean, required: true },
        counters: {
          type: [
            new mongoose.Schema(
              {
                name: { type: String, required: true },
                channel: { type: String, required: true },
                content: { type: String, required: true },
              },
              { _id: false },
            ),
          ],
          required: true,
        },
      },
      { _id: false },
    ),

    [ModuleId.Forms]: new mongoose.Schema(
      {
        enabled: { type: Boolean, required: true },
        channel: { type: String, required: true },
        forms: {
          type: [
            new mongoose.Schema(
              {
                id: { type: String, required: true },
                name: { type: String, required: true },
                channel: { type: String, required: true },
                questions: { type: Array, required: true },
              },
              { _id: false },
            ),
          ],
          required: true,
        },
      },
      { _id: false },
    ),

    [ModuleId.JoinToCreates]: new mongoose.Schema(
      {
        enabled: { type: Boolean, required: true },
        channel: { type: String, required: true },
        category: { type: String, required: true },
        active: { type: [String], required: true },
      },
      { _id: false },
    ),

    [ModuleId.Levels]: new mongoose.Schema(
      {
        enabled: { type: Boolean, required: true },
        channel: { type: String, required: true },
        message: { type: String, required: true },
        mention: { type: Boolean, required: true },
        background: { type: String },
        roles: {
          type: [
            new mongoose.Schema(
              {
                level: { type: Number, required: true },
                role: { type: String, required: true },
              },
              { _id: false },
            ),
          ],
          required: true,
        },
      },
      { _id: false },
    ),

    [ModuleId.ReactionRoles]: new mongoose.Schema(
      {
        enabled: { type: Boolean, required: true },
        channel: { type: String, required: true },
        message: { type: String, required: true },
        reactions: {
          type: [
            new mongoose.Schema(
              {
                emoji: { type: String, required: true },
                role: { type: String, required: true },
              },
              { _id: false },
            ),
          ],
          required: true,
        },
      },
      { _id: false },
    ),

    [ModuleId.Tickets]: new mongoose.Schema(
      {
        enabled: { type: Boolean, required: true },
        channel: { type: String, required: true },
        max_open: { type: Number, required: true },
        tickets: {
          type: [
            new mongoose.Schema(
              {
                id: { type: String, required: true },
                name: { type: String, required: true },
                message: { type: String, required: true },
                mention: String,
              },
              { _id: false },
            ),
          ],
          required: true,
        },
      },
      { _id: false },
    ),

    [ModuleId.TwitchNotifications]: new mongoose.Schema(
      {
        enabled: { type: Boolean, required: true },
        streamers: {
          type: [
            new mongoose.Schema(
              {
                id: { type: String, required: true },
                channel: { type: String, required: true },
                mention: { type: String },
              },
              { _id: false },
            ),
          ],
          required: true,
        },
      },
      { _id: false },
    ),

    [ModuleId.Warnings]: new mongoose.Schema(
      {
        enabled: { type: Boolean, required: true },
        warnings: { type: [String], required: true },
      },
      { _id: false },
    ),

    [ModuleId.WelcomeMessages]: new mongoose.Schema(
      {
        enabled: { type: Boolean, required: true },
        channel: { type: String, required: true },
        message: { type: String, required: true },
        mention: { type: Boolean, required: true },
        card: new mongoose.Schema(
          {
            enabled: { type: Boolean, required: true },
            background: { type: String },
          },
          { _id: false },
        ),
      },
      { _id: false },
    ),
  },
  { _id: false },
)

// guild (document) //

export interface Guild {
  id: string
  admins: string[]
  commands?: Map<string, GuildCommand>
  modules?: Partial<GuildModules>
}

export const guilds = defineModel(
  "Guilds",
  new mongoose.Schema<Guild>(
    {
      id: {
        type: String,
        required: true,
      },
      admins: {
        type: [String],
        required: true,
        default: [],
      },
      commands: {
        type: Map,
        of: commandSchema,
        required: false,
        default: {},
      },
      modules: {
        type: modulesSchema,
        required: false,
        default: {},
      },
    },
    {
      minimize: false,
    },
  ),
  {
    id: { unique: true },
  },
)
