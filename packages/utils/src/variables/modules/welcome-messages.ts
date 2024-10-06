import { Variable } from "~/variables/structures"

import type { GuildMember } from "discord.js"

export const welcomeMessages = [
  new Variable<[GuildMember]>({
    name: "memberCount",
    description: "The number of members in the server.",
    syntax: /(?<!\\){memberCount}/g,
    parse(value: string, guildMember: GuildMember) {
      const memberCount = guildMember.guild.memberCount.toString()

      return value.replaceAll(this.syntax, memberCount)
    },
  }),
  new Variable<[GuildMember]>({
    name: "username",
    description: "The username of the member.",
    syntax: /(?<!\\){username}/g,
    parse(value: string, guildMember: GuildMember) {
      const username = guildMember.user.username.toString()

      return value.replaceAll(this.syntax, username)
    },
  }),
] as const satisfies Variable<[GuildMember]>[]
