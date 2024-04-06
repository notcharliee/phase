/* eslint-disable @typescript-eslint/consistent-type-imports */
import mongoose from "mongoose"

import { env } from "@/lib/env"

declare global {
  // eslint-disable-next-line no-var
  var mongoose: {
    conn: null | typeof import("mongoose")
    promise: null | Promise<typeof import("mongoose")>
  }
}

let cached = global.mongoose

if (!cached) {
  cached = global.mongoose = {
    conn: null,
    promise: null,
  }
}

export async function dbConnect() {
  if (cached.conn) return cached.conn

  if (!cached.promise) {
    cached.promise = mongoose.connect(env.MONGODB_URI, {
      bufferCommands: false,
    })
  }

  try {
    cached.conn = await cached.promise
  } catch (e) {
    cached.promise = null
    throw e
  }

  return cached.conn
}
