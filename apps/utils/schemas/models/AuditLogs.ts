import mongoose, { Schema } from 'mongoose'

const Data: Schema = new mongoose.Schema<DataTypes>({
  guild: String,
  channel: String,
  options: Array,
})

interface DataTypes {
  guild: string,
  channel: string,
  options?: {
    server: { // channels, roles, boosts, emojis, server settings
      channel: string,
      enabled: string,
    },
    messages: { // deletes, edits, mentions
      channel: string,
      enabled: string,
    },
    voice: { // joins, leaves, mutes, deafens
      channel: string,
      enabled: string,
    },
    invites: { // creates, expires, usage
      channel: string,
      enabled: string,
    },
    members: { // joins, leaves, role changes, nickname changes
      channel: string,
      enabled: string,
    },
    punishments: { // warns, unwarns, bans, tempbans, timeouts
      channel: string,
      enabled: string,
    },
  },
}

export default mongoose.models['AuditLogs'] as mongoose.Model<DataTypes> || mongoose.model<DataTypes>('AuditLogs', Data)