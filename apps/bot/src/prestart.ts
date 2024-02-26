import mongoose from "mongoose"
import { env } from "~/env"

export default async function prestart () {
  await mongoose.connect(env.MONGODB_URI)
}
