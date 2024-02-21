import { GatewayIntentBits, Partials, ActivityType } from "discord.js"
import { setConfig } from "../dist/index.js"

/** @type {import("../dist/index.js").ConfigOptions} */
export default setConfig({
  clientOptions: {
    intents: [],
    partials: [],
    presence: {
      activities: [
        {
          name: "🎀 meow",
          type: ActivityType.Custom,
        },
      ],
      status: "online",
    },
  }
})
