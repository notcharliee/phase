import { NextRequest } from "next/server"
import { imageResponse } from "@/utils/imageResponse"

export const runtime = "edge"
export const dynamic = "force-dynamic"

export const GET = (request: NextRequest) => imageResponse({
  fonts: [600],
  width: 630,
  height: 1200,
}, (
  <div>{request.url}</div>
))