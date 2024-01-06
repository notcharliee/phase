import mongoose from "mongoose"


// Schema structure

const schema = new mongoose.Schema<Tag>({
  guild: String,
  tags: Array,
})

export const TagSchema = (
  mongoose.models['Tags'] as mongoose.Model<Tag> ||
  mongoose.model<Tag>('Tags', schema)
)


// Schema types

export type Tag = {
  guild: string,
  tags: {
    name: string,
    value: string,
  }[],
}
