import mongoose from "mongoose"

export const defineModel = <T>(name: string, schema: mongoose.Schema<T>) => {
  return (
    (mongoose.models[name] as mongoose.Model<T>) ??
    mongoose.model<T>(name, schema)
  )
}
