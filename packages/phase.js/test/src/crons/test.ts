import { cronJob } from "~/index"

export default cronJob (
  "*/1 * * * *",
  (client) => {
    console.log("This runs once every minute!")
  }
)
