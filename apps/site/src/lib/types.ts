import { z } from "zod"

export type User = {
  user_id: string, // discord id
  session_id: string, // uuid
  access_token: string, // REDACTED
  refresh_token: string, // REDACTED
  created_timestamp: number,  // current epoc
  expires_timestamp: number, // current epoc + 604800
}

export const UserSchema = z.object({
  user_id: z.string(), // discord id
  session_id: z.string(), // uuid
  access_token: z.string(), // REDACTED
  refresh_token: z.string(), // REDACTED
  created_timestamp: z.number(),  // current epoc
  expires_timestamp: z.number(), // current epoc + 604800
})