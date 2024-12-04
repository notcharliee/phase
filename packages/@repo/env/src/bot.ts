import { createEnv } from "@t3-oss/env-core"
import { railway } from "@t3-oss/env-core/presets"
import { z } from "zod"

import { shared } from "~/shared"

export function bot() {
  return createEnv({
    extends: [railway(), shared()],
    emptyStringAsUndefined: true,
    runtimeEnv: process.env,
    skipValidation: !!process.env.SKIP_ENV_VALIDATION,
    server: {
      PORT: z
        .string()
        .default("4000")
        .transform((str) => parseInt(str, 10)),
    },
  })
}
