import { Schema } from "mongoose"

export interface AutoRoles {
  enabled: boolean
  roles: {
    id: string
    target: "everyone" | "members" | "bots"
  }[]
}

export const autoRolesSchema = new Schema<AutoRoles>(
  {
    enabled: { type: Schema.Types.Boolean, required: true },
    roles: {
      type: [
        new Schema(
          {
            id: { type: Schema.Types.String, required: true },
            target: { type: Schema.Types.String, required: true },
          },
          { _id: false },
        ),
      ],
      required: true,
    },
  },
  { _id: false },
)
