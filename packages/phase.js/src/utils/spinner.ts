import ora from "ora"
import chalk from "chalk"


export const cliSpinner = async <T extends any> (promise: Promise<T>, loading: string, complete: string): Promise<T> => {
  const promiseSpinner = ora({
    text: loading,
    color: "white",
    spinner: {
      frames: ["🌕︎","🌖︎","🌗︎","🌘︎","🌑︎","🌒︎","🌓︎","🌔︎"],
      interval: 60,
    },
    stream: process.stdout,
  }).start()

  try {
    const value = await promise

    promiseSpinner.stopAndPersist({
      symbol: chalk.magentaBright("🌑︎"),
      text: complete,
    })

    return value
  } catch (error) {
    throw error
  }
}
