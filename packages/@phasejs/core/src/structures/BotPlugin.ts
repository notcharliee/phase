import type {
  BotPluginLoadFunction,
  BotPluginLoadTrigger,
  BotPluginVersion,
} from "~/types/plugin"

export class BotPlugin<
  TTrigger extends BotPluginLoadTrigger = BotPluginLoadTrigger,
> {
  public readonly name: string
  public readonly version: BotPluginVersion
  public readonly trigger: TTrigger
  public readonly onLoad: BotPluginLoadFunction<TTrigger>

  constructor(params: {
    name: string
    version: BotPluginVersion
    trigger: TTrigger
    onLoad: BotPluginLoadFunction<TTrigger>
  }) {
    this.name = params.name
    this.version = params.version
    this.trigger = params.trigger
    this.onLoad = params.onLoad
  }
}
