import { NextRequest } from "next/server"
import { imageResponse } from "@/utils/imageResponse"

export {
  runtime,
  dynamic,
} from "@/utils/imageResponse"

export const GET = (request: NextRequest) => imageResponse({
  fonts: [],
  width: 630,
  height: 1200,
}, (
  <div>{request.url}</div>
))