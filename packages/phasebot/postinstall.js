import { execSync } from "child_process"
import { existsSync } from "fs"

if (!existsSync("./dist")) {
  console.log("Building phasebot...")
  execSync("npm run build", { stdio: "inherit" })
}
