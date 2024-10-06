import { ModuleId } from "~/modules"
import { counters } from "~/variables/modules/counters"
import { levels } from "~/variables/modules/levels"
import { welcomeMessages } from "~/variables/modules/welcome-messages"
import { VariableGroup } from "~/variables/structures"

export const moduleVariables = {
  [ModuleId.Counters]: new VariableGroup(counters),
  [ModuleId.Levels]: new VariableGroup(levels),
  [ModuleId.WelcomeMessages]: new VariableGroup(welcomeMessages),
} as const
