// src/index.ts
import {
  existsSync,
  readFileSync
} from "fs";
var createEnv = (env2) => {
  const envVars = env2;
  return envVars;
};
var env = createEnv({
  NODE_ENV: process.env.NODE_ENV,
  MONGODB_URI: process.env.MONGODB_URI,
  DISCORD_TOKEN: process.env.DISCORD_TOKEN,
  DISCORD_SECRET: process.env.DISCORD_SECRET,
  DISCORD_ID: process.env.DISCORD_ID,
  WEBHOOK_ALERT: process.env.WEBHOOK_ALERT,
  WEBHOOK_STATUS: process.env.WEBHOOK_STATUS,
  API_YOUTUBE: process.env.API_YOUTUBE
});
var getEnvVariables = (envPath) => {
  const envVariables = {};
  if (!existsSync(envPath))
    return void 0;
  const envFileContent = readFileSync(envPath, "utf-8");
  const lines = envFileContent.split("\n");
  for (const line of lines) {
    const trimmedLine = line.trim();
    if (trimmedLine.startsWith("#") || trimmedLine == "")
      continue;
    const [key, ...value] = trimmedLine.split("=");
    if (key && value)
      envVariables[key.trim()] = value.join("=").trim().replaceAll(`"`, "");
  }
  return envVariables;
};
export {
  createEnv,
  env,
  getEnvVariables
};
