import { initTRPC, TRPCError } from "@trpc/server"

import type { Context } from "~/server/context"

const t = initTRPC.context<Context>().create()

const privateMiddleware = t.middleware(async ({ ctx, next }) => {
  const { isAuthorized } = ctx

  if (!isAuthorized) {
    throw new TRPCError({
      code: "UNAUTHORIZED",
      message: "Unauthorized",
    })
  }

  return next({ ctx })
})

export const router = t.router
export const publicProcedure = t.procedure
export const privateProcedure = t.procedure.use(privateMiddleware)
