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