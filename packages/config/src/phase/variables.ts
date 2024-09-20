import { ModuleId } from "./modules"

export interface Variable {
  name: string
  description: string
}

export const moduleVariables = {
  [ModuleId.Counters]: [
    {
      name: "ageInDays",
      description: "The age of the server in days.",
    },
    {
      name: "boostCount",
      description: "The number of boosts in the server.",
    },
    {
      name: "boostTarget",
      description: "The target boost level of the server.",
    },
    {
      name: "channelCount",
      description: "The number of channels in the server.",
    },
    {
      name: "memberCount",
      description: "The number of members in the server.",
    },
    {
      name: "onlineMemberCount",
      description: "The number of online members in the server.",
    },
    {
      name: "offlineMemberCount",
      description: "The number of offline members in the server.",
    },
    {
      name: "roleCount",
      description: "The number of roles in the server.",
    }
  ],
} satisfies Partial<Record<ModuleId, Variable[]>>
