import type { ModuleId } from "@repo/config/phase/modules.ts"
import type { GuildModules } from "@repo/database"
import type { GuildMember } from "discord.js"

type SelfRolesMessage = GuildModules[ModuleId.SelfRoles]["messages"][number]

export function updateRoles(
  member: GuildMember,
  message: SelfRolesMessage,
  methodIndex: number,
) {
  const { roles } = message!.methods[methodIndex]!

  const rolesToAdd = roles.filter((role) => role.action === "add")
  const rolesToRemove = roles.filter((role) => role.action === "remove")

  if (rolesToAdd.length) {
    member.roles.add(rolesToAdd.map(({ id }) => id)).catch(() => null)
  }

  if (rolesToRemove.length) {
    member.roles.remove(rolesToRemove.map(({ id }) => id)).catch(() => null)
  }
}
