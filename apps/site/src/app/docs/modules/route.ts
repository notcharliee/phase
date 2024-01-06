import { NextResponse } from "next/server"
import modules from "@/lib/modules"

export const GET = () =>
  NextResponse.redirect(modules[0]!.docs_url)
