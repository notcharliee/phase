import { randomUUID } from "crypto"

import mongoose from "mongoose"

/**
 * Defines a mongoose model with a given name and schema.
 *
 * @param name The name of the model.
 * @param schema The schema of the model.
 * @returns The defined model.
 */
export function defineModel<T>(name: string, schema: mongoose.Schema<T>) {
  return (
    (mongoose.models[name] as mongoose.Model<T>) ??
    mongoose.model<T>(name, schema)
  )
}

/**
 * Generates a 10-character string for use as module or command keys.
 */
export function generateKey(): string {
  const base62Encode = (buffer: Buffer): string => {
    const base62Chars = `0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ`

    let result = ""
    let value = BigInt("0x" + buffer.toString("hex"))

    while (value > 0n) {
      result = base62Chars[Number(value % 62n)] + result
      value /= 62n
    }

    return result
  }

  const uuid = randomUUID()
  const buffer = Buffer.from(uuid.replace(/-/g, ""), "hex")
  const base62Id = base62Encode(buffer)
  return base62Id.substring(0, 10)
}
