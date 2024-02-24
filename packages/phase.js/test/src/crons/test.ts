import { botCronJob } from "~/index"

export default botCronJob (
  "*/1 * * * *",
  (client) => {
    console.log("This runs once every minute!")
  }
)
