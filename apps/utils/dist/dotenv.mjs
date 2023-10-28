// src/dotenv.ts
import * as dotenv from "dotenv";
import * as fs from "fs";
import * as path from "path";
function configEnvVars() {
  const envPath = path.resolve(process.cwd(), "..", "..", ".env");
  if (!fs.existsSync(envPath))
    throw new Error("Could not find .env file.");
  else if (process.cwd().includes("bot"))
    dotenv.configDotenv({ path: envPath });
  else if (process.cwd().includes("site")) {
    const localEnvPath = path.resolve(process.cwd(), ".env.local");
    const envData = fs.readFileSync(envPath);
    fs.writeFileSync(localEnvPath, envData);
  }
}
configEnvVars();
export {
  configEnvVars
};
