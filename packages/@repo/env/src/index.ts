import { bot } from "~/bot"
import { shared } from "~/shared"
import { site } from "~/site"

export function getEnv(type: "bot" | "site" | "shared") {
  return { bot, site, shared }[type]()
}
