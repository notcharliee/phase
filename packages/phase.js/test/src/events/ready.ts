import { botEvent } from "~/utils/botEvent"

export default botEvent("ready", (client, _) => {
  console.log("This runs on the ready event!")
})
