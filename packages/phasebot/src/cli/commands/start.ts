import { Command } from "commander"

import { getConfig } from "~/cli/utils"
import { PhaseClient } from "~/client"

export default new Command("start")
  .description("run the bot in production mode")
  .action(async () => {
    const client = new PhaseClient({
      config: await getConfig(),
      dev: false,
    })

    await client.init()
  })
