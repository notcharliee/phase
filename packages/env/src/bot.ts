import { createEnv } from "@t3-oss/env-core"
import { railway } from "@t3-oss/env-core/presets"

import { shared } from "~/shared"

export function bot() {
  return createEnv({
    extends: [railway(), shared()],
    emptyStringAsUndefined: true,
    runtimeEnv: process.env,
    server: {},
  })
}
