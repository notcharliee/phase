import { ModuleId } from "~/modules/constants/ids"
import { Variable } from "~/modules/structures/Variable"
import { VariableGroup } from "~/modules/structures/VariableGroup"

import type { ModuleDefinition } from "~/modules/types/definitions"
import type { GuildMember } from "discord.js"

export const welcomeMessages = {
  id: ModuleId.WelcomeMessages,
  name: "Welcome Messages",
  description: "Sends a customised welcome message to new members.",
  tags: ["Engagement"],
  variables: new VariableGroup<[GuildMember]>([
    new Variable({
      name: "memberCount",
      description: "The number of members in the server.",
      syntax: /(?<!\\){memberCount}/g,
      parse(value, guildMember) {
        const memberCount = guildMember.guild.memberCount.toString()

        return value.replaceAll(this.syntax, memberCount)
      },
    }),
    new Variable({
      name: "username",
      description: "The username of the member.",
      syntax: /(?<!\\){username}/g,
      parse(value, guildMember) {
        const username = guildMember.user.username.toString()

        return value.replaceAll(this.syntax, username)
      },
    }),
  ]),
} as const satisfies ModuleDefinition
