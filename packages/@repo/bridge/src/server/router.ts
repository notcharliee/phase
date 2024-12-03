import { z } from "zod"

import { publicProcedure, router } from "~/server/trpc"

export const appRouter = router({
  hello: publicProcedure
    .input(z.object({ name: z.string() }))
    .query(({ input }) => {
      return `Hello ${input.name}!`
    }),
})

export type AppRouter = typeof appRouter
