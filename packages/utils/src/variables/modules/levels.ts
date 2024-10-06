import { Variable } from "~/variables/structures"

import type { Snowflake, User } from "discord.js"

interface Level {
  guild: Snowflake
  user: Snowflake
  level: number
  xp: number
}

export const levels = [
  new Variable<[User, Level]>({
    name: "member",
    description: "The member's mention.",
    syntax: /(?<!\\){member}/g,
    parse(value: string, user: User) {
      const memberMention = `<@${user.id}>`

      return value.replaceAll(this.syntax, memberMention)
    },
  }),
  new Variable<[User, Level]>({
    name: "member.name",
    description: "The member's username.",
    syntax: /(?<!\\){member.name}/g,
    parse(value: string, user: User) {
      const memberName = user.username

      return value.replaceAll(this.syntax, memberName)
    },
  }),
  new Variable<[User, Level]>({
    name: "member.level",
    description: "The member's level.",
    syntax: /(?<!\\){member.level}/g,
    parse(value: string, _user: User, level: Level) {
      const memberLevel = level.level

      return value.replaceAll(this.syntax, memberLevel.toString())
    },
  }),
  new Variable<[User, Level]>({
    name: "member.xp",
    description: "The member's xp.",
    syntax: /(?<!\\){member.xp}/g,
    parse(value: string, _user: User, level: Level) {
      const memberXp = level.xp

      return value.replaceAll(this.syntax, memberXp.toString())
    },
  }),
  new Variable<[User, Level]>({
    name: "member.target",
    description: "The member's target xp.",
    syntax: /(?<!\\){member.target}/g,
    parse(value: string, _user: User, level: Level) {
      const memberTarget = 500 * (level.level + 1)

      return value.replaceAll(this.syntax, memberTarget.toString())
    },
  }),
] as const satisfies Variable<[User, Level]>[]
