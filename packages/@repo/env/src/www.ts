import { createEnv } from "@t3-oss/env-nextjs"
import { vercel } from "@t3-oss/env-nextjs/presets"
import { z } from "zod"

import { shared } from "~/shared"

export function www() {
  return createEnv({
    extends: [vercel(), shared()],
    emptyStringAsUndefined: true,
    experimental__runtimeEnv: {},
    skipValidation: !!process.env.SKIP_ENV_VALIDATION,
    server: {
      BRIDGE_DOMAIN: z.string().default("http://localhost:4000"),
    },
  })
}
