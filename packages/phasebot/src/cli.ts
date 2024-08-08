#!/usr/bin/env bun

import "~/plugins"

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
        await new PhaseClient({
          dev: true,
        }).init()
      }),
  )
  .addCommand(
    new Command("start")
      .description("run the bot in production mode")
      .action(async () => {
        await new PhaseClient({
          dev: false,
        }).init()
      }),
  )
  .parse()
