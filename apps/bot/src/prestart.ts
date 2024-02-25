import mongoose from "mongoose"
import { env } from "~/env"

export default async () => {
  await mongoose.connect(env.MONGODB_URI)
}