import { ModuleId } from "@repo/config/phase/modules.ts"
import { v4 as randomUUID } from "uuid"

import { safeMs } from "~/lib/utils"

import type { GuildModules } from "~/lib/db"
import type { GuildModulesWithData } from "~/types/dashboard"
import type { modulesSchema } from "~/validators/modules"
import type { APIMessage } from "discord-api-types/v10"
import type { z } from "zod"

type FormValues = z.infer<typeof modulesSchema>

export const defaultValues: Required<FormValues> = {
  [ModuleId.AuditLogs]: {
    enabled: false,
    channels: {
      server: "",
      members: "",
      messages: "",
      punishments: "",
      voice: "",
      invites: "",
    },
  },
  [ModuleId.AutoMessages]: {
    enabled: false,
    messages: [
      {
        name: "",
        channel: "",
        content: "",
        interval: "",
      },
    ],
  },
  [ModuleId.AutoRoles]: {
    enabled: false,
    roles: [],
  },
  [ModuleId.BumpReminders]: {
    enabled: false,
    time: "",
    initialMessage: "",
    reminderMessage: "",
  },
  [ModuleId.Counters]: {
    enabled: false,
    counters: [
      {
        name: "",
        channel: "",
        content: "",
      },
    ],
  },
  [ModuleId.Forms]: {
    enabled: false,
    channel: "",
    forms: [
      {
        id: randomUUID(),
        name: "Form 1",
        channel: "",
        questions: [],
      },
    ],
  },
  [ModuleId.JoinToCreates]: {
    enabled: false,
    channel: "",
    category: "",
    active: [],
  },
  [ModuleId.Levels]: {
    enabled: false,
    channel: "",
    message: "",
    background: undefined,
    mention: false,
    roles: [],
  },
  [ModuleId.ReactionRoles]: {
    enabled: false,
    messageUrl: "",
    reactions: [
      {
        emoji: "",
        role: "",
      },
    ],
  },
  [ModuleId.Tickets]: {
    enabled: false,
    channel: "",
    message: "",
    max_open: undefined,
    tickets: [
      {
        id: randomUUID(),
        name: "Ticket 1",
        message: "",
        mention: undefined,
      },
    ],
  },
  [ModuleId.TwitchNotifications]: {
    enabled: false,
    streamers: [
      {
        id: "",
        channel: "",
        mention: undefined,
      },
    ],
  },
  [ModuleId.Warnings]: {
    enabled: false,
    warnings: [],
  },
  [ModuleId.WelcomeMessages]: {
    enabled: false,
    channel: "",
    message: "",
    mention: false,
    card: {
      enabled: false,
      background: undefined,
    },
  },
}

export const getDirtyFields = <
  TData extends Partial<Record<keyof TDirtyItems, unknown>>,
  TDirtyItems extends Record<string, unknown>,
>(
  formValues: TData,
  dirtyItems: TDirtyItems,
): Partial<TData> => {
  return Object.entries(dirtyItems).reduce((dirtyData, [key, value]) => {
    if (value === false || !(key in formValues)) return dirtyData
    if (value === true) return { ...dirtyData, [key]: true }

    const child = getDirtyFields(
      formValues[key] as TData,
      dirtyItems[key] as TDirtyItems,
    )

    if (typeof child === "object" && Object.keys(child).length === 0) {
      return dirtyData
    }

    if (Array.isArray(child) && child.length === 0) {
      return dirtyData
    }

    return {
      ...dirtyData,
      [key]: child,
    }
  }, {})
}

export function getDefaultValues(
  guildId: string,
  modules: Partial<GuildModules>,
): FormValues {
  const parsedValues: FormValues = {}

  const moduleParsers: {
    [K in ModuleId]?: (data: Required<GuildModulesWithData>[K]) => FormValues[K]
  } = {
    [ModuleId.AutoMessages]: (data) => ({
      ...data,
      messages: data.messages.map((msg) => ({
        ...msg,
        interval: safeMs(msg.interval, { long: true })!,
        content: msg.message,
      })),
    }),
    [ModuleId.AutoRoles]: (data) => ({
      ...data,
      roles: data.roles.map((roleId) => ({
        id: roleId,
      })),
    }),
    [ModuleId.BumpReminders]: (data) => ({
      ...data,
      time: safeMs(data.time, { long: true })!,
    }),
    [ModuleId.Forms]: (data) => ({
      ...data,
      forms: data.forms.map((form) => ({
        ...form,
        questions: form.questions.map((question) => ({ question })),
      })),
    }),
    [ModuleId.ReactionRoles]: (data) => ({
      ...data,
      messageUrl: `https://discord.com/channels/${guildId}/${data.channel}/${data.message}`,
    }),
    [ModuleId.Tickets]: (data) => {
      const message = data._data?.message as APIMessage | undefined
      const messageContent = message?.embeds?.[0]?.description

      return {
        ...data,
        message: messageContent ?? "",
      }
    },
    [ModuleId.TwitchNotifications]: (data) => ({
      ...data,
      streamers: data.streamers.map((streamer, index) => {
        const streamerNames = data._data?.streamerNames as string[] | undefined
        const streamerName = streamerNames?.[index]

        return {
          ...streamer,
          id: streamerName ?? "unknown",
        }
      }),
    }),
    [ModuleId.Warnings]: (data) => ({
      ...data,
      warnings: data.warnings.map((role: string) => ({
        role,
      })),
    }),
  }

  if (!modules) return parsedValues

  for (const [moduleId, moduleData] of Object.entries(modules) as [
    ModuleId,
    GuildModulesWithData[ModuleId],
  ][]) {
    const moduleParser = moduleParsers[moduleId]

    // @ts-expect-error type safety is very tricky here
    parsedValues[moduleId] = moduleParser
      ? moduleParser(moduleData as never)
      : moduleData
  }

  return parsedValues
}
