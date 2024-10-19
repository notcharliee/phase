// import { createHmac } from "node:crypto"

import { pgTable, timestamp, varchar } from "drizzle-orm/pg-core"

export const otps = pgTable("otps", {
  code: varchar({ length: 256 }).unique().primaryKey(),
  userId: varchar({ length: 19 }).notNull(),
  guildId: varchar({ length: 19 }).notNull(),
  createdAt: timestamp().defaultNow().notNull(),
})

// function generateCode() {
//   const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"
//   const codeLength = 6

//   let randomCode = ""

//   for (let i = 0; i < codeLength; i++) {
//     const randomIndex = Math.floor(Math.random() * chars.length)
//     randomCode += chars[randomIndex]
//   }

//   return randomCode
// }

// function signCode(code: string) {
//   const secret = process.env.AUTH_OTP_SECRET

//   if (!secret) {
//     throw new Error("Missing AUTH_OTP_SECRET environment variable")
//   }

//   const algorithm = "sha256"
//   const encoding = "hex"

//   return createHmac(algorithm, secret).update(code).digest(encoding)
// }
