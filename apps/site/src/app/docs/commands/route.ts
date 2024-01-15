import { NextResponse } from "next/server"

import { env } from "@/lib/env"
import commands from "@/lib/commands"

export const GET = () => 
  NextResponse.redirect(env.NEXT_PUBLIC_BASE_URL + "/docs/commands/" + commands[0]?.name.replaceAll(" ", "-"))
