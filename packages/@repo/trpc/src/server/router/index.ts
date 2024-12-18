import { guildsRouter } from "~/server/router/guilds"
import { publicProcedure, router } from "~/server/trpc"

export const appRouter = router({
  guilds: guildsRouter,
  status: publicProcedure.query(({ ctx }) => {
    const { client } = ctx

    const config = client.stores.config
    const statusType = config.status.type as "idle" | "dnd" | "online"

    const status =
      statusType === "idle"
        ? "Minor issues"
        : statusType === "dnd"
          ? "Major issues"
          : "Operational"

    const statusText = config.status.text

    return {
      status,
      statusText,
      uptime: client.uptime,
      latency: client.ws.ping,
    }
  }),
})

export type AppRouter = typeof appRouter
