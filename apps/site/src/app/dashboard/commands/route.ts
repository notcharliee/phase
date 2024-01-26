import { NextRequest, NextResponse } from "next/server"

import { dashboardConfig } from "@/config/dashboard"

export const GET = (request: NextRequest) =>
  NextResponse.redirect(new URL(dashboardConfig.sidebarNav[1]?.items[0]?.href!, request.url))
