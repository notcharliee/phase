import type { Music } from "@repo/music"
import type { Store } from "~/lib/store"
import type { Client as DiscordClient } from "discord.js"

declare module "discord.js" {
  interface Client extends DiscordClient {
    music: Music
    store: Store
  }
}

declare module "*.woff" {
  const src: ArrayBuffer
  export default src
}
declare module "*.woff2" {
  const src: ArrayBuffer
  export default src
}
declare module "*.eot" {
  const src: ArrayBuffer
  export default src
}
declare module "*.ttf" {
  const src: ArrayBuffer
  export default src
}
declare module "*.otf" {
  const src: ArrayBuffer
  export default src
}
