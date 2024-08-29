"use server"

import { ModuleId } from "@repo/config/phase/modules.ts"

import { database } from "~/lib/db"

import {
  handleAutoMessagesModule,
  handleFormsModule,
  handleReactionRolesModule,
  handleTicketsModule,
  parseModuleData,
} from "~/app/dashboard/modules/_utils/server"
import { getDashboardHeaders } from "~/app/dashboard/utils"
import { moduleIdSchema, modulesSchema } from "~/validators/modules"

import type { GuildModules } from "~/lib/db"
import type {
  GuildModulesWithData,
  ModulesFormValues,
  ModulesFormValuesWithData,
} from "~/types/dashboard"

export async function updateModules(
  unsafeFormValues: ModulesFormValues,
  unsafeDirtyFields: ModuleId[],
) {
  const { guildId, userId } = getDashboardHeaders()

  const db = await database.init()

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

  const parsedModules: Partial<GuildModules> = {}

  const parsedModulesToSet: Partial<
    Record<`modules.${ModuleId}`, GuildModules[ModuleId]>
  > = {}

  for (const moduleId of dirtyFields) {
    const formData = formValues[moduleId]
    const moduleData = await parseModuleData(moduleId, formData)
    const moduleDataToSet = { [`modules.${moduleId}`]: moduleData[moduleId] }

    Object.assign(parsedModules, moduleData)
    Object.assign(parsedModulesToSet, moduleDataToSet)
  }

  await guildDoc.updateOne({
    $set: parsedModulesToSet,
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
      ] as ModulesFormValuesWithData[ModuleId.Forms])!._data.messages
    }
  }

  if (parsedModulesWithData[ModuleId.Tickets]) {
    if (dirtyFields.includes(ModuleId.Tickets)) {
      const updatedModule = parsedModulesWithData[ModuleId.Tickets]
      const messageContent = formValues[ModuleId.Tickets]!.message

      const updatedMessage = await handleTicketsModule(
        updatedModule.channel,
        updatedModule.tickets,
        messageContent,
      )

      updatedModule._data.message = updatedMessage
    } else {
      parsedModulesWithData[ModuleId.Tickets]._data.message = (unsafeFormValues[
        ModuleId.Tickets
      ] as ModulesFormValuesWithData[ModuleId.Tickets])!._data.message
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
        ] as ModulesFormValuesWithData[ModuleId.TwitchNotifications])!._data.streamerNames
    }
  }

  return parsedModulesWithData
}
