import { z } from "zod"

export const snowflakeSchema = z
  .string()
  .regex(/^[0-9]{17,20}$/, "Invalid snowflake")
