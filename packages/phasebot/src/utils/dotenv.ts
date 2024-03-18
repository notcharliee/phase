import { basename } from "path"
import { config, listFiles } from "dotenv-flow"

export const getEnv = () => {
  config({
    files: [
      ".env",
      ".env.local",
      `.env.${process.env.NODE_ENV}`, // ".env.development"
      `.env.${process.env.NODE_ENV}.local` // ".env.development.local"
    ],
  })

  return {
    files: listFiles().map(path => basename(path)),
  }
}
