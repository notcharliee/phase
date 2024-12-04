import type { GuildModules } from "@repo/db"
import type { ModuleId } from "@repo/utils/modules"
import type { GuildMember } from "discord.js"

type SelfRolesMessage = GuildModules[ModuleId.SelfRoles]["messages"][number]

export async function updateRoles(
  member: GuildMember,
  message: SelfRolesMessage,
  methodIndex: number,
) {
  const { roles } = message.methods[methodIndex]!

  const rolesToAdd = roles
    .filter((role) => role.action === "add")
    .map(({ id }) => id)

  const rolesToRemove = roles
    .filter((role) => role.action === "remove")
    .map(({ id }) => id)

  if (rolesToAdd.length) {
    await member.roles.add(rolesToAdd).catch(() => null)
  }

  if (rolesToRemove.length) {
    await member.roles.remove(rolesToRemove).catch(() => null)
  }
}
