import mongoose from "mongoose"

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

export const selfRolesSchema = new mongoose.Schema<SelfRoles>(
  {
    enabled: { type: Boolean, required: true },
    messages: {
      type: [
        new mongoose.Schema(
          {
            id: { type: String, required: true },
            type: { type: String, required: true },
            name: { type: String, required: true },
            channel: { type: String, required: true },
            content: { type: String, required: true },
            multiselect: { type: Boolean, required: true },
            methods: {
              type: [
                new mongoose.Schema(
                  {
                    id: { type: String, required: true },
                    label: { type: String },
                    emoji: { type: String },
                    roles: {
                      type: [
                        new mongoose.Schema(
                          {
                            id: { type: String, required: true },
                            action: { type: String, required: true },
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
