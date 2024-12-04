import { ModuleId } from "~/modules/constants/ids"
import { Variable } from "~/modules/structures/Variable"
import { VariableGroup } from "~/modules/structures/VariableGroup"

import type { ModuleDefinition } from "~/modules/types/definitions"
import type { User } from "discord.js"

type Level = {
  guild: string
  user: string
  level: number
  xp: number
}

export const levels = {
  id: ModuleId.Levels,
  name: "Levels",
  description: "Rewards member activity with XP, level-ups, and special roles",
  tags: ["Utility"],
  variables: new VariableGroup<[User, Level]>([
    new Variable({
      name: "member",
      description: "The member's mention.",
      syntax: /(?<!\\){member}/g,
      parse(value, user, _level) {
        const memberMention = `<@${user.id}>`

        return value.replaceAll(this.syntax, memberMention)
      },
    }),
    new Variable({
      name: "member.name",
      description: "The member's username.",
      syntax: /(?<!\\){member.name}/g,
      parse(value, user, _level) {
        const memberName = user.username

        return value.replaceAll(this.syntax, memberName)
      },
    }),
    new Variable({
      name: "member.level",
      description: "The member's level.",
      syntax: /(?<!\\){member.level}/g,
      parse(value, _user, level) {
        const memberLevel = level.level

        return value.replaceAll(this.syntax, memberLevel.toString())
      },
    }),
    new Variable({
      name: "member.xp",
      description: "The member's xp.",
      syntax: /(?<!\\){member.xp}/g,
      parse(value, _user, level) {
        const memberXp = level.xp

        return value.replaceAll(this.syntax, memberXp.toString())
      },
    }),
    new Variable({
      name: "member.target",
      description: "The member's target xp.",
      syntax: /(?<!\\){member.target}/g,
      parse(value, _user, level) {
        const memberTarget = 500 * (level.level + 1)

        return value.replaceAll(this.syntax, memberTarget.toString())
      },
    }),
  ]),
} as const satisfies ModuleDefinition
