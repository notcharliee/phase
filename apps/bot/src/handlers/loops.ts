import * as Discord from 'discord.js'
import * as Utils from 'utils/bot'
import * as Schemas from 'utils/schemas'
import * as fs from 'fs'


export default async function loopsHandler (client: Discord.Client<true>) {

  const loopDirectories = fs.readdirSync('./.build/loops')
  const loopArray: Utils.Types.LoopFile[] = []


  // Loops over loop directories and starts an interval.

  for (const loopDirectory of loopDirectories) {

    const loopFiles = fs.readdirSync(`./.build/loops/${loopDirectory}`).filter((file: string) => file.endsWith('.js'))

    for (const eventFile of loopFiles) {

      const loopData: Utils.Types.LoopFile = await (await import(`../loops/${loopDirectory}/${eventFile}`)).default

      loopArray.push(loopData)

      setInterval(() => { loopData.execute(client).catch((error) => {
        Utils.Functions.alertDevs({
          title: 'Event execution failed',
          description: `${error}`,
          type: 'error'
        })
      })}, loopData.interval)

    }

  }


  return loopArray

}