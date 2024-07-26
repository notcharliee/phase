import { Command } from "commander"

import { getConfig } from "~/cli/utils"
import { PhaseClient } from "~/client"

export default new Command("dev")
  .description("run the bot in development mode")
  .action(async () => {
    const client = new PhaseClient({
      config: await getConfig(),
      dev: true,
    })

    await client.init()
  })
