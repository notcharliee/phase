import { NextResponse } from "next/server"
import { env } from "@/env"
import commands from "./commands"

export const GET = () => (
  NextResponse.redirect(env.NEXT_PUBLIC_BASE_URL + "/docs/commands/" + commands[0]?.name.replaceAll(" ", "-"))
)