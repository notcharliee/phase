import { z } from "zod"

type ErrMessage = string | { message?: string }

declare module "zod" {
  interface ZodString {
    snowflake(message?: ErrMessage): ZodString
    mention(message?: ErrMessage): ZodString
    nonempty(message?: ErrMessage): ZodString
  }
}

z.ZodString.prototype.snowflake = function (message = "Invalid snowflake") {
  return this.regex(/^[0-9]{17,20}$/, message)
}

z.ZodString.prototype.mention = function (message = "Invalid mention") {
  return this.regex(/^<@&?[0-9]{17,20}>$|^@(?:everyone|here|\w+)$/, message)
}

z.ZodString.prototype.nonempty = function (message = "Required") {
  return this.trim().min(1, message)
}

export const zod = z
export type * from "zod"
