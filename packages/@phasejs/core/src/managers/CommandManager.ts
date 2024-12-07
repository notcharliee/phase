import { ChatInputCommandInteraction, Collection } from "discord.js"

import { deepmergeCustom } from "deepmerge-ts"

import { BotCommand } from "~/structures/BotCommand"
import { BaseManager } from "~/managers/BaseManager"

import type { BotClient } from "~/structures/BotClient"
import type { BotCommandBody, BotCommandNameResolvable } from "~/types/commands"
import type { BotCommandMiddleware } from "~/types/middleware"

const mergeCommands = deepmergeCustom({
  mergeArrays(values, utils) {
    const merged = new Map<unknown, unknown>()
    values.flat().forEach((item) => {
      if (typeof item === "object" && item !== null && "name" in item) {
        const existingItem = merged.get(item.name)
        if (existingItem) {
          merged.set(item.name, utils.deepmerge(existingItem, item))
        } else {
          merged.set(item.name, item)
        }
      } else {
        merged.set(item, item)
      }
    })
    return Array.from(merged.values())
  },
})

export class CommandManager extends BaseManager {
  protected _commands: Collection<string, BotCommand>
  protected _middleware?: BotCommandMiddleware

  constructor(phase: BotClient) {
    super(phase)
    this._commands = new Collection()

    // eslint-disable-next-line @typescript-eslint/no-misused-promises
    phase.client.on("interactionCreate", async (interaction) => {
      if (!interaction.isChatInputCommand()) return
      await this.execute(interaction)
    })

    // eslint-disable-next-line @typescript-eslint/no-misused-promises
    phase.client.once("ready", async (client) => {
      const localAPICommands = new Collection<string, BotCommandBody>()
      const remoteAPICommands = new Collection<string, BotCommandBody>()

      // populate the local api command collection
      const localJSONCommands = this._commands.map((command) =>
        command.toJSON(),
      )
      for (const jsonCommand of localJSONCommands) {
        const existingAPICommand = localAPICommands.get(jsonCommand.name) ?? {}
        const updatedAPICommand = mergeCommands(existingAPICommand, jsonCommand)
        localAPICommands.set(updatedAPICommand.name, updatedAPICommand)
      }

      // populate the remote api command collection
      const remoteAppCommands = await client.application?.commands.fetch()
      for (const appCommand of remoteAppCommands.values()) {
        const transformedAppCommand = BotCommand.transformCommand(appCommand)
        remoteAPICommands.set(transformedAppCommand.name, transformedAppCommand)
      }

      const getCommandId = (localCommand: BotCommandBody) => {
        return remoteAppCommands.find(
          (remoteCommand) => remoteCommand.name === localCommand.name,
        )?.id
      }

      // determine which commands to create
      const commandsToCreate = localAPICommands.filter(
        (command) => !remoteAPICommands.has(command.name),
      )

      // determine which commands to delete
      const commandsToDelete = remoteAPICommands.filter(
        (command) => !localAPICommands.has(command.name),
      )

      // determine which commands to update
      const commandsToUpdate = localAPICommands.filter((command) => {
        return (
          !commandsToCreate.has(command.name) &&
          !commandsToDelete.has(command.name) &&
          !BotCommand.equals(command, remoteAPICommands.get(command.name)!)
        )
      })

      // determine how many commands to sync
      const commandsToSync =
        commandsToCreate.size + commandsToDelete.size + commandsToUpdate.size

      // sync commands if needed
      if (commandsToSync) {
        // const symbol = chalk.bold.whiteBright("↻")
        // console.log(`${symbol} Syncing ${commandsToSync} commands ...`)

        // commands to create
        const createPromises = commandsToCreate.map(async (command) => {
          await client.application.commands.create(command)
          // console.log(chalk.grey(`  created /${command.name}`))
        })

        // commands to delete
        const deletePromises = commandsToDelete.map(async (command) => {
          const commandId = getCommandId(command)!
          await client.application.commands.delete(commandId)
          // console.log(chalk.grey(`  deleted /${command.name}`))
        })

        // commands to update
        const updatePromises = commandsToUpdate.map(async (command) => {
          const commandId = getCommandId(command)!
          await client.application.commands.edit(commandId, command)
          // console.log(chalk.grey(`  updated /${command.name}`))
        })

        try {
          await Promise.all([
            ...createPromises,
            ...deletePromises,
            ...updatePromises,
          ])
        } catch (error) {
          console.error(`Failed to sync commands:`)
          console.error(error)
        }
      }
    })
  }

  /**
   * Adds a command to the command manager.
   */
  public create(command: BotCommand) {
    if (this.phase.client.isReady()) {
      throw new Error("Commands cannot be created post client initialisation")
    }

    const name = this.resolveName(command)

    if (this._commands.has(name)) {
      throw new Error(`Duplicate command detected: '${name}'`)
    }

    this._commands.set(name, command)

    void this.phase.emitter.emit("initCommand", command)
  }

  /**
   * Removes a command from the command manager.
   */
  public delete(name: string) {
    if (this.phase.client.isReady()) {
      throw new Error("Commands cannot be deleted post client initialisation")
    }

    return this._commands.delete(name)
  }

  /**
   * Checks if a command exists in the command manager.
   */
  public has(name: string) {
    return this._commands.has(name)
  }

  /**
   * Gets a command from the command manager.
   */
  public get(name: string) {
    return this._commands.get(name)
  }

  /**
   * Sets the middleware function for the command manager.
   *
   * @remarks This is temporary and will be replaced by a middleware manager.
   */
  public use(middleware: BotCommandMiddleware) {
    this._middleware = middleware
    return this
  }

  /**
   * Gets the full name of a command.
   */
  public resolveName(commandNameResolvable: BotCommandNameResolvable) {
    if (commandNameResolvable instanceof ChatInputCommandInteraction) {
      const interaction = commandNameResolvable

      const fullNameParts = [
        interaction.commandName,
        interaction.options.getSubcommandGroup(false),
        interaction.options.getSubcommand(false),
      ]

      return fullNameParts.filter(Boolean).join(" ")
    }

    if (commandNameResolvable instanceof BotCommand) {
      const command = commandNameResolvable

      const parentName = command.parentName
      const groupName = command.groupName
      const commandName = command.name

      const fullNameParts = [parentName, groupName, commandName]

      return fullNameParts.filter(Boolean).join(" ")
    }

    return commandNameResolvable
  }

  /**
   * Executes a command.
   */
  private async execute(interaction: ChatInputCommandInteraction) {
    const name = this.resolveName(interaction)
    const command = this.get(name)

    if (!command) return

    try {
      if (this._middleware) {
        return await this._middleware(
          interaction,
          command.execute,
          command.metadata,
        )
      }

      return await command.execute(interaction)
    } catch (error) {
      console.error(`Error occurred in '${name}' command:`)
      console.error(error)
    }
  }
}
