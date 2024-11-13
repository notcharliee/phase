import { ModuleId } from "@repo/utils/modules"

import { safeMs } from "~/lib/utils"
import { zod } from "~/lib/zod"

function moduleSchema<T extends Record<string, Zod.ZodType>>(schema: T) {
  return zod.object({ enabled: zod.boolean(), ...schema })
}

export const auditLogsSchema = moduleSchema({
  channels: zod.object({
    server: zod.string().snowflake().optional(),
    messages: zod.string().snowflake().optional(),
    voice: zod.string().snowflake().optional(),
    invites: zod.string().snowflake().optional(),
    members: zod.string().snowflake().optional(),
    punishments: zod.string().snowflake().optional(),
  }),
})

export const autoMessagesSchema = moduleSchema({
  messages: zod
    .object({
      name: zod
        .string()
        .nonempty("Name is required")
        .max(100, "Name cannot be longer than 100 characters"),
      channel: zod.string().snowflake("Channel is required"),
      content: zod
        .string()
        .nonempty("Content is required")
        .max(2000, "Content cannot be longer than 2000 characters"),
      mention: zod.string().mention().optional(),
      interval: zod
        .string()
        .nonempty("Interval is required")
        .max(100, "Interval cannot be longer than 100 characters")
        .refine(safeMs, "Invalid interval format"),
    })
    .array()
    .max(10),
})

export const autoRolesSchema = moduleSchema({
  roles: zod
    .object({
      id: zod.string().snowflake("Role is required"),
      target: zod.enum(["everyone", "members", "bots"]),
    })
    .array()
    .max(10),
})

export const bumpRemindersSchema = moduleSchema({
  time: zod
    .string()
    .nonempty("Time is required")
    .max(100, "Time cannot be longer than 100 characters")
    .refine(safeMs, "Invalid time format"),
  initialMessage: zod
    .string()
    .nonempty("Initial message is required")
    .max(2000, "Initial message cannot be longer than 2000 characters"),
  reminderMessage: zod
    .string()
    .nonempty("Reminder message is required")
    .max(2000, "Reminder message cannot be longer than 2000 characters"),
  mention: zod.string().mention().optional(),
})

export const countersSchema = moduleSchema({
  counters: zod
    .object({
      // name: zod.string().nonempty("Name is required"),
      channel: zod.string().snowflake("Channel is required"),
      content: zod
        .string()
        .nonempty("Content is required")
        .max(100, "Content cannot be longer than 100 characters"),
    })
    .array()
    .max(10),
})

export const formsSchema = moduleSchema({
  channel: zod.string().snowflake("Channel is required"),
  forms: zod
    .object({
      id: zod.string().uuid(),
      name: zod
        .string()
        .nonempty("Name is required")
        .max(32, "Name cannot be longer than 32 characters"),
      channel: zod.string().snowflake("Channel is required"),
      questions: zod
        .object({
          label: zod
            .string()
            .nonempty("Question is required")
            .max(128, "Question cannot be longer than 128 characters"),
          type: zod.enum(["string", "number", "boolean"]),
          required: zod.boolean(),
          choices: zod
            .string()
            .nonempty("Choice is required")
            .max(100, "Choice cannot be longer than 100 characters")
            .array()
            .max(10)
            .transform((arr) => (arr.length === 0 ? undefined : arr))
            .optional(),
          min: zod.number().min(0).max(1024).optional(),
          max: zod.number().min(0).max(1024).optional(),
        })
        .array()
        .min(1)
        .max(25),
    })
    .array()
    .max(10),
})

export const joinToCreatesSchema = moduleSchema({
  channel: zod.string().snowflake("Channel is required"),
  category: zod.string().snowflake("Category is required"),
})

export const levelsSchema = moduleSchema({
  replyType: zod.enum(["reply", "dm", "channel"]),
  channel: zod.string().optional(),
  message: zod
    .string()
    .nonempty("Message is required")
    .max(2000, "Message cannot be longer than 2000 characters"),
  background: zod
    .string()
    .url()
    .max(256, "Background URL cannot be longer than 256 characters")
    .optional()
    .transform((str) => str ?? undefined),
  mention: zod.boolean(),
  roles: zod
    .object({
      level: zod.number().int().min(1).max(1000),
      role: zod.string().snowflake("Role is required"),
    })
    .array()
    .max(100),
}).transform(({ channel, ...data }) => ({
  ...data,
  channel: data.replyType === "channel" ? channel! : data.replyType,
}))

export const reactionRolesSchema = moduleSchema({
  messageUrl: zod
    .string()
    .regex(
      /^https:\/\/discord\.com\/channels\/\d+\/\d+\/\d+$/,
      "URL does not match the Discord message URL pattern",
    ),
  reactions: zod
    .object({
      emoji: zod.string().nonempty("Emoji is required").emoji(),
      role: zod.string().snowflake("Role is required"),
    })
    .array()
    .max(20),
})

