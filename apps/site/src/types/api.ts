import { NextResponse } from "next/server"


export type ExtractResponseType<T> = T extends NextResponse<infer R> ? R : never

export type ExtractAPIType<T extends (request: any) => Promise<NextResponse<any>>> = 
  T extends (request: any) => Promise<NextResponse<infer R>> ? Exclude<R, { error: any }> : never;


export type { GetBotResponse } from "@/app/api/bot/route"
export type { GetBotCommandsResponse } from "@/app/api/bot/commands/route"

export type { GetLevelsGuildResponse } from "@/app/api/levels/guild/route"
export type { GetLevelsUserResponse } from "@/app/api/levels/user/route"
