import { Schema } from "mongoose"

interface SelfRolesBaseMessage {
  id: string
  name: string
  channel: string
  content: string
  multiselect: boolean
}

interface SelfRolesReactionMessage extends SelfRolesBaseMessage {
  type: "reaction"
  methods: {
    id: string
    emoji: string
    roles: {
      id: string
      action: "add" | "remove"
    }[]
  }[]
}

interface SelfRolesButtonMessage extends SelfRolesBaseMessage {
  type: "button"
  methods: {
    id: string
    label: string
    emoji?: string
    roles: {
      id: string
      action: "add" | "remove"
    }[]
  }[]
}

interface SelfRolesDropdownMessage extends SelfRolesBaseMessage {
  type: "dropdown"
  methods: {
    id: string
    label: string
    emoji?: string
    roles: {
      id: string
      action: "add" | "remove"
    }[]
  }[]
}

type SelfRolesMessage =
  | SelfRolesReactionMessage
  | SelfRolesButtonMessage
  | SelfRolesDropdownMessage

export interface SelfRoles {
  enabled: boolean
  messages: SelfRolesMessage[]
}

export const selfRolesSchema = new Schema<SelfRoles>(
  {
    enabled: { type: Schema.Types.Boolean, required: true },
    messages: {
      type: [
        new Schema(
          {
            id: { type: Schema.Types.String, required: true },
            type: { type: Schema.Types.String, required: true },
            name: { type: Schema.Types.String, required: true },
            channel: { type: Schema.Types.String, required: true },
            content: { type: Schema.Types.String, required: true },
            multiselect: { type: Schema.Types.Boolean, required: true },
            methods: {
              type: [
                new Schema(
                  {
                    id: { type: Schema.Types.String, required: true },
                    label: { type: Schema.Types.String },
                    emoji: { type: Schema.Types.String },
                    roles: {
                      type: [
                        new Schema(
                          {
                            id: { type: Schema.Types.String, required: true },
                            action: {
                              type: Schema.Types.String,
                              required: true,
                            },
                          },
                          { _id: false },
                        ),
                      ],
                      required: true,
                    },
                  },
                  { _id: false },
                ),
              ],
            },
          },
          { _id: false },
        ),
      ],
      required: true,
    },
  },
  { _id: false },
)
