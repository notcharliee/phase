import * as Discord from 'discord.js'
import * as Utils from 'phaseutils'
import * as fs from 'fs'


export default async function eventsHandler (client: Discord.Client<true>) {

  client.removeAllListeners()

  const eventDirectories = fs.readdirSync('./.build/events')
  const eventArray: Utils.Types.EventFile<keyof Discord.ClientEvents>[] = []


  // Loops over event directories and listens to their events.

  for (const eventDirectory of eventDirectories) {

    const eventFiles = fs.readdirSync(`./.build/events/${eventDirectory}`).filter((file: string) => file.endsWith('.js'))

    for (const eventFile of eventFiles) {

      const eventData: Utils.Types.EventFile<keyof Discord.ClientEvents> = await (await import(`../events/${eventDirectory}/${eventFile}`)).default

      eventArray.push(eventData)

      client.on(eventData.name, async (...data) => {
        eventData.execute(client, ...data).catch((error) => {
          Utils.Functions.alertDevs({
            title: 'Event execution failed',
            description: `${error}`,
            type: 'error'
          })
        })
      })

    }

  }


  return eventArray

}