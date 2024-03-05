import { type NextRequest, type NextResponse } from "next/server"

export type ExtractResponseType<T> = T extends NextResponse<infer R> ? R : never

export type ExtractAPIType<
  T extends (request: NextRequest) => Promise<NextResponse<unknown>>,
> = T extends (request: NextRequest) => Promise<NextResponse<infer R>>
  ? Exclude<R, { error: unknown }>
  : never

export type { GetBotResponse } from "@/app/api/bot/route"
export type { GetBotCommandsResponse } from "@/app/api/bot/commands/route"
export type { GetBotStatusResponse } from "@/app/api/bot/status/route"

export type { GetLevelsGuildResponse } from "@/app/api/levels/guild/route"
export type { GetLevelsUserResponse } from "@/app/api/levels/user/route"
