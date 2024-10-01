import { ModuleId } from "@repo/config/phase/modules.ts"
import { z } from "zod"

import { safeMs } from "~/lib/utils"

export const auditLogsSchema = z.object({
  enabled: z.boolean(),
  channels: z.object({
    server: z.string().optional(),
    messages: z.string().optional(),
    voice: z.string().optional(),
    invites: z.string().optional(),
    members: z.string().optional(),
    punishments: z.string().optional(),
  }),
})

export const autoMessagesSchema = z.object({
  enabled: z.boolean(),
  messages: z.array(
    z.object({
      name: z
        .string()
        .min(1, "Name is required")
        .max(100, "Name cannot be longer than 100 characters"),
      channel: z.string().min(1, "Channel is required"),
      content: z
        .string()
        .min(1, "Content is required")
        .max(2000, "Content cannot be longer than 2000 characters"),
      mention: z.string().optional(),
      interval: z
        .string()
        .min(2, { message: "Interval is required" })
        .max(100, { message: "Interval cannot be longer than 100 characters" })
        .refine(safeMs, { message: "Invalid interval format" }),
    }),
  ),
})

export const autoRolesSchema = z.object({
  enabled: z.boolean(),
  roles: z
    .array(
      z.object({
        id: z.string().min(1, { message: "Role is required" }),
        target: z.enum(["everyone", "members", "bots"]),
      }),
    )
    .max(10),
})

export const bumpRemindersSchema = z.object({
  enabled: z.boolean(),
  time: z
    .string()
    .min(2, { message: "Time is required" })
    .max(100, { message: "Time cannot be longer than 100 characters" })
    .refine(safeMs, { message: "Invalid time format" }),
  initialMessage: z
    .string()
    .min(1, { message: "Initial message is required" })
    .max(2000, {
      message: "Initial message cannot be longer than 2000 characters",
    }),
  reminderMessage: z
    .string()
    .min(1, { message: "Reminder message is required" })
    .max(2000, {
      message: "Reminder message cannot be longer than 2000 characters",
    }),
  mention: z.string().optional(),
})

export const countersSchema = z.object({
  enabled: z.boolean(),
  counters: z.array(
    z.object({
      name: z.string().min(1, {
        message: "You must provide a counter name",
      }),
      channel: z.string().min(1, {
        message: "You must select a channel",
      }),
      content: z
        .string()
        .min(1, {
          message: "Content must be at least 1 character",
        })
        .max(100, {
          message: "Content cannot be longer than 100 characters",
        }),
    }),
  ),
})

export const formsSchema = z.object({
  enabled: z.boolean(),
  channel: z.string().min(1, {
    message: "You must select a channel",
  }),
  forms: z
    .array(
      z.object({
        id: z.string(),
        name: z
          .string()
          .min(1, {
            message: "Name must be at least 1 character",
          })
          .max(32, {
            message: "Name cannot be longer than 32 characters",
          }),
        channel: z.string().min(1, {
          message: "You must select a channel",
        }),
        questions: z
          .array(
            z.object({
              label: z
                .string()
                .min(1, {
                  message: "Question must be at least 1 character",
                })
                .max(128, {
                  message: "Question cannot be longer than 128 characters",
                }),
              type: z.enum(["string", "number", "boolean"]),
              required: z.boolean(),
              choices: z
                .string()
                .min(1, {
                  message: "Choice must be at least 1 character",
                })
                .max(100, {
                  message: "Choice cannot be longer than 100 characters",
                })
                .array()
                .max(10)
                .transform((v) => (v.length === 0 ? undefined : v))
                .optional(),
              min: z.number().min(0).max(1024).optional(),
              max: z.number().min(0).max(1024).optional(),
            }),
          )
          .min(1)
          .max(25),
      }),
    )
    .max(10),
})

export const joinToCreatesSchema = z.object({
  enabled: z.boolean(),
  channel: z.string().min(1, {
    message: "Channel is required",
  }),
  category: z.string().min(1, {
    message: "Category is required",
  }),
  active: z.string().array(),
})

export const levelsSchema = z.object({
  enabled: z.boolean(),
  channel: z.string().min(1, {
    message: "Channel is required",
  }),
  message: z
    .string()
    .min(1, {
      message: "Message is required",
    })
    .max(2000, {
      message: "Message must be less than 2000 characters",
    }),
  background: z
    .string()
    .url()
    .max(256, {
      message: "Background must be less than 256 characters",
    })
    .refine((value) => /\.(jpeg|jpg|png)$/.exec(value), {
      message: "Background must be a valid PNG or JPEG image URL",
    })
    .optional()
    .transform((str) => (str?.length ? str : undefined)),
  mention: z.boolean(),
  roles: z
    .array(
      z.object({
        level: z.number().min(1).max(100).int(),
        role: z.string(),
      }),
    )
    .max(100),
})

export const reactionRolesSchema = z.object({
  enabled: z.boolean(),
  messageUrl: z
    .string()
    .url()
    .refine(
      (url) => {
        const discordChannelRegex =
          /^https:\/\/discord\.com\/channels\/\d+\/\d+\/\d+$/
        return discordChannelRegex.test(url)
      },
      {
        message: "URL does not match the Discord message URL pattern",
      },
    ),
  reactions: z
    .array(
      z.object({
        emoji: z.string().emoji().min(1, {
          message: "Emoji is required",
        }),
        role: z.string().min(1, {
          message: "Role is required",
        }),
      }),
    )
    .max(20),
})

