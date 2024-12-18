import { ModuleId } from "@repo/utils/modules"
import { z } from "zod"

import { privateProcedure, router } from "~/server/trpc"

import type { GuildModules } from "@repo/db"
import type { APIRole, NonThreadGuildBasedChannel } from "discord.js"

type GuildModulesWithData = Partial<
  GuildModules &
    Record<
      ModuleId.TwitchNotifications,
      GuildModules[ModuleId.TwitchNotifications] & {
        _data: { streamerNames: Record<number, string> }
      }
    >
>

export const guildsRouter = router({
  getById: privateProcedure
    .input(z.object({ guildId: z.string(), adminId: z.string().optional() }))
    .query(async ({ ctx, input }) => {
      const { client } = ctx
      const { guildId, adminId } = input

      const dbGuild = client.stores.guilds.get(guildId)
      const djsGuild = client.guilds.cache.get(guildId)

      if (
        !dbGuild ||
        !djsGuild ||
        (adminId && !dbGuild.admins.includes(adminId))
      ) {
        return null
      }

      const apiChannels = djsGuild.channels.cache
        .filter((c): c is NonThreadGuildBasedChannel => !c.isThread())
        .map((channel) => ({
          id: channel.id,
          name: channel.name,
          type: channel.type,
          flags: channel.flags.toJSON(),
          parentId: channel.parentId,
          permissionOverwrites: channel.permissionOverwrites.cache.map(
            (overwrite) => ({
              id: overwrite.id,
              type: overwrite.type,
              allow: overwrite.allow.toJSON(),
              deny: overwrite.deny.toJSON(),
            }),
          ),
          position: channel.position,
        }))

      const apiRoles = djsGuild.roles.cache
        .filter((r) => r.id !== guildId)
        .map((role) => {
          return {
            id: role.id,
            name: role.name,
            color: role.color,
            hoist: role.hoist,
            position: role.position,
            permissions: role.permissions.toJSON(),
            flags: role.flags.toJSON(),
            managed: role.managed,
            mentionable: role.mentionable,
          } satisfies APIRole
        })

      const guildModules = { ...dbGuild.modules } as GuildModulesWithData

      if (guildModules[ModuleId.TwitchNotifications]) {
        const guildModule = guildModules[ModuleId.TwitchNotifications]
        const streamerNames: Record<number, string> = {}

        for (let i = 0; i < guildModule.streamers.length; i++) {
          const id = guildModule.streamers[i]!.id
          const name = client.stores.streamers.get(id)?.username
          if (name) streamerNames[i] = name
        }

        guildModule._data = {
          streamerNames,
        }
      }

      return {
        id: djsGuild.id,
        roles: apiRoles,
        channels: apiChannels,
        admins: dbGuild.admins,
        modules: guildModules,
      }
    }),

  getByAdminId: privateProcedure
    .input(z.object({ adminId: z.string() }))
    .query(({ ctx, input }) => {
      const { client } = ctx
      const { adminId } = input

      const dbGuildIds = client.stores.guilds
        .filter((guild) => guild.admins.includes(adminId))
        .map((guild) => guild.id)

      const guilds = client.guilds.cache
        .filter((guild) => dbGuildIds.includes(guild.id))
        .map((guild) => ({
          id: guild.id,
          name: guild.name,
          nameAcronym: guild.nameAcronym,
          iconURL: guild.iconURL({ size: 256 }),
          memberCount: guild.approximateMemberCount ?? 0,
          presenceCount: guild.approximatePresenceCount ?? 0,
        }))

      return guilds
    }),
})
