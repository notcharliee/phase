import { Schema } from "mongoose"

import { defineModel } from "~/mongo/utils"

import type { Snowflake } from "~/mongo/types"

export interface Analytics {
  id: Snowflake
  enabled: boolean
  members: MemberAnalytics[]
  messages: MessageAnalytics[]
  voice: VoiceAnalytics[]
  channels: ChannelAnalytics[]
  roles: RoleAnalytics[]
  interactions: InteractionAnalytics[]
}

interface MemberAnalytics {
  addedCount: number
  removedCount: number
  kickedCount: number
  bannedCount: number
  unbannedCount: number
  recordedAt: Date
}

interface MessageAnalytics {
  createdCount: number
  deletedCount: number
  pinnedCount: number
  reactionsAddedCount: number
  reactionsRemovedCount: number
  recordedAt: Date
}

interface VoiceAnalytics {
  memberCount: number
  peakConcurrentMemberCount: number
  minutesSpentInVoice: number
  recordedAt: Date
}

interface ChannelAnalytics {
  createdCount: number
  updatedCount: number
  deletedCount: number
  recordedAt: Date
}

interface RoleAnalytics {
  createdCount: number
  updatedCount: number
  deletedCount: number
  recordedAt: Date
}

interface InteractionAnalytics {
  commandsUsedCount: number
  recordedAt: Date
}

const analyticsSchema = new Schema<Analytics>({
  id: { type: Schema.Types.String, required: true, index: true },
  enabled: { type: Schema.Types.Boolean, required: true },

  members: {
    type: [
      new Schema(
        {
          addedCount: {
            type: Schema.Types.Number,
            required: true,
            min: 0,
            default: 0,
          },
          removedCount: {
            type: Schema.Types.Number,
            required: true,
            min: 0,
            default: 0,
          },
          kickedCount: {
            type: Schema.Types.Number,
            required: true,
            min: 0,
            default: 0,
          },
          bannedCount: {
            type: Schema.Types.Number,
            required: true,
            min: 0,
            default: 0,
          },
          unbannedCount: {
            type: Schema.Types.Number,
            required: true,
            min: 0,
            default: 0,
          },
          recordedAt: { type: Schema.Types.Date, required: true },
        },
        { _id: false },
      ),
    ],
    required: true,
  },

  messages: {
    type: [
      new Schema(
        {
          createdCount: {
            type: Schema.Types.Number,
            required: true,
            min: 0,
            default: 0,
          },
          deletedCount: {
            type: Schema.Types.Number,
            required: true,
            min: 0,
            default: 0,
          },
          pinnedCount: {
            type: Schema.Types.Number,
            required: true,
            min: 0,
            default: 0,
          },
          reactionsAddedCount: {
            type: Schema.Types.Number,
            required: true,
            min: 0,
            default: 0,
          },
          reactionsRemovedCount: {
            type: Schema.Types.Number,
            required: true,
            min: 0,
            default: 0,
          },
          recordedAt: { type: Schema.Types.Date, required: true },
        },
        { _id: false },
      ),
    ],
    required: true,
  },

  voice: {
    type: [
      new Schema(
        {
          memberCount: {
            type: Schema.Types.Number,
            required: true,
            min: 0,
            default: 0,
          },
          peakConcurrentMemberCount: {
            type: Schema.Types.Number,
            required: true,
            min: 0,
            default: 0,
          },
          minutesSpentInVoice: {
            type: Schema.Types.Number,
            required: true,
            min: 0,
            default: 0,
          },
          recordedAt: { type: Schema.Types.Date, required: true },
        },
        { _id: false },
      ),
    ],
    required: true,
  },

  channels: {
    type: [
      new Schema(
        {
          createdCount: {
            type: Schema.Types.Number,
            required: true,
            min: 0,
            default: 0,
          },
          updatedCount: {
            type: Schema.Types.Number,
            required: true,
            min: 0,
            default: 0,
          },
          deletedCount: {
            type: Schema.Types.Number,
            required: true,
            min: 0,
            default: 0,
          },
          recordedAt: { type: Schema.Types.Date, required: true },
        },
        { _id: false },
      ),
    ],
    required: true,
  },

  roles: {
    type: [
      new Schema(
        {
          createdCount: {
            type: Schema.Types.Number,
            required: true,
            min: 0,
            default: 0,
          },
          updatedCount: {
            type: Schema.Types.Number,
            required: true,
            min: 0,
            default: 0,
          },
          deletedCount: {
            type: Schema.Types.Number,
            required: true,
            min: 0,
            default: 0,
          },
          recordedAt: { type: Schema.Types.Date, required: true },
        },
        { _id: false },
      ),
    ],
    required: true,
  },

  interactions: {
    type: [
      new Schema(
        {
          commandsUsedCount: {
            type: Schema.Types.Number,
            required: true,
            min: 0,
            default: 0,
          },
          recordedAt: { type: Schema.Types.Date, required: true },
        },
        { _id: false },
      ),
    ],
    required: true,
  },
})

analyticsSchema.index({ id: 1 })
analyticsSchema.index({ "members.recordedAt": 1 })
analyticsSchema.index({ "messages.recordedAt": 1 })
analyticsSchema.index({ "voice.recordedAt": 1 })
analyticsSchema.index({ "channels.recordedAt": 1 })
analyticsSchema.index({ "roles.recordedAt": 1 })
analyticsSchema.index({ "interactions.recordedAt": 1 })

export const analytics = defineModel("Analytics", analyticsSchema)