export const selfRolesSchema = z.object({
  enabled: z.boolean(),
  messages: z
    .union([
      z.object({
        id: z.string().uuid(),
        type: z.literal("reaction"),
        name: z.string().min(1, { message: "Name is required" }),
        channel: z.string().min(1, { message: "Channel is required" }),
        content: z.string().min(1, { message: "Content is required" }),
        multiselect: z.boolean(),
        methods: z
          .object({
            id: z.string().uuid(),
            emoji: z.string().emoji(),
            rolesToAdd: z
              .string()
              .array()
              .max(10, { message: "Maximum of 10 roles allowed" })
              .default([]),
            rolesToRemove: z
              .string()
              .array()
              .max(10, { message: "Maximum of 10 roles allowed" })
              .default([]),
          })
          .array()
          .min(1, { message: "At least one method is required" })
          .max(20, { message: "Maximum of 20 methods allowed" }),
      }),
      z.object({
        id: z.string().uuid(),
        type: z.literal("button"),
        name: z.string().min(1, { message: "Name is required" }),
        channel: z.string().min(1, { message: "Channel is required" }),
        content: z.string().min(1, { message: "Content is required" }),
        multiselect: z.boolean(),
        methods: z
          .object({
            id: z.string().uuid(),
            emoji: z.string().emoji().optional(),
            label: z
              .string()
              .min(1, { message: "Label is required" })
              .max(80, { message: "Maximum of 80 characters allowed" }),
            rolesToAdd: z
              .string()
              .array()
              .max(10, { message: "Maximum of 10 roles allowed" })
              .default([]),
            rolesToRemove: z
              .string()
              .array()
              .max(10, { message: "Maximum of 10 roles allowed" })
              .default([]),
          })
          .array()
          .min(1, { message: "At least one method is required" })
          .max(20, { message: "Maximum of 20 methods allowed" }),
      }),
      z.object({
        id: z.string().uuid(),
        type: z.literal("dropdown"),
        name: z
          .string()
          .min(1, { message: "Name is required" })
          .max(256, { message: "Maximum of 256 characters allowed" }),
        channel: z.string().min(1, { message: "Channel is required" }),
        content: z
          .string()
          .min(1, { message: "Content is required" })
          .max(512, { message: "Maximum of 512 characters allowed" }),
        multiselect: z.boolean().default(false),
        methods: z
          .object({
            id: z.string().uuid(),
            emoji: z.string().emoji().optional(),
            label: z
              .string()
              .min(1, { message: "Label is required" })
              .max(80, { message: "Maximum of 80 characters allowed" }),
            rolesToAdd: z
              .string()
              .array()
              .max(10, { message: "Maximum of 10 roles allowed" })
              .default([]),
            rolesToRemove: z
              .string()
              .array()
              .max(10, { message: "Maximum of 10 roles allowed" })
              .default([]),
          })
          .array()
          .min(1, { message: "At least one method is required" })
          .max(20, { message: "Maximum of 20 methods allowed" }),
      }),
    ])
    .array()
    .min(1)
    .max(10, { message: "Maximum of 10 messages allowed" }),
})

export const ticketsSchema = z.object({
  enabled: z.boolean(),
  channel: z.string().min(1, {
    message: "Channel is required",
  }),
  message: z.string().min(1, {
    message: "Message is required",
  }),
  max_open: z
    .number()
    .int()
    .optional()
    .transform((num) => (num === Infinity ? undefined : num)),
  tickets: z
    .array(
      z.object({
        id: z.string(),
        name: z.string().min(1, {
          message: "Name is required",
        }),
        message: z.string().min(1, {
          message: "Message is required",
        }),
        mention: z.string().optional(),
      }),
    )
    .max(5),
})

export const twitchNotificationsSchema = z.object({
  enabled: z.boolean(),
  streamers: z
    .array(
      z.object({
        id: z
          .string()
          .min(4, {
            message: "The streamer name must be at least 4 characters",
          })
          .max(25, {
            message: "The streamer name must be less than 25 characters",
          }),
        channel: z.string().min(1, {
          message: "You must select a channel",
        }),
        mention: z
          .string()
          .optional()
          .transform((str) => (str?.length ? str : undefined)),
      }),
    )
    .max(5),
})

export const warningsSchema = z.object({
  enabled: z.boolean(),
  warnings: z
    .array(
      z.object({
        role: z.string().min(1, {
          message: "Role is required",
        }),
      }),
    )
    .max(10),
})

export const welcomeMessagesSchema = z.object({
  enabled: z.boolean(),
  channel: z.string().min(1, {
    message: "Channel is required",
  }),
  message: z.string(),
  mention: z.boolean(),
  card: z.object({
    enabled: z.boolean(),
    background: z
      .string()
      .url()
      .optional()
      .transform((str) => (str?.length ? str : undefined)),
  }),
})

export const modulesSchema = z.object({
  [ModuleId.AuditLogs]: auditLogsSchema.optional(),
  [ModuleId.AutoMessages]: autoMessagesSchema.optional(),
  [ModuleId.AutoRoles]: autoRolesSchema.optional(),
  [ModuleId.BumpReminders]: bumpRemindersSchema.optional(),
  [ModuleId.Counters]: countersSchema.optional(),
  [ModuleId.Forms]: formsSchema.optional(),
  [ModuleId.JoinToCreates]: joinToCreatesSchema.optional(),
  [ModuleId.Levels]: levelsSchema.optional(),
  [ModuleId.ReactionRoles]: reactionRolesSchema.optional(),
  [ModuleId.SelfRoles]: selfRolesSchema.optional(),
  [ModuleId.Tickets]: ticketsSchema.optional(),
  [ModuleId.TwitchNotifications]: twitchNotificationsSchema.optional(),
  [ModuleId.Warnings]: warningsSchema.optional(),
  [ModuleId.WelcomeMessages]: welcomeMessagesSchema.optional(),
})

export const moduleIdSchema = z.nativeEnum(ModuleId)
