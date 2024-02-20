import { readdirSync } from "fs"

import mongoose from "mongoose"

import chalk from "chalk"
import gradient from "gradient-string"

import * as Discord from "discord.js"
import * as Utils from "#src/utils/index.js"

import { env } from "#src/env.js"

import invitesTracker from "@androz2091/discord-invites-tracker"
import discordLogs from "./logs.js"


// Create timings array

const timingsStart = Date.now()
const timings: {
  timestamp: number,
  message: string,
}[] = []


// Create new client

const client = new Discord.Client({
  intents: [
    Discord.GatewayIntentBits.Guilds,
    Discord.GatewayIntentBits.GuildMembers,
    Discord.GatewayIntentBits.GuildModeration,
    Discord.GatewayIntentBits.GuildEmojisAndStickers,
    Discord.GatewayIntentBits.GuildInvites,
    Discord.GatewayIntentBits.GuildMessages,
    Discord.GatewayIntentBits.GuildMessageReactions,
    Discord.GatewayIntentBits.GuildVoiceStates,
  ],
  partials: [
    Discord.Partials.Channel,
    Discord.Partials.GuildMember,
    Discord.Partials.Message,
    Discord.Partials.Reaction,
    Discord.Partials.User,
  ],
  presence: {
    activities: [
      {
        name: "🔗 phasebot.xyz",
        type: Discord.ActivityType.Custom,
      },
    ],
    status: "online",
  },
})


// Connect client and database

try {
  await client.login(env.DISCORD_TOKEN)
  timings.push({
    timestamp: Date.now(),
    message: "Connected to client.",
  })

  await mongoose.connect(env.MONGODB_URI)
  timings.push({
    timestamp: Date.now(),
    message: "Connected to database.",
  })
} catch (error) {
  throw error
}


// Invite logger

export const inviteEvents = invitesTracker.init(client, {
  fetchGuilds: true,
  fetchVanity: true,
  fetchAuditLogs: true,
})


// Create command/event/loop function records

const commands: Record<string, Utils.SlashCommand> = {}
const events: Record<string, Utils.EventFile<keyof Discord.ClientEvents>> = {}
const loops: Record<string, Utils.LoopFile> = {}


// Get command functions

for (const dir of readdirSync("build/commands")) {
  for (const file of readdirSync(`build/commands/${dir}`).filter(file => file.endsWith(".js") && !file.startsWith("_"))) {
    try {
      const commandFunction: Utils.SlashCommand = await (await import(`./commands/${dir}/${file}`)).default
      commands[commandFunction.data.name] = commandFunction
    } catch (error) {
      throw error
    }
  }
}


// If necessary, push commands to client

try {
  if (
    client.application &&
    !client.application.commands.cache.every(command => Object.keys(commands).includes(command.name))
  ) await client.application.commands.set(Object.values(commands).map(command => command.data))
} catch (error) {
  throw error
}


// Create command event listener

client.on("interactionCreate", (interaction) => {
  if (interaction.isChatInputCommand()) {
    const command = commands[interaction.commandName]

    if (!command) return Utils.clientError(
      interaction,
      "No can do!",
      "Command doesn't exist anymore.",
      true,
    )

    if (command.permissions) {
      const baseCommandPermissions = command.permissions.baseCommand
      const subCommandsPermissions = Object.entries(command.permissions.subCommands ?? {})

      if (baseCommandPermissions && !interaction.memberPermissions?.has(baseCommandPermissions)) return Utils.clientError(
        interaction,
        "Access Denied!",
        `${Utils.PhaseError.AccessDenied}\n\n**Missing Permission:**\n\`${Utils.getPermissionName(baseCommandPermissions).replace(/([a-z])([A-Z])/g, "$1 $2")}\``,
      )

      if (subCommandsPermissions) for (const subCommandPermissions of subCommandsPermissions) {
        if (interaction.options.getSubcommand() == subCommandPermissions[0] && !interaction.memberPermissions?.has(subCommandPermissions[1])) return Utils.clientError(
          interaction,
          "Access Denied!",
          `${Utils.PhaseError.AccessDenied}\n\n**Missing Permission:**\n\`${Utils.getPermissionName(subCommandPermissions[1]).replace(/([a-z])([A-Z])/g, "$1 $2")}\``
        )
      }
    }

    command.execute(client as Discord.Client<true>, interaction).catch((error) => { throw error })
  }
})

timings.push({
  timestamp: Date.now(),
  message: "Loaded command functions.",
})


// Handle event functions

for (const dir of readdirSync("build/events")) {
  for (const file of readdirSync(`build/events/${dir}`).filter(file => file.endsWith(".js") && !file.startsWith("_"))) {
    try {
      const eventFunction: Utils.EventFile<keyof Discord.ClientEvents> = await (await import(`./events/${dir}/${file}`)).default
      events[eventFunction.name] = eventFunction

      client.on(eventFunction.name, (...data) => eventFunction.execute(client, ...data).catch((error) => { throw error }))
    } catch (error) {
      throw error
    }
  }
}

try {
  await discordLogs(client)
} catch (error) {
  throw error
}

timings.push({
  timestamp: Date.now(),
  message: "Loaded event functions.",
})


// Handle loop functions
// Warning: Will be swapped for cron jobs soon

for (const dir of readdirSync("build/loops")) {
  for (const file of readdirSync(`build/loops/${dir}`).filter(file => file.endsWith(".js") && !file.startsWith("_"))) {
    try {
      const loopFunction: Utils.LoopFile = await (await import(`./loops/${dir}/${file}`)).default
      loops[loopFunction.name] = loopFunction

      setInterval(() => loopFunction.execute(client).catch((error) => { throw error }), loopFunction.interval)
    } catch (error) {
      throw error
    }
  }
}

timings.push({
  timestamp: Date.now(),
  message: "Loaded loop functions.",
})


// Log Timings

console.log(
  chalk.bold(gradient([Utils.PhaseColour.GradientPrimary, Utils.PhaseColour.GradientSecondary])("Phase Bot"))
  + "\n"
  + timings.map((timing) => {
    const time = ((timing.timestamp-timingsStart)/1000).toFixed(1)
    return chalk.gray(`${time}s - `) + timing.message
  }).join("\n"),
)


// Exports

export {
  commands,
  events,
  loops,
  client,
}
