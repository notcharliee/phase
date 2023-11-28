import { NextResponse } from "next/server"

export const runtime = "edge"
export const dynamic = "force-static"

export function GET() {
  return NextResponse.redirect("https://www.buymeacoffee.com/notcharliee")
}
