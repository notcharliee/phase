import {
  existsSync,
  readFileSync,
} from 'fs'


/**
 * Phase configuration object
 */
export interface PhaseConfig {
  scripts: {
    app: string,
    build?: string,
    start?: string,
    dev?: string
  }[]
}


/**
 * @returns Readonly object with string-typed environment variables.
 */
export const createEnv = <T> (env: T) => env as Readonly<{ [K in keyof T]: string }>


/**
 * Readonly object with string-typed environment variables.
 */
export const env = createEnv({
  NODE_ENV: process.env.NODE_ENV,
  MONGODB_URI: process.env.MONGODB_URI,
  DISCORD_TOKEN: process.env.DISCORD_TOKEN,
  DISCORD_SECRET: process.env.DISCORD_SECRET,
  DISCORD_ID: process.env.DISCORD_ID,
  WEBHOOK_ALERT: process.env.WEBHOOK_ALERT,
  WEBHOOK_STATUS: process.env.WEBHOOK_STATUS,
  API_YOUTUBE: process.env.API_YOUTUBE,
})


/**
* Reads environment variables from a file.
*
* @param envPath - The path of the env file.
*/
export const getEnvVariables = (envPath: string) => {
 const envVariables: Record<string, string> = {}

 if (!existsSync(envPath)) return undefined

 const envFileContent = readFileSync(envPath, 'utf-8')
 const lines = envFileContent.split("\n")

 for (const line of lines) {
   const trimmedLine = line.trim()
   if (trimmedLine.startsWith("#") || trimmedLine == "") continue 

   const [key, ...value] = trimmedLine.split("=")
   if (key && value) envVariables[key.trim()] = value.join("=").trim().replaceAll(`"`,"")
 }

 return envVariables
}