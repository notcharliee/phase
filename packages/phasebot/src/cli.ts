#!/usr/bin/env bun
import { Command } from "commander"

import { PhaseClient } from "~/client"
import { phaseFooter, phaseHeader } from "~/utils"
import { version } from "../package.json"

new Command("phase")
  .version(version, "-v, --version")
  .addHelpText("beforeAll", phaseHeader)
  .addHelpText("afterAll", phaseFooter)
  .showSuggestionAfterError(true)
  .addCommand(
    new Command("dev")
      .description("run the bot in development mode")
      .action(async () => {
        await new PhaseClient({ dev: true }).start()
      }),
  )
  .addCommand(
    new Command("start")
      .description("run the bot in production mode")
      .action(async () => {
        await new PhaseClient().start()
      }),
  )
  .addCommand(
    new Command("build").description("build the bot").action(async () => {
      console.log("Not implemented yet. Please use the CLI.")
    }),
  )
  .parse()
