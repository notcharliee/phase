import type {
  BotCommandExecute,
  BotCommandMetadata,
  BotCommandOrSubcommandBody,
} from "~/types/commands"

export class SharedBotCommandBuilderBase {
  protected body: BotCommandOrSubcommandBody
  protected metadata: BotCommandMetadata
  protected execute: BotCommandExecute

  constructor() {
    this.body = {} as BotCommandOrSubcommandBody
    this.metadata = { type: "command" }
    this.execute = () => {}
  }

  /**
   * Sets the metadata of this command.
   */
  public setMetadata(metadata: Omit<BotCommandMetadata, "type">) {
    this.metadata = { type: "command", ...metadata }
    return this
  }

  /**
   * Sets the execute function of this command.
   */
  public setExecute(execute: BotCommandExecute) {
    this.execute = execute
    return this
  }
}
