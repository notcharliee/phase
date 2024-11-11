"use server"

import { ModuleId } from "@repo/utils/modules"

import { db } from "~/lib/db"
import { env } from "~/lib/env"
import { zod } from "~/lib/zod"

import {
  handleAutoMessagesModule,
  handleFormsModule,
  handleReactionRolesModule,
  handleSelfRolesModule,
  handleTicketsModule,
  parseModuleData,
} from "~/app/dashboard/guilds/[id]/modules/_utils/server"
import { auth } from "~/auth"
import { moduleIdSchema, modulesSchema } from "~/validators/modules"

import type {
  GuildModulesWithData,
  ModulesFormValuesOutput,
  ModulesFormValuesInputWithData,
} from "~/types/dashboard"
import type { GuildModules } from "~/types/db"

export async function updateModules(
  unsafeGuildId: string,
  unsafeFormValues: ModulesFormValuesOutput,
  unsafeDirtyFields: ModuleId[],
) {
  const userId = (await auth())!.user.id
  const guildId = zod.string().snowflake().parse(unsafeGuildId)

  await db.connect(env.MONGODB_URI)

  const guildDoc = await db.guilds.findOne({
    id: guildId,
    admins: { $in: userId },
  })

  if (!guildDoc) {
    throw new Error(
      `Could not find guild by id '${guildId}' with admin by id '${userId}'`,
    )
  }

  const formValues = modulesSchema.parse(unsafeFormValues)
  const dirtyFields = moduleIdSchema.array().parse(unsafeDirtyFields)

  const parsedModules: Partial<Record<ModuleId, GuildModules[ModuleId]>> = {}

  const parsedModulesToSet: Partial<
    Record<`modules.${ModuleId}`, GuildModules[ModuleId]>
  > = {}

  const parsedModulesToUnset: Partial<Record<`modules.${ModuleId}`, null>> = {}

  for (const moduleId of dirtyFields) {
    const formData = formValues[moduleId]
    const moduleData = await parseModuleData(moduleId, formData)

    if (moduleData === undefined) {
      parsedModulesToUnset[`modules.${moduleId}`] = null
    } else {
      parsedModulesToSet[`modules.${moduleId}`] = moduleData
      parsedModules[moduleId] = moduleData
    }
  }

  await guildDoc.updateOne({
    $set: parsedModulesToSet,
    $unset: parsedModulesToUnset,
  })

  const parsedModulesWithData = Object.entries(parsedModules).reduce(
    (acc, [key, value]) => {
      acc[key as ModuleId] = {
        ...value,
        _data: {} as never,
      } as never

      return acc
    },
    {} as GuildModulesWithData,
  )

  if (parsedModulesWithData[ModuleId.AutoMessages]) {
    if (dirtyFields.includes(ModuleId.AutoMessages)) {
      await handleAutoMessagesModule(
        guildId,
        parsedModulesWithData[ModuleId.AutoMessages].messages,
      )
    }
  }

  if (parsedModulesWithData[ModuleId.ReactionRoles]) {
    if (dirtyFields.includes(ModuleId.ReactionRoles)) {
      await handleReactionRolesModule(
        parsedModulesWithData[ModuleId.ReactionRoles].channel,
        parsedModulesWithData[ModuleId.ReactionRoles].message,
        parsedModulesWithData[ModuleId.ReactionRoles].reactions,
      )
    }
  }

  if (parsedModulesWithData[ModuleId.Forms]) {
    if (dirtyFields.includes(ModuleId.Forms)) {
      const updatedMessages = await handleFormsModule(
        parsedModulesWithData[ModuleId.Forms].forms,
      )

      parsedModulesWithData[ModuleId.Forms]._data.messages = updatedMessages
    } else {
      parsedModulesWithData[ModuleId.Forms]._data.messages = (unsafeFormValues[
        ModuleId.Forms
      ] as ModulesFormValuesInputWithData[ModuleId.Forms])!._data.messages
    }
  }

  if (parsedModulesWithData[ModuleId.SelfRoles]) {
    if (dirtyFields.includes(ModuleId.SelfRoles)) {
      await handleSelfRolesModule(
        parsedModulesWithData[ModuleId.SelfRoles].messages,
      )
    }
  }

  if (parsedModulesWithData[ModuleId.Tickets]) {
    if (dirtyFields.includes(ModuleId.Tickets)) {
      const updatedModule = parsedModulesWithData[ModuleId.Tickets]
      const messageContent = formValues[ModuleId.Tickets]!.message

      await handleTicketsModule(
        updatedModule.channel,
        updatedModule.tickets,
        messageContent,
      )

      updatedModule._data.messageContent = messageContent
    } else {
      parsedModulesWithData[ModuleId.Tickets]._data.messageContent =
        (unsafeFormValues[
          ModuleId.Tickets
        ] as ModulesFormValuesInputWithData[ModuleId.Tickets])!._data.messageContent
    }
  }

  if (parsedModulesWithData[ModuleId.TwitchNotifications]) {
    if (dirtyFields.includes(ModuleId.TwitchNotifications)) {
      const updatedModule = parsedModulesWithData[ModuleId.TwitchNotifications]

      const streamers = formValues[ModuleId.TwitchNotifications]!.streamers
      const streamerNames = streamers.map((streamer) => streamer.id)

      updatedModule._data.streamerNames = streamerNames
    } else {
      parsedModulesWithData[ModuleId.TwitchNotifications]._data.streamerNames =
        (unsafeFormValues[
          ModuleId.TwitchNotifications
        ] as ModulesFormValuesInputWithData[ModuleId.TwitchNotifications])!._data.streamerNames
    }
  }

  return {
    ...guildDoc.toObject().modules,
    ...parsedModulesWithData,
  }
}
