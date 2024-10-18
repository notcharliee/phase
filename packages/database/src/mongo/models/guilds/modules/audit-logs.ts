import { Schema } from "mongoose"

export interface AuditLogs {
  enabled: boolean
  channels: {
    server?: string
    messages?: string
    voice?: string
    invites?: string
    members?: string
    punishments?: string
  }
}

export const auditLogsSchema = new Schema<AuditLogs>(
  {
    enabled: { type: Schema.Types.Boolean, required: true },
    channels: {
      type: new Schema(
        {
          server: { type: Schema.Types.String },
          messages: { type: Schema.Types.String },
          voice: { type: Schema.Types.String },
          invites: { type: Schema.Types.String },
          members: { type: Schema.Types.String },
          punishments: { type: Schema.Types.String },
        },
        { _id: false },
      ),
      required: true,
    },
  },
  { _id: false },
)
