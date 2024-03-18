import { existsSync } from "node:fs"
import { pathToFileURL } from "node:url"
import { basename, extname, resolve } from "node:path"

import { BotCronJob } from "~/utils/botCronJob"
import { getAllFiles } from "~/utils/getAllFiles"

import { Client } from "discord.js"
import { CronJob as CronJobNPM } from "cron"


export const handleCronJobs = async (client: Client<boolean>) => {
  const cronJobs: Record<string, ReturnType<BotCronJob>> = {}
  const cronJobDir = resolve(process.cwd(), "build/crons")

  if (!existsSync(pathToFileURL(cronJobDir))) return cronJobs

  for (const cronJobFile of getAllFiles(cronJobDir)) {
    try {
      const cronJobFunction: ReturnType<BotCronJob> = await (await import(pathToFileURL(cronJobFile).toString())).default
      cronJobs[basename(cronJobDir, extname(cronJobDir))] = cronJobFunction

      if (client.isReady()) addCronJob(cronJobFunction, client)
      else client.once("ready", (readyClient) => { addCronJob(cronJobFunction, readyClient) })
    } catch (error) {
      throw error
    }
  }

  return cronJobs
}


const addCronJob = (cronJob: ReturnType<BotCronJob>, client: Client<true>) => {
  new CronJobNPM (
    cronJob.cronTime,
    () => cronJob.execute(client),
    null,
    true,
  )
}