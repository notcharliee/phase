import { NextResponse } from "next/server"


export type ExtractResponseType<T> = T extends NextResponse<infer R> ? R : never

export type ExtractAPIType<T extends (params: any) => Promise<NextResponse<any>>> = ExtractResponseType<Awaited<ReturnType<T>>>


export type { GetBotResponse } from "@/app/api/bot/route"
export type { GetBotCommandsResponse } from "@/app/api/bot/commands/route"
