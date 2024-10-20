import { createEnv } from "@t3-oss/env-nextjs"
import { vercel } from "@t3-oss/env-nextjs/presets"

import { shared } from "~/shared"

export function site() {
  return createEnv({
    extends: [vercel(), shared()],
    emptyStringAsUndefined: true,
    experimental__runtimeEnv: {},
    skipValidation: !!process.env.SKIP_ENV_VALIDATION,
    server: {},
  })
}
