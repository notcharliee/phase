#!/usr/bin/env bun
import { Command } from "commander"

import { version } from "~/../package.json"
import { dev, start } from "~/cli/commands"
import { phaseGradient } from "~/cli/utils"

import "~/../plugins"

new Command("phase")
  .version(version)
  .showSuggestionAfterError(true)
  .addHelpText("afterAll", phaseGradient("\nThanks for using phasebot! ♡"))
  .addCommand(dev)
  .addCommand(start)
  .parse()
