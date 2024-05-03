import { PhaseConfig } from "~/cli/utils"

export const setConfig = (params: PhaseConfig) => params
export type { PhaseConfig }

export * from "~/utils/botCommand"
export * from "~/utils/botEvent"
export * from "~/utils/botCronJob"
