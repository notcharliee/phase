import { botEvent } from "~/index"

export default botEvent("ready", (client, _) => {
  console.log("This runs on the ready event!")
})
