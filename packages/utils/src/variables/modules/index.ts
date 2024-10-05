import { ModuleId } from "~/modules"
import { counters } from "~/variables/modules/counters"
import { welcomeMessages } from "~/variables/modules/welcome-messages"
import { VariableGroup } from "~/variables/structures"

export const moduleVariables = {
  [ModuleId.Counters]: new VariableGroup(counters),
  [ModuleId.WelcomeMessages]: new VariableGroup(welcomeMessages),
} as const
