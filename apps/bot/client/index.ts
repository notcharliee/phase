import * as Discord from 'discord.js'
import * as Utils from 'utils'

import commandsHandler from '#handlers/commands'
import eventsHandler from '#handlers/events'
import loopsHandler from '#handlers/loops'
import mongodbHandler from '#handlers/mongodb'

import intents from '#client/intents'
import partials from '#client/partials'

// Temp Files
import invitesLogsFuntion from './invites.temp.js'
import discordLogsFunction from './logs.temp.js'


// Configure Environment Variables
Utils.Functions.configEnvVars()


export const client = new Discord.Client({ intents, partials })

export let commandsArray: Utils.Types.SlashCommand[] = []
export let eventsArray: Utils.Types.EventFile<keyof Discord.ClientEvents>[] = []
export let loopsArray: Utils.Types.LoopFile[] = []


// Startup Bot

const startupTimings: { time: number, event: string, message: string }[] = []

const pushToStartupTimings = (event: string) => {

  const time = Date.now()
  const startTime = startupTimings.length ? startupTimings[0].time : time
  const message = `[\`${(Math.abs(startTime - time) / 1000).toFixed(2)}s\`] ${event}`

  startupTimings.push({
    time,
    event,
    message,
  })

}


let error: Error

startupClient()


// Startup Functions

async function startupClient () {

  try {

    pushToStartupTimings('Attempting to connect to client...')
    await client.login(process.env.DISCORD_TOKEN)
  
  } catch (e) {

    error = e as Error
  
  } finally {

    if (error) {

      pushToStartupTimings('Failed to connect to client.')
      return startupEnd(true)

    }
  
    pushToStartupTimings('Connection established successfully.\n')
    startupMongoDB()
  
  }

}


async function startupMongoDB () {

  try {

    pushToStartupTimings('Attempting to connect to MongoDB...')
    await mongodbHandler(process.env.DATABASE_URI)
  
  } catch (e) {
  
    error = e as Error
  
  } finally {

    if (error) {

      console.error(error)

      pushToStartupTimings('Failed to connect to MongoDB.')
      return startupEnd(true)

    }
  
    pushToStartupTimings('Connection established successfully.\n')
    startupCommandsHandler()
  
  }

}


async function startupCommandsHandler () {

  try {

    pushToStartupTimings('Attempting to start command handler...')
    commandsArray = await commandsHandler(client as Discord.Client<true>)
    
  } catch (e) {
  
    error = e as Error
  
  } finally {

    if (error || !commandsArray.length) {

      console.error(error)

      pushToStartupTimings('Failed to start command handler.')
      return startupEnd(true)

    }
  
    pushToStartupTimings('Started command handler successfully.\n')
    startupEventsHandler()
  
  }

}


async function startupEventsHandler () {

  try {

    pushToStartupTimings('Attempting to start event handler...')
    eventsArray = await eventsHandler(client as Discord.Client<true>)
  
  } catch (e) {

    error = e as Error
  
  } finally {

    if (error || !eventsArray.length) {

      console.error(error)

      pushToStartupTimings('Failed to start event handler.')
      return startupEnd(true)

    }
  
    pushToStartupTimings('Started event handler successfully.\n')
    startupLoopsHandler()
  
  }

}


async function startupLoopsHandler () {

  try {

    pushToStartupTimings('Attempting to start loop handler...')
    loopsArray = await loopsHandler(client as Discord.Client<true>)
  
  } catch (e) {

    error = e as Error
  
  } finally {

    if (error || !eventsArray.length) {

      console.error(error)

      pushToStartupTimings('Failed to start loop handler.')
      return startupEnd(true)

    }
  
    pushToStartupTimings('Started loop handler successfully.\n')
    pushToStartupTimings('Client online and operational.')
    startupEnd()
  
  }

}


async function startupEnd (failed?: boolean) {

  const webhookClient = new Discord.WebhookClient({ url: process.env.WEBHOOK_STATUS! })
  
  await webhookClient.send({
    embeds: [
      new Discord.EmbedBuilder()
      .setAuthor({ iconURL: client.user?.displayAvatarURL() ?? undefined, name: Utils.Constants.isDevEnv ? 'Phase [Alpha]' : 'Phase [Production]' })
      .setColor(failed ? Utils.Enums.PhaseColour.Failure : Utils.Enums.PhaseColour.Primary)
      .setDescription(
        `${commandsArray.length ? Utils.Enums.PhaseEmoji.Success : Utils.Enums.PhaseEmoji.Failure} Set up **${commandsArray.length}** client slash commands.\n` +
        `${eventsArray.length ? Utils.Enums.PhaseEmoji.Success : Utils.Enums.PhaseEmoji.Failure} Set up **${eventsArray.length}** client event listeners.\n` +
        `${loopsArray.length ? Utils.Enums.PhaseEmoji.Success : Utils.Enums.PhaseEmoji.Failure} Set up **${loopsArray.length}** client loops.\n` +
        `### Startup Timings\n` +
        `${startupTimings.map((timing) => timing.message).join('\n')}\n` +
        `### Client Status\n` +
        (failed
          ? `${Utils.Enums.PhaseEmoji.Failure} Offline`
          : `${Utils.Enums.PhaseEmoji.Success} Online in ${(Math.abs(startupTimings[0].time - startupTimings[startupTimings.length - 1].time) / 1000).toFixed(2)}s`)
      )
      .setTimestamp()
    ],
  })

  if (failed) {

    client.destroy()
    process.exit(0)

  }

  // Temp Functions
  invitesLogsFuntion(client as Discord.Client<true>)
  discordLogsFunction(client as Discord.Client<true>)

}


// Set Client Status

client.once('ready', async (client) => {

  const statusArray: Discord.ActivityOptions[] = [
    { type: Discord.ActivityType.Watching, name: 'chat chaos unfold 🍿', },  // Watching chat chaos unfold 🍿
    { type: Discord.ActivityType.Playing, name: '🪨📃✂️' },                 // Playing 🪨📃✂️
    { type: Discord.ActivityType.Listening, name: 'server drama ☕' },       // Listening to server drama ☕
    { type: Discord.ActivityType.Playing, name: 'TicTacToe' },               // Playing TicTacToe
    { type: Discord.ActivityType.Watching, name: 'you...' },                 // Watching you...
    { type: Discord.ActivityType.Playing, name: 'Connect-4' },               // Playing Connect-4
  ]

  let statusArrayIndex = 0

  client.user.setPresence({ status: 'idle', activities: [statusArray[statusArrayIndex]] })

  setInterval(() => {

    if (statusArrayIndex >= statusArray.length-1) statusArrayIndex = 0
    else statusArrayIndex++

    client.user.setPresence({ status: 'idle', activities: [statusArray[statusArrayIndex]] })
      
  }, 30 * 1000)

})