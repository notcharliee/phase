import { Variable } from "~/variables/structures"

import type { Guild } from "discord.js"

export const counters = [
  new Variable({
    name: "ageInDays",
    description: "The age of the server in days.",
    syntax: /(?<!\\){ageInDays}/g,
    parse(value: string, guild: Guild) {
      const ageInDays = Math.floor(
        Date.now() / 1000 - guild.createdAt.getTime() / 1000,
      ).toString()

      return value.replaceAll(this.syntax, ageInDays)
    },
  }),
  new Variable({
    name: "boostCount",
    description: "The number of boosts in the server.",
    syntax: /(?<!\\){boostCount}/g,
    parse(value: string, guild: Guild) {
      const boostCount = (guild.premiumSubscriptionCount ?? 0).toString()

      return value.replaceAll(this.syntax, boostCount)
    },
  }),
  new Variable({
    name: "boostTarget",
    description: "The target boost level of the server.",
    syntax: /(?<!\\){boostTarget}/g,
    parse(value: string, guild: Guild) {
      const premiumTiers = ["2", "7", "14", "None"] as const
      const boostTarget = premiumTiers[guild.premiumTier].toString()

      return value.replaceAll(this.syntax, boostTarget)
    },
  }),
  new Variable({
    name: "channelCount",
    description: "The number of channels in the server.",
    syntax: /(?<!\\){channelCount}/g,
    parse(value: string, guild: Guild) {
      const channelCount = guild.channels.cache.size.toString()

      return value.replaceAll(this.syntax, channelCount)
    },
  }),
  new Variable({
    name: "memberCount",
    description: "The number of members in the server.",
    syntax: /(?<!\\){memberCount}/g,
    parse(value: string, guild: Guild) {
      const memberCount = guild.memberCount.toString()

      return value.replaceAll(this.syntax, memberCount)
    },
  }),
  new Variable({
    name: "onlineMemberCount",
    description: "The number of online members in the server.",
    syntax: /(?<!\\){onlineMemberCount}/g,
    parse(value: string, guild: Guild) {
      const onlineMemberCount = (guild.approximatePresenceCount ?? 0).toString()

      return value.replaceAll(this.syntax, onlineMemberCount)
    },
  }),
  new Variable({
    name: "offlineMemberCount",
    description: "The number of offline members in the server.",
    syntax: /(?<!\\){offlineMemberCount}/g,
    parse(value: string, guild: Guild) {
      const offlineMemberCount = (
        guild.memberCount - (guild.approximatePresenceCount ?? 0)
      ).toString()

      return value.replaceAll(this.syntax, offlineMemberCount)
    },
  }),
  new Variable({
    name: "roleCount",
    description: "The number of roles in the server.",
    syntax: /(?<!\\){roleCount}/g,
    parse(value: string, guild: Guild) {
      const roleCount = guild.roles.cache.size.toString()

      return value.replaceAll(this.syntax, roleCount)
    },
  }),
] as const satisfies Variable<any[]>[]
