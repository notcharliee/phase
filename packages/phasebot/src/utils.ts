import ansiEscapes from "ansi-escapes"
import chalk from "chalk"
import dedent from "dedent"
import ora from "ora"

import { version as packageVersion } from "../package.json"

export const phaseHeader = chalk.bold.white(`☽ PhaseBot v${packageVersion}`)

export const phaseFooter = chalk.whiteBright(
  "\n" +
    dedent`
    Made with ${chalk.bold("♡")} by ${chalk.reset.bold(ansiEscapes.link("mikaela", "https://github.com/notcharliee"))}.
    Source code is on ${chalk.reset.bold(ansiEscapes.link("GitHub", "https://github.com/notcharliee/phase"))}.
  `,
)

export const spinner = (params?: Parameters<typeof ora>[0]) => {
  if (typeof params === "string") params = { text: params }

  return ora({
    color: "white",
    interval: 20,
    stream: process.stdout as unknown as NodeJS.WritableStream,
    ...params,
  })
}
