import { ModuleId } from "~/modules/constants/ids"
import { Variable } from "~/modules/structures/Variable"
import { VariableGroup } from "~/modules/structures/VariableGroup"

import type { ModuleDefinition } from "~/modules/types/definitions"
import type { Guild } from "discord.js"

export const counters = {
  id: ModuleId.Counters,
  name: "Counters",
  description: "Displays a counter in the names of the channels you specify.",
  tags: ["Utility"],
  variables: new VariableGroup<[Guild]>([
    new Variable({
      name: "ageInDays",
      description: "The age of the server in days.",
      syntax: /(?<!\\){ageInDays}/g,
      parse(value, guild) {
        const createdTime = guild.createdAt.getTime()
        const currentTime = Date.now()
        const ageInMilliseconds = currentTime - createdTime
        const ageInDays = Math.floor(ageInMilliseconds / 1000 / 60 / 60 / 24)
        return value.replaceAll(this.syntax, ageInDays.toString())
      },
    }),
    new Variable({
      name: "boostCount",
      description: "The number of boosts in the server.",
      syntax: /(?<!\\){boostCount}/g,
      parse(value, guild) {
        const boostCount = (guild.premiumSubscriptionCount ?? 0).toString()
        return value.replaceAll(this.syntax, boostCount)
      },
    }),
    new Variable({
      name: "boostTarget",
      description: "The target boost level of the server.",
      syntax: /(?<!\\){boostTarget}/g,
      parse(value, guild) {
        const premiumTiers = ["2", "7", "14", "None"] as const
        const boostTarget = premiumTiers[guild.premiumTier].toString()
        return value.replaceAll(this.syntax, boostTarget)
      },
    }),
    new Variable({
      name: "channelCount",
      description: "The number of channels in the server.",
      syntax: /(?<!\\){channelCount}/g,
      parse(value, guild) {
        const channelCount = guild.channels.cache.size.toString()
        return value.replaceAll(this.syntax, channelCount)
      },
    }),
    new Variable({
      name: "memberCount",
      description: "The number of members in the server.",
      syntax: /(?<!\\){memberCount}/g,
      parse(value, guild) {
        const memberCount = guild.memberCount.toString()
        return value.replaceAll(this.syntax, memberCount)
      },
    }),
    new Variable({
      name: "onlineMemberCount",
      description: "The number of online members in the server.",
      syntax: /(?<!\\){onlineMemberCount}/g,
      parse(value, guild) {
        const onlineMemberCount = `${guild.approximatePresenceCount}`
        return value.replaceAll(this.syntax, onlineMemberCount)
      },
    }),
    new Variable({
      name: "offlineMemberCount",
      description: "The number of offline members in the server.",
      syntax: /(?<!\\){offlineMemberCount}/g,
      parse(value, guild) {
        const offlineMemberCount = `${guild.memberCount - (guild.approximatePresenceCount ?? 0)}`
        return value.replaceAll(this.syntax, offlineMemberCount)
      },
    }),
    new Variable({
      name: "roleCount",
      description: "The number of roles in the server.",
      syntax: /(?<!\\){roleCount}/g,
      parse(value, guild) {
        const roleCount = guild.roles.cache.size.toString()
        return value.replaceAll(this.syntax, roleCount)
      },
    }),
  ]),
} as const satisfies ModuleDefinition