export const selfRolesSchema = moduleSchema({
  messages: zod
    .union([
      zod.object({
        id: zod.string().uuid(),
        type: zod.literal("reaction"),
        name: zod.string().nonempty("Name is required"),
        channel: zod.string().snowflake("Channel is required"),
        content: zod.string().nonempty("Content is required"),
        multiselect: zod.boolean(),
        methods: zod
          .object({
            id: zod.string().uuid(),
            emoji: zod.string().emoji("Emoji is required"),
            rolesToAdd: zod
              .string()
              .array()
              .max(10, "Maximum of 10 roles allowed")
              .default([]),
            rolesToRemove: zod
              .string()
              .array()
              .max(10, "Maximum of 10 roles allowed")
              .default([]),
          })
          .array()
          .min(1, "At least one method is required")
          .max(20, "Maximum of 20 methods allowed"),
      }),
      zod.object({
        id: zod.string().uuid(),
        type: zod.literal("button"),
        name: zod.string().nonempty("Name is required"),
        channel: zod.string().snowflake("Channel is required"),
        content: zod.string().nonempty("Content is required"),
        multiselect: zod.boolean().default(false),
        methods: zod
          .object({
            id: zod.string().uuid(),
            emoji: zod.string().emoji().optional(),
            label: zod
              .string()
              .nonempty("Label is required")
              .max(80, "Maximum of 80 characters allowed"),
            rolesToAdd: zod
              .string()
              .array()
              .max(10, "Maximum of 10 roles allowed")
              .default([]),
            rolesToRemove: zod
              .string()
              .array()
              .max(10, "Maximum of 10 roles allowed")
              .default([]),
          })
          .array()
          .min(1, "At least one method is required")
          .max(20, "Maximum of 20 methods allowed"),
      }),
      zod.object({
        id: zod.string().uuid(),
        type: zod.literal("dropdown"),
        name: zod
          .string()
          .nonempty("Name is required")
          .max(256, "Maximum of 256 characters allowed"),
        channel: zod.string().snowflake("Channel is required"),
        content: zod
          .string()
          .nonempty("Content is required")
          .max(512, "Maximum of 512 characters allowed"),
        multiselect: zod.boolean().default(false),
        methods: zod
          .object({
            id: zod.string().uuid(),
            emoji: zod.string().emoji().optional(),
            label: zod
              .string()
              .nonempty("Label is required")
              .max(80, "Maximum of 80 characters allowed"),
            rolesToAdd: zod
              .string()
              .snowflake()
              .array()
              .max(10, "Maximum of 10 roles allowed")
              .default([]),
            rolesToRemove: zod
              .string()
              .snowflake()
              .array()
              .max(10, "Maximum of 10 roles allowed")
              .default([]),
          })
          .array()
          .min(1, "At least one method is required")
          .max(20, "Maximum of 20 methods allowed"),
      }),
    ])
    .array()
    .min(1)
    .max(10, "Maximum of 10 messages allowed"),
})

export const ticketsSchema = moduleSchema({
  channel: zod.string().nonempty("Channel is required"),
  category: zod
    .string()
    .nullish()
    .transform((str) => str ?? undefined),
  message: zod
    .string()
    .max(1000, "Message must be less than 1000 characters")
    .trim()
    .nullish()
    .transform((str) => str ?? undefined),
  max_open: zod
    .number()
    .int()
    .nullish()
    .transform((int) => int ?? undefined),
  tickets: zod
    .object({
      id: zod.string().uuid(),
      name: zod
        .string()
        .nonempty("Name is required")
        .max(32, "Name cannot be longer than 32 characters"),
      message: zod
        .string()
        .nonempty("Message is required")
        .max(1000, "Message must be less than 1000 characters"),
      mention: zod
        .string()
        .nullish()
        .transform((str) => str ?? undefined),
      reason: zod
        .enum(["required", "optional", "disabled"])
        .default("disabled")
        .optional(),
    })
    .array()
    .max(5),
})

export const twitchNotificationsSchema = moduleSchema({
  streamers: zod
    .object({
      id: zod
        .string()
        .min(4, "The streamer name must be at least 4 characters")
        .max(25, "The streamer name must be less than 25 characters"),
      channel: zod.string().snowflake("You must select a channel"),
      mention: zod
        .string()
        .mention()
        .nullish()
        .transform((str) => str ?? undefined),
    })
    .array()
    .max(5),
})

export const warningsSchema = moduleSchema({
  warnings: zod
    .object({ role: zod.string().snowflake("Role is required") })
    .array()
    .max(10),
})

export const welcomeMessagesSchema = moduleSchema({
  channel: zod.string().snowflake("Channel is required"),
  message: zod
    .string()
    .nonempty("Message is required")
    .max(2000, "Message must be less than 2000 characters"),
  mention: zod.boolean(),
  card: zod.object({
    enabled: zod.boolean(),
    background: zod
      .string()
      .url()
      .max(256, "Background URL cannot be longer than 256 characters")
      .nullish()
      .transform((str) => str ?? undefined),
  }),
})

export const modulesSchema = zod
  .object({
    [ModuleId.AuditLogs]: auditLogsSchema,
    [ModuleId.AutoMessages]: autoMessagesSchema,
    [ModuleId.AutoRoles]: autoRolesSchema,
    [ModuleId.BumpReminders]: bumpRemindersSchema,
    [ModuleId.Counters]: countersSchema,
    [ModuleId.Forms]: formsSchema,
    [ModuleId.JoinToCreates]: joinToCreatesSchema,
    [ModuleId.Levels]: levelsSchema,
    [ModuleId.ReactionRoles]: reactionRolesSchema,
    [ModuleId.SelfRoles]: selfRolesSchema,
    [ModuleId.Tickets]: ticketsSchema,
    [ModuleId.TwitchNotifications]: twitchNotificationsSchema,
    [ModuleId.Warnings]: warningsSchema,
    [ModuleId.WelcomeMessages]: welcomeMessagesSchema,
  })
  .partial()

export const moduleIdSchema = zod.nativeEnum(ModuleId)
