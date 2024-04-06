import mongoose, { Schema, SchemaTypes } from "mongoose"

export type Otp = {
  createdAt: Date
  userId: string
  guildId: string
  otp: string
}

const schema = new Schema<Otp>({
  createdAt: { type: Date, expires: "1m", required: true, default: Date.now },
  userId: { type: SchemaTypes.String, required: true },
  guildId: { type: SchemaTypes.String, required: true },
  otp: { type: SchemaTypes.String, required: true },
})

export const OtpSchema =
  (mongoose.models["Otps"] as mongoose.Model<Otp>) ||
  mongoose.model<Otp>("Otps", schema)
